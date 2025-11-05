import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MapPin, 
  Bed, 
  Bath, 
  DollarSign, 
  Heart, 
  Star, 
  Eye,
  Grid,
  List,
  SlidersHorizontal,
  Home,
  Building,
  Car,
  Wifi,
  Shield,
  ArrowLeft,
  Calendar,
  ArrowRight,
  TrendingUp,
  Award,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import useListings from '../hooks/useListings';
import { getUserById } from '../services/firebase';
import { User } from '../types/User';
import { getUserAvatarFallback, getUserRoleLabel } from '../utils/user';
import { formatRegionLabel, GHANA_REGIONS } from '../utils/regions';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  rating: number;
  reviews: number;
  type: 'apartment' | 'house' | 'studio' | 'condo';
  featured: boolean;
  amenities: string[];
  region?: string;
  landlord: {
    name: string;
    verified: boolean;
    avatar: string;
    role: User['role'];
    roleLabel: string;
  };
  availableFrom: string;
}

const DEFAULT_PROPERTY_IMAGE = 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&auto=format&fit=crop&q=80';

const BrowseListingsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { listings, loading, error, fetchListings } = useListings();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [bedroomFilter, setBedroomFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [landlordProfiles, setLandlordProfiles] = useState<Record<string, User>>({});
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get('search') ?? params.get('q') ?? params.get('location');
    const regionParam = params.get('region');

    if (queryParam !== null && queryParam !== searchTerm) {
      setSearchTerm(queryParam);
    }

    if (!regionParam) {
      if (selectedRegion !== 'all') {
        setSelectedRegion('all');
      }
      return;
    }

    const normalizedRegion = formatRegionLabel(regionParam);
    if (normalizedRegion === 'Unspecified') {
      if (selectedRegion !== 'all') {
        setSelectedRegion('all');
      }
      return;
    }

    if (normalizedRegion !== selectedRegion) {
      setSelectedRegion(normalizedRegion);
    }
  }, [location.search, searchTerm, selectedRegion]);


  const normalizeType = (input?: string): Property['type'] => {
    if (!input) {
      return 'apartment';
    }
    const value = input.toLowerCase();
    if (value.includes('house') || value.includes('villa')) {
      return 'house';
    }
    if (value.includes('studio')) {
      return 'studio';
    }
    if (value.includes('condo')) {
      return 'condo';
    }
    return 'apartment';
  };

  useEffect(() => {
    const uniqueIds = Array.from(
      new Set(
        listings
          .map(listing => listing.userId || listing.landlordId)
          .filter((value): value is string => Boolean(value))
      )
    );

    const missingIds = uniqueIds.filter(id => !landlordProfiles[id]);
    if (missingIds.length === 0) {
      return;
    }

    let isCancelled = false;
    Promise.all(
      missingIds.map(async id => {
        try {
          const user = await getUserById(id);
          return { id, user } as { id: string; user: User | null };
        } catch (error) {
          console.warn('Failed to fetch landlord profile for id', id, error);
          return { id, user: null } as { id: string; user: User | null };
        }
      })
    ).then(results => {
      if (isCancelled) {
        return;
      }
      setLandlordProfiles(prev => {
        const next = { ...prev };
        results.forEach(({ id, user }) => {
          if (user) {
            next[id] = user;
          }
        });
        return next;
      });
    });

    return () => {
      isCancelled = true;
    };
  }, [listings, landlordProfiles]);

  useEffect(() => {
    if (error) {
      toast.error('Unable to load listings. Please refresh or try again.');
      setProperties([]);
      return;
    }

    if (loading) {
      return;
    }

    if (listings.length === 0) {
      setProperties([]);
      return;
    }

    const mapped: Property[] = listings.map(listing => {
      const cover = listing.coverPhoto || listing.photos?.[0] || DEFAULT_PROPERTY_IMAGE;
      const images = listing.photos && listing.photos.length > 0
        ? listing.photos
        : [cover];

      let ownerProfile: User | undefined;
      if (listing.userId && landlordProfiles[listing.userId]) {
        ownerProfile = landlordProfiles[listing.userId];
      } else if (listing.landlordId && landlordProfiles[listing.landlordId]) {
        ownerProfile = landlordProfiles[listing.landlordId];
      }

      const ownerName = ownerProfile?.name ?? listing.contactName ?? 'Listing Owner';
      const ownerRole: User['role'] = ownerProfile?.role ?? 'landlord';
      const ownerRoleLabel = getUserRoleLabel(ownerProfile?.role);
      const ownerAvatar = ownerProfile?.photoURL ?? getUserAvatarFallback(ownerRole, ownerName);

      return {
        id: listing.id ?? `temp-${Math.random().toString(36).slice(2, 10)}`,
        title: listing.title || 'Untitled property',
        location: listing.location || 'Location unavailable',
        price: listing.price ?? 0,
        bedrooms: listing.bedrooms ?? 0,
        bathrooms: listing.bathrooms ?? 0,
        area: listing.size ?? 0,
        images,
        rating: listing.verified ? 4.8 : 4.5,
        reviews: listing.reportedCount ?? 0,
        type: normalizeType(listing.propertyType ?? listing.type),
        featured: listing.featured ?? false,
        amenities: listing.amenities ?? [],
        region: listing.region ? formatRegionLabel(listing.region) : undefined,
        landlord: {
          name: ownerName,
          verified: listing.verified ?? ownerProfile?.verified ?? false,
          avatar: ownerAvatar,
          role: ownerRole,
          roleLabel: ownerRoleLabel,
        },
        availableFrom: listing.availabilityDate || listing.createdAt || new Date().toISOString(),
      } as Property;
    });

    setProperties(mapped);
  }, [listings, loading, error, landlordProfiles]);

  // Filter effects
  useEffect(() => {
    let filtered = [...properties];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRegion !== 'all') {
      filtered = filtered.filter(property =>
        property.region &&
        property.region.toLowerCase() === selectedRegion.toLowerCase()
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(property => property.type === selectedType);
    }

    // Price filter
    filtered = filtered.filter(property =>
      property.price >= priceRange[0] && property.price <= priceRange[1]
    );

    // Bedroom filter
    if (bedroomFilter !== 'all') {
      const bedrooms = parseInt(bedroomFilter);
      filtered = filtered.filter(property => property.bedrooms >= bedrooms);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.availableFrom).getTime() - new Date(a.availableFrom).getTime());
        break;
      default: // featured
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredProperties(filtered);
  }, [searchTerm, selectedRegion, selectedType, priceRange, bedroomFilter, sortBy, properties]);

  const toggleFavorite = (propertyId: string) => {
    setFavoriteIds(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
    toast.success(
      favoriteIds.includes(propertyId) ? 'Removed from favorites' : 'Added to favorites',
      { icon: favoriteIds.includes(propertyId) ? '💔' : '❤️' }
    );
  };

  const updateRegionInUrl = (regionValue: string) => {
    const params = new URLSearchParams(location.search);
    if (regionValue === 'all') {
      params.delete('region');
    } else {
      params.set('region', regionValue);
    }
    const queryString = params.toString();
    navigate({ pathname: location.pathname, search: queryString ? `?${queryString}` : '' }, { replace: true });
  };

  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedRegion(value);
    updateRegionInUrl(value);
  };

  const clearRegionFilter = () => {
    setSelectedRegion('all');
    updateRegionInUrl('all');
  };

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

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.03,
      y: -5,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          {/* Back Navigation */}
          <motion.div 
            variants={itemVariants}
            className="mb-6"
          >
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-gray-700 hover:text-blue-600 border border-gray-200 hover:border-blue-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </button>
          </motion.div>

          {/* Header with colorful gradient */}
          <motion.div 
            variants={itemVariants}
            className="relative mb-12 p-8 rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white overflow-hidden"
          >
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="relative z-10">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-4"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Discover Your Perfect Home 🏠
              </motion.h1>
              <motion.p 
                className="text-xl opacity-90 mb-6"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Explore {filteredProperties.length} amazing properties {selectedRegion !== 'all' ? `in ${selectedRegion}` : 'across Ghana'}
              </motion.p>

              {/* Search and Filter Bar */}
              <motion.div 
                className="flex flex-col lg:flex-row gap-4 items-center"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <div className="relative flex-1 w-full lg:max-w-md">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by location or property name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                </div>
                
                <motion.button
                  onClick={() => setShowFilters(!showFilters)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-6 py-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 text-white hover:bg-white/30 transition-all duration-300"
                >
                  <SlidersHorizontal className="w-5 h-5 mr-2" />
                  Filters
                </motion.button>
              </motion.div>

              {selectedRegion !== 'all' && (
                <motion.div
                  className="mt-4 flex flex-wrap items-center gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/20 backdrop-blur-md text-sm text-white/90">
                    <MapPin className="w-4 h-4" />
                    {selectedRegion}
                  </span>
                  <button
                    onClick={clearRegionFilter}
                    className="text-sm text-white/80 hover:text-white underline underline-offset-4 decoration-white/40"
                  >
                    Clear region filter
                  </button>
                </motion.div>
              )}
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-400 to-blue-500 rounded-full opacity-20 transform -translate-x-24 translate-y-24"></div>
          </motion.div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8 overflow-hidden"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {/* Region */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Region</label>
                      <select
                        value={selectedRegion}
                        onChange={handleRegionChange}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Regions</option>
                        {GHANA_REGIONS.map(region => (
                          <option key={region} value={region}>
                            {region}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Property Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Property Type</label>
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Types</option>
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="studio">Studio</option>
                        <option value="condo">Condo</option>
                      </select>
                    </div>

                    {/* Bedrooms */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Bedrooms</label>
                      <select
                        value={bedroomFilter}
                        onChange={(e) => setBedroomFilter(e.target.value)}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">Any</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                      </select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Price Range: ${priceRange[0]} - ${priceRange[1]}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        step="100"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full"
                      />
                    </div>

                    {/* Sort By */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="featured">Featured First</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                        <option value="newest">Newest</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div
              variants={itemVariants}
              className="mb-8 rounded-2xl border border-red-100 bg-red-50 px-6 py-5 text-red-700"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">We couldn&apos;t load the latest listings.</h3>
                  <p className="text-sm text-red-600/80">
                    Please refresh the page or tap retry once you&apos;re back online.
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fetchListings()}
                  className="self-start rounded-xl bg-red-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
                >
                  Retry loading listings
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* View Toggle and Results Count */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-between items-center mb-8"
          >
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <span className="text-gray-600 font-medium">
                {filteredProperties.length} properties found
              </span>
              {filteredProperties.length !== properties.length && (
                <span className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                  Filtered
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2 bg-white rounded-xl p-1 shadow-sm border border-gray-200">
              <motion.button
                onClick={() => setViewMode('grid')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={() => setViewMode('list')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>

          {/* Properties Grid/List */}
          <motion.div variants={itemVariants}>
            {filteredProperties.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="mb-6">
                  <Home className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No properties found</h3>
                  <p className="text-gray-600">Try adjusting your filters or search terms</p>
                </div>
                <motion.button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedType('all');
                    setPriceRange([0, 5000]);
                    setBedroomFilter('all');
                    clearRegionFilter();
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  Clear Filters
                </motion.button>
              </motion.div>
            ) : (
              <div className={`grid gap-8 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                    onClick={() => navigate(`/listing/${property.id}`)}
                  >
                    {/* Image Section */}
                    <div className={`relative ${viewMode === 'list' ? 'w-1/3' : 'w-full h-64'} group cursor-pointer`}>
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Property badges */}
                      <div className="absolute top-4 left-4 flex flex-col space-y-2">
                        {property.featured && (
                          <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full flex items-center">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </span>
                        )}
                        <span className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full capitalize">
                          {property.type}
                        </span>
                      </div>

                      {/* Favorite button */}
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(property.id);
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                      >
                        <Heart 
                          className={`w-5 h-5 ${
                            favoriteIds.includes(property.id) 
                              ? 'text-red-500 fill-current' 
                              : 'text-gray-600'
                          }`} 
                        />
                      </motion.button>

                      {/* Image overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Content Section */}
                    <div className={`p-6 ${viewMode === 'list' ? 'w-2/3' : 'w-full'}`}>
                      {/* Price and Rating */}
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="text-2xl font-bold text-blue-600">${property.price}</span>
                          <span className="text-gray-500 text-sm">/month</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-700">{property.rating}</span>
                          <span className="text-sm text-gray-500">({property.reviews})</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                        {property.title}
                      </h3>

                      {/* Location */}
                      <div className="flex items-center text-gray-600 mb-4">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{property.location}</span>
                      </div>

                      {/* Property details */}
                      <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Bed className="w-4 h-4 mr-1" />
                          <span>{property.bedrooms} bed</span>
                        </div>
                        <div className="flex items-center">
                          <Bath className="w-4 h-4 mr-1" />
                          <span>{property.bathrooms} bath</span>
                        </div>
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-1" />
                          <span>{property.area} m²</span>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {property.amenities.slice(0, 3).map((amenity) => (
                          <span
                            key={amenity}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg flex items-center"
                          >
                            {amenity === 'WiFi' && <Wifi className="w-3 h-3 mr-1" />}
                            {amenity === 'Parking' && <Car className="w-3 h-3 mr-1" />}
                            {amenity === 'Security' && <Shield className="w-3 h-3 mr-1" />}
                            {amenity}
                          </span>
                        ))}
                        {property.amenities.length > 3 && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg">
                            +{property.amenities.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Landlord info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            src={property.landlord.avatar}
                            alt={property.landlord.name}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <div>
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-900">{property.landlord.name}</span>
                              {property.landlord.verified && (
                                <Check className="w-3 h-3 text-green-500 ml-1" />
                              )}
                            </div>
                            <span className="block text-xs font-medium text-blue-600">{property.landlord.roleLabel}</span>
                            <span className="text-xs text-gray-500">Available from {new Date(property.availableFrom).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/listing/${property.id}`);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Load More Button */}
          {filteredProperties.length >= 6 && (
            <motion.div
              variants={itemVariants}
              className="text-center mt-12"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Load More Properties
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BrowseListingsPage;
