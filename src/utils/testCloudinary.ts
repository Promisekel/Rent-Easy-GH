// Test Cloudinary configuration
export const testCloudinaryConfig = async () => {
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'dwwbegf2y';
  const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'rental_images';

  console.log('Testing Cloudinary configuration...');
  console.log('Cloud Name:', cloudName);
  console.log('Upload Preset:', uploadPreset);

  try {
    // Test if the cloud exists by making a simple request
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/list`, {
      method: 'GET',
    });

    if (response.status === 401) {
      console.log('✅ Cloud exists (401 is expected for unauthenticated list request)');
    } else if (response.status === 404) {
      console.error('❌ Cloud name not found');
      return false;
    }

    // Test upload preset by making a minimal request
    const testFormData = new FormData();
    testFormData.append('upload_preset', uploadPreset);
    testFormData.append('file', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');

    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: testFormData
    });

    if (uploadResponse.ok) {
      console.log('✅ Upload preset is valid');
      const result = await uploadResponse.json();
      console.log('Test upload result:', result);
      return true;
    } else {
      const errorText = await uploadResponse.text();
      console.error('❌ Upload preset error:', uploadResponse.status, errorText);
      return false;
    }
  } catch (error) {
    console.error('❌ Cloudinary test failed:', error);
    return false;
  }
};
