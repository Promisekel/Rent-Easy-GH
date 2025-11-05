import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  BarChart3,
  Home,
  Users,
  DollarSign,
  Eye,
  Heart,
  MessageCircle,
  Calendar,
  TrendingUp,
  Settings,
  Bell,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Star,
  MapPin,
  Bed,
  Bath,
  Square,
  LogOut,
  RefreshCcw,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useListings from '../hooks/useListings';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Listing } from '../types/Listing';
import { getUserRoleLabel } from '../utils/user';

const DEFAULT_LISTING_IMAGE = 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&auto=format&fit=crop&q=80';

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { currentUser, userProfile, logout } = useAuth();
  const {
    listings,
    loading: listingsLoading,
    error: listingsError,
    fetchListings,
  } = useListings();

  useEffect(() => {
    if (!currentUser?.uid) {
      return;
    }

    void fetchListings(currentUser.uid);
  }, [currentUser?.uid, fetchListings]);

  const myListings = useMemo(() => {
    if (!currentUser?.uid) {
      return [] as Listing[];
    }
    return listings.filter(listing => listing.userId === currentUser.uid || listing.landlordId === currentUser.uid);
  }, [currentUser?.uid, listings]);

  const displayName = userProfile?.displayName || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'there';
  const roleLabel = userProfile?.role ? `${userProfile.role.charAt(0).toUpperCase()}${userProfile.role.slice(1)}` : 'Renter';

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Signed out successfully.');
      navigate('/');
    } catch (error) {
      console.error('DashboardPage logout error:', error);
      toast.error('Sign out failed. Please try again.');
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-6">
        <div className="max-w-md text-center bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-3">Sign in to continue</h2>
          <p className="text-gray-600 mb-6">
            Access to the analytics dashboard requires authentication. Please sign in to manage your rental activity.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors duration-200"
          >
            Go to Sign In
          </button>
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 }
    },
    hover: {
      y: -5,
      transition: { duration: 0.2 }
    }
  };

  // Mock data
  const totalProperties = myListings.length;

  const stats = useMemo(() => [
    { 
      title: 'Total Properties', 
      value: totalProperties.toString(), 
      change: '+2 this month', 
      icon: Home, 
      color: 'bg-blue-500',
      trend: 'up' 
    },
    { 
      title: 'Total Views', 
      value: '1,247', 
      change: '+15% this week', 
      icon: Eye, 
      color: 'bg-green-500',
      trend: 'up'
    },
    { 
      title: 'Active Inquiries', 
      value: '23', 
      change: '5 new today', 
      icon: MessageCircle, 
      color: 'bg-yellow-500',
      trend: 'up'
    },
    { 
      title: 'Monthly Revenue', 
      value: 'GHS 18,500', 
      change: '+8% from last month', 
      icon: DollarSign, 
      color: 'bg-purple-500',
      trend: 'up'
    }
  ], [totalProperties]);

  const sortedListings = useMemo(() => {
    if (myListings.length === 0) {
      return [] as Listing[];
    }

    return [...myListings].sort((a, b) => {
      const getTime = (value?: string | null) => {
        if (!value) {
          return 0;
        }
        const parsed = new Date(value).getTime();
        return Number.isNaN(parsed) ? 0 : parsed;
      };

      const aTime = getTime(a.updatedAt ?? a.createdAt ?? null);
      const bTime = getTime(b.updatedAt ?? b.createdAt ?? null);
      return bTime - aTime;
    });
  }, [myListings]);

  const recentListings = useMemo(() => sortedListings.slice(0, 3), [sortedListings]);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'properties', name: 'My Properties', icon: Home },
    { id: 'inquiries', name: 'Inquiries', icon: MessageCircle },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const renderStatCard = (stat: typeof stats[0], index: number) => (
    <motion.div
      key={stat.title}
      variants={cardVariants}
      whileHover="hover"
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
          <stat.icon className="w-6 h-6 text-white" />
        </div>
        <div className={`text-sm px-2 py-1 rounded-full ${
          stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          <TrendingUp className="w-3 h-3 inline mr-1" />
          {stat.change}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
      <p className="text-gray-600 text-sm">{stat.title}</p>
    </motion.div>
  );

  const formatDateLabel = (value?: string | null) => {
    if (!value) {
      return 'Not set';
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return 'Not set';
    }
    return parsed.toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderOverviewListingCard = (listing: Listing) => {
    const cover = listing.coverPhoto || listing.photos?.[0] || DEFAULT_LISTING_IMAGE;
    const priceLabel = formatListingPrice(listing.price);

    return (
      <motion.div
        key={listing.id ?? cover}
        variants={itemVariants}
        whileHover={{ y: -2 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
      >
        <div className="relative">
          <img
            src={cover}
            alt={listing.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-black/50 text-white px-2 py-1 rounded-lg text-sm font-medium">
              {priceLabel}/month
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                listing.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : listing.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-600'
              }`}
            >
              {listing.status ?? 'pending'}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {listing.title || 'Untitled Listing'}
            </h3>
            <p className="text-gray-600 flex items-center mt-2">
              <MapPin className="w-4 h-4 mr-1" />
              {listing.location || 'Location not provided'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              {listing.bedrooms ?? 0} bed
            </div>
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              {listing.bathrooms ?? 0} bath
            </div>
            <div className="flex items-center">
              <Square className="w-4 h-4 mr-1" />
              {listing.size ?? 0} m²
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600 flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Available from
            </div>
            <span className="font-medium text-gray-900">{formatDateLabel(listing.availabilityDate)}</span>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => handleEditListing(listing.id)}
              className="flex-1 btn-primary text-sm py-2 flex items-center justify-center"
            >
              <Edit className="w-4 h-4 mr-1" />
              Manage
            </button>
            <button
              onClick={() => handleViewListing(listing.id)}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center"
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  const formatListingPrice = (value: number | undefined): string => {
    if (!value) {
      return 'GHS 0';
    }
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleViewListing = (listingId?: string) => {
    if (!listingId) {
      toast.error('Listing is missing an identifier.');
      return;
    }
    navigate(`/listing/${listingId}`);
  };

  const handleEditListing = (listingId?: string) => {
    if (!listingId) {
      toast.error('Listing is missing an identifier.');
      return;
    }
    navigate(`/manage-listing/${listingId}`);
  };

  const renderMyListingCard = (listing: Listing) => {
    const cover = listing.coverPhoto || listing.photos?.[0] || DEFAULT_LISTING_IMAGE;
    const priceLabel = formatListingPrice(listing.price);
    const roleBadge = getUserRoleLabel(userProfile?.role);

    return (
      <motion.div
        key={listing.id ?? cover}
        variants={itemVariants}
        whileHover={{ y: -2 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
      >
        <div className="relative">
          <img
            src={cover}
            alt={listing.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 left-3 bg-black/60 text-white px-3 py-1 rounded-lg text-sm font-medium">
            {priceLabel}/month
          </div>
          <div className="absolute top-3 right-3 flex items-center space-x-2">
            {roleBadge && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                {roleBadge}
              </span>
            )}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              listing.status === 'active'
                ? 'bg-green-100 text-green-700'
                : listing.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-600'
            }`}>
              {listing.status ?? 'pending'}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {listing.title || 'Untitled Listing'}
          </h3>
          <p className="text-gray-600 flex items-center mb-4">
            <MapPin className="w-4 h-4 mr-1" />
            {listing.location || 'Location not provided'}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              {listing.bedrooms ?? 0} bed
            </div>
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              {listing.bathrooms ?? 0} bath
            </div>
            <div className="flex items-center">
              <Square className="w-4 h-4 mr-1" />
              {listing.size ?? 0} m²
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => handleEditListing(listing.id)}
              className="flex-1 btn-primary text-sm py-2 flex items-center justify-center"
            >
              <Edit className="w-4 h-4 mr-1" />
              Manage
            </button>
            <button
              onClick={() => handleViewListing(listing.id)}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center"
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderMyProperties = () => {
    if (listingsLoading) {
      return (
        <div className="py-20 flex justify-center">
          <LoadingSpinner />
        </div>
      );
    }

    if (listingsError) {
      return (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">We couldn&apos;t load your listings</h2>
          <p className="text-gray-600 mb-6">{listingsError}</p>
          <button
            onClick={() => currentUser?.uid && fetchListings(currentUser.uid)}
            className="btn-primary"
          >
            Retry loading
          </button>
        </div>
      );
    }

    if (myListings.length === 0) {
      return (
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl p-10 shadow-lg border border-gray-100 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <Home className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">No listings yet</h2>
          <p className="text-gray-600 mb-6">
            Create your first property listing to start showcasing rentals to potential tenants.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary inline-flex items-center"
            onClick={() => navigate('/add-listing')}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add a listing
          </motion.button>
        </motion.div>
      );
    }

    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-gray-900">My Listings</h2>
            <p className="text-gray-600">Manage listings you have published on RentEasy GH.</p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 border border-gray-300 rounded-xl flex items-center text-gray-700 hover:bg-gray-50"
              onClick={() => currentUser?.uid && fetchListings(currentUser.uid)}
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Refresh
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary flex items-center"
              onClick={() => navigate('/add-listing')}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Listing
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myListings.map(renderMyListingCard)}
        </div>
      </motion.div>
    );
  };

  const renderOverview = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => renderStatCard(stat, index))}
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">Ready to add a new property?</h2>
            <p className="text-primary-100">Expand your portfolio and reach more potential renters.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/add-listing')}
            className="bg-white text-primary-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Property
          </motion.button>
        </div>
      </motion.div>

      {/* Recent Properties */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-gray-900">Recent Properties</h2>
          <button
            onClick={() => setActiveTab('properties')}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            View All
          </button>
        </div>

        {listingsLoading ? (
          <div className="py-16 flex justify-center">
            <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
          </div>
        ) : recentListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentListings.map(renderOverviewListingCard)}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-10 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings yet</h3>
            <p className="text-gray-600 mb-6">Add a property to see it featured here on your dashboard.</p>
            <button
              onClick={() => navigate('/add-listing')}
              className="btn-primary inline-flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add your first listing
            </button>
          </div>
        )}
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { type: 'inquiry', message: 'New inquiry for Modern 2-Bedroom Apartment', time: '2 hours ago' },
            { type: 'view', message: 'Your property was viewed 15 times today', time: '4 hours ago' },
            { type: 'like', message: 'Someone liked your Luxury Studio listing', time: '6 hours ago' },
            { type: 'update', message: 'Property listing "3-Bedroom House" was updated', time: '1 day ago' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activity.type === 'inquiry' ? 'bg-blue-100 text-blue-600' :
                activity.type === 'view' ? 'bg-green-100 text-green-600' :
                activity.type === 'like' ? 'bg-red-100 text-red-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                {activity.type === 'inquiry' && <MessageCircle className="w-5 h-5" />}
                {activity.type === 'view' && <Eye className="w-5 h-5" />}
                {activity.type === 'like' && <Heart className="w-5 h-5" />}
                {activity.type === 'update' && <Settings className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">{activity.message}</p>
                <p className="text-gray-500 text-sm">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
                Welcome back, {displayName}! 👋
              </h1>
              <p className="text-gray-600">
                You're signed in as a {roleLabel}. Here's what's happening with your properties today.
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <button className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </motion.button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'properties' && renderMyProperties()}
          {activeTab === 'inquiries' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Inquiries</h2>
              <p className="text-gray-600">Inquiries management interface will be implemented here.</p>
            </div>
          )}
          {activeTab === 'analytics' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics</h2>
              <p className="text-gray-600">Analytics dashboard will be implemented here.</p>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
              <p className="text-gray-600">Settings panel will be implemented here.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;