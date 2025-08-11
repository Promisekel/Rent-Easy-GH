// Cloudinary configuration and upload service
const CLOUDINARY_CONFIG = {
  cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'dwwbegf2y',
  apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY || '416313624663736',
  apiSecret: process.env.REACT_APP_CLOUDINARY_API_SECRET || 'hyJxqiguS3y0IZjaodpT-BR43DU', // Don't use in production frontend
  uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'rental_images'
};

/**
 * Upload image to Cloudinary
 * @param {File} file - The image file to upload
 * @param {Function} onProgress - Progress callback (optional)
 * @returns {Promise<Object>} - Upload result with URL and metadata
 */
export const uploadToCloudinary = async (file: File, onProgress?: (progress: number) => void) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName);

    const xhr = new XMLHttpRequest();
    
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
        const response = JSON.parse(xhr.responseText);
        resolve({
          url: response.secure_url,
          publicId: response.public_id,
          width: response.width,
          height: response.height,
          format: response.format,
          bytes: response.bytes,
          createdAt: response.created_at
        });
      } else {
        reject(new Error(`Upload failed with status: ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed due to network error'));
    });

    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`);
    xhr.send(formData);
  });
};

/**
 * Upload multiple images to Cloudinary
 * @param {File[]} files - Array of image files
 * @param {Function} onProgress - Progress callback for each file
 * @returns {Promise<Object[]>} - Array of upload results
 */
export const uploadMultipleToCloudinary = async (
  files: File[], 
  onProgress?: (fileIndex: number, progress: number) => void
) => {
  const uploadPromises = files.map((file, index) => 
    uploadToCloudinary(file, (progress) => {
      if (onProgress) onProgress(index, progress);
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
 * Delete image from Cloudinary
 * @param {string} publicId - The public ID of the image to delete
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteFromCloudinary = async (publicId: string) => {
  try {
    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('api_key', CLOUDINARY_CONFIG.apiKey);
    
    // Note: For deletion, you typically need to implement this on your backend
    // as it requires the API secret which shouldn't be exposed on the frontend
    console.warn('Image deletion should be implemented on the backend for security');
    
    return { success: false, message: 'Deletion should be handled by backend' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Delete failed: ${errorMessage}`);
  }
};

/**
 * Generate optimized image URL with transformations
 * @param {string} publicId - The public ID of the image
 * @param {Object} options - Transformation options
 * @returns {string} - Optimized image URL
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
  if (height) transformations += `,h_${height}`;
  transformations += `,c_${crop}`;
  transformations += `,q_${quality}`;
  transformations += `,f_${format}`;

  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${transformations}/${publicId}`;
};

export default {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
  getOptimizedImageUrl,
  config: CLOUDINARY_CONFIG
};
