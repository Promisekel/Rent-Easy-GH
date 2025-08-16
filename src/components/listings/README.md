# Enhanced Listing Image Uploader

A powerful, feature-rich image uploader component specifically designed for property listings in the Rent Easy application. This component provides advanced functionality including drag-and-drop reordering, cover image selection, automatic image compression, and real-time upload progress.

## ✨ Key Features

### Core Functionality
- **Multiple Image Upload**: Support for uploading up to 10 property images
- **Drag & Drop**: Intuitive drag-and-drop interface for file selection
- **Image Reordering**: Drag and drop to reorder images after upload
- **Cover Image Selection**: Set any image as the property's cover photo
- **Automatic Compression**: Optimizes images for web display (max 1920x1080)
- **Progress Tracking**: Real-time upload progress with visual feedback

### User Experience
- **Image Preview**: Full-size image preview modal
- **Error Handling**: Retry failed uploads with one click
- **File Validation**: Automatic validation of file type and size
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Visual Feedback**: Clear status indicators for upload states
- **File Information**: Display file size and dimensions

### Technical Features
- **Cloud Storage**: Integration with Cloudinary for image hosting
- **Database Sync**: Automatic saving to Firestore database
- **Type Safety**: Full TypeScript support with proper interfaces
- **Animation**: Smooth animations using Framer Motion
- **Performance**: Optimized rendering and memory management

## 🚀 Quick Start

### Basic Usage

```tsx
import ListingImageUploader from './components/listings/ListingImageUploader';

const MyComponent = () => {
  const [images, setImages] = useState([]);
  const [coverImage, setCoverImage] = useState(null);

  return (
    <ListingImageUploader
      onImagesChange={setImages}
      onCoverImageChange={setCoverImage}
      maxFiles={10}
    />
  );
};
```

### Advanced Usage

```tsx
import ListingImageUploader from './components/listings/ListingImageUploader';

const AdvancedExample = () => {
  const [images, setImages] = useState([]);
  const [coverImage, setCoverImage] = useState(null);

  const handleImagesChange = (updatedImages) => {
    setImages(updatedImages);
    // Save to form state or send to API
    console.log('Images updated:', updatedImages);
  };

  const handleCoverChange = (coverUrl) => {
    setCoverImage(coverUrl);
    // Update cover image in your listing data
    console.log('Cover image:', coverUrl);
  };

  return (
    <ListingImageUploader
      onImagesChange={handleImagesChange}
      onCoverImageChange={handleCoverChange}
      maxFiles={10}
      allowReorder={true}
      showImageInfo={true}
      compressionQuality={0.8}
      existingImages={['https://example.com/image1.jpg']}
      className="my-custom-class"
    />
  );
};
```

## 📋 Props API

### ListingImageUploaderProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onImagesChange` | `(images: ListingImage[]) => void` | `undefined` | Callback fired when images array changes |
| `onCoverImageChange` | `(url: string \| null) => void` | `undefined` | Callback fired when cover image changes |
| `maxFiles` | `number` | `10` | Maximum number of images allowed |
| `className` | `string` | `''` | Additional CSS classes |
| `existingImages` | `string[]` | `[]` | URLs of existing images to display |
| `allowReorder` | `boolean` | `true` | Enable drag-and-drop reordering |
| `showImageInfo` | `boolean` | `true` | Show file size and dimensions |
| `compressionQuality` | `number` | `0.8` | Image compression quality (0-1) |

### ListingImage Interface

```tsx
interface ListingImage {
  id: string;           // Unique identifier
  url: string;          // Image URL (Cloudinary)
  publicId: string;     // Cloudinary public ID
  width: number;        // Image width in pixels
  height: number;       // Image height in pixels
  bytes: number;        // File size in bytes
  isCover: boolean;     // Whether this is the cover image
  uploading?: boolean;  // Upload in progress
  progress?: number;    // Upload progress (0-100)
  error?: string;       // Error message if upload failed
}
```

## 🎨 User Interface

### Upload Area
- Large, prominent drag-and-drop zone
- Visual feedback on hover and drag states
- Click to browse files alternative
- Upload progress indicator
- Clear instructions and file requirements

### Image Management
- **Grid View**: Clean grid layout for uploaded images
- **List View**: Detailed list with reorder handles (when reordering enabled)
- **Status Indicators**: Upload progress, success, and error states
- **Action Buttons**: Cover selection, preview, retry, and remove

### Cover Image Selection
- Star icon to set/unset cover image
- Visual badge on current cover image
- Automatic cover assignment for first image
- One-click cover image switching

### Image Preview
- Full-screen modal overlay
- High-quality image display
- Click outside to close
- Responsive design

## 🔧 Implementation Details

### File Validation
```tsx
const validateFile = (file: File): string | null => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 15 * 1024 * 1024; // 15MB

  if (!allowedTypes.includes(file.type)) {
    return 'Please select a valid image file (JPEG, PNG, WebP)';
  }

  if (file.size > maxSize) {
    return 'File size must be less than 15MB';
  }

  return null;
};
```

### Image Compression
- Automatic resizing to max 1920x1080 resolution
- Configurable compression quality
- Maintains aspect ratio
- Optimizes file size for web delivery

### Upload Process
1. File validation and compression
2. Create temporary preview
3. Upload to Cloudinary with progress tracking
4. Save metadata to Firestore
5. Update component state
6. Notify parent component

### Error Handling
- Network failure recovery
- File validation errors
- Upload timeout handling
- User-friendly error messages
- Retry functionality for failed uploads

## 🎯 Usage Examples

### In Listing Form
```tsx
// components/listings/ListingForm.tsx
const ListingForm = () => {
  const [listingImages, setListingImages] = useState([]);
  const [coverImageUrl, setCoverImageUrl] = useState(null);

  const handleSubmit = (formData) => {
    const listingData = {
      ...formData,
      photos: listingImages.map(img => img.url),
      coverPhoto: coverImageUrl,
    };
    
    // Submit to API
    submitListing(listingData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Other form fields */}
      
      <ListingImageUploader
        onImagesChange={setListingImages}
        onCoverImageChange={setCoverImageUrl}
        maxFiles={10}
      />
      
      <button type="submit" disabled={listingImages.length === 0}>
        Create Listing
      </button>
    </form>
  );
};
```

### With Existing Images
```tsx
const EditListing = ({ listing }) => {
  const [images, setImages] = useState([]);
  
  return (
    <ListingImageUploader
      existingImages={listing.photos}
      onImagesChange={setImages}
      onCoverImageChange={(url) => console.log('New cover:', url)}
    />
  );
};
```

## 🔍 Comparison with Basic ImageUpload

| Feature | Basic ImageUpload | Enhanced ListingImageUploader |
|---------|-------------------|--------------------------------|
| Multiple Files | ✅ | ✅ |
| Drag & Drop Upload | ✅ | ✅ |
| Image Reordering | ❌ | ✅ |
| Cover Image Selection | ❌ | ✅ |
| Image Compression | ❌ | ✅ |
| Upload Progress | ✅ | ✅ |
| Error Retry | ❌ | ✅ |
| Image Preview Modal | ❌ | ✅ |
| Responsive Design | ✅ | ✅ |
| Property-Specific UI | ❌ | ✅ |
| Advanced File Info | ❌ | ✅ |

## 🔒 Security & Performance

### Security
- File type validation
- File size limits
- Secure upload to Cloudinary
- User authentication checks

### Performance
- Image compression reduces bandwidth
- Lazy loading for large image sets
- Optimized re-renders with React.memo
- Efficient state management

## 🐛 Troubleshooting

### Common Issues

**Images not uploading**
- Check Cloudinary configuration
- Verify file size limits
- Ensure network connectivity

**Reordering not working**
- Verify `allowReorder` prop is `true`
- Check if Framer Motion is installed
- Ensure proper touch/mouse events

**Cover image not setting**
- Check `onCoverImageChange` callback
- Verify image has finished uploading
- Ensure no upload errors

### Debug Mode
Enable debug logging by adding:
```tsx
const handleImagesChange = (images) => {
  console.log('Debug - Images changed:', images);
  setImages(images);
};
```

## 🔄 Migration Guide

### From Basic ImageUpload

1. **Update imports**:
   ```tsx
   // Before
   import ImageUpload from '../common/ImageUpload';
   
   // After
   import ListingImageUploader from './ListingImageUploader';
   ```

2. **Update props**:
   ```tsx
   // Before
   <ImageUpload
     multiple={true}
     maxFiles={5}
     onUploadComplete={handleUpload}
   />
   
   // After
   <ListingImageUploader
     maxFiles={10}
     onImagesChange={handleImagesChange}
     onCoverImageChange={handleCoverChange}
   />
   ```

3. **Update state management**:
   ```tsx
   // Before
   const [uploadedImages, setUploadedImages] = useState([]);
   
   // After
   const [listingImages, setListingImages] = useState([]);
   const [coverImageUrl, setCoverImageUrl] = useState(null);
   ```

## 📚 Related Components

- `ListingForm.tsx` - Main form using the image uploader
- `ListingImageUploaderDemo.tsx` - Demo component with examples
- `ImageUpload.tsx` - Basic image upload component
- `GalleryModal.tsx` - Image gallery display component

## 🤝 Contributing

When contributing to this component:

1. Maintain TypeScript strict mode
2. Add proper error handling
3. Include accessibility features
4. Write comprehensive tests
5. Update documentation

## 📄 License

This component is part of the Rent Easy application and follows the same licensing terms.
