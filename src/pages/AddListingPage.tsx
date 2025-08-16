import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  MapPin, 
  DollarSign, 
  Camera, 
  Plus, 
  Bed, 
  Bath, 
  Square, 
  Wifi,
  Car,
  Shield,
  Zap,
  Droplets,
  Wind,
  Tv,
  X,
  Upload,
  CheckCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  Star
} from 'lucide-react';
import ListingImageUploader from '../components/listings/ListingImageUploader';
import { uploadListing } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface ListingData {
  title: string;
  propertyType: string;
  location: string;
  bedrooms: string;
  bathrooms: string;
  size: string;
  description: string;
  additionalFeatures: string;
  monthlyRent: string;
  securityDeposit: string;
  contactName: string;
  phoneNumber: string;
  emailAddress: string;
}

interface ListingImage {
  id: string;
  url: string;
  publicId: string;
  width: number;
  height: number;
  bytes: number;
  isCover: boolean;
}

const AddListingPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [listingImages, setListingImages] = useState<ListingImage[]>([]);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    if (!currentUser) {
      toast.error('Please login to add a property listing');
      navigate('/auth');
    }
  }, [currentUser, navigate]);
  
  // Form data state - persisted across steps
  const [listingData, setListingData] = useState<ListingData>({
    title: '',
    propertyType: '',
    location: '',
    bedrooms: '1',
    bathrooms: '1',
    size: '',
    description: '',
    additionalFeatures: '',
    monthlyRent: '',
    securityDeposit: '',
    contactName: '',
    phoneNumber: '',
    emailAddress: ''
  });

  // Update form data
  const updateListingData = (field: keyof ListingData, value: string) => {
    setListingData(prev => ({ ...prev, [field]: value }));
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const steps = [
    { number: 1, title: 'Property Details', description: 'Basic information about your property' },
    { number: 2, title: 'Features & Amenities', description: 'What makes your property special' },
    { number: 3, title: 'Photos & Media', description: 'Show your property in its best light' },
    { number: 4, title: 'Pricing & Contact', description: 'Set your price and contact details' }
  ];

  const propertyTypes = [
    { id: 'apartment', name: 'Apartment', icon: '🏢' },
    { id: 'house', name: 'House', icon: '🏠' },
    { id: 'studio', name: 'Studio', icon: '🏡' },
    { id: 'room', name: 'Single Room', icon: '🚪' }
  ];

  const features = [
    { id: 'wifi', name: 'WiFi', icon: Wifi },
    { id: 'parking', name: 'Parking', icon: Car },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'electricity', name: '24/7 Electricity', icon: Zap },
    { id: 'water', name: 'Running Water', icon: Droplets },
    { id: 'ac', name: 'Air Conditioning', icon: Wind },
    { id: 'tv', name: 'Cable TV', icon: Tv }
  ];

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleImagesChange = (images: ListingImage[]) => {
    setListingImages(images);
  };

  const handleCoverImageChange = (url: string | null) => {
    setCoverImageUrl(url);
  };

  const selectPropertyType = (typeId: string) => {
    setSelectedPropertyType(typeId);
    updateListingData('propertyType', typeId);
  };

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImageIndex(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImageIndex === null) {
      return;
    }
    
    const newIndex = direction === 'prev' 
      ? (selectedImageIndex - 1 + listingImages.length) % listingImages.length
      : (selectedImageIndex + 1) % listingImages.length;
    
    setSelectedImageIndex(newIndex);
  };

  const publishListing = async () => {
    if (!currentUser) {
      toast.error('Please login to publish a listing');
      navigate('/auth');
      return;
    }

    if (listingImages.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    if (!listingData.title || !listingData.location || !listingData.monthlyRent) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsPublishing(true);

    try {
      const listingPayload = {
        title: listingData.title,
        price: parseFloat(listingData.monthlyRent),
        location: listingData.location,
        description: listingData.description,
        amenities: selectedFeatures,
        photos: listingImages.map(img => img.url),
        landlordId: currentUser.uid, // Use actual authenticated user ID
        userId: currentUser.uid, // Add userId for consistency
        rentAdvance: 1,
        propertyType: listingData.propertyType,
        bedrooms: parseInt(listingData.bedrooms),
        bathrooms: parseInt(listingData.bathrooms),
        size: parseFloat(listingData.size) || 0,
        coverPhoto: coverImageUrl,
        contactName: listingData.contactName,
        phoneNumber: listingData.phoneNumber,
        emailAddress: listingData.emailAddress,
        securityDeposit: parseFloat(listingData.securityDeposit) || 0,
        additionalFeatures: listingData.additionalFeatures,
        createdAt: new Date().toISOString(),
        available: true,
        verified: false,
        featured: false
      };

      await uploadListing(listingPayload);
      toast.success('🎉 Listing published successfully!');
      
      // Reset form after successful submission
      setListingData({
        title: '',
        propertyType: '',
        location: '',
        bedrooms: '1',
        bathrooms: '1',
        size: '',
        description: '',
        additionalFeatures: '',
        monthlyRent: '',
        securityDeposit: '',
        contactName: '',
        phoneNumber: '',
        emailAddress: ''
      });
      setSelectedFeatures([]);
      setListingImages([]);
      setCoverImageUrl(null);
      setSelectedPropertyType('');
      setCurrentStep(1);

    } catch (error) {
      console.error('Error publishing listing:', error);
      toast.error('Failed to publish listing. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-12">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: currentStep >= step.number ? '#3B82F6' : '#E5E7EB',
                  color: currentStep >= step.number ? '#FFFFFF' : '#6B7280'
                }}
                className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg mb-2"
              >
                {currentStep > step.number ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  step.number
                )}
              </motion.div>
              <div className="text-center">
                <h3 className="font-medium text-gray-900 text-sm">{step.title}</h3>
                <p className="text-xs text-gray-500 max-w-24">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="w-16 h-0.5 mx-4 mt-6">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: currentStep > step.number ? '#3B82F6' : '#E5E7EB'
                  }}
                  className="h-full w-full"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Property Details</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Let's start with the basic information about your property</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Property Title *</label>
          <input
            type="text"
            value={listingData.title}
            onChange={(e) => updateListingData('title', e.target.value)}
            placeholder="e.g., Modern 2-Bedroom Apartment in East Legon"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Property Type *</label>
          <div className="grid grid-cols-2 gap-3">
            {propertyTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => selectPropertyType(type.id)}
                className={`p-4 border rounded-xl transition-all duration-200 text-left ${
                  selectedPropertyType === type.id
                    ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                    : 'border-gray-300 hover:border-primary-500 hover:bg-primary-50'
                }`}
              >
                <div className="text-2xl mb-2">{type.icon}</div>
                <div className="font-medium text-gray-900">{type.name}</div>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Location *
          </label>
          <input
            type="text"
            value={listingData.location}
            onChange={(e) => updateListingData('location', e.target.value)}
            placeholder="Enter full address (e.g., East Legon, Accra)"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Bed className="w-4 h-4 inline mr-2" />
              Bedrooms
            </label>
            <select 
              value={listingData.bedrooms}
              onChange={(e) => updateListingData('bedrooms', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Bath className="w-4 h-4 inline mr-2" />
              Bathrooms
            </label>
            <select 
              value={listingData.bathrooms}
              onChange={(e) => updateListingData('bathrooms', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Square className="w-4 h-4 inline mr-2" />
              Size (sqm)
            </label>
            <input
              type="number"
              value={listingData.size}
              onChange={(e) => updateListingData('size', e.target.value)}
              placeholder="50"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            rows={4}
            value={listingData.description}
            onChange={(e) => updateListingData('description', e.target.value)}
            placeholder="Describe your property, its unique features, and the neighborhood..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-none"
          />
        </motion.div>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Features & Amenities</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Select all the features and amenities your property offers</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {features.map((feature) => (
          <motion.button
            key={feature.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => toggleFeature(feature.id)}
            className={`p-6 rounded-xl border-2 transition-all duration-200 ${
              selectedFeatures.includes(feature.id)
                ? 'border-primary-500 bg-primary-50 text-primary-700 ring-2 ring-primary-200'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <feature.icon className="w-8 h-8 mx-auto mb-3" />
            <div className="font-medium text-sm">{feature.name}</div>
          </motion.button>
        ))}
      </div>

      <motion.div variants={itemVariants} className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Features</h3>
        <textarea
          rows={3}
          value={listingData.additionalFeatures}
          onChange={(e) => updateListingData('additionalFeatures', e.target.value)}
          placeholder="List any other features or amenities not mentioned above..."
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-none"
        />
      </motion.div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Photos & Media</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Upload high-quality photos to showcase your property</p>
      </div>

      <motion.div variants={itemVariants}>
        <ListingImageUploader
          onImagesChange={handleImagesChange}
          onCoverImageChange={handleCoverImageChange}
          maxFiles={10}
          allowReorder={true}
          showImageInfo={true}
          className="w-full"
        />
      </motion.div>

      {listingImages.length > 0 && (
        <motion.div variants={itemVariants} className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Camera className="w-5 h-5 mr-2" />
            Property Gallery ({listingImages.length})
            {coverImageUrl && (
              <span className="ml-4 text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full flex items-center">
                <Star className="w-4 h-4 mr-1" />
                Cover set
              </span>
            )}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {listingImages.map((image, index) => (
              <div key={image.id} className="relative group cursor-pointer">
                <div 
                  onClick={() => openImageModal(index)}
                  className="relative overflow-hidden rounded-lg"
                >
                  <img 
                    src={image.url} 
                    alt={`Property ${index + 1}`} 
                    className="w-full h-32 object-cover transition-transform duration-200 group-hover:scale-105" 
                  />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Cover badge */}
                  {image.isCover && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Cover
                    </div>
                  )}

                  {/* Image number */}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
            <p className="flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              Click any image to view in full size with zoom and navigation
            </p>
          </div>
        </motion.div>
      )}

      {/* Image Gallery Modal */}
      {showImageModal && selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-5xl max-h-full w-full">
            {/* Close button */}
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation buttons */}
            {listingImages.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all duration-200"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => navigateImage('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all duration-200"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image */}
            <div className="relative">
              <img
                src={listingImages[selectedImageIndex].url}
                alt={`Property ${selectedImageIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain mx-auto rounded-lg"
                style={{ cursor: 'zoom-in' }}
                onClick={(e) => {
                  const img = e.target as HTMLImageElement;
                  if (img.style.transform === 'scale(2)') {
                    img.style.transform = 'scale(1)';
                    img.style.cursor = 'zoom-in';
                  } else {
                    img.style.transform = 'scale(2)';
                    img.style.cursor = 'zoom-out';
                  }
                }}
              />

              {/* Image info */}
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
                <p className="text-sm">
                  Image {selectedImageIndex + 1} of {listingImages.length}
                  {listingImages[selectedImageIndex].isCover && (
                    <span className="ml-2 text-yellow-400">• Cover Photo</span>
                  )}
                </p>
                <p className="text-xs text-gray-300">
                  {listingImages[selectedImageIndex].width} × {listingImages[selectedImageIndex].height} px
                </p>
              </div>

              {/* Zoom instruction */}
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
                <p className="text-xs text-gray-300">Click image to zoom</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Pricing & Contact</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Set your rental price and provide contact information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 inline mr-2" />
            Monthly Rent (GHS) *
          </label>
          <input
            type="number"
            value={listingData.monthlyRent}
            onChange={(e) => updateListingData('monthlyRent', e.target.value)}
            placeholder="1500"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Security Deposit (GHS)</label>
          <input
            type="number"
            value={listingData.securityDeposit}
            onChange={(e) => updateListingData('securityDeposit', e.target.value)}
            placeholder="3000"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name *</label>
          <input
            type="text"
            value={listingData.contactName}
            onChange={(e) => updateListingData('contactName', e.target.value)}
            placeholder="Your full name"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
          <input
            type="tel"
            value={listingData.phoneNumber}
            onChange={(e) => updateListingData('phoneNumber', e.target.value)}
            placeholder="+233 24 123 4567"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
          <input
            type="email"
            value={listingData.emailAddress}
            onChange={(e) => updateListingData('emailAddress', e.target.value)}
            placeholder="your.email@example.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
          />
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="bg-primary-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Listing Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Property Type:</span>
              <span className="font-medium">{listingData.propertyType || 'Not selected'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Rent:</span>
              <span className="font-medium">
                {listingData.monthlyRent ? `GHS ${listingData.monthlyRent}` : 'Not set'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bedrooms:</span>
              <span className="font-medium">{listingData.bedrooms}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bathrooms:</span>
              <span className="font-medium">{listingData.bathrooms}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Features:</span>
              <span className="font-medium">{selectedFeatures.length} selected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Photos:</span>
              <span className="font-medium">{listingImages.length} uploaded</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cover Photo:</span>
              <span className="font-medium">{coverImageUrl ? 'Set' : 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="font-medium text-sm">{listingData.location || 'Not provided'}</span>
            </div>
          </div>
        </div>

        {/* Validation warnings */}
        <div className="mt-6 space-y-2">
          {!listingData.title && (
            <p className="text-red-600 text-sm flex items-center">
              <X className="w-4 h-4 mr-2" />
              Property title is required
            </p>
          )}
          {!listingData.location && (
            <p className="text-red-600 text-sm flex items-center">
              <X className="w-4 h-4 mr-2" />
              Location is required
            </p>
          )}
          {!listingData.monthlyRent && (
            <p className="text-red-600 text-sm flex items-center">
              <X className="w-4 h-4 mr-2" />
              Monthly rent is required
            </p>
          )}
          {listingImages.length === 0 && (
            <p className="text-red-600 text-sm flex items-center">
              <X className="w-4 h-4 mr-2" />
              At least one photo is required
            </p>
          )}
          {listingData.title && listingData.location && listingData.monthlyRent && listingImages.length > 0 && (
            <p className="text-green-600 text-sm flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Ready to publish!
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              List Your Property
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Reach thousands of potential renters and showcase your property with our professional listing platform
            </p>
          </div>

          {renderStepIndicator()}

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            {renderCurrentStep()}

            <div className="flex justify-between mt-12 pt-8 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
                  currentStep === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </motion.button>

              <motion.button
                whileHover={{ scale: currentStep === 4 && !isPublishing ? 1.02 : 1 }}
                whileTap={{ scale: currentStep === 4 && !isPublishing ? 0.98 : 1 }}
                onClick={currentStep === 4 ? publishListing : nextStep}
                disabled={currentStep === 4 && isPublishing}
                className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg ${
                  currentStep === 4
                    ? isPublishing
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                    : 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800'
                }`}
              >
                {currentStep === 4 
                  ? isPublishing 
                    ? 'Publishing...' 
                    : '🚀 Publish Listing'
                  : 'Next Step'
                }
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddListingPage;