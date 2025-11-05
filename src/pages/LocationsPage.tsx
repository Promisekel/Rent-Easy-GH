import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Building,
  Users,
  Coffee,
  School,
  Shield,
  Car,
  Leaf,
  TreePine,
  Utensils,
  Heart,
  Sparkles,
  ArrowRight,
  Compass,
  Search,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GHANA_REGIONS } from '../utils/regions';

const featuredLocations = [
  {
    id: 'accra-east-legon',
    name: 'East Legon',
    city: 'Accra',
    image:
      'https://images.unsplash.com/photo-1582719478161-6eb1f3f0c6d1?auto=format&fit=crop&w=1200&q=80',
    averageRent: 2500,
    vibe: 'Upscale & Vibrant',
    description:
      'Premium residential neighborhood popular with professionals, offering modern apartments, international schools, and lively nightlife.',
    quickStats: [
      { icon: School, label: '3' },
      { icon: Coffee, label: '22' },
      { icon: Shield, label: 'High' },
    ],
    highlights: ['Nightlife', 'Gated communities', 'International schools'],
    tags: ['City life', 'Premium', 'Nightlife'],
    coordinates: { lat: 5.63, lng: -0.17 },
  },
  {
    id: 'accra-cantonments',
    name: 'Cantonments',
    city: 'Accra',
    image:
      'https://images.unsplash.com/photo-1529429617124-aee711a3363a?auto=format&fit=crop&w=1200&q=80',
    averageRent: 3200,
    vibe: 'Diplomatic & Serene',
    description:
      'Home to embassies and diplomatic residences, Cantonments offers secure living, wide streets, and premium amenities.',
    quickStats: [
      { icon: Shield, label: 'Very High' },
      { icon: TreePine, label: 'Green' },
      { icon: Car, label: 'Easy' },
    ],
    highlights: ['Embassy district', 'Tree-lined avenues', 'Upscale dining'],
    tags: ['Families', 'Secure', 'Embassy district'],
    coordinates: { lat: 5.57, lng: -0.18 },
  },
  {
    id: 'accra-osu',
    name: 'Osu',
    city: 'Accra',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
    averageRent: 1500,
    vibe: 'Energetic & Central',
    description:
      'Bustling neighborhood known for restaurants, entertainment, shopping, and easy beach access. Ideal for young professionals.',
    quickStats: [
      { icon: Utensils, label: '35' },
      { icon: Heart, label: 'Popular' },
      { icon: MapPin, label: 'Central' },
    ],
    highlights: ['Oxford Street', 'Beach access', 'Nightlife'],
    tags: ['Foodies', 'Nightlife', 'City vibes'],
    coordinates: { lat: 5.55, lng: -0.18 },
  },
  {
    id: 'tema-community-25',
    name: 'Community 25',
    city: 'Tema',
    image:
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
    averageRent: 900,
    vibe: 'Family-Friendly Suburb',
    description:
      'Planned community with spacious homes, good schools, and a growing retail presence. Loved by families seeking quieter living.',
    quickStats: [
      { icon: School, label: '4' },
      { icon: Car, label: 'Straight' },
      { icon: Leaf, label: 'Clean' },
    ],
    highlights: ['Gated estates', 'Retail parks', 'Family amenities'],
    tags: ['Families', 'Budget friendly', 'Suburban'],
    coordinates: { lat: 5.70, lng: -0.01 },
  },
  {
    id: 'kumasi-ayigya',
    name: 'Ayigya',
    city: 'Kumasi',
    image:
      'https://images.unsplash.com/photo-1527254059249-cadf0d17c5ad?auto=format&fit=crop&w=1200&q=80',
    averageRent: 600,
    vibe: 'University Hub',
    description:
      'Vibrant area near KNUST with affordable housing, lively markets, and student-friendly amenities.',
    quickStats: [
      { icon: Users, label: 'Students' },
      { icon: Coffee, label: '12' },
      { icon: Car, label: 'Busy' },
    ],
    highlights: ['Campus access', 'Markets', 'Budget living'],
    tags: ['Students', 'Budget', 'Community'],
    coordinates: { lat: 6.68, lng: -1.57 },
  },
  {
    id: 'takoradi-anzaa',
    name: 'Anaji',
    city: 'Takoradi',
    image:
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80',
    averageRent: 1100,
    vibe: 'Coastal Comfort',
    description:
      'Popular residential zone with coastal breezes, modern apartments, and easy access to oil & gas business hubs.',
    quickStats: [
      { icon: Compass, label: '5 mins' },
      { icon: Car, label: 'Smooth' },
      { icon: Sparkles, label: 'Modern' },
    ],
    highlights: ['Coastal views', 'Business hubs', 'Modern apartments'],
    tags: ['Executives', 'Coastal', 'Modern living'],
    coordinates: { lat: 4.93, lng: -1.76 },
  },
];

const lifestyles = [
  {
    id: 'executive',
    title: 'Executive Living',
    description: 'Upscale neighborhoods with premium amenities and secure gated communities ideal for corporate leaders and diplomats.',
    neighborhoods: ['Cantonments', 'Airport Residential', 'Labone'],
    icon: Building,
  },
  {
    id: 'family',
    title: 'Family Friendly',
    description: 'Spacious homes near quality schools, parks, and community centers for growing families seeking balance.',
    neighborhoods: ['Tema Community 25', 'Spintex', 'Adenta'],
    icon: Users,
  },
  {
    id: 'creative',
    title: 'Creative & Social',
    description: 'Energetic communities brimming with cafés, nightlife, art spaces, and start-up hubs for young professionals.',
    neighborhoods: ['Osu', 'East Legon', 'Dzorwulu'],
    icon: Coffee,
  },
  {
    id: 'serene',
    title: 'Serene Retreats',
    description: 'Quiet, leafy areas that offer a slower pace, nature access, and wellness-focused amenities to recharge.',
    neighborhoods: ['Aburi', 'North Ridge', 'Roman Ridge'],
    icon: Leaf,
  },
];

const tips = [
  {
    title: 'Check commute routes early',
    detail:
      'Traffic in Accra can add 45 minutes to your travel. Map your route during rush hour before committing to a lease.',
  },
  {
    title: 'Ask about backup utilities',
    detail:
      'Many upscale properties offer standby generators and water reserves. Confirm these details during inspections.',
  },
  {
    title: 'Verify security arrangements',
    detail:
      'Look for neighborhoods with gated estates, CCTV, and community watch groups to enhance your safety.',
  },
  {
    title: 'Compare rent and service charges',
    detail:
      'Estate management often adds service fees for maintenance. Make sure you know the total monthly cost.',
  },
];

const LocationsPage: React.FC = () => {
  const navigate = useNavigate();

  const cardVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
      },
    }),
    []
  );

  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.15 },
      },
    }),
    []
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <section className="relative overflow-hidden pt-24 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 via-white to-secondary-100 opacity-60" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold mb-6">
              <MapPin className="w-4 h-4 mr-2" />
              Explore Ghana's top rental neighborhoods
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              Discover the perfect area for your next home
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Compare lifestyle, average rent, commute options, and must-know highlights for Ghana's most sought-after neighborhoods.
            </p>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-white rounded-xl shadow-lg border border-gray-100 cursor-pointer"
              onClick={() => navigate('/browse')}
            >
              <Search className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-600">
                Browse listings in these neighborhoods
              </span>
              <ArrowRight className="w-4 h-4 text-primary-600" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {featuredLocations.map(location => (
              <motion.article
                key={location.id}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden flex flex-col"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={location.image}
                    alt={`${location.name}, ${location.city}`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                    {location.city}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                    {location.vibe}
                  </div>
                </div>

                <div className="flex-1 p-6 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {location.name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Average rent: {formatCurrency(location.averageRent)}/month
                    </p>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {location.description}
                  </p>

                  <div className="flex items-center space-x-3">
                    {location.quickStats.map((stat, index) => (
                      <div
                        key={`${location.id}-stat-${index}`}
                        className="flex items-center space-x-1 px-3 py-2 bg-gray-50 rounded-xl text-xs text-gray-600"
                      >
                        <stat.icon className="w-4 h-4" />
                        <span>{stat.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {location.highlights.map(highlight => (
                      <span
                        key={`${location.id}-highlight-${highlight}`}
                        className="px-3 py-1 bg-primary-50 text-primary-600 text-xs font-medium rounded-full"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6 border-t border-gray-100 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium text-gray-900">Popular with:</span>{' '}
                    {location.tags.join(', ')}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/browse?search=${encodeURIComponent(location.name)}`)}
                    className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold text-primary-600 border border-primary-200 hover:bg-primary-50"
                  >
                    View listings
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </motion.button>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white/70">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Match neighborhoods to your lifestyle
            </h2>
            <p className="text-gray-600">
              Start with what matters most to you -- family schools, nightlife, coastal living, or a peaceful retreat -- then explore curated areas that fit.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {lifestyles.map(lifestyle => (
              <motion.div
                key={lifestyle.id}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl border border-gray-100 shadow-md p-6 flex items-start space-x-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
                  <lifestyle.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {lifestyle.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
                    {lifestyle.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {lifestyle.neighborhoods.map(neighborhood => (
                      <button
                        key={`${lifestyle.id}-${neighborhood}`}
                        onClick={() => navigate(`/browse?search=${encodeURIComponent(neighborhood)}`)}
                        className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium hover:bg-primary-50 hover:text-primary-600 transition-colors"
                      >
                        {neighborhood}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-blue-50/40 via-white to-primary-50/40">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center mb-10"
          >
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Browse rentals by region
            </h2>
            <p className="text-gray-600">
              Jump straight to listings curated for each of Ghana's administrative regions.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={containerVariants}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {GHANA_REGIONS.map(region => (
              <motion.button
                key={region}
                variants={cardVariants}
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/browse?region=${encodeURIComponent(region)}`)}
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-white border border-gray-200 text-left shadow-sm"
              >
                <span className="text-sm font-semibold text-gray-800">{region}</span>
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary-50 text-primary-600">
                  <MapPin className="w-4 h-4" />
                </span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl text-white p-8 md:p-12 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2 space-y-4">
                <h2 className="text-3xl font-display font-bold">
                  Ready to tour neighborhoods in person?
                </h2>
                <p className="text-primary-100 text-sm md:text-base">
                  Our field team can schedule guided neighborhood tours, introduce you to local amenities, and help secure your next lease.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {tips.map(tip => (
                    <div
                      key={tip.title}
                      className="bg-white/10 border border-white/20 rounded-2xl p-4"
                    >
                      <h3 className="font-semibold mb-1">{tip.title}</h3>
                      <p className="text-primary-100 text-xs leading-relaxed">
                        {tip.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col space-y-4">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/contact')}
                  className="bg-white text-primary-600 font-semibold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl"
                >
                  Book a neighborhood tour
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/browse')}
                  className="bg-white/10 border border-white/40 text-white font-semibold px-6 py-4 rounded-xl hover:bg-white/20"
                >
                  View all listings
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LocationsPage;
