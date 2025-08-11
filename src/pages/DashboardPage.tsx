import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  MoreVertical,
  Edit,
  Trash2,
  Star,
  MapPin,
  Bed,
  Bath,
  Square
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userRole] = useState<'landlord' | 'renter' | 'admin'>('landlord'); // Mock user role

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
  const stats = [
    { 
      title: 'Total Properties', 
      value: '12', 
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
  ];

  const recentProperties = [
    {
      id: 1,
      title: 'Modern 2-Bedroom Apartment',
      location: 'East Legon, Accra',
      price: 2500,
      bedrooms: 2,
      bathrooms: 2,
      size: 75,
      views: 156,
      likes: 24,
      inquiries: 8,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      title: 'Luxury Studio in Cantonments',
      location: 'Cantonments, Accra',
      price: 1800,
      bedrooms: 1,
      bathrooms: 1,
      size: 45,
      views: 89,
      likes: 12,
      inquiries: 3,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      title: '3-Bedroom House with Garden',
      location: 'Tema, Greater Accra',
      price: 3200,
      bedrooms: 3,
      bathrooms: 3,
      size: 120,
      views: 234,
      likes: 45,
      inquiries: 12,
      status: 'pending',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop'
    }
  ];

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

  const renderPropertyCard = (property: typeof recentProperties[0]) => (
    <motion.div
      key={property.id}
      variants={itemVariants}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
    >
      <div className="relative">
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            property.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
            {property.status}
          </span>
        </div>
        <div className="absolute top-3 left-3">
          <span className="bg-black/50 text-white px-2 py-1 rounded-lg text-sm font-medium">
            GHS {property.price.toLocaleString()}/month
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
        <p className="text-gray-600 flex items-center mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          {property.location}
        </p>
        
        <div className="grid grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            {property.bedrooms} bed
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            {property.bathrooms} bath
          </div>
          <div className="flex items-center">
            <Square className="w-4 h-4 mr-1" />
            {property.size}m²
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <Eye className="w-4 h-4 mx-auto mb-1 text-gray-600" />
            <span className="font-medium">{property.views}</span>
            <p className="text-xs text-gray-500">Views</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <Heart className="w-4 h-4 mx-auto mb-1 text-gray-600" />
            <span className="font-medium">{property.likes}</span>
            <p className="text-xs text-gray-500">Likes</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <MessageCircle className="w-4 h-4 mx-auto mb-1 text-gray-600" />
            <span className="font-medium">{property.inquiries}</span>
            <p className="text-xs text-gray-500">Inquiries</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button className="flex-1 btn-primary text-sm py-2">
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </button>
          <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );

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
          <button className="text-primary-600 hover:text-primary-700 font-medium">View All</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentProperties.map(renderPropertyCard)}
        </div>
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
                Welcome back, John! 👋
              </h1>
              <p className="text-gray-600">Here's what's happening with your properties today.</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <button className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
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
          {activeTab === 'properties' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Properties Management</h2>
              <p className="text-gray-600">Properties management interface will be implemented here.</p>
            </div>
          )}
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