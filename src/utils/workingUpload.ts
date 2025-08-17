// Working Cloudinary upload using the same approach as profile pictures
import { uploadImageToCloudinary } from './cloudinary';

/**
 * Upload wrapper that matches the interface expected by listing components
 * Uses the same proven approach as profile picture uploads
 */
export const workingUploadToCloudinary = async (
  file: File, 
  onProgress?: (progress: number) => void
) => {
  // Start progress if callback provided
  if (onProgress) {
    onProgress(0);
  }

  try {
    console.log('🚀 Using working profile picture upload approach...');
    
    // Use progress callback during upload
    if (onProgress) {
      // Simulate progress since the utils function doesn't support progress callbacks
      const progressInterval = setInterval(() => {
        // This is a simulation - real progress tracking would require XMLHttpRequest
      }, 100);
      
      setTimeout(() => clearInterval(progressInterval), 2000);
    }
    
    // Use the same function that works for profile pictures
    const url = await uploadImageToCloudinary(file);
    
    if (onProgress) {
      onProgress(100);
    }
    
    console.log('✅ Upload successful using profile picture method!', url);
    
    // Return in the format expected by listing components
    return {
      url: url,
      publicId: url.split('/').pop()?.split('.')[0] || '',
      width: 0, // Not available from simple upload
      height: 0, // Not available from simple upload
      format: file.type.split('/')[1] || 'jpg',
      bytes: file.size,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  }
};

export default workingUploadToCloudinary;
