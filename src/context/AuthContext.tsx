import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, collection, addDoc, DocumentData } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';
import { workingUploadToCloudinary } from '../utils/workingUpload';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: string;
  role: 'landlord' | 'renter' | 'admin';
  verified: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<FirebaseUser>;
  signup: (email: string, password: string, displayName: string, role?: 'landlord' | 'renter', profileImage?: File) => Promise<FirebaseUser>;
  loginWithGoogle: () => Promise<FirebaseUser>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUserProfile: () => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const toIsoString = (value: unknown): string | null => {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === 'object' && value !== null && 'toDate' in (value as Record<string, unknown>)) {
    try {
      const date = (value as { toDate: () => Date }).toDate();
      return date.toISOString();
    } catch (error) {
      console.warn('AuthContext: failed to convert Firestore timestamp', error);
    }
  }

  return null;
};

const normalizeUserProfile = (
  uid: string,
  data: DocumentData | undefined,
  defaults: Partial<UserProfile> = {}
): UserProfile => {
  const safeData = data ?? {};

  const email = safeData.email ?? defaults.email ?? '';
  const displayName = safeData.displayName ?? defaults.displayName ?? email.split('@')[0] ?? 'User';
  const photoURL = safeData.photoURL ?? defaults.photoURL ?? '';
  const provider = safeData.provider ?? defaults.provider ?? 'email';
  const role = safeData.role ?? defaults.role ?? 'renter';
  const verified = safeData.verified ?? defaults.verified ?? false;

  return {
    uid,
    email,
    displayName,
    photoURL,
    provider,
    role,
    verified,
    createdAt: toIsoString(safeData.createdAt) ?? defaults.createdAt ?? null,
    updatedAt: toIsoString(safeData.updatedAt) ?? defaults.updatedAt ?? null,
  };
};

/**
 * Save user profile to Firestore
 */
const saveUserProfile = async (
  user: FirebaseUser,
  additionalData: Partial<UserProfile> & Record<string, unknown> = {}
): Promise<UserProfile> => {
  if (!user) {
    throw new Error('User is required to save profile');
  }

  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  const isNewUser = !userSnap.exists();

  const fallbackProfile: Partial<UserProfile> = {
    uid: user.uid,
    email: user.email ?? '',
    displayName: user.displayName ?? user.email?.split('@')[0] ?? 'User',
    photoURL: user.photoURL ?? '',
    provider: user.providerData[0]?.providerId ?? 'email',
    role: 'renter',
    verified: false,
    createdAt: null,
    updatedAt: null,
  };

  const sanitizedAdditionalData = Object.entries(additionalData).reduce<Record<string, unknown>>((accumulator, [key, value]) => {
    if (value !== undefined && value !== null) {
      accumulator[key] = value;
    }
    return accumulator;
  }, {});

  const payload: Record<string, unknown> = {
    uid: user.uid,
    email: sanitizedAdditionalData.email ?? fallbackProfile.email,
    displayName: sanitizedAdditionalData.displayName ?? fallbackProfile.displayName,
    photoURL: sanitizedAdditionalData.photoURL ?? fallbackProfile.photoURL,
    provider: sanitizedAdditionalData.provider ?? fallbackProfile.provider,
    updatedAt: serverTimestamp(),
  };

  if (isNewUser) {
    payload.role = sanitizedAdditionalData.role ?? fallbackProfile.role;
    payload.verified = sanitizedAdditionalData.verified ?? fallbackProfile.verified;
    payload.createdAt = serverTimestamp();
  } else {
    if (sanitizedAdditionalData.role !== undefined) {
      payload.role = sanitizedAdditionalData.role;
    }
    if (sanitizedAdditionalData.verified !== undefined) {
      payload.verified = sanitizedAdditionalData.verified;
    }
  }

  await setDoc(userRef, payload, { merge: true });
  const refreshedSnapshot = await getDoc(userRef);

  return normalizeUserProfile(user.uid, refreshedSnapshot.data(), {
    ...fallbackProfile,
    ...(sanitizedAdditionalData as Partial<UserProfile>),
  });
};

/**
 * Get user profile from Firestore
 */
const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return normalizeUserProfile(uid, userSnap.data());
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

/**
 * Log user activity
 */
const logUserActivity = async (uid: string, activityType: string, metadata?: any) => {
  try {
    const activityRef = collection(db, 'user_activities');
    await addDoc(activityRef, {
      uid,
      activityType,
      timestamp: serverTimestamp(),
      metadata: metadata || {}
    });
  } catch (error) {
    console.error('Error logging user activity:', error);
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Sign up with email and password
   */
  const signUpWithEmailAndPassword = async (
    email: string, 
    password: string, 
    displayName: string,
    role: 'landlord' | 'renter' = 'renter',
    profileImage?: File
  ) => {
    try {
      console.log('Starting signup process...', { email, displayName, role });
      
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created successfully:', user.uid);
      setCurrentUser(user);
      
      let photoURL = '';
      
      // Upload profile image if provided
      if (profileImage) {
        try {
          console.log('Uploading profile image...');
          const uploadResult = await workingUploadToCloudinary(profileImage) as { url: string };
          photoURL = uploadResult.url;
          console.log('Profile image uploaded:', photoURL);
        } catch (error) {
          console.warn('Failed to upload profile image:', error);
        }
      }
      
      // Update user profile
      console.log('Updating user profile...');
      await updateProfile(user, {
        displayName,
        photoURL
      });
      
      // Save to Firestore
      console.log('Saving to Firestore...');
      let savedProfile: UserProfile | null = null;
      try {
        savedProfile = await saveUserProfile(user, { 
          displayName, 
          photoURL,
          role 
        });
        setUserProfile(savedProfile);
        console.log('Firestore save successful!');
      } catch (firestoreError) {
        console.warn('Firestore save failed (this is expected if Firestore is not set up):', firestoreError);
        // Don't throw error - user creation was successful even if Firestore save failed
      }

      try {
        await logUserActivity(user.uid, 'signup', {
          role,
          hasProfileImage: Boolean(photoURL)
        });
      } catch (activityError) {
        console.warn('AuthContext: failed to log signup activity', activityError);
      }
      
      console.log('Signup completed successfully!');
      return user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  /**
   * Sign in with email and password
   */
  const signInWithEmailAndPasswordAuth = async (email: string, password: string) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser(user);

      try {
        const profile = await saveUserProfile(user);
        setUserProfile(profile);
      } catch (firestoreError) {
        console.warn('AuthContext: failed to ensure user profile on login', firestoreError);
      }

      try {
        await logUserActivity(user.uid, 'login');
      } catch (activityError) {
        console.warn('AuthContext: failed to log login activity', activityError);
      }

      return user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  /**
   * Sign in with Google
   */
  const signInWithGoogle = async () => {
    try {
      // Configure the Google provider with additional settings
      googleProvider.setCustomParameters({
        prompt: 'select_account',
        hd: '' // Remove domain restriction
      });
      
      // Add scopes if needed
      googleProvider.addScope('email');
      googleProvider.addScope('profile');
      
      let user: FirebaseUser;
      
      try {
        // Use popup for Google sign-in
        const result = await signInWithPopup(auth, googleProvider);
        user = result.user;
      } catch (popupError: any) {
        console.log('Popup error:', popupError);
        
        if (popupError.code === 'auth/popup-closed-by-user') {
          throw new Error('Sign-in was cancelled. Please try again.');
        } else if (popupError.code === 'auth/popup-blocked') {
          throw new Error('Popup was blocked by your browser. Please allow popups and try again.');
        }
        throw popupError;
      }
      
      // Save user profile to Firestore
      setCurrentUser(user);

      try {
        const profile = await saveUserProfile(user, {
          provider: 'google.com'
        });
        setUserProfile(profile);
      } catch (firestoreError) {
        console.warn('AuthContext: failed to persist Google user profile', firestoreError);
      }
      
      try {
        await logUserActivity(user.uid, 'login', { provider: 'google' });
      } catch (activityError) {
        console.warn('AuthContext: failed to log Google login activity', activityError);
      }
      
      return user;
    } catch (error: any) {
      console.error('Google sign in error:', error);
      
      // Handle specific popup errors
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup was blocked by your browser. Please allow popups and try again.');
      } else if (error.code === 'auth/unauthorized-domain') {
        throw new Error('This domain is not authorized for Google Sign-In. Please contact support.');
      } else if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Google Sign-In is not enabled. Please contact support.');
      }
      
      throw error;
    }
  };

  /**
   * Sign out user
   */
  const signOutUser = async () => {
    const uid = auth.currentUser?.uid;

    try {
      await signOut(auth);
      if (uid) {
        try {
          await logUserActivity(uid, 'logout');
        } catch (activityError) {
          console.warn('AuthContext: failed to log logout activity', activityError);
        }
      }
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setCurrentUser(null);
      setUserProfile(null);
    }
  };

  /**
   * Send password reset email
   */
  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  const refreshUserProfile = useCallback(async (): Promise<UserProfile | null> => {
    const user = auth.currentUser;

    if (!user) {
      setCurrentUser(null);
      setUserProfile(null);
      return null;
    }

    setCurrentUser(user);

    try {
      const existingProfile = await getUserProfile(user.uid);
      if (existingProfile) {
        setUserProfile(existingProfile);
        return existingProfile;
      }

      const createdProfile = await saveUserProfile(user);
      setUserProfile(createdProfile);
      return createdProfile;
    } catch (error) {
      console.error('Error refreshing user profile:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) {
        return;
      }

      setCurrentUser(user);

      if (user) {
        try {
          let profile = await getUserProfile(user.uid);

          if (!profile) {
            profile = await saveUserProfile(user);
          }

          if (isMounted) {
            setUserProfile(profile);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          if (isMounted) {
            setUserProfile(null);
          }
        }
      } else {
        setUserProfile(null);
      }

      if (isMounted) {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    login: signInWithEmailAndPasswordAuth,
    signup: signUpWithEmailAndPassword,
    loginWithGoogle: signInWithGoogle,
    logout: signOutUser,
    resetPassword: sendPasswordReset,
    refreshUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
