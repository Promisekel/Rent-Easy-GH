import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Mail, Shield, Calendar, Camera, Home, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface UserProfileProps {
  onLogout?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onLogout }) => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      onLogout?.();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  if (!currentUser) return null;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4 py-8"
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div 
          variants={itemVariants}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Welcome to RentEasy GH! 🇬🇭
          </h1>
          <p className="text-gray-600">
            Your account is ready. Start exploring properties in Ghana!
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          variants={itemVariants}
          className="glass-effect rounded-2xl p-8 shadow-xl border border-white/20 mb-6"
        >
          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-primary-200 to-secondary-200">
                {currentUser.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-10 h-10 text-primary-600" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {currentUser.displayName || userProfile?.displayName || 'Welcome!'}
            </h2>
            
            {userProfile?.role && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                userProfile.role === 'landlord' 
                  ? 'bg-blue-100 text-blue-800' 
                  : userProfile.role === 'admin'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {userProfile.role === 'landlord' ? '🏘️ Landlord' : 
                 userProfile.role === 'admin' ? '👑 Admin' : '🏠 Renter'}
              </span>
            )}
          </div>

          {/* Profile Details */}
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-white/50 rounded-xl">
              <Mail className="w-5 h-5 text-primary-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Email Address</p>
                <p className="font-medium text-gray-900">{currentUser.email}</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-white/50 rounded-xl">
              <Shield className="w-5 h-5 text-primary-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Account Status</p>
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    userProfile?.verified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {userProfile?.verified ? '✅ Verified' : '⏳ Pending Verification'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-white/50 rounded-xl">
              <Calendar className="w-5 h-5 text-primary-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-medium text-gray-900">
                  {currentUser.metadata.creationTime ? 
                    new Date(currentUser.metadata.creationTime).toLocaleDateString() : 
                    'Recently'
                  }
                </p>
              </div>
            </div>

            {userProfile?.provider && (
              <div className="flex items-center p-4 bg-white/50 rounded-xl">
                <Camera className="w-5 h-5 text-primary-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Sign-in Method</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {userProfile.provider === 'google.com' ? 'Google' : userProfile.provider}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-3">
            {/* Navigation Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              >
                <Home className="w-4 h-4 mr-1" />
                Home
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/my-dashboard')}
                className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              >
                <User className="w-4 h-4 mr-1" />
                Dashboard
              </motion.button>
            </div>

            {userProfile?.role === 'landlord' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                🏘️ Manage Properties
              </motion.button>
            )}
            
            {userProfile?.role === 'renter' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/')}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                🏠 Browse Properties
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </motion.button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-2 gap-4"
        >
          <div className="glass-effect rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-primary-600 mb-1">
              {userProfile?.role === 'landlord' ? '0' : '0'}
            </div>
            <div className="text-sm text-gray-600">
              {userProfile?.role === 'landlord' ? 'Properties Listed' : 'Favorites'}
            </div>
          </div>
          
          <div className="glass-effect rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-secondary-600 mb-1">0</div>
            <div className="text-sm text-gray-600">
              {userProfile?.role === 'landlord' ? 'Total Views' : 'Applications'}
            </div>
          </div>
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-8 p-6 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl text-white"
        >
          <h3 className="text-xl font-bold mb-2">🎉 Welcome to Ghana's Premier Rental Platform!</h3>
          <p className="opacity-90">
            {userProfile?.role === 'landlord' 
              ? 'Start listing your properties and connect with verified renters across Ghana.'
              : 'Discover verified rental properties from trusted landlords across Ghana.'
            }
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UserProfile;
