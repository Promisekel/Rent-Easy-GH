# Cloudinary Setup Guide

## 🎯 Overview
This guide will help you set up Cloudinary for image uploads in your Ghana Rental Platform.

## 📋 Prerequisites
- A Cloudinary account (free tier available)
- Basic understanding of environment variables

## 🚀 Setup Instructions

### 1. Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your Cloudinary Credentials
1. Navigate to your Cloudinary Dashboard
2. Find these values in the "Product Environment Credentials" section:
   - **Cloud Name**: `your_cloud_name`
   - **API Key**: `your_api_key`
   - **API Secret**: `your_api_secret`

### 3. Create Upload Preset
1. In your Cloudinary Dashboard, go to **Settings** → **Upload**
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Configure the preset:
   - **Preset name**: `rental_images`
   - **Signing Mode**: `Unsigned` (for frontend uploads)
   - **Folder**: `rental-listings` (optional, for organization)
   - **Format**: `Auto`
   - **Quality**: `Auto`
   - **Transformation**: 
     - Max width: `1200px`
     - Max height: `800px`
     - Crop mode: `Limit`
5. Click **Save**

### 4. Configure Environment Variables

#### For Local Development:
Create a `.env` file in your project root:

```bash
# Cloudinary Configuration
REACT_APP_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
REACT_APP_CLOUDINARY_API_KEY=your_actual_api_key
REACT_APP_CLOUDINARY_API_SECRET=your_actual_api_secret
REACT_APP_CLOUDINARY_UPLOAD_PRESET=rental_images
```

#### For Vercel Deployment:
Add these environment variables in your Vercel dashboard:

```bash
REACT_APP_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
REACT_APP_CLOUDINARY_API_KEY=your_actual_api_key
REACT_APP_CLOUDINARY_API_SECRET=your_actual_api_secret
REACT_APP_CLOUDINARY_UPLOAD_PRESET=rental_images
```

## 🔧 Implementation Examples

### Basic Image Upload
```typescript
import { uploadImageToCloudinary } from '../utils/cloudinary';

const handleFileUpload = async (file: File) => {
  try {
    const imageUrl = await uploadImageToCloudinary(file);
    console.log('Uploaded image URL:', imageUrl);
    // Use imageUrl in your application
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### Multiple Images Upload
```typescript
import { uploadMultipleToCloudinary } from '../services/cloudinary';

const handleMultipleUpload = async (files: File[]) => {
  try {
    const results = await uploadMultipleToCloudinary(files, (index, progress) => {
      console.log(`File ${index + 1}: ${progress}% uploaded`);
    });
    console.log('All uploads completed:', results);
  } catch (error) {
    console.error('Multiple upload failed:', error);
  }
};
```

## 🛡️ Security Best Practices

### 1. Use Unsigned Upload Presets
- Never expose your API secret in frontend code
- Use unsigned upload presets for client-side uploads
- Configure transformation rules in the preset

### 2. File Validation
- Validate file types (JPEG, PNG, WebP)
- Limit file sizes (recommended: 5MB max)
- Check file dimensions if needed

### 3. Content Moderation
- Enable Cloudinary's content moderation in your dashboard
- Set up webhooks for automated moderation
- Consider manual review for user-generated content

## 📊 Upload Preset Recommendations

### For Property Listings:
```
Preset Name: rental_images
Max Width: 1200px
Max Height: 800px
Quality: Auto (80-90%)
Format: Auto (WebP when supported)
Crop: Limit (maintains aspect ratio)
```

### For Profile Pictures:
```
Preset Name: profile_images
Max Width: 400px
Max Height: 400px
Quality: Auto
Format: Auto
Crop: Fill (square aspect ratio)
```

## 🐛 Common Issues & Solutions

### Upload Fails with CORS Error
- Ensure your upload preset is set to "Unsigned"
- Check that your cloud name is correct
- Verify the upload preset name matches exactly

### Images Not Loading
- Check the returned URL format
- Ensure the image was uploaded successfully
- Verify network connectivity

### File Size Too Large
- Implement client-side file size validation
- Configure max file size in your upload preset
- Consider image compression before upload

## 📈 Optimization Tips

1. **Use Transformations**: Let Cloudinary handle resizing and optimization
2. **Enable Auto Format**: Automatically serve WebP when supported
3. **Set Quality to Auto**: Automatic quality optimization
4. **Use Progressive JPEG**: For better perceived loading performance
5. **Implement Lazy Loading**: Load images as they come into view

## 🎛️ Advanced Features

### Automatic Image Optimization
```typescript
import { getOptimizedImageUrl } from '../services/cloudinary';

const optimizedUrl = getOptimizedImageUrl('your-public-id', {
  width: 800,
  height: 600,
  quality: 'auto',
  format: 'auto'
});
```

### Image Transformations
```typescript
// Generate thumbnail
const thumbnailUrl = getOptimizedImageUrl('your-public-id', {
  width: 200,
  height: 200,
  crop: 'fill'
});

// Generate responsive image
const responsiveUrl = getOptimizedImageUrl('your-public-id', {
  width: 800,
  quality: 'auto',
  format: 'auto'
});
```

## 📞 Support
- Cloudinary Documentation: https://cloudinary.com/documentation
- Community Forum: https://community.cloudinary.com
- Support: https://support.cloudinary.com
