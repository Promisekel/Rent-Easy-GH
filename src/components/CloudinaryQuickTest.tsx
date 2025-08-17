import React, { useState } from 'react';
import { uploadToCloudinary, testCloudinaryConfig } from '../services/cloudinary';

const CloudinaryQuickTest: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string>('');

  const runTest = async () => {
    setTesting(true);
    setTestResult('Testing configuration...');
    
    try {
      const success = await testCloudinaryConfig();
      if (success) {
        setTestResult('✅ Configuration test passed! Cloudinary is working correctly.');
      } else {
        setTestResult('❌ Configuration test failed. Check console for details.');
      }
    } catch (error) {
      setTestResult(`❌ Test error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    setTesting(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    setUploadResult('Uploading...');

    try {
      const result = await uploadToCloudinary(file);
      setUploadResult(`✅ Upload successful! URL: ${(result as any).url}`);
    } catch (error) {
      setUploadResult(`❌ Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    setUploading(false);
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '600px', 
      margin: '20px auto',
      border: '1px solid #ccc',
      borderRadius: '8px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2>🧪 Cloudinary Quick Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Configuration Test</h3>
        <button 
          onClick={runTest} 
          disabled={testing}
          style={{
            padding: '10px 20px',
            backgroundColor: testing ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: testing ? 'not-allowed' : 'pointer'
          }}
        >
          {testing ? 'Testing...' : 'Test Configuration'}
        </button>
        
        {testResult && (
          <div style={{ 
            marginTop: '10px', 
            padding: '10px', 
            backgroundColor: testResult.includes('✅') ? '#d4edda' : '#f8d7da',
            border: `1px solid ${testResult.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            {testResult}
          </div>
        )}
      </div>

      <div>
        <h3>File Upload Test</h3>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileUpload}
          disabled={uploading}
          style={{ marginBottom: '10px' }}
        />
        
        {uploadResult && (
          <div style={{ 
            marginTop: '10px', 
            padding: '10px', 
            backgroundColor: uploadResult.includes('✅') ? '#d4edda' : '#f8d7da',
            border: `1px solid ${uploadResult.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: '4px',
            fontSize: '14px',
            wordBreak: 'break-all'
          }}>
            {uploadResult}
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p><strong>Current Config:</strong></p>
        <p>Cloud Name: dwwbegf2y</p>
        <p>Upload Preset: rental_images</p>
        <p>Fallback Presets: ml_default, unsigned_preset, default_preset</p>
      </div>
    </div>
  );
};

export default CloudinaryQuickTest;
