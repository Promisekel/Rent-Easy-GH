import React, { useState } from 'react';

const CloudinaryDirectTest: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const testDirectUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    setResult('Starting direct upload test...\n');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'rental_images');

    try {
      setResult(prev => prev + 'Uploading to Cloudinary...\n');
      
      const response = await fetch('https://api.cloudinary.com/v1_1/dwwbegf2y/image/upload', {
        method: 'POST',
        body: formData
      });

      setResult(prev => prev + `Response status: ${response.status}\n`);

      if (response.ok) {
        const data = await response.json();
        setResult(prev => prev + '✅ Upload successful!\n');
        setResult(prev => prev + `URL: ${data.secure_url}\n`);
        setResult(prev => prev + `Public ID: ${data.public_id}\n`);
      } else {
        const errorData = await response.text();
        setResult(prev => prev + `❌ Upload failed: ${response.status}\n`);
        setResult(prev => prev + `Error: ${errorData}\n`);
      }
    } catch (error) {
      setResult(prev => prev + `❌ Network error: ${error}\n`);
    }

    setUploading(false);
  };

  const testWithML = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    setResult('Testing with ml_default preset...\n');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dwwbegf2y/image/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setResult(prev => prev + '✅ ml_default worked!\n');
        setResult(prev => prev + `URL: ${data.secure_url}\n`);
      } else {
        const errorData = await response.text();
        setResult(prev => prev + `❌ ml_default failed: ${errorData}\n`);
      }
    } catch (error) {
      setResult(prev => prev + `❌ Error: ${error}\n`);
    }

    setUploading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>🧪 Direct Cloudinary Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Test rental_images preset</h3>
        <input type="file" accept="image/*" onChange={testDirectUpload} disabled={uploading} />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Test ml_default preset (fallback)</h3>
        <input type="file" accept="image/*" onChange={testWithML} disabled={uploading} />
      </div>

      {result && (
        <div style={{
          backgroundColor: '#f5f5f5',
          padding: '15px',
          borderRadius: '5px',
          fontFamily: 'monospace',
          fontSize: '12px',
          whiteSpace: 'pre-wrap',
          border: '1px solid #ddd'
        }}>
          {result}
        </div>
      )}
    </div>
  );
};

export default CloudinaryDirectTest;
