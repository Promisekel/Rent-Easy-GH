import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  CheckCircle
} from 'lucide-react';
import ImageUpload from '../components/common/ImageUpload';

const AddListingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

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

  const handleImageUpload = (imageUrls: string[]) => {
    setUploadedImages(prev => [...prev, ...imageUrls]);
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Property Title</label>
          <input
            type="text"
            placeholder="e.g., Modern 2-Bedroom Apartment in East Legon"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
          <div className="grid grid-cols-2 gap-3">
            {propertyTypes.map((type) => (
              <button
                key={type.id}
                className="p-4 border border-gray-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 text-left"
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
            Location
          </label>
          <input
            type="text"
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
            <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200">
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Bath className="w-4 h-4 inline mr-2" />
              Bathrooms
            </label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200">
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Square className="w-4 h-4 inline mr-2" />
              Size (sqm)
            </label>
            <input
              type="number"
              placeholder="50"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            rows={4}
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
            onClick={() => toggleFeature(feature.id)}
            className={`p-6 rounded-xl border-2 transition-all duration-200 ${
              selectedFeatures.includes(feature.id)
                ? 'border-primary-500 bg-primary-50 text-primary-700'
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
        <ImageUpload
          multiple={true}
          maxFiles={10}
          onUploadComplete={handleImageUpload}
          className="w-full"
        />
      </motion.div>

      {uploadedImages.length > 0 && (
        <motion.div variants={itemVariants} className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Uploaded Images ({uploadedImages.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedImages.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <img 
                  src={imageUrl} 
                  alt={`Property ${index + 1}`} 
                  className="w-full h-32 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200" 
                />
                <button 
                  onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== index))}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
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
            Monthly Rent (GHS)
          </label>
          <input
            type="number"
            placeholder="1500"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Security Deposit (GHS)</label>
          <input
            type="number"
            placeholder="3000"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
          <input
            type="text"
            placeholder="Your full name"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            placeholder="+233 24 123 4567"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            placeholder="your.email@example.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
          />
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="bg-primary-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Listing Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Property Type:</span>
            <span className="ml-2 font-medium">Apartment</span>
          </div>
          <div>
            <span className="text-gray-600">Monthly Rent:</span>
            <span className="ml-2 font-medium">GHS 1,500</span>
          </div>
          <div>
            <span className="text-gray-600">Bedrooms:</span>
            <span className="ml-2 font-medium">2</span>
          </div>
          <div>
            <span className="text-gray-600">Features:</span>
            <span className="ml-2 font-medium">{selectedFeatures.length} selected</span>
          </div>
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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={currentStep === 4 ? () => console.log('Submit listing') : nextStep}
                className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-medium hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg"
              >
                {currentStep === 4 ? 'Publish Listing' : 'Next Step'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddListingPage;