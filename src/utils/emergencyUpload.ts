// Emergency upload using EXACT same pattern as working profile picture upload
const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "dwwbegf2y";
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "rental_images";

/**
 * Emergency upload using exact same pattern as profile pictures
 * This should work in production if profile pictures work
 */
export const emergencyProfileStyleUpload = async (file: File): Promise<string> => {
  if (!file) throw new Error('No file provided');
  
  // Validate file (same as profile pictures)
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please select a JPEG, PNG, or WebP image.');
  }
  
  if (file.size > maxSize) {
    throw new Error('File too large. Please select an image under 5MB.');
  }
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);
  
  console.log('🚨 EMERGENCY: Using exact profile picture upload pattern');
  console.log('🚨 Cloud name:', CLOUDINARY_CLOUD_NAME);
  console.log('🚨 Upload preset:', CLOUDINARY_UPLOAD_PRESET);
  console.log('🚨 Env vars:', {
    cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
    preset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
  });
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('🚨 Upload failed:', response.status, errorText);
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('🚨 Emergency upload successful:', data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error('🚨 Emergency upload error:', error);
    throw new Error('Failed to upload image using emergency method');
  }
};

/**
 * Emergency upload wrapper that matches listing component interface
 * Returns object format expected by listing components
 */
export const emergencyUploadWithProgress = async (
  file: File, 
  onProgress?: (progress: number) => void
) => {
  if (onProgress) {
    onProgress(0);
  }
  
  try {
    if (onProgress) {
      onProgress(50);
    }
    
    const url = await emergencyProfileStyleUpload(file);
    
    if (onProgress) {
      onProgress(100);
    }
    
    // Return format expected by listing components
    return {
      url: url,
      publicId: url.split('/').pop()?.split('.')[0] || '',
      width: 0,
      height: 0,
      format: file.type.split('/')[1] || 'jpg',
      bytes: file.size,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('🚨 Emergency upload with progress failed:', error);
    throw error;
  }
};

export default emergencyUploadWithProgress;
