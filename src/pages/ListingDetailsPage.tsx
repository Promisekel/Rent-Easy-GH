import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Heart,
  Share2,
  MapPin,
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
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Star,
  Check,
  Eye,
  ExternalLink,
  AlertTriangle,
  Home as HomeIcon,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Listing } from '../types/Listing';
import { User } from '../types/User';
import { getListingById, getUserById } from '../services/firebase';
import { getUserAvatarFallback, getUserRoleLabel } from '../utils/user';

const DEFAULT_PROPERTY_IMAGE = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80';

type FeatureDefinition = {
  id: string;
  name: string;
  Icon: typeof Wifi;
};

type NearbyPlace = {
  name: string;
  distance: string;
  type: string;
};

const AMENITY_ICON_MATCHERS: Array<{ keywords: string[]; Icon: typeof Wifi; label: string }> = [
  { keywords: ['wifi', 'internet'], Icon: Wifi, label: 'WiFi' },
  { keywords: ['parking', 'garage'], Icon: Car, label: 'Parking' },
  { keywords: ['security', 'guard'], Icon: Shield, label: '24/7 Security' },
  { keywords: ['generator', 'electricity', 'power'], Icon: Zap, label: 'Backup Power' },
  { keywords: ['water'], Icon: Droplets, label: 'Water Supply' },
  { keywords: ['air', 'ac', 'conditioning'], Icon: Wind, label: 'Air Conditioning' },
  { keywords: ['tv', 'cable'], Icon: Tv, label: 'Cable TV Ready' },
];

type Point = { x: number; y: number };
type PanState = { x: number; y: number };

const clampZoom = (value: number): number => Math.min(4, Math.max(1, value));

const getDistance = (a: Point, b: Point): number => Math.hypot(a.x - b.x, a.y - b.y);

  const DEFAULT_FEATURES: FeatureDefinition[] = [
    { id: 'wifi', name: 'WiFi', Icon: Wifi },
    { id: 'parking', name: 'Secure Parking', Icon: Car },
    { id: 'security', name: '24/7 Security', Icon: Shield },
    { id: 'power', name: 'Backup Power', Icon: Zap },
  ];

  const buildFeatureFromAmenity = (amenity: string): FeatureDefinition => {
    const normalized = amenity.toLowerCase();
    const matcher = AMENITY_ICON_MATCHERS.find(({ keywords }) =>
      keywords.some(keyword => normalized.includes(keyword))
    );

    if (matcher) {
      return {
        id: matcher.label.toLowerCase().replace(/\s+/g, '-'),
        name: matcher.label,
        Icon: matcher.Icon,
      };
    }

    return {
      id: normalized.replace(/\s+/g, '-'),
      name: amenity,
      Icon: Check,
    };
  };

  const formatCurrency = (value: number): string => {
    if (!value || Number.isNaN(value)) {
      return 'GHS 0';
    }
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (value?: string | null): string => {
    if (!value) {
      return 'Available Now';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return 'Available Now';
    }
    return date.toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const buildNearbyPlaces = (location?: string): NearbyPlace[] => {
    const base = (location || 'Local Area').split(',')[0]?.trim() || 'Local Area';
    return [
      { name: `${base} Mall`, distance: '0.8 km', type: 'Shopping' },
      { name: `${base} Market`, distance: '1.2 km', type: 'Groceries' },
      { name: `${base} Clinic`, distance: '1.5 km', type: 'Healthcare' },
      { name: `${base} Transport Hub`, distance: '2.0 km', type: 'Transport' },
      { name: `${base} School`, distance: '2.5 km', type: 'Education' },
    ];
  };

  const ListingDetailsPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [listing, setListing] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [showContactForm, setShowContactForm] = useState(false);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [pan, setPan] = useState<PanState>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
  const [landlordUser, setLandlordUser] = useState<User | null>(null);
    const imageContainerRef = useRef<HTMLDivElement | null>(null);
    const pointerPositions = useRef<Map<number, Point>>(new Map());
    const initialPinchDistance = useRef<number | null>(null);
    const initialZoomRef = useRef(1);

    const constrainPan = useCallback((nextPan: PanState, zoom: number): PanState => {
      const container = imageContainerRef.current;
      if (!container) {
        return nextPan;
      }

      const width = container.clientWidth;
      const height = container.clientHeight;
      const maxX = Math.max(0, ((zoom - 1) * width) / 2);
      const maxY = Math.max(0, ((zoom - 1) * height) / 2);

      return {
        x: maxX === 0 ? 0 : Math.max(-maxX, Math.min(maxX, nextPan.x)),
        y: maxY === 0 ? 0 : Math.max(-maxY, Math.min(maxY, nextPan.y)),
      };
    }, []);

    const resetPanAndZoom = useCallback(() => {
      setZoomLevel(1);
      setPan({ x: 0, y: 0 });
      setIsDragging(false);
      pointerPositions.current.clear();
      initialPinchDistance.current = null;
      initialZoomRef.current = 1;
    }, []);

    const adjustZoom = useCallback((targetZoom: number) => {
      const newZoom = clampZoom(targetZoom);
      setZoomLevel(newZoom);
      setPan(prev => (newZoom === 1 ? { x: 0, y: 0 } : constrainPan(prev, newZoom)));
      if (newZoom === 1) {
        setIsDragging(false);
        pointerPositions.current.clear();
        initialPinchDistance.current = null;
      }
    }, [constrainPan]);

    const handleWheel = useCallback((event: React.WheelEvent<HTMLDivElement>) => {
      if (!isLightboxOpen) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      const delta = -event.deltaY;
      if (delta === 0) {
        return;
      }
      adjustZoom(zoomLevel + (delta * 0.002));
    }, [adjustZoom, isLightboxOpen, zoomLevel]);

    const handlePointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
      if (!isLightboxOpen) {
        return;
      }

      event.preventDefault();
      const container = event.currentTarget;
      container.setPointerCapture(event.pointerId);
      pointerPositions.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

      if (pointerPositions.current.size === 2) {
        const positions = Array.from(pointerPositions.current.values());
        initialPinchDistance.current = getDistance(positions[0], positions[1]);
        initialZoomRef.current = zoomLevel;
      }

      setIsDragging(pointerPositions.current.size === 1 && zoomLevel > 1);
    }, [isLightboxOpen, zoomLevel]);

    const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
      if (!pointerPositions.current.has(event.pointerId)) {
        return;
      }

      const previous = pointerPositions.current.get(event.pointerId)!;
      const currentPosition: Point = { x: event.clientX, y: event.clientY };
      pointerPositions.current.set(event.pointerId, currentPosition);

      if (pointerPositions.current.size === 1 && zoomLevel > 1) {
        const deltaX = currentPosition.x - previous.x;
        const deltaY = currentPosition.y - previous.y;
        setPan(prevPan => constrainPan({ x: prevPan.x + deltaX, y: prevPan.y + deltaY }, zoomLevel));
      } else if (pointerPositions.current.size === 2 && initialPinchDistance.current) {
        const positions = Array.from(pointerPositions.current.values());
        const distance = getDistance(positions[0], positions[1]);
        const scaleFactor = distance / initialPinchDistance.current;
        adjustZoom(initialZoomRef.current * scaleFactor);
      }
    }, [adjustZoom, constrainPan, zoomLevel]);

    const releasePointer = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
      if (pointerPositions.current.has(event.pointerId)) {
        pointerPositions.current.delete(event.pointerId);
      }

      const container = event.currentTarget;
      if (container.hasPointerCapture(event.pointerId)) {
        container.releasePointerCapture(event.pointerId);
      }

      if (pointerPositions.current.size < 2) {
        initialPinchDistance.current = null;
      }

      if (pointerPositions.current.size === 0) {
        setIsDragging(false);
        if (zoomLevel === 1) {
          setPan({ x: 0, y: 0 });
        }
      }
    }, [zoomLevel]);

    const handleDoubleClick = useCallback(() => {
      adjustZoom(zoomLevel === 1 ? 2 : 1);
    }, [adjustZoom, zoomLevel]);

    const fetchListing = useCallback(async () => {
      if (!id) {
        setError('We could not find this listing. It may have been removed.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await getListingById(id);
        if (!data) {
          setError('This listing no longer exists or has been removed.');
          setListing(null);
          return;
        }
        setListing(data);
      } catch (err) {
        console.error('Failed to fetch listing:', err);
        setError('Unable to load this listing right now. Please try again.');
        toast.error('Failed to load listing. Please try again.');
      } finally {
        setLoading(false);
      }
    }, [id]);

    useEffect(() => {
      void fetchListing();
    }, [fetchListing]);

    useEffect(() => {
      setCurrentImageIndex(0);
      setShowContactForm(false);
    }, [listing?.id]);

    useEffect(() => {
      if (!isLightboxOpen) {
        resetPanAndZoom();
      }
    }, [isLightboxOpen, resetPanAndZoom]);

    useEffect(() => {
      if (isLightboxOpen) {
        resetPanAndZoom();
      }
    }, [currentImageIndex, isLightboxOpen, resetPanAndZoom]);

    useEffect(() => {
      if (!listing?.userId && !listing?.landlordId) {
        setLandlordUser(null);
        return;
      }

      let isCancelled = false;
      const userIdentifier = listing.userId ?? listing.landlordId;
      if (!userIdentifier) {
        setLandlordUser(null);
        return;
      }

      void getUserById(userIdentifier)
        .then(user => {
          if (!isCancelled) {
            setLandlordUser(user);
          }
        })
        .catch(error => {
          console.warn('Failed to fetch landlord profile', error);
          if (!isCancelled) {
            setLandlordUser(null);
          }
        });

      return () => {
        isCancelled = true;
      };
    }, [listing?.userId, listing?.landlordId]);

    useEffect(() => {
      if (typeof document === 'undefined') {
        return;
      }

      const { body } = document;
      if (isLightboxOpen) {
        const originalOverflow = body.style.overflow;
        body.style.overflow = 'hidden';
        return () => {
          body.style.overflow = originalOverflow;
        };
      }

      return undefined;
    }, [isLightboxOpen]);

    const lightboxContainerStyle = useMemo<React.CSSProperties>(() => ({
      cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
      touchAction: 'none',
    }), [isDragging, zoomLevel]);

    const lightboxImageStyle = useMemo<React.CSSProperties>(() => ({
      transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoomLevel})`,
      transition: isDragging ? 'none' : 'transform 0.15s ease-out',
      willChange: 'transform',
    }), [isDragging, pan.x, pan.y, zoomLevel]);

    const images = useMemo(() => {
      if (listing?.photos && listing.photos.length > 0) {
        return listing.photos;
      }
      if (listing?.coverPhoto) {
        return [listing.coverPhoto];
      }
      return [DEFAULT_PROPERTY_IMAGE];
    }, [listing]);

    const propertyTypeLabel = useMemo(() => {
      const value = listing?.propertyType || listing?.type;
      if (!value) {
        return 'Property';
      }
      return value.charAt(0).toUpperCase() + value.slice(1);
    }, [listing?.propertyType, listing?.type]);

    const priceDisplay = formatCurrency(listing?.price ?? 0);
    const depositDisplay = formatCurrency(
      listing?.securityDeposit ?? Math.round((listing?.price ?? 0) * 2)
    );
    const availabilityDisplay = formatDate(listing?.availabilityDate ?? listing?.createdAt ?? null);

    const features = useMemo(() => {
      if (!listing) {
        return DEFAULT_FEATURES;
      }

      const amenities = listing.amenities ?? [];
      const extras = listing.additionalFeatures
        ? listing.additionalFeatures.split(',').map(item => item.trim()).filter(Boolean)
        : [];

      const combined = [...amenities, ...extras];
      if (combined.length === 0) {
        return DEFAULT_FEATURES;
      }

      const unique = new Map<string, FeatureDefinition>();
      combined.forEach(amenity => {
        const feature = buildFeatureFromAmenity(amenity);
        unique.set(feature.id, feature);
      });

      return unique.size > 0 ? Array.from(unique.values()) : DEFAULT_FEATURES;
    }, [listing]);

    const nearbyPlaces = useMemo(() => buildNearbyPlaces(listing?.location), [listing?.location]);

  const landlordName = landlordUser?.name || listing?.contactName || 'Property Owner';
  const landlordEmail = listing?.contactEmail || landlordUser?.email;
  const landlordPhone = listing?.contactPhone || landlordUser?.phone;
  const landlordRoleLabel = getUserRoleLabel(landlordUser?.role);
  const landlordAvatar = landlordUser?.photoURL || getUserAvatarFallback(landlordUser?.role, landlordName);
  const landlordVerified = listing?.verified ?? landlordUser?.verified ?? false;
    const landlordResponseTime = landlordVerified ? '< 2 hours' : 'Within a day';
    const landlordProperties = landlordVerified ? 12 : 4;
    const landlordJoined = formatDate(listing?.createdAt ?? null);
    const ratingValue = landlordVerified ? 4.9 : 4.6;
    const reviewsCount = Math.max(listing?.reportedCount ?? 12, 1);

    const bedroomsDisplay = listing?.bedrooms ?? 0;
    const bathroomsDisplay = listing?.bathrooms ?? 0;
    const sizeDisplay = listing?.size ? `${listing.size} m²` : 'N/A';
    const locationDisplay = listing?.location || 'Location to be provided';
    const descriptionDisplay = listing?.description || 'The landlord has not provided a description for this listing yet.';

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2,
        },
      },
    } as const;

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
      },
    } as const;

    const imagesCount = images.length;

    const nextImage = () => {
      setCurrentImageIndex(prev => (prev + 1) % imagesCount);
    };

    const prevImage = () => {
      setCurrentImageIndex(prev => (prev - 1 + imagesCount) % imagesCount);
    };

    const openLightbox = (index: number) => {
      resetPanAndZoom();
      setCurrentImageIndex(index);
      setIsLightboxOpen(true);
    };

    const closeLightbox = () => {
      setIsLightboxOpen(false);
      resetPanAndZoom();
    };

    const handleCall = () => {
      if (!landlordPhone) {
        toast.error('Phone number not provided yet.');
        return;
      }
      if (typeof window !== 'undefined') {
        window.open(`tel:${landlordPhone}`, '_self');
      }
    };

    const handleEmail = () => {
      if (!landlordEmail) {
        toast.error('Email address not provided yet.');
        return;
      }
      if (typeof window !== 'undefined') {
        window.open(`mailto:${landlordEmail}`, '_self');
      }
    };

    if (loading) {
      return <LoadingSpinner />;
    }

    if (error || !listing) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center">
          <div className="container mx-auto px-6 py-12">
            <div className="max-w-xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-lg p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">We couldn&apos;t show this listing</h1>
              <p className="text-gray-600 mb-6">{error ?? 'This listing may have been removed or is temporarily unavailable.'}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => fetchListing()}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
                >
                  Retry
                </button>
                <button
                  onClick={() => navigate('/browse')}
                  className="rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back to listings
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-6 py-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto"
          >
            <motion.div
              variants={itemVariants}
              className="mb-6 flex flex-wrap items-center gap-4"
            >
              <button
                onClick={() => navigate('/browse')}
                className="flex items-center px-4 py-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
                <span className="ml-2 text-gray-700 font-medium">Back to listings</span>
              </button>
              <div className="flex items-center space-x-3 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200">
                <MapPin className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-medium text-gray-700">{locationDisplay}</span>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <motion.div variants={itemVariants} className="relative">
                  <div
                    className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden cursor-zoom-in"
                    onClick={() => openLightbox(currentImageIndex)}
                    role="button"
                    tabIndex={0}
                    aria-label="View image in full screen"
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        openLightbox(currentImageIndex);
                      }
                    }}
                  >
                    <motion.img
                      key={currentImageIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      src={images[currentImageIndex]}
                      alt={`Property image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />

                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    <div className="absolute top-4 right-4 flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsLiked(!isLiked)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                          isLiked ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-700 hover:bg-white'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 bg-white/90 hover:bg-white text-gray-700 rounded-full flex items-center justify-center transition-all duration-200"
                      >
                        <Share2 className="w-5 h-5" />
                      </motion.button>
                    </div>

                    <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {imagesCount}
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onMouseEnter={() => setCurrentImageIndex(index)}
                        onClick={() => openLightbox(index)}
                        className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          index === currentImageIndex ? 'border-primary-500' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                    <div>
                      <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">{listing.title}</h1>
                      <p className="text-gray-600 flex items-center text-lg">
                        <MapPin className="w-5 h-5 mr-2" />
                        {locationDisplay}
                      </p>
                    </div>
                    <div className="text-right mt-4 md:mt-0">
                      <div className="text-3xl font-bold text-primary-600 mb-1">
                        {priceDisplay}<span className="text-lg text-gray-500">/month</span>
                      </div>
                      <p className="text-gray-600">Deposit: {depositDisplay}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <Bed className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                      <div className="font-semibold text-gray-900">{bedroomsDisplay}</div>
                      <div className="text-sm text-gray-600">Bedrooms</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <Bath className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                      <div className="font-semibold text-gray-900">{bathroomsDisplay}</div>
                      <div className="text-sm text-gray-600">Bathrooms</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <Square className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                      <div className="font-semibold text-gray-900">{sizeDisplay}</div>
                      <div className="text-sm text-gray-600">Size</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <HomeIcon className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                      <div className="font-semibold text-gray-900">{propertyTypeLabel}</div>
                      <div className="text-sm text-gray-600">Property Type</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <Calendar className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                      <div className="font-semibold text-gray-900">Available</div>
                      <div className="text-sm text-gray-600">{availabilityDisplay}</div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{descriptionDisplay}</p>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Features & Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {features.map(feature => (
                        <div key={feature.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <feature.Icon className="w-5 h-5 text-primary-600" />
                          <span className="text-gray-900 font-medium">{feature.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-8">
                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">{landlordRoleLabel}</h3>

                  <div className="flex items-center space-x-4 mb-6">
                    <div className="relative">
                      <img
                        src={landlordAvatar}
                        alt={landlordName}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      {landlordVerified && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{landlordName}</h4>
                      {landlordRoleLabel !== 'Property Owner' && (
                        <span className="inline-flex items-center px-2 py-0.5 mt-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          {landlordRoleLabel}
                        </span>
                      )}
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(ratingValue) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {ratingValue.toFixed(1)} ({reviewsCount} reviews)
                        </span>
                      </div>
                      {landlordVerified && (
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          <Check className="w-3 h-3 mr-1" />
                          Verified Owner
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div>
                      <span className="text-gray-600">Properties:</span>
                      <span className="ml-2 font-medium">{landlordProperties}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Response time:</span>
                      <span className="ml-2 font-medium">{landlordResponseTime}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Member since:</span>
                      <span className="ml-2 font-medium">{landlordJoined}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowContactForm(!showContactForm)}
                      className="w-full btn-primary"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Send Message
                    </motion.button>

                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCall}
                        className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleEmail}
                        className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </motion.button>
                    </div>
                  </div>

                  {showContactForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-6 p-4 bg-gray-50 rounded-xl"
                    >
                      <h4 className="font-semibold text-gray-900 mb-3">Send a Message</h4>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Your name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <input
                          type="email"
                          placeholder="Your email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <textarea
                          rows={3}
                          placeholder="I'm interested in this property..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                        />
                        <button className="w-full btn-primary">Send Message</button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">What&apos;s Nearby</h3>

                  <div className="space-y-4">
                    {nearbyPlaces.map((place, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{place.name}</h4>
                          <p className="text-sm text-gray-600">{place.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-primary-600">{place.distance}</p>
                          <p className="text-xs text-gray-500">away</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-4 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on map
                  </motion.button>
                </motion.div>
              </div>
            </div>
            <AnimatePresence>
              {isLightboxOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                  onClick={closeLightbox}
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="relative w-full max-w-5xl max-h-full"
                    onClick={(event) => event.stopPropagation()}
                  >
                      <div
                        ref={imageContainerRef}
                        style={lightboxContainerStyle}
                        className="relative w-full max-h-[80vh] overflow-hidden flex items-center justify-center bg-black/30 rounded-2xl"
                        onWheel={handleWheel}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={releasePointer}
                        onPointerLeave={releasePointer}
                        onPointerCancel={releasePointer}
                        onDoubleClick={handleDoubleClick}
                      >
                        <img
                          src={images[currentImageIndex]}
                          alt={`Property large view ${currentImageIndex + 1}`}
                          className="w-full max-h-[80vh] object-contain select-none"
                          style={lightboxImageStyle}
                          draggable={false}
                        />
                      </div>
                    <button
                      onClick={closeLightbox}
                      className="absolute top-4 right-4 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                      aria-label="Close full screen image"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    {imagesCount > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {imagesCount}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    );
  };

  export default ListingDetailsPage;