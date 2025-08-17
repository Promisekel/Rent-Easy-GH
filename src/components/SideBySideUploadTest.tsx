import React, { useState } from 'react';
import { uploadImageToCloudinary } from '../utils/cloudinary'; // This works for profile pictures
import directUploadToCloudinary from '../utils/directUpload'; // Our new attempt

const SideBySideUploadTest: React.FC = () => {
  const [profileResult, setProfileResult] = useState<any>(null);
  const [directResult, setDirectResult] = useState<any>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [directError, setDirectError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<{ profile: boolean; direct: boolean }>({
    profile: false,
    direct: false
  });

  const testProfileUpload = async (file: File) => {
    setUploading(prev => ({ ...prev, profile: true }));
    setProfileResult(null);
    setProfileError(null);

    try {
      console.log('🔵 Testing PROFILE PICTURE upload method...');
      const url = await uploadImageToCloudinary(file);
      console.log('✅ Profile upload successful:', url);
      setProfileResult({ url, method: 'Profile Picture Method' });
    } catch (err: any) {
      console.error('❌ Profile upload failed:', err);
      setProfileError(err.message);
    } finally {
      setUploading(prev => ({ ...prev, profile: false }));
    }
  };

  const testDirectUpload = async (file: File) => {
    setUploading(prev => ({ ...prev, direct: true }));
    setDirectResult(null);
    setDirectError(null);

    try {
      console.log('🟡 Testing DIRECT upload method...');
      const result = await directUploadToCloudinary(file);
      console.log('✅ Direct upload successful:', result);
      setDirectResult({ ...result, method: 'Direct Method' });
    } catch (err: any) {
      console.error('❌ Direct upload failed:', err);
      setDirectError(err.message);
    } finally {
      setUploading(prev => ({ ...prev, direct: false }));
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('🧪 Testing both upload methods with file:', file.name);
    
    // Test both methods with the same file
    await Promise.all([
      testProfileUpload(file),
      testDirectUpload(file)
    ]);
  };

  const ResultCard = ({ title, result, error, uploading: isUploading }: any) => (
    <div style={{ 
      flex: 1, 
      margin: '10px', 
      padding: '20px', 
      border: '2px solid #ddd', 
      borderRadius: '8px',
      backgroundColor: result ? '#e8f5e8' : error ? '#ffeaea' : '#f9f9f9'
    }}>
      <h3>{title}</h3>
      
      {isUploading && (
        <div style={{ color: '#666' }}>Uploading...</div>
      )}
      
      {result && (
        <div>
          <h4>✅ Success!</h4>
          <p><strong>URL:</strong> <a href={result.url} target="_blank" rel="noopener noreferrer">{result.url}</a></p>
          {result.publicId && <p><strong>Public ID:</strong> {result.publicId}</p>}
          {result.width && <p><strong>Size:</strong> {result.width} x {result.height}</p>}
          <img 
            src={result.url} 
            alt="Upload result" 
            style={{ 
              maxWidth: '200px', 
              maxHeight: '150px', 
              marginTop: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }} 
          />
        </div>
      )}
      
      {error && (
        <div>
          <h4>❌ Failed</h4>
          <p style={{ color: '#d32f2f' }}>{error}</p>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🔍 Side-by-Side Upload Comparison</h1>
      <p>This tests both the working profile picture method and our new direct method with the same file.</p>
      
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading.profile || uploading.direct}
        style={{ marginBottom: '20px', fontSize: '16px', padding: '10px' }}
      />

      <div style={{ display: 'flex', gap: '20px' }}>
        <ResultCard
          title="🔵 Profile Picture Method (WORKING)"
          result={profileResult}
          error={profileError}
          uploading={uploading.profile}
        />
        
        <ResultCard
          title="🟡 Direct Method (NEW)"
          result={directResult}
          error={directError}
          uploading={uploading.direct}
        />
      </div>

      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '8px' 
      }}>
        <h3>🔧 Configuration</h3>
        <p><strong>Cloud Name:</strong> {process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "dwwbegf2y"}</p>
        <p><strong>Upload Preset:</strong> {process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "rental_images"}</p>
      </div>
    </div>
  );
};

export default SideBySideUploadTest;
