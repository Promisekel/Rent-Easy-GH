// Cloudinary configuration and upload service
const CLOUDINARY_CONFIG = {
  cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'dwwbegf2y',
  apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY || '416313624663736',
  uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'rental_images'
};

/**
 * Upload image to Cloudinary using the configured unsigned preset
 */
export const uploadToCloudinary = async (file: File, onProgress?: (progress: number) => void) => {
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

    console.log('🚀 Uploading to Cloudinary:', file.name, `(${(file.size / 1024 / 1024).toFixed(2)}MB)`);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('folder', 'rental-listings');

    const xhr = new XMLHttpRequest();
    xhr.timeout = 60000; // 60 seconds

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          onProgress(percentComplete);
        }
      });
    }

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          console.log('✅ Upload successful:', response.secure_url);
          resolve({
            url: response.secure_url,
            publicId: response.public_id,
            width: response.width,
            height: response.height,
            format: response.format,
            bytes: response.bytes,
            createdAt: response.created_at
          });
        } catch (parseError) {
          console.error('Failed to parse response:', parseError);
          reject(new Error('Invalid response from upload service'));
        }
      } else {
        let errorMessage = `Upload failed with status: ${xhr.status}`;
        try {
          const errorResponse = JSON.parse(xhr.responseText);
          if (errorResponse.error && errorResponse.error.message) {
            errorMessage = errorResponse.error.message;
          }
        } catch {
          // Use default error message
        }
        console.error('Upload error:', errorMessage);
        reject(new Error(errorMessage));
      }
    });

    xhr.addEventListener('error', () => {
      console.error('Network error during upload');
      reject(new Error('Upload failed due to network error'));
    });

    xhr.addEventListener('timeout', () => {
      console.error('Upload timeout');
      reject(new Error('Upload timed out. Please try again.'));
    });

    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`);
    xhr.send(formData);
  });
};

/**
 * Upload multiple images to Cloudinary
 */
export const uploadMultipleToCloudinary = async (
  files: File[],
  onProgress?: (fileIndex: number, progress: number) => void
) => {
  const uploadPromises = files.map((file, index) =>
    uploadToCloudinary(file, (progress) => {
      if (onProgress) {
        onProgress(index, progress);
      }
    })
  );

  try {
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Multiple upload failed: ${errorMessage}`);
  }
};

/**
 * Generate optimized image URL with transformations
 */
export const getOptimizedImageUrl = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    crop?: 'fill' | 'fit' | 'scale' | 'crop';
  } = {}
) => {
  const {
    width = 800,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill'
  } = options;

  let transformations = `w_${width}`;
  if (height) {
    transformations += `,h_${height}`;
  }
  transformations += `,c_${crop}`;
  transformations += `,q_${quality}`;
  transformations += `,f_${format}`;

  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${transformations}/${publicId}`;
};

export default {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  getOptimizedImageUrl,
  config: CLOUDINARY_CONFIG
};
