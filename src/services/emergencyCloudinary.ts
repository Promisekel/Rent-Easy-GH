// Emergency Cloudinary service with proven working configuration
const WORKING_CONFIG = {
  cloudName: 'dwwbegf2y',
  uploadPreset: 'rental_images' // We proved this works in the test
};

/**
 * Emergency upload function that replicates the exact working test
 */
export const emergencyUploadToCloudinary = async (file: File, onProgress?: (progress: number) => void) => {
  return new Promise((resolve, reject) => {
    // Validate file
    if (!file || !(file instanceof File)) {
      reject(new Error('Invalid file provided'));
      return;
    }

    // Check file size (15MB limit)
    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      reject(new Error('File size too large. Maximum 15MB allowed.'));
      return;
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      reject(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
      return;
    }

    console.log('🚀 Emergency upload starting...');

    // Use the EXACT same approach as the successful profile upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', WORKING_CONFIG.uploadPreset);
    formData.append('cloud_name', WORKING_CONFIG.cloudName); // This might be the missing piece!

    // Use fetch instead of XMLHttpRequest for better error handling
    fetch(`https://api.cloudinary.com/v1_1/${WORKING_CONFIG.cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    })
    .then(response => {
      console.log(`Response status: ${response.status}`);
      
      if (response.ok) {
        return response.json();
      } else {
        return response.text().then(errorText => {
          throw new Error(`Upload failed: ${response.status} - ${errorText}`);
        });
      }
    })
    .then(data => {
      console.log('✅ Emergency upload successful!', data.secure_url);
      resolve({
        url: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
        format: data.format,
        bytes: data.bytes,
        createdAt: data.created_at
      });
    })
    .catch(error => {
      console.error('❌ Emergency upload failed:', error);
      reject(error);
    });
  });
};

// Export as default for easy replacement
export default emergencyUploadToCloudinary;
