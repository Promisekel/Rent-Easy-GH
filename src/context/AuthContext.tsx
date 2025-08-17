import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';
import { workingUploadToCloudinary } from '../utils/workingUpload';
import toast from 'react-hot-toast';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: string;
  role: 'landlord' | 'renter' | 'admin';
  verified: boolean;
  createdAt: any;
  updatedAt: any;
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

/**
 * Save user profile to Firestore
 */
const saveUserProfile = async (user: FirebaseUser, additionalData: any = {}) => {
  if (!user) return;
  
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    const { displayName, email, photoURL } = user;
    const createdAt = serverTimestamp();
    
    try {
      await setDoc(userRef, {
        uid: user.uid,
        displayName: displayName || email?.split('@')[0] || 'User',
        email,
        photoURL: photoURL || '',
        provider: user.providerData[0]?.providerId || 'email',
        role: 'renter', // Default role
        verified: false,
        createdAt,
        updatedAt: createdAt,
        ...additionalData
      });
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  }
  
  return userRef;
};

/**
 * Get user profile from Firestore
 */
const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
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
      try {
        await saveUserProfile(user, { 
          displayName, 
          photoURL,
          role 
        });
        console.log('Firestore save successful!');
      } catch (firestoreError) {
        console.warn('Firestore save failed (this is expected if Firestore is not set up):', firestoreError);
        // Don't throw error - user creation was successful even if Firestore save failed
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
      
      // Ensure user profile exists in Firestore
      await saveUserProfile(user);
      
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
      await saveUserProfile(user, {
        provider: 'google.com'
      });
      
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
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    login: signInWithEmailAndPasswordAuth,
    signup: signUpWithEmailAndPassword,
    loginWithGoogle: signInWithGoogle,
    logout: signOutUser,
    resetPassword: sendPasswordReset
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
