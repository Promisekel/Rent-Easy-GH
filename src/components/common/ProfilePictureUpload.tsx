import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { uploadImageToCloudinary } from '../../utils/cloudinary';
import { updateProfile } from 'firebase/auth';
import toast from 'react-hot-toast';

interface ProfilePictureUploadProps {
  currentPhotoURL?: string;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({ currentPhotoURL }) => {
  const { currentUser, refreshUserProfile } = useAuth();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(currentPhotoURL ?? currentUser?.photoURL ?? null);

  useEffect(() => {
    setPhotoUrl(currentPhotoURL ?? currentUser?.photoURL ?? null);
  }, [currentPhotoURL, currentUser?.photoURL]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      // Upload to Cloudinary
      const photoURL = await uploadImageToCloudinary(file);

      // Update user profile in Firestore
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        photoURL,
        updatedAt: serverTimestamp()
      });

      // Update Firebase Auth profile
      await updateProfile(currentUser, {
        photoURL
      });

      setPhotoUrl(photoURL);

      try {
        const updatedProfile = await refreshUserProfile();
        if (updatedProfile?.photoURL) {
          setPhotoUrl(updatedProfile.photoURL);
        }
      } catch (profileError) {
        console.warn('ProfilePictureUpload: failed to refresh profile', profileError);
      }

      toast.success('Profile picture updated successfully!');

    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative group">
      <div className="w-32 h-32 mx-auto md:mx-0 mb-4 rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center relative">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-16 h-16 text-white" />
        )}
        
        {/* Upload overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Camera className="w-6 h-6 text-white" />
        </div>

        {/* Progress overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        aria-label="Upload profile picture"
      />

      <motion.button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full px-4 py-2 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        <Upload className="w-4 h-4 mr-2" />
        {uploading ? 'Uploading...' : 'Change Photo'}
      </motion.button>
    </div>
  );
};

export default ProfilePictureUpload;
