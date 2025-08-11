import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Camera, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadToCloudinary, uploadMultipleToCloudinary } from '../../services/cloudinary';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  onUploadComplete?: (urls: string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
}

interface UploadedImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
  bytes: number;
  uploading?: boolean;
  progress?: number;
  error?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUploadComplete,
  multiple = false,
  maxFiles = 5,
  className = ''
}) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentUser } = useAuth();

  // Validate file type and size
  const validateFile = (file: File): string | null => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return 'Please select a valid image file (JPEG, PNG, WebP)';
    }

    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }

    return null;
  };

  // Handle file selection
  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    
    // Check file limit
    if (!multiple && fileArray.length > 1) {
      toast.error('Please select only one file');
      return;
    }

    if (images.length + fileArray.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
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
      if (multiple) {
        // Upload multiple files
        const uploadPromises = fileArray.map((file, index) => {
          const tempImage: UploadedImage = {
            url: URL.createObjectURL(file),
            publicId: '',
            width: 0,
            height: 0,
            bytes: file.size,
            uploading: true,
            progress: 0
          };

          setImages(prev => [...prev, tempImage]);

          return uploadToCloudinary(file, (progress: number) => {
            setImages(prev => prev.map((img, i) => 
              i === prev.length - fileArray.length + index 
                ? { ...img, progress }
                : img
            ));
          });
        });

        const results = await Promise.all(uploadPromises);
        
        // Update with actual upload results
        setImages(prev => {
          const updated = [...prev];
          results.forEach((result: any, index: number) => {
            const imgIndex = updated.length - fileArray.length + index;
            updated[imgIndex] = {
              url: (result as any).url,
              publicId: (result as any).publicId,
              width: (result as any).width,
              height: (result as any).height,
              bytes: (result as any).bytes,
              uploading: false
            };
          });
          return updated;
        });

        // Save to database
        if (currentUser) {
          await Promise.all(results.map((result: any) => 
            addDoc(collection(db, 'user_images'), {
              uid: currentUser.uid,
              url: (result as any).url,
              publicId: (result as any).publicId,
              width: (result as any).width,
              height: (result as any).height,
              bytes: (result as any).bytes,
              uploadedAt: serverTimestamp()
            })
          ));
        }

        onUploadComplete?.(results.map((r: any) => r.url));
        toast.success(`${results.length} images uploaded successfully!`);
        
      } else {
        // Upload single file
        const file = fileArray[0];
        const tempImage: UploadedImage = {
          url: URL.createObjectURL(file),
          publicId: '',
          width: 0,
          height: 0,
          bytes: file.size,
          uploading: true,
          progress: 0
        };

        setImages([tempImage]);

        const result = await uploadToCloudinary(file, (progress: number) => {
          setImages(prev => [{ ...prev[0], progress }]);
        });

        const uploadedImage: UploadedImage = {
          url: (result as any).url,
          publicId: (result as any).publicId,
          width: (result as any).width,
          height: (result as any).height,
          bytes: (result as any).bytes,
          uploading: false
        };

        setImages([uploadedImage]);

        // Save to database
        if (currentUser) {
          await addDoc(collection(db, 'user_images'), {
            uid: currentUser.uid,
            url: uploadedImage.url,
            publicId: uploadedImage.publicId,
            width: uploadedImage.width,
            height: uploadedImage.height,
            bytes: uploadedImage.bytes,
            uploadedAt: serverTimestamp()
          });
        }

        onUploadComplete?.([uploadedImage.url]);
        toast.success('Image uploaded successfully!');
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('Upload failed. Please try again.');
      
      // Remove failed uploads
      setImages(prev => prev.filter(img => !img.uploading));
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

  // Remove image
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Upload Area */}
      <motion.div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          dragOver
            ? 'border-primary-500 bg-primary-50'
            : uploading
            ? 'border-gray-300 bg-gray-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: uploading ? 1 : 1.02 }}
        whileTap={{ scale: uploading ? 1 : 0.98 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={uploading}
        />

        <div className="space-y-4">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
              uploading ? 'bg-gray-200' : 'bg-primary-100'
            }`}
          >
            {uploading ? (
              <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-primary-600" />
            )}
          </motion.div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {uploading ? 'Uploading...' : 'Upload Images'}
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your images here, or{' '}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
              >
                browse files
              </button>
            </p>
            <p className="text-sm text-gray-500">
              {multiple ? `Up to ${maxFiles} images` : 'Single image'} • PNG, JPG, WebP up to 10MB
            </p>
          </div>
        </div>
      </motion.div>

      {/* Image Preview Grid */}
      <AnimatePresence>
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group"
              >
                <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                  <img
                    src={image.url}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Upload Progress */}
                  {image.uploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        <p className="text-sm">{image.progress || 0}%</p>
                      </div>
                    </div>
                  )}

                  {/* Upload Complete */}
                  {!image.uploading && !image.error && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="w-6 h-6 text-green-500 bg-white rounded-full" />
                    </div>
                  )}

                  {/* Upload Error */}
                  {image.error && (
                    <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-white" />
                    </div>
                  )}

                  {/* Remove Button */}
                  {!image.uploading && (
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 left-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Image Info */}
                <div className="mt-2 text-xs text-gray-500">
                  <p className="truncate">{formatFileSize(image.bytes)}</p>
                  {image.width && image.height && (
                    <p>{image.width} × {image.height}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageUpload;
