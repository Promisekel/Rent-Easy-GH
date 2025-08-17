// Cloudinary configuration and upload service
const CLOUDINARY_CONFIG = {
  cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'dwwbegf2y',
  apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY || '416313624663736',
  uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'rental_images'
};

// Fallback presets to try if the main one fails
const FALLBACK_PRESETS = ['ml_default', 'unsigned_preset', 'default_preset'];

console.log('🔧 Cloudinary Config Loaded:', {
  cloudName: CLOUDINARY_CONFIG.cloudName,
  uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
  hasApiKey: !!CLOUDINARY_CONFIG.apiKey
});

/**
 * Upload image to Cloudinary using the configured unsigned preset
 */
export const uploadToCloudinary = async (file: File, onProgress?: (progress: number) => void) => {
  // Since the test proved rental_images works, use it directly first
  const presetsToTry = [
    'rental_images', // We know this works from the test
    'rental-images', // Try with dash instead of underscore as fallback
  ];
  
  let lastError: Error | null = null;
  
  for (const preset of presetsToTry) {
    try {
      console.log(`🚀 Trying upload with preset: ${preset}`);
      const result = await uploadWithPreset(file, preset, onProgress);
      console.log(`✅ Upload successful with preset: ${preset}`);
      return result;
    } catch (error) {
      console.log(`❌ Upload failed with preset ${preset}:`, error);
      lastError = error as Error;
      // If it's not a preset error, don't try other presets
      if (!(error as Error).message.includes('preset')) {
        throw error;
      }
      continue;
    }
  }
  
  // If all presets failed, throw the last error
  throw lastError || new Error('All upload presets failed');
};

/**
 * Upload with a specific preset
 */
const uploadWithPreset = async (file: File, uploadPreset: string, onProgress?: (progress: number) => void) => {
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

    // Use the EXACT same approach as the successful test
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    
    // Don't add any other parameters that might interfere

    console.log(`📤 Uploading with preset: ${uploadPreset} to cloud: ${CLOUDINARY_CONFIG.cloudName}`);

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
          reject(new Error('Invalid response from upload service'));
        }
      } else {
        let errorMessage = `Upload failed with status: ${xhr.status}`;
        
        try {
          const errorResponse = JSON.parse(xhr.responseText);
          console.error('📄 Full error response:', errorResponse);
          
          if (errorResponse.error?.message) {
            errorMessage = errorResponse.error.message;
          }
        } catch {
          // Use default error message
        }
        
        reject(new Error(errorMessage));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed due to network error'));
    });

    xhr.addEventListener('timeout', () => {
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
    return await Promise.all(uploadPromises);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Multiple upload failed: ${errorMessage}`);
  }
};

/**
 * Test Cloudinary configuration and upload preset
 */
export const testCloudinaryConfig = async () => {
  console.log('🧪 Testing Cloudinary Configuration...');
  
  // Create a small test image file
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(0, 0, 100, 100);
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.fillText('Test', 35, 55);
  }
  
  return new Promise<boolean>((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        console.error('❌ Could not create test image');
        resolve(false);
        return;
      }
      
      const testFile = new File([blob], 'test-image.png', { type: 'image/png' });
      
      try {
        console.log('📋 Configuration Check:');
        console.log('- Cloud Name:', CLOUDINARY_CONFIG.cloudName);
        console.log('- Upload Preset:', CLOUDINARY_CONFIG.uploadPreset);
        console.log('- Has API Key:', !!CLOUDINARY_CONFIG.apiKey);
        
        const result = await uploadToCloudinary(testFile);
        console.log('✅ Test upload successful!', (result as any).url);
        console.log('🎉 Cloudinary is configured correctly');
        resolve(true);
      } catch (error) {
        console.error('❌ Test upload failed:', error);
        console.log('');
        console.log('🔧 Troubleshooting steps:');
        console.log('1. Go to Cloudinary Dashboard > Settings > Upload');
        console.log('2. Create/Check upload preset "rental_images"');
        console.log('3. Set preset as "Unsigned"');
        console.log('4. Enable "Use filename or externally defined Public ID"');
        console.log('5. Save the preset');
        resolve(false);
      }
    }, 'image/png');
  });
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
