import React, { useState } from 'react';
import { uploadToCloudinary } from '../services/cloudinary';
import toast from 'react-hot-toast';

const CloudinaryUploadTest: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setResult(null);

    try {
      toast.loading('Uploading image...', { id: 'upload' });
      
      const uploadResult = await uploadToCloudinary(file, (progressValue) => {
        setProgress(progressValue);
      });

      setResult(uploadResult);
      toast.success('Upload successful!', { id: 'upload' });
      
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: 'upload' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>🧪 Cloudinary Upload Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={uploading}
          style={{
            padding: '10px',
            border: '2px dashed #ccc',
            borderRadius: '5px',
            width: '100%'
          }}
        />
      </div>

      {uploading && (
        <div style={{ marginBottom: '20px' }}>
          <div>Uploading... {progress}%</div>
          <div style={{
            width: '100%',
            height: '10px',
            backgroundColor: '#f0f0f0',
            borderRadius: '5px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: '#4CAF50',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      )}

      {result && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '5px',
          border: '1px solid #e9ecef'
        }}>
          <h3>✅ Upload Successful!</h3>
          <p><strong>URL:</strong> <a href={result.url} target="_blank" rel="noopener noreferrer">{result.url}</a></p>
          <p><strong>Public ID:</strong> {result.publicId}</p>
          <p><strong>Size:</strong> {(result.bytes / 1024).toFixed(2)} KB</p>
          <p><strong>Dimensions:</strong> {result.width} x {result.height}</p>
          <img 
            src={result.url} 
            alt="Uploaded" 
            style={{ 
              maxWidth: '100%', 
              height: 'auto', 
              marginTop: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px'
            }} 
          />
        </div>
      )}

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#e8f5e8', 
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <h4>🎯 Test Instructions:</h4>
        <ol>
          <li>Choose an image file (JPEG, PNG, or WebP)</li>
          <li>Watch the progress bar during upload</li>
          <li>See the result with image preview</li>
          <li>Check browser console for detailed logs</li>
        </ol>
      </div>
    </div>
  );
};

export default CloudinaryUploadTest;
