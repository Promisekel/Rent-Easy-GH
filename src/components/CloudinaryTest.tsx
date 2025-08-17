import React, { useState } from 'react';
import { uploadToCloudinary } from '../services/cloudinary';

// Define the type for Cloudinary upload result
interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  createdAt: string;
}

const CloudinaryTest: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testCloudinaryConfig = async () => {
    setLoading(true);
    setResult('Testing Cloudinary configuration...\n');

    try {
      // Test 1: Check environment variables
      const config = {
        cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY,
        uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
      };

      setResult(prev => prev + `Cloud Name: ${config.cloudName}\n`);
      setResult(prev => prev + `API Key: ${config.apiKey ? 'Set' : 'Not set'}\n`);
      setResult(prev => prev + `Upload Preset: ${config.uploadPreset}\n\n`);

      // Test 2: Test upload presets
      const presetsToTest = ['rental_images', 'ml_default', 'unsigned_preset'];
      
      for (const preset of presetsToTest) {
        try {
          setResult(prev => prev + `Testing preset: ${preset}...\n`);
          
          const testImageData = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
          const formData = new FormData();
          formData.append('upload_preset', preset);
          formData.append('file', testImageData);
          
          const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`, {
            method: 'POST',
            body: formData
          });
          
          if (response.ok) {
            const result = await response.json();
            setResult(prev => prev + `✅ ${preset} - SUCCESS (URL: ${result.secure_url})\n`);
            break; // Found a working preset
          } else {
            const error = await response.text();
            setResult(prev => prev + `❌ ${preset} - FAILED (${response.status}: ${error})\n`);
          }
        } catch (error) {
          setResult(prev => prev + `❌ ${preset} - ERROR (${error})\n`);
        }
      }

    } catch (error) {
      setResult(prev => prev + `\nOverall test failed: ${error}\n`);
    }
    
    setLoading(false);
  };

  const testFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setLoading(true);
    setResult('Testing file upload...\n');

    try {
      const result = await uploadToCloudinary(file, (progress) => {
        setResult(prev => prev + `Progress: ${progress}%\n`);
      }) as CloudinaryUploadResult;

      setResult(prev => prev + `\n✅ Upload successful!\n`);
      setResult(prev => prev + `URL: ${result.url}\n`);
      setResult(prev => prev + `Public ID: ${result.publicId}\n`);
      setResult(prev => prev + `Size: ${result.bytes} bytes\n`);
      setResult(prev => prev + `Dimensions: ${result.width}x${result.height}\n`);
    } catch (error) {
      setResult(prev => prev + `\n❌ Upload failed: ${error}\n`);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🧪 Cloudinary Configuration Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testCloudinaryConfig}
          disabled={loading}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Testing...' : 'Test Configuration'}
        </button>

        <input
          type="file"
          accept="image/*"
          onChange={testFileUpload}
          disabled={loading}
          style={{ marginLeft: '10px' }}
        />
      </div>

      <div 
        style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          padding: '15px',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          minHeight: '200px',
          maxHeight: '400px',
          overflow: 'auto'
        }}
      >
        {result || 'Click "Test Configuration" to check your Cloudinary setup'}
      </div>

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>Instructions:</strong></p>
        <ul>
          <li>Click "Test Configuration" to check if your upload presets work</li>
          <li>Use the file input to test actual file uploads</li>
          <li>If all tests fail, you need to create an unsigned upload preset in your Cloudinary dashboard</li>
        </ul>
      </div>
    </div>
  );
};

export default CloudinaryTest;
