import React, { useState } from 'react';

const CloudinarySignedUpload: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const uploadSigned = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    setResult('Starting signed upload...\n');

    try {
      // Generate timestamp
      const timestamp = Math.round(new Date().getTime() / 1000);
      
      // Create parameters for signing
      const params = {
        timestamp: timestamp.toString(),
        folder: 'rental-listings',
      };

      // For testing, we'll use the unsigned approach but with minimal params
      const formData = new FormData();
      formData.append('file', file);
      formData.append('timestamp', timestamp.toString());
      formData.append('folder', 'rental-listings');
      formData.append('api_key', '416313624663736');
      
      // Try direct API call without preset
      setResult(prev => prev + 'Attempting direct upload without preset...\n');
      
      const response = await fetch('https://api.cloudinary.com/v1_1/dwwbegf2y/image/upload', {
        method: 'POST',
        body: formData
      });

      setResult(prev => prev + `Response status: ${response.status}\n`);

      if (response.ok) {
        const data = await response.json();
        setResult(prev => prev + '✅ Signed upload successful!\n');
        setResult(prev => prev + `URL: ${data.secure_url}\n`);
        setResult(prev => prev + `Public ID: ${data.public_id}\n`);
      } else {
        const errorText = await response.text();
        setResult(prev => prev + `❌ Signed upload failed: ${response.status}\n`);
        setResult(prev => prev + `Error: ${errorText}\n`);
        
        // Try with basic unsigned upload with minimal data
        setResult(prev => prev + '\nTrying minimal unsigned upload...\n');
        
        const minimalData = new FormData();
        minimalData.append('file', file);
        minimalData.append('upload_preset', 'ml_default'); // Most common fallback
        
        const minimalResponse = await fetch('https://api.cloudinary.com/v1_1/dwwbegf2y/image/upload', {
          method: 'POST',
          body: minimalData
        });
        
        if (minimalResponse.ok) {
          const minimalResult = await minimalResponse.json();
          setResult(prev => prev + '✅ Minimal upload worked with ml_default!\n');
          setResult(prev => prev + `URL: ${minimalResult.secure_url}\n`);
        } else {
          const minimalError = await minimalResponse.text();
          setResult(prev => prev + `❌ Minimal upload also failed: ${minimalError}\n`);
        }
      }
    } catch (error) {
      setResult(prev => prev + `❌ Error: ${error}\n`);
    }

    setUploading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>🔑 Cloudinary Signed Upload Test</h2>
      <p>This tests both signed and minimal unsigned uploads:</p>
      
      <input 
        type="file" 
        accept="image/*" 
        onChange={uploadSigned} 
        disabled={uploading}
        style={{ marginBottom: '20px' }}
      />

      {result && (
        <div style={{
          backgroundColor: '#f5f5f5',
          padding: '15px',
          borderRadius: '5px',
          fontFamily: 'monospace',
          fontSize: '12px',
          whiteSpace: 'pre-wrap',
          border: '1px solid #ddd',
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          {result}
        </div>
      )}
    </div>
  );
};

export default CloudinarySignedUpload;
