import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Loader2,
  MapPin,
  Home,
  Bed,
  Bath,
  Square,
  Calendar,
  Shield,
  CheckCircle,
  Eye,
  Save,
  AlertCircle,
  RefreshCcw,
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Listing } from '../types/Listing';
import { getListingById, updateListing } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

const PROPERTY_TYPES = [
  'Apartment',
  'House',
  'Studio',
  'Townhouse',
  'Condo',
  'Duplex',
  'Guest House',
];

type FormState = {
  title: string;
  propertyType: string;
  location: string;
  price: string;
  securityDeposit: string;
  bedrooms: string;
  bathrooms: string;
  size: string;
  availabilityDate: string;
  description: string;
  additionalFeatures: string;
  status: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
};

const emptyState: FormState = {
  title: '',
  propertyType: '',
  location: '',
  price: '',
  securityDeposit: '',
  bedrooms: '',
  bathrooms: '',
  size: '',
  availabilityDate: '',
  description: '',
  additionalFeatures: '',
  status: 'pending',
  contactName: '',
  contactPhone: '',
  contactEmail: '',
};

const formatCurrency = (value: number | undefined) =>
  new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    maximumFractionDigits: 0,
  }).format(value ?? 0);

const toDateInputValue = (value?: string | null) => {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toISOString().split('T')[0];
};

const EditListingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formState, setFormState] = useState<FormState>(emptyState);

  const loadListing = useCallback(async () => {
    if (!id) {
      toast.error('Listing not found.');
      navigate('/dashboard');
      return;
    }

    try {
      setLoading(true);
      const fetched = await getListingById(id);
      if (!fetched) {
        toast.error('We could not find that listing.');
        navigate('/dashboard');
        return;
      }
      setListing(fetched);
      setFormState({
        title: fetched.title ?? '',
        propertyType: fetched.propertyType ?? fetched.type ?? '',
        location: fetched.location ?? '',
        price: fetched.price?.toString() ?? '',
        securityDeposit: fetched.securityDeposit?.toString() ?? '',
        bedrooms: fetched.bedrooms?.toString() ?? '',
        bathrooms: fetched.bathrooms?.toString() ?? '',
        size: fetched.size?.toString() ?? '',
        availabilityDate: toDateInputValue(fetched.availabilityDate ?? fetched.createdAt ?? null),
        description: fetched.description ?? '',
        additionalFeatures: fetched.additionalFeatures ?? '',
        status: fetched.status ?? 'pending',
        contactName: fetched.contactName ?? '',
        contactPhone: fetched.contactPhone ?? '',
        contactEmail: fetched.contactEmail ?? '',
      });
    } catch (error) {
      console.error('Failed to load listing', error);
      toast.error('Unable to load listing for editing.');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    void loadListing();
  }, [loadListing]);

  const isOwner = useMemo(() => {
    if (!listing || !currentUser?.uid) {
      return false;
    }
    return listing.userId === currentUser.uid || listing.landlordId === currentUser.uid;
  }, [listing, currentUser?.uid]);

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = event.target.value;
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) {
      toast.error('Missing listing identifier.');
      return;
    }

    if (!isOwner) {
      toast.error('You do not have permission to update this listing.');
      return;
    }

    try {
      setSaving(true);
      await updateListing(id, {
        title: formState.title.trim(),
        propertyType: formState.propertyType || listing?.propertyType || listing?.type,
        location: formState.location,
        price: Number(formState.price) || 0,
        securityDeposit: formState.securityDeposit ? Number(formState.securityDeposit) : undefined,
        bedrooms: formState.bedrooms ? Number(formState.bedrooms) : undefined,
        bathrooms: formState.bathrooms ? Number(formState.bathrooms) : undefined,
        size: formState.size ? Number(formState.size) : undefined,
        availabilityDate: formState.availabilityDate
          ? new Date(formState.availabilityDate).toISOString()
          : undefined,
        description: formState.description,
        additionalFeatures: formState.additionalFeatures,
        status: formState.status as Listing['status'],
        contactName: formState.contactName,
        contactPhone: formState.contactPhone,
        contactEmail: formState.contactEmail,
      });
      toast.success('Listing updated successfully.');
      void loadListing();
    } catch (error) {
      console.error('Failed to update listing', error);
      toast.error('We could not save your changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-6">
        <div className="max-w-xl bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Listing not found</h1>
          <p className="text-gray-600 mb-6">The listing you are trying to manage may have been removed.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-6">
        <div className="max-w-xl bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
          <Shield className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access restricted</h1>
          <p className="text-gray-600 mb-6">You do not have permission to manage this listing.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const coverImage = listing.coverPhoto || listing.photos?.[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-6 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-1 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            {coverImage ? (
              <img src={coverImage} alt={listing.title} className="w-full h-56 object-cover" />
            ) : (
              <div className="w-full h-56 bg-gray-100 flex items-center justify-center">
                <Home className="w-10 h-10 text-gray-400" />
              </div>
            )}
            <div className="p-6 space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{listing.title || 'Untitled Listing'}</h1>
                <p className="text-gray-600 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-primary-500" />
                  {listing.location || 'Location not provided'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Monthly Rent</p>
                  <p className="text-base font-semibold text-gray-900">{formatCurrency(listing.price)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Deposit</p>
                  <p className="text-base font-semibold text-gray-900">{formatCurrency(listing.securityDeposit)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 flex items-center space-x-2">
                  <Bed className="w-4 h-4 text-gray-500" />
                  <span>{listing.bedrooms ?? 0} bed</span>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 flex items-center space-x-2">
                  <Bath className="w-4 h-4 text-gray-500" />
                  <span>{listing.bathrooms ?? 0} bath</span>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 flex items-center space-x-2">
                  <Square className="w-4 h-4 text-gray-500" />
                  <span>{listing.size ?? 0} m²</span>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{formState.availabilityDate || 'Not set'}</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate(`/listing/${listing.id}`)}
                  className="flex-1 inline-flex items-center justify-center border border-gray-300 rounded-xl py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Listing
                </button>
                <button
                  onClick={() => window.open(`https://wa.me/${listing.contactPhone ?? ''}`, '_blank')}
                  className="flex-1 inline-flex items-center justify-center border border-gray-300 rounded-xl py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Contact
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-display font-bold text-gray-900">Manage Listing Details</h2>
                <p className="text-gray-600">Update your property information and contact details.</p>
              </div>
              <button
                onClick={() => loadListing()}
                className="inline-flex items-center px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Reload data
              </button>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-1">Title</span>
                  <input
                    type="text"
                    value={formState.title}
                    onChange={handleChange('title')}
                    className="input"
                    placeholder="Modern 2-bedroom apartment"
                    required
                  />
                </label>
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-1">Property Type</span>
                  <select
                    value={formState.propertyType}
                    onChange={handleChange('propertyType')}
                    className="input"
                  >
                    <option value="">Select property type</option>
                    {PROPERTY_TYPES.map(option => (
                      <option key={option} value={option.toLowerCase()}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 mb-1">Location</span>
                <input
                  type="text"
                  value={formState.location}
                  onChange={handleChange('location')}
                  className="input"
                  placeholder="e.g. Cantonments, Accra"
                  required
                />
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-1">Monthly Rent (GHS)</span>
                  <input
                    type="number"
                    min="0"
                    value={formState.price}
                    onChange={handleChange('price')}
                    className="input"
                    placeholder="2500"
                    required
                  />
                </label>
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-1">Security Deposit (optional)</span>
                  <input
                    type="number"
                    min="0"
                    value={formState.securityDeposit}
                    onChange={handleChange('securityDeposit')}
                    className="input"
                    placeholder="5000"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-1">Bedrooms</span>
                  <input
                    type="number"
                    min="0"
                    value={formState.bedrooms}
                    onChange={handleChange('bedrooms')}
                    className="input"
                  />
                </label>
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-1">Bathrooms</span>
                  <input
                    type="number"
                    min="0"
                    value={formState.bathrooms}
                    onChange={handleChange('bathrooms')}
                    className="input"
                  />
                </label>
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-1">Size (m²)</span>
                  <input
                    type="number"
                    min="0"
                    value={formState.size}
                    onChange={handleChange('size')}
                    className="input"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-1">Availability Date</span>
                  <input
                    type="date"
                    value={formState.availabilityDate}
                    onChange={handleChange('availabilityDate')}
                    className="input"
                  />
                </label>
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-1">Listing Status</span>
                  <select
                    value={formState.status}
                    onChange={handleChange('status')}
                    className="input"
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </label>
              </div>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 mb-1">Description</span>
                <textarea
                  value={formState.description}
                  onChange={handleChange('description')}
                  className="input min-h-[120px]"
                  placeholder="Describe the property, nearby amenities, policies, etc."
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 mb-1">Additional Features</span>
                <textarea
                  value={formState.additionalFeatures}
                  onChange={handleChange('additionalFeatures')}
                  className="input min-h-[80px]"
                  placeholder="Separate extras with commas e.g. Private parking, Rooftop terrace"
                />
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-1">Contact Name</span>
                  <input
                    type="text"
                    value={formState.contactName}
                    onChange={handleChange('contactName')}
                    className="input"
                    placeholder="Property manager name"
                  />
                </label>
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-1">Contact Phone</span>
                  <input
                    type="tel"
                    value={formState.contactPhone}
                    onChange={handleChange('contactPhone')}
                    className="input"
                    placeholder="e.g. +233 24 123 4567"
                  />
                </label>
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 mb-1">Contact Email</span>
                  <input
                    type="email"
                    value={formState.contactEmail}
                    onChange={handleChange('contactEmail')}
                    className="input"
                    placeholder="contact@example.com"
                  />
                </label>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900">Tip</p>
                  <p>Keep your listing information accurate. Changes may take a few minutes to appear.</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary inline-flex items-center"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EditListingPage;
