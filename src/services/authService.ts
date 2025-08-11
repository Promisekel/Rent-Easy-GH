import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';
import { uploadToCloudinary } from './cloudinary';

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

/**
 * Save user profile to Firestore
 */
export const saveUserProfile = async (user: FirebaseUser, additionalData: any = {}) => {
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
 * Sign up with email and password
 */
export const signUpWithEmailAndPassword = async (
  email: string, 
  password: string, 
  displayName: string,
  role: 'landlord' | 'renter' = 'renter',
  profileImage?: File
) => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    let photoURL = '';
    
    // Upload profile image if provided
    if (profileImage) {
      try {
        const uploadResult = await uploadToCloudinary(profileImage) as { url: string };
        photoURL = uploadResult.url;
      } catch (error) {
        console.warn('Failed to upload profile image:', error);
      }
    }
    
    // Update user profile
    await updateProfile(user, {
      displayName,
      photoURL
    });
    
    // Save to Firestore
    await saveUserProfile(user, { 
      displayName, 
      photoURL,
      role 
    });
    
    return user;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

/**
 * Sign in with email and password
 */
export const signInWithEmailAndPasswordAuth = async (email: string, password: string) => {
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
export const signInWithGoogle = async () => {
  try {
    const { user } = await signInWithPopup(auth, googleProvider);
    
    // Save user profile to Firestore
    await saveUserProfile(user, {
      provider: 'google'
    });
    
    return user;
  } catch (error) {
    console.error('Google sign in error:', error);
    throw error;
  }
};

/**
 * Sign out user
 */
export const signOutUser = async () => {
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
export const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};
