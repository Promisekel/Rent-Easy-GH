import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  Upload, 
  X, 
  Camera, 
  Image as ImageIcon, 
  CheckCircle, 
  AlertCircle,
  Star,
  StarOff,
  GripVertical,
  RotateCcw,
  Download,
  Eye,
  Maximize2
} from 'lucide-react';
import { uploadToCloudinary } from '../../services/cloudinary';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface ListingImage {
  id: string;
  url: string;
  publicId: string;
  width: number;
  height: number;
  bytes: number;
  isCover: boolean;
  uploading?: boolean;
  progress?: number;
  error?: string;
  file?: File;
  previewUrl?: string;
}

interface ListingImageUploaderProps {
  onImagesChange?: (images: ListingImage[]) => void;
  onCoverImageChange?: (coverImageUrl: string | null) => void;
  maxFiles?: number;
  className?: string;
  existingImages?: string[];
  allowReorder?: boolean;
  showImageInfo?: boolean;
  compressionQuality?: number;
}

const ListingImageUploader: React.FC<ListingImageUploaderProps> = ({
  onImagesChange,
  onCoverImageChange,
  maxFiles = 10,
  className = '',
  existingImages = [],
  allowReorder = true,
  showImageInfo = true,
  compressionQuality = 0.8
}) => {
  const [images, setImages] = useState<ListingImage[]>(
    existingImages.map((url, index) => ({
      id: `existing-${index}`,
      url,
      publicId: '',
      width: 0,
      height: 0,
      bytes: 0,
      isCover: index === 0
    }))
  );
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentUser } = useAuth();

  // Validate file type and size
  const validateFile = (file: File): string | null => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 15 * 1024 * 1024; // 15MB for property images

    if (!allowedTypes.includes(file.type)) {
      return 'Please select a valid image file (JPEG, PNG, WebP)';
    }

    if (file.size > maxSize) {
      return 'File size must be less than 15MB';
    }

    return null;
  };

  // Compress image before upload
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (max 1920x1080 for listings)
        const maxWidth = 1920;
        const maxHeight = 1080;
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          file.type,
          compressionQuality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  // Handle file selection
  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    const fileArray = Array.from(files);
    
    // Check file limit
    if (images.length + fileArray.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} images allowed for property listings`);
      return;
    }

    // Validate all files
    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        toast.error(error);
        return;
      }
    }

    setUploading(true);

    try {
      const uploadPromises = fileArray.map(async (file) => {
        const id = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Compress image
        const compressedFile = await compressImage(file);
        
        const tempImage: ListingImage = {
          id,
          url: '',
          publicId: '',
          width: 0,
          height: 0,
          bytes: compressedFile.size,
          isCover: images.length === 0, // First image is cover by default
          uploading: true,
          progress: 0,
          file: compressedFile,
          previewUrl: URL.createObjectURL(compressedFile)
        };

        setImages(prev => [...prev, tempImage]);

        try {
          // Show loading toast for the upload
          const loadingToastId = toast.loading(`Uploading ${file.name}...`, {
            duration: Infinity
          });

          const result = await uploadToCloudinary(compressedFile, (progress: number) => {
            setImages(prev => prev.map(img => 
              img.id === id ? { ...img, progress } : img
            ));
          });

          // Dismiss loading toast
          toast.dismiss(loadingToastId);

          const uploadedImage: ListingImage = {
            id,
            url: (result as any).url,
            publicId: (result as any).publicId,
            width: (result as any).width,
            height: (result as any).height,
            bytes: (result as any).bytes,
            isCover: tempImage.isCover,
            uploading: false
          };

          setImages(prev => prev.map(img => 
            img.id === id ? uploadedImage : img
          ));

          // Save to database
          if (currentUser) {
            await addDoc(collection(db, 'listing_images'), {
              uid: currentUser.uid,
              url: uploadedImage.url,
              publicId: uploadedImage.publicId,
              width: uploadedImage.width,
              height: uploadedImage.height,
              bytes: uploadedImage.bytes,
              isCover: uploadedImage.isCover,
              uploadedAt: serverTimestamp()
            });
          }

          return uploadedImage;
        } catch (error) {
          console.error('Upload error for file:', file.name, error);
          
          // Determine error message
          let errorMessage = 'Upload failed';
          if (error instanceof Error) {
            if (error.message.includes('Upload preset must be whitelisted')) {
              errorMessage = 'Upload configuration error. Please contact support.';
            } else if (error.message.includes('File size too large')) {
              errorMessage = 'File is too large. Maximum 15MB allowed.';
            } else if (error.message.includes('Invalid file type')) {
              errorMessage = 'Invalid file type. Only JPEG, PNG, and WebP are allowed.';
            } else {
              errorMessage = error.message;
            }
          } else if (typeof error === 'string') {
            errorMessage = error;
          }

          // Update image with error state
          setImages(prev => prev.map(img => 
            img.id === id ? { 
              ...img, 
              error: errorMessage, 
              uploading: false,
              progress: 0
            } : img
          ));
          
          // Show user-friendly error message
          toast.error(`Failed to upload ${file.name}: ${errorMessage}`, {
            duration: 5000,
            icon: '❌'
          });
          throw error;
        }
      });

      const results = await Promise.allSettled(uploadPromises);
      const successfulUploads = results
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<ListingImage>).value);

      if (successfulUploads.length > 0) {
        toast.success(`${successfulUploads.length} images uploaded successfully!`);
        
        // Update parent component
        const updatedImages = images.filter(img => !img.uploading || !img.error);
        onImagesChange?.(updatedImages);
        
        // Set cover image if this is the first successful upload
        const coverImage = updatedImages.find(img => img.isCover);
        onCoverImageChange?.(coverImage?.url || null);
      }

      const failedUploads = results.filter(result => result.status === 'rejected').length;
      if (failedUploads > 0) {
        toast.error(`${failedUploads} images failed to upload`);
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  // Set cover image
  const setCoverImage = useCallback((imageId: string) => {
    setImages(prev => {
      const updated = prev.map(img => ({
        ...img,
        isCover: img.id === imageId
      }));
      
      onImagesChange?.(updated);
      
      const newCoverImage = updated.find(img => img.isCover);
      onCoverImageChange?.(newCoverImage?.url || null);
      
      return updated;
    });
    
    toast.success('Cover image updated');
  }, [onImagesChange, onCoverImageChange]);

  // Remove image
  const removeImage = useCallback((imageId: string) => {
    setImages(prev => {
      const updated = prev.filter(img => img.id !== imageId);
      
      // If removed image was cover, make first image the new cover
      if (prev.find(img => img.id === imageId)?.isCover && updated.length > 0) {
        updated[0].isCover = true;
      }
      
      onImagesChange?.(updated);
      
      const newCoverImage = updated.find(img => img.isCover);
      onCoverImageChange?.(newCoverImage?.url || null);
      
      return updated;
    });
  }, [onImagesChange, onCoverImageChange]);

  // Handle reorder
  const handleReorder = useCallback((reorderedImages: ListingImage[]) => {
    setImages(reorderedImages);
    onImagesChange?.(reorderedImages);
  }, [onImagesChange]);

  // Retry failed upload
  const retryUpload = useCallback((imageId: string) => {
    const image = images.find(img => img.id === imageId);
    if (image?.file) {
      // Create a new DataTransfer object to simulate file selection
      const dt = new DataTransfer();
      dt.items.add(image.file);
      handleFileSelect(dt.files);
      removeImage(imageId);
    }
  }, [images, removeImage]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Upload Area */}
      <motion.div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          dragOver
            ? 'border-blue-500 bg-blue-50 shadow-lg'
            : uploading
            ? 'border-gray-300 bg-gray-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: uploading ? 1 : 1.01 }}
        whileTap={{ scale: uploading ? 1 : 0.99 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={uploading}
        />

        <div className="space-y-4">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center transition-colors duration-300 ${
              uploading ? 'bg-gray-200' : 'bg-blue-100'
            }`}
          >
            {uploading ? (
              <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Camera className="w-10 h-10 text-blue-600" />
            )}
          </motion.div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {uploading ? 'Uploading Property Images...' : 'Add Property Photos'}
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your property images here, or{' '}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 underline"
              >
                browse files
              </button>
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>Up to {maxFiles} high-quality images • PNG, JPG, WebP up to 15MB</p>
              <p>First image will be your cover photo • Images will be optimized automatically</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Image Stats */}
      {images.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded-lg p-3"
        >
          <span>{images.length} of {maxFiles} images</span>
          <span>Cover: {images.find(img => img.isCover)?.id ? 'Set' : 'None'}</span>
        </motion.div>
      )}

      {/* Image Preview Grid */}
      <AnimatePresence>
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6"
          >
            {allowReorder ? (
              <Reorder.Group 
                axis="y" 
                values={images} 
                onReorder={handleReorder}
                className="space-y-4"
              >
                {images.map((image, index) => (
                  <Reorder.Item 
                    key={image.id} 
                    value={image}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
                  >
                    <ImageCard
                      image={image}
                      index={index}
                      onSetCover={setCoverImage}
                      onRemove={removeImage}
                      onRetry={retryUpload}
                      onPreview={setPreviewImage}
                      showImageInfo={showImageInfo}
                      formatFileSize={formatFileSize}
                      allowReorder={allowReorder}
                    />
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
                  >
                    <ImageCard
                      image={image}
                      index={index}
                      onSetCover={setCoverImage}
                      onRemove={removeImage}
                      onRetry={retryUpload}
                      onPreview={setPreviewImage}
                      showImageInfo={showImageInfo}
                      formatFileSize={formatFileSize}
                      allowReorder={false}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={previewImage}
                alt="Preview"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Image Card Component
interface ImageCardProps {
  image: ListingImage;
  index: number;
  onSetCover: (imageId: string) => void;
  onRemove: (imageId: string) => void;
  onRetry: (imageId: string) => void;
  onPreview: (url: string) => void;
  showImageInfo: boolean;
  formatFileSize: (bytes: number) => string;
  allowReorder: boolean;
}

const ImageCard: React.FC<ImageCardProps> = ({
  image,
  index,
  onSetCover,
  onRemove,
  onRetry,
  onPreview,
  showImageInfo,
  formatFileSize,
  allowReorder
}) => {
  const imageUrl = image.previewUrl || image.url;

  return (
    <div className="flex items-center space-x-4">
      {/* Drag Handle */}
      {allowReorder && (
        <div className="cursor-grab active:cursor-grabbing">
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>
      )}

      {/* Image Thumbnail */}
      <div className="relative flex-shrink-0">
        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt={`Property image ${index + 1}`}
            className="w-full h-full object-cover"
          />
          
          {/* Upload Progress */}
          {image.uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-1" />
                <p className="text-xs">{image.progress || 0}%</p>
              </div>
            </div>
          )}

          {/* Upload Complete */}
          {!image.uploading && !image.error && (
            <div className="absolute top-1 right-1">
              <CheckCircle className="w-5 h-5 text-green-500 bg-white rounded-full" />
            </div>
          )}

          {/* Upload Error */}
          {image.error && (
            <div className="absolute inset-0 bg-red-500 bg-opacity-75 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          )}
        </div>

        {/* Cover Badge */}
        {image.isCover && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium"
          >
            Cover
          </motion.div>
        )}
      </div>

      {/* Image Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            Image {index + 1}
          </h4>
          
          {/* Cover Star Button */}
          <button
            onClick={() => onSetCover(image.id)}
            disabled={image.uploading || !!image.error}
            className={`p-1 rounded-full transition-colors duration-200 ${
              image.isCover
                ? 'text-yellow-500 hover:text-yellow-600'
                : 'text-gray-400 hover:text-yellow-500'
            }`}
            title={image.isCover ? 'Current cover image' : 'Set as cover image'}
          >
            {image.isCover ? (
              <Star className="w-4 h-4 fill-current" />
            ) : (
              <StarOff className="w-4 h-4" />
            )}
          </button>
        </div>

        {showImageInfo && (
          <div className="text-xs text-gray-500 mt-1 space-y-1">
            <p>{formatFileSize(image.bytes)}</p>
            {image.width && image.height && (
              <p>{image.width} × {image.height}</p>
            )}
            {image.error && (
              <p className="text-red-500">{image.error}</p>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        {/* Preview Button */}
        {!image.uploading && !image.error && (
          <button
            onClick={() => onPreview(imageUrl)}
            className="p-2 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 transition-all duration-200"
            title="Preview image"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}

        {/* Retry Button */}
        {image.error && (
          <button
            onClick={() => onRetry(image.id)}
            className="p-2 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 transition-all duration-200"
            title="Retry upload"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}

        {/* Remove Button */}
        {!image.uploading && (
          <button
            onClick={() => onRemove(image.id)}
            className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all duration-200"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ListingImageUploader;
