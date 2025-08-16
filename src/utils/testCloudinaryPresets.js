/**
 * Test script to verify Cloudinary configuration
 * Run this in browser console to test upload presets
 */

const testCloudinaryPresets = async () => {
  const cloudName = 'dwwbegf2y';
  const presetsToTest = ['rental_images', 'ml_default', 'unsigned_preset'];
  
  console.log('🧪 Testing Cloudinary Upload Presets...\n');
  
  // Create a minimal test image (1x1 pixel GIF)
  const testImageData = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  
  for (const preset of presetsToTest) {
    try {
      console.log(`Testing preset: ${preset}`);
      
      const formData = new FormData();
      formData.append('upload_preset', preset);
      formData.append('file', testImageData);
      
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ ${preset} - SUCCESS`);
        console.log(`   URL: ${result.secure_url}`);
        console.log(`   Public ID: ${result.public_id}\n`);
        return preset; // Return the first working preset
      } else {
        const error = await response.text();
        console.log(`❌ ${preset} - FAILED`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Error: ${error}\n`);
      }
    } catch (error) {
      console.log(`❌ ${preset} - ERROR`);
      console.log(`   Error: ${error.message}\n`);
    }
  }
  
  console.log('🔍 No working presets found. You need to create an unsigned upload preset in your Cloudinary dashboard.');
  return null;
};

// Instructions for using this test
console.log(`
🧪 CLOUDINARY PRESET TESTER
============================

To test your Cloudinary configuration:

1. Open browser console (F12)
2. Paste this entire script
3. Run: testCloudinaryPresets()

This will test which upload presets work with your account.

If no presets work, you need to:
1. Go to Cloudinary Dashboard
2. Settings → Upload → Upload presets
3. Create a new preset named 'rental_images'
4. Set Signing Mode to 'Unsigned'
5. Save the preset

Then run the test again.
`);

// Auto-run the test
testCloudinaryPresets();
