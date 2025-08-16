import React, { useState } from 'react';
import ListingImageUploader from './ListingImageUploader';

interface ListingImage {
  id: string;
  url: string;
  publicId: string;
  width: number;
  height: number;
  bytes: number;
  isCover: boolean;
}

const ListingImageUploaderDemo: React.FC = () => {
  const [images, setImages] = useState<ListingImage[]>([]);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);

  const handleImagesChange = (updatedImages: ListingImage[]) => {
    setImages(updatedImages);
    console.log('Images updated:', updatedImages);
  };

  const handleCoverImageChange = (url: string | null) => {
    setCoverImageUrl(url);
    console.log('Cover image changed:', url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Enhanced Listing Image Uploader
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          A powerful image uploader designed specifically for property listings with features like 
          drag-and-drop reordering, cover image selection, image compression, and real-time upload progress.
        </p>
      </div>

      {/* Features List */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">✨ Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Drag & drop file upload</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Image reordering with drag & drop</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Set cover image with star button</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Automatic image compression</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Real-time upload progress</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Image preview modal</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Retry failed uploads</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Responsive design</span>
            </div>
          </div>
        </div>
      </div>

      {/* Image Uploader */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Property Images</h2>
        
        <ListingImageUploader
          onImagesChange={handleImagesChange}
          onCoverImageChange={handleCoverImageChange}
          maxFiles={10}
          allowReorder={true}
          showImageInfo={true}
          compressionQuality={0.8}
          className="mb-6"
        />

        {/* Current State Display */}
        {images.length > 0 && (
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Current State</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Images ({images.length})</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  {images.map((image, index) => (
                    <div key={image.id} className="flex items-center justify-between">
                      <span>Image {index + 1}</span>
                      <div className="flex items-center space-x-2">
                        {image.isCover && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                            Cover
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {Math.round(image.bytes / 1024)}KB
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Cover Image</h4>
                {coverImageUrl ? (
                  <div className="space-y-2">
                    <img 
                      src={coverImageUrl} 
                      alt="Cover" 
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <p className="text-sm text-gray-600">Cover image set</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No cover image selected</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Usage Instructions */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">📖 How to Use</h2>
        <div className="space-y-3 text-blue-800">
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-200 text-blue-800 text-sm font-medium rounded-full flex items-center justify-center mt-0.5">1</span>
            <span>Drag and drop images or click "browse files" to upload property photos</span>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-200 text-blue-800 text-sm font-medium rounded-full flex items-center justify-center mt-0.5">2</span>
            <span>The first image will automatically be set as the cover photo</span>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-200 text-blue-800 text-sm font-medium rounded-full flex items-center justify-center mt-0.5">3</span>
            <span>Click the star icon next to any image to set it as the cover photo</span>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-200 text-blue-800 text-sm font-medium rounded-full flex items-center justify-center mt-0.5">4</span>
            <span>Drag images up or down to reorder them (when reordering is enabled)</span>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-200 text-blue-800 text-sm font-medium rounded-full flex items-center justify-center mt-0.5">5</span>
            <span>Click the eye icon to preview images in full size</span>
          </div>
        </div>
      </div>

      {/* API Example */}
      <div className="bg-gray-900 rounded-xl p-6 text-gray-100">
        <h2 className="text-xl font-semibold mb-4">💻 Usage Example</h2>
        <pre className="text-sm overflow-x-auto">
{`import ListingImageUploader from './components/listings/ListingImageUploader';

const MyListingForm = () => {
  const [images, setImages] = useState([]);
  const [coverImage, setCoverImage] = useState(null);

  return (
    <ListingImageUploader
      onImagesChange={setImages}
      onCoverImageChange={setCoverImage}
      maxFiles={10}
      allowReorder={true}
      showImageInfo={true}
      compressionQuality={0.8}
    />
  );
};`}
        </pre>
      </div>
    </div>
  );
};

export default ListingImageUploaderDemo;
