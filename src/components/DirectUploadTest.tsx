import React, { useState } from 'react';
import directUploadToCloudinary from '../utils/directUpload';

const DirectUploadTest: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setResult(null);
    setError(null);

    try {
      console.log('🧪 Testing direct upload with file:', file.name);
      
      const uploadResult = await directUploadToCloudinary(file, (progressValue) => {
        setProgress(progressValue);
        console.log('📊 Upload progress:', progressValue + '%');
      });

      console.log('✅ Direct upload test successful:', uploadResult);
      setResult(uploadResult);
    } catch (err: any) {
      console.error('❌ Direct upload test failed:', err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>🧪 Direct Upload Test</h2>
      <p>This tests the new direct upload approach that should work like profile pictures.</p>
      
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        style={{ marginBottom: '20px' }}
      />

      {uploading && (
        <div style={{ marginBottom: '20px' }}>
          <div>Uploading... {progress}%</div>
          <div style={{ 
            width: '100%', 
            height: '20px', 
            backgroundColor: '#e0e0e0', 
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${progress}%`, 
              height: '100%', 
              backgroundColor: '#4caf50',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      )}

      {result && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          backgroundColor: '#e8f5e8', 
          borderRadius: '8px' 
        }}>
          <h3>✅ Upload Successful!</h3>
          <p><strong>URL:</strong> <a href={result.url} target="_blank" rel="noopener noreferrer">{result.url}</a></p>
          <p><strong>Public ID:</strong> {result.publicId}</p>
          <p><strong>Size:</strong> {result.width} x {result.height}</p>
          <p><strong>Format:</strong> {result.format}</p>
          <p><strong>Bytes:</strong> {result.bytes}</p>
          
          <img 
            src={result.url} 
            alt="Uploaded" 
            style={{ 
              maxWidth: '300px', 
              maxHeight: '200px', 
              marginTop: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }} 
          />
        </div>
      )}

      {error && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          backgroundColor: '#ffeaea', 
          borderRadius: '8px',
          color: '#d32f2f'
        }}>
          <h3>❌ Upload Failed</h3>
          <p>{error}</p>
        </div>
      )}

      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <h4>🔍 Debug Info</h4>
        <p><strong>Cloud Name:</strong> {process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "dwwbegf2y"}</p>
        <p><strong>Upload Preset:</strong> {process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "rental_images"}</p>
      </div>
    </div>
  );
};

export default DirectUploadTest;
