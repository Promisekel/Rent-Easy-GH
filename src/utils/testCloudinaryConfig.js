// Quick Cloudinary Test Script
// Run this in browser console to test your configuration

console.log('🧪 Testing Cloudinary Configuration...');

const cloudinaryConfig = {
  cloudName: 'dwwbegf2y',
  presets: ['rental_images', 'ml_default', 'unsigned_preset', 'default_preset']
};

const testCloudinaryPresets = async () => {
  console.log('🔍 Testing upload presets for cloud:', cloudinaryConfig.cloudName);
  
  // Create minimal test image (1x1 pixel GIF)
  const testImageData = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  
  for (const preset of cloudinaryConfig.presets) {
    try {
      console.log(`Testing preset: ${preset}`);
      
      const formData = new FormData();
      formData.append('upload_preset', preset);
      formData.append('file', testImageData);
      
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ ${preset} - SUCCESS!`);
        console.log(`   URL: ${result.secure_url}`);
        console.log(`   Public ID: ${result.public_id}`);
        return preset; // Return the first working preset
      } else {
        const error = await response.text();
        console.log(`❌ ${preset} - FAILED (${response.status})`);
        console.log(`   Error: ${error}`);
      }
    } catch (error) {
      console.log(`❌ ${preset} - ERROR: ${error.message}`);
    }
    
    // Add small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('🔍 Test complete. If no presets worked, you need to create an unsigned upload preset.');
  return null;
};

// Run the test
testCloudinaryPresets().then(workingPreset => {
  if (workingPreset) {
    console.log(`🎉 SUCCESS! Use preset: ${workingPreset}`);
    console.log('Your uploads should work now!');
  } else {
    console.log('⚠️  No working presets found.');
    console.log('You need to create an unsigned upload preset in your Cloudinary dashboard.');
    console.log('1. Go to cloudinary.com → Settings → Upload → Upload presets');
    console.log('2. Create new preset with name: rental_images');
    console.log('3. Set Signing Mode to: Unsigned');
    console.log('4. Save the preset');
  }
});

// Export function for manual testing
window.testCloudinary = testCloudinaryPresets;
