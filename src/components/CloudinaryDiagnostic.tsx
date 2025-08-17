import React, { useState } from 'react';
import { uploadToCloudinary, testCloudinaryConfig } from '../services/cloudinary';
import toast from 'react-hot-toast';

const CloudinaryDiagnostic: React.FC = () => {
    const [isTestingConfig, setIsTestingConfig] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [lastResult, setLastResult] = useState<any>(null);

    const runConfigTest = async () => {
        setIsTestingConfig(true);
        try {
            const success = await testCloudinaryConfig();
            if (success) {
                toast.success('✅ Cloudinary configuration is working!');
            } else {
                toast.error('❌ Cloudinary configuration has issues');
            }
        } catch (error) {
            console.error('Config test error:', error);
            toast.error('Config test failed');
        } finally {
            setIsTestingConfig(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        console.log('🔍 File details:', {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: new Date(file.lastModified).toISOString()
        });

        setIsUploading(true);
        setUploadProgress(0);
        setLastResult(null);

        try {
            const result = await uploadToCloudinary(file, (progress) => {
                setUploadProgress(progress);
            });
            
            setLastResult(result);
            toast.success(`✅ Upload successful: ${file.name}`);
        } catch (error) {
            console.error('Upload error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast.error(`❌ Upload failed: ${errorMessage.substring(0, 100)}...`);
            setLastResult({ error: errorMessage });
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">🔧 Cloudinary Diagnostic Tool</h2>
            
            {/* Environment Check */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">📋 Environment Configuration</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <strong>Cloud Name:</strong> {process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'Not set'}
                    </div>
                    <div>
                        <strong>Upload Preset:</strong> {process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'Not set'}
                    </div>
                    <div>
                        <strong>API Key:</strong> {process.env.REACT_APP_CLOUDINARY_API_KEY ? '✅ Set' : '❌ Not set'}
                    </div>
                    <div>
                        <strong>API Secret:</strong> {process.env.REACT_APP_CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Not set'}
                    </div>
                </div>
            </div>

            {/* Configuration Test */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">🧪 Configuration Test</h3>
                <p className="text-sm text-gray-600 mb-3">
                    This will create a small test image and try to upload it to verify your Cloudinary setup.
                </p>
                <button
                    onClick={runConfigTest}
                    disabled={isTestingConfig}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {isTestingConfig ? '🔄 Testing...' : '🧪 Test Configuration'}
                </button>
            </div>

            {/* File Upload Test */}
            <div className="mb-6 p-4 bg-green-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">📤 File Upload Test</h3>
                <p className="text-sm text-gray-600 mb-3">
                    Upload a real image file to test the upload functionality.
                </p>
                
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                
                {isUploading && (
                    <div className="mt-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Results */}
            {lastResult && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">📊 Last Upload Result</h3>
                    <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-64">
                        {JSON.stringify(lastResult, null, 2)}
                    </pre>
                </div>
            )}

            {/* Troubleshooting Guide */}
            <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">🛠️ Troubleshooting Guide</h3>
                <div className="text-sm space-y-2">
                    <p><strong>If you see "Missing or insufficient permissions":</strong></p>
                    <ol className="list-decimal list-inside space-y-1 ml-4">
                        <li>Go to your <a href="https://cloudinary.com/console" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Cloudinary Console</a></li>
                        <li>Navigate to Settings → Upload</li>
                        <li>Find or create upload preset "rental_images"</li>
                        <li>Set Mode to "Unsigned"</li>
                        <li>Enable "Use filename or externally defined Public ID"</li>
                        <li>Under "Folder", allow "rental-listings" or leave empty</li>
                        <li>Save the preset</li>
                    </ol>
                    
                    <p className="mt-4"><strong>Alternative Solutions:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Try creating a new upload preset with a different name</li>
                        <li>Remove the folder parameter temporarily</li>
                        <li>Check if your Cloudinary account has upload limits</li>
                        <li>Verify your account is not suspended or restricted</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CloudinaryDiagnostic;
