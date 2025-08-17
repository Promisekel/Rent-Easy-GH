import React, { useState } from 'react';

const CloudinaryPresetTester: React.FC = () => {
  const [results, setResults] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);

  const presets = [
    'rental_images',
    'rental-images', 
    'rental_image',
    'rental-image',
    'rentalimages',
    'ml_default',
    'unsigned_preset',
    'default',
    'upload_preset',
    'basic'
  ];

  const testPresets = async () => {
    setTesting(true);
    setResults([]);
    
    for (const preset of presets) {
      try {
        // Create a small test blob
        const canvas = document.createElement('canvas');
        canvas.width = 10;
        canvas.height = 10;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ff0000';
          ctx.fillRect(0, 0, 10, 10);
        }
        
        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, 'image/png');
        });
        
        if (!blob) {
          continue;
        }
        
        const formData = new FormData();
        formData.append('file', blob, 'test.png');
        formData.append('upload_preset', preset);
        
        const response = await fetch('https://api.cloudinary.com/v1_1/dwwbegf2y/image/upload', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          const data = await response.json();
          setResults(prev => [...prev, `✅ ${preset} - SUCCESS! URL: ${data.secure_url}`]);
        } else {
          const errorText = await response.text();
          setResults(prev => [...prev, `❌ ${preset} - FAILED: ${response.status} ${errorText.substring(0, 100)}`]);
        }
      } catch (error) {
        setResults(prev => [...prev, `❌ ${preset} - ERROR: ${error}`]);
      }
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setTesting(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>🔍 Cloudinary Preset Tester</h2>
      <p>This will test multiple preset names to find which one works:</p>
      
      <button 
        onClick={testPresets} 
        disabled={testing}
        style={{
          padding: '10px 20px',
          backgroundColor: testing ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: testing ? 'not-allowed' : 'pointer',
          marginBottom: '20px'
        }}
      >
        {testing ? 'Testing...' : 'Test All Presets'}
      </button>

      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '15px', 
        borderRadius: '5px',
        maxHeight: '400px',
        overflowY: 'auto'
      }}>
        {results.length === 0 && !testing && <p>Click the button to start testing...</p>}
        {testing && <p>Testing presets... This may take a moment.</p>}
        {results.map((result, index) => (
          <div key={index} style={{ 
            marginBottom: '8px', 
            fontFamily: 'monospace', 
            fontSize: '12px',
            color: result.includes('✅') ? '#28a745' : '#dc3545'
          }}>
            {result}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CloudinaryPresetTester;
