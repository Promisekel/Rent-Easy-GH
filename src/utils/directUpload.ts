// Direct Cloudinary upload - exactly like profile pictures but with progress tracking
const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "dwwbegf2y";
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "rental_images";

/**
 * Direct upload to Cloudinary with progress tracking
 * Uses XMLHttpRequest for real progress monitoring
 */
export const directUploadToCloudinary = async (
  file: File, 
  onProgress?: (progress: number) => void
) => {
  if (!file) throw new Error('No file provided');
  
  // Validate file
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please select a JPEG, PNG, or WebP image.');
  }
  
  if (file.size > maxSize) {
    throw new Error('File too large. Please select an image under 5MB.');
  }

  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

    const xhr = new XMLHttpRequest();

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });
    }

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          console.log('✅ Direct upload successful:', data.secure_url);
          
          // Return in the format expected by listing components
          resolve({
            url: data.secure_url,
            publicId: data.public_id,
            width: data.width,
            height: data.height,
            format: data.format,
            bytes: data.bytes,
            createdAt: data.created_at
          });
        } catch (error) {
          console.error('❌ Failed to parse response:', error);
          reject(new Error('Failed to parse upload response'));
        }
      } else {
        console.error('❌ Upload failed with status:', xhr.status, xhr.responseText);
        reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
      }
    });

    xhr.addEventListener('error', () => {
      console.error('❌ Upload network error');
      reject(new Error('Network error during upload'));
    });

    console.log('🚀 Starting direct upload to Cloudinary...');
    console.log('Cloud name:', CLOUDINARY_CLOUD_NAME);
    console.log('Upload preset:', CLOUDINARY_UPLOAD_PRESET);
    console.log('File:', file.name, file.size, 'bytes');

    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`);
    xhr.send(formData);
  });
};

export default directUploadToCloudinary;
