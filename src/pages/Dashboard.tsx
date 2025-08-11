import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  User,
  Mail,
  Calendar,
  Camera,
  Image as ImageIcon,
  Upload,
  LogOut,
  Shield,
  Home,
  Grid,
  Settings,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import ImageUpload from '../components/common/ImageUpload';
import toast from 'react-hot-toast';

interface UserImage {
  id: string;
  url: string;
  publicId: string;
  width: number;
  height: number;
  bytes: number;
  uploadedAt: any;
}

const Dashboard: React.FC = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [userImages, setUserImages] = useState<UserImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'images' | 'upload'>('profile');

  // Fetch user images
  useEffect(() => {
    const fetchUserImages = async () => {
      if (!currentUser) return;

      try {
        const imagesQuery = query(
          collection(db, 'user_images'),
          where('uid', '==', currentUser.uid),
          orderBy('uploadedAt', 'desc')
        );

        const querySnapshot = await getDocs(imagesQuery);
        const images: UserImage[] = [];

        querySnapshot.forEach((doc) => {
          images.push({
            id: doc.id,
            ...doc.data()
          } as UserImage);
        });

        setUserImages(images);
      } catch (error) {
        console.error('Error fetching user images:', error);
        toast.error('Failed to load images');
      } finally {
        setLoading(false);
      }
    };

    fetchUserImages();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const handleImageUpload = (urls: string[]) => {
    toast.success(`${urls.length} image(s) uploaded successfully!`);
    // Refresh images
    window.location.reload();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return 'Unknown';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Unknown';
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to continue</h2>
          <p className="text-gray-600">You need to be authenticated to access the dashboard.</p>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="mb-4 md:mb-0">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
                  Welcome back, {currentUser.displayName || currentUser.email?.split('@')[0]}! 👋
                </h1>
                <p className="text-gray-600">
                  Manage your profile and uploaded images
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <motion.button
                  onClick={() => navigate('/')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors duration-200"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </motion.button>
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
              <div className="flex space-x-2">
                {[
                  { id: 'profile', label: 'Profile', icon: User },
                  { id: 'images', label: 'My Images', icon: ImageIcon },
                  { id: 'upload', label: 'Upload', icon: Upload }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-primary-500 text-white shadow-lg'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Tab Content */}
          <motion.div variants={itemVariants}>
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Avatar and Basic Info */}
                  <div className="text-center md:text-left">
                    <div className="w-32 h-32 mx-auto md:mx-0 mb-4 rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                      {currentUser.photoURL ? (
                        <img
                          src={currentUser.photoURL}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-16 h-16 text-white" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {currentUser.displayName || 'User'}
                    </h3>
                    <p className="text-gray-600 mb-4">{currentUser.email}</p>
                    
                    {userProfile?.verified && (
                      <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        <Shield className="w-4 h-4 mr-1" />
                        Verified Account
                      </div>
                    )}
                  </div>

                  {/* Profile Details */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                      <Mail className="w-6 h-6 text-primary-500" />
                      <div>
                        <p className="text-sm text-gray-600">Email Address</p>
                        <p className="font-medium text-gray-900">{currentUser.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                      <User className="w-6 h-6 text-primary-500" />
                      <div>
                        <p className="text-sm text-gray-600">Display Name</p>
                        <p className="font-medium text-gray-900">
                          {currentUser.displayName || 'Not set'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                      <Calendar className="w-6 h-6 text-primary-500" />
                      <div>
                        <p className="text-sm text-gray-600">Member Since</p>
                        <p className="font-medium text-gray-900">
                          {formatDate(userProfile?.createdAt)}
                        </p>
                      </div>
                    </div>

                    {userProfile?.role && (
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                        <Home className="w-6 h-6 text-primary-500" />
                        <div>
                          <p className="text-sm text-gray-600">Account Type</p>
                          <p className="font-medium text-gray-900 capitalize">
                            {userProfile.role}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'images' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">My Images</h2>
                  <div className="text-sm text-gray-600">
                    {userImages.length} image{userImages.length !== 1 ? 's' : ''}
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading images...</p>
                  </div>
                ) : userImages.length === 0 ? (
                  <div className="text-center py-12">
                    <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No images yet</h3>
                    <p className="text-gray-600 mb-6">Start by uploading your first image!</p>
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="bg-primary-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors duration-200"
                    >
                      Upload Image
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {userImages.map((image) => (
                      <motion.div
                        key={image.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="group relative bg-gray-50 rounded-xl overflow-hidden"
                      >
                        <div className="aspect-square">
                          <img
                            src={image.url}
                            alt="User upload"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>{formatFileSize(image.bytes)}</span>
                            <span>{image.width} × {image.height}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(image.uploadedAt)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'upload' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Images</h2>
                <ImageUpload
                  onUploadComplete={handleImageUpload}
                  multiple={true}
                  maxFiles={10}
                />
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
