import React, { useState } from 'react';
import ListingImageUploader from './ListingImageUploader';
import ImageUpload from '../common/ImageUpload';

interface ListingImage {
  id: string;
  url: string;
  publicId: string;
  width: number;
  height: number;
  bytes: number;
  isCover: boolean;
}

const ImageUploaderComparison: React.FC = () => {
  // Enhanced uploader state
  const [enhancedImages, setEnhancedImages] = useState<ListingImage[]>([]);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  
  // Basic uploader state
  const [basicImages, setBasicImages] = useState<string[]>([]);

  const handleEnhancedImagesChange = (images: ListingImage[]) => {
    setEnhancedImages(images);
  };

  const handleEnhancedCoverChange = (url: string | null) => {
    setCoverImageUrl(url);
  };

  const handleBasicUpload = (urls: string[]) => {
    setBasicImages(prev => [...prev, ...urls]);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Image Uploader Comparison
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Compare the enhanced listing image uploader with advanced features against 
          the basic image upload component.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enhanced Listing Image Uploader */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              🚀 Enhanced Listing Uploader
            </h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p>✅ Drag & drop reordering</p>
              <p>✅ Cover image selection</p>
              <p>✅ Automatic compression</p>
              <p>✅ Image preview modal</p>
              <p>✅ Retry failed uploads</p>
              <p>✅ Better visual feedback</p>
            </div>
          </div>

          <ListingImageUploader
            onImagesChange={handleEnhancedImagesChange}
            onCoverImageChange={handleEnhancedCoverChange}
            maxFiles={8}
            allowReorder={true}
            showImageInfo={true}
            compressionQuality={0.8}
          />

          {/* Enhanced Stats */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Current State</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Images:</span>
                <span className="ml-2 font-medium">{enhancedImages.length}</span>
              </div>
              <div>
                <span className="text-blue-700">Cover:</span>
                <span className="ml-2 font-medium">
                  {enhancedImages.find(img => img.isCover) ? '✅ Set' : '❌ None'}
                </span>
              </div>
            </div>
            
            {enhancedImages.length > 0 && (
              <div className="mt-3 space-y-1">
                <p className="text-xs text-blue-600 font-medium">Image Order:</p>
                {enhancedImages.map((img, index) => (
                  <div key={img.id} className="flex items-center justify-between text-xs">
                    <span>{index + 1}. Image {img.id.split('-').pop()}</span>
                    {img.isCover && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Basic Image Upload */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              📎 Basic Image Upload
            </h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p>✅ Multiple file upload</p>
              <p>✅ Drag & drop upload</p>
              <p>✅ Upload progress</p>
              <p>❌ No reordering</p>
              <p>❌ No cover selection</p>
              <p>❌ No compression</p>
            </div>
          </div>

          <ImageUpload
            multiple={true}
            maxFiles={8}
            onUploadComplete={handleBasicUpload}
          />

          {/* Basic Stats */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Current State</h3>
            <div className="text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Images:</span>
                <span className="font-medium">{basicImages.length}</span>
              </div>
            </div>
            
            {basicImages.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {basicImages.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Basic ${index + 1}`}
                    className="w-full h-16 object-cover rounded border"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          📊 Feature Comparison
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold text-gray-900">Feature</th>
                <th className="text-center p-3 font-semibold text-blue-600">Enhanced</th>
                <th className="text-center p-3 font-semibold text-gray-600">Basic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="p-3">Multiple File Upload</td>
                <td className="p-3 text-center">✅</td>
                <td className="p-3 text-center">✅</td>
              </tr>
              <tr>
                <td className="p-3">Drag & Drop Upload</td>
                <td className="p-3 text-center">✅</td>
                <td className="p-3 text-center">✅</td>
              </tr>
              <tr>
                <td className="p-3">Upload Progress</td>
                <td className="p-3 text-center">✅</td>
                <td className="p-3 text-center">✅</td>
              </tr>
              <tr>
                <td className="p-3">Image Reordering</td>
                <td className="p-3 text-center text-green-600 font-semibold">✅</td>
                <td className="p-3 text-center text-red-500">❌</td>
              </tr>
              <tr>
                <td className="p-3">Cover Image Selection</td>
                <td className="p-3 text-center text-green-600 font-semibold">✅</td>
                <td className="p-3 text-center text-red-500">❌</td>
              </tr>
              <tr>
                <td className="p-3">Automatic Compression</td>
                <td className="p-3 text-center text-green-600 font-semibold">✅</td>
                <td className="p-3 text-center text-red-500">❌</td>
              </tr>
              <tr>
                <td className="p-3">Image Preview Modal</td>
                <td className="p-3 text-center text-green-600 font-semibold">✅</td>
                <td className="p-3 text-center text-red-500">❌</td>
              </tr>
              <tr>
                <td className="p-3">Retry Failed Uploads</td>
                <td className="p-3 text-center text-green-600 font-semibold">✅</td>
                <td className="p-3 text-center text-red-500">❌</td>
              </tr>
              <tr>
                <td className="p-3">Property-Specific UI</td>
                <td className="p-3 text-center text-green-600 font-semibold">✅</td>
                <td className="p-3 text-center text-red-500">❌</td>
              </tr>
              <tr>
                <td className="p-3">Detailed File Info</td>
                <td className="p-3 text-center text-green-600 font-semibold">✅</td>
                <td className="p-3 text-center text-orange-500">⚠️</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Usage Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-3">
            🎯 Use Enhanced Uploader For:
          </h3>
          <ul className="space-y-2 text-sm text-green-700">
            <li>• Property listing forms</li>
            <li>• Real estate applications</li>
            <li>• E-commerce product images</li>
            <li>• Portfolio galleries</li>
            <li>• Any use case requiring image order</li>
            <li>• When cover/featured image is needed</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            💡 Use Basic Uploader For:
          </h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li>• Simple image uploads</li>
            <li>• Profile pictures</li>
            <li>• Document uploads</li>
            <li>• Quick prototypes</li>
            <li>• When order doesn't matter</li>
            <li>• Lightweight implementations</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImageUploaderComparison;
