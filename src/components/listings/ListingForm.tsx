import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { uploadListing } from '../../services/firebase';
import { Listing } from '../../types/Listing';
import ListingImageUploader from './ListingImageUploader';
import toast from 'react-hot-toast';

interface ListingImage {
  id: string;
  url: string;
  publicId: string;
  width: number;
  height: number;
  bytes: number;
  isCover: boolean;
}

const ListingForm: React.FC = () => {
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<Listing>();
    const [loading, setLoading] = useState(false);
    const [listingImages, setListingImages] = useState<ListingImage[]>([]);
    const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
    
    const onSubmit = async (data: Listing) => {
        setLoading(true);
        
        try {
            // Include uploaded image URLs in the listing data
            const listingData = {
                ...data,
                photos: listingImages.map(img => img.url),
                coverPhoto: coverImageUrl ?? undefined,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            await uploadListing(listingData);
            toast.success('Listing uploaded successfully!');
            
            // Reset form
            setListingImages([]);
            setCoverImageUrl(null);
            // You might want to redirect or reset the form here
            
        } catch (error) {
            console.error('Error uploading listing:', error);
            toast.error('Error uploading listing. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleImagesChange = (images: ListingImage[]) => {
        setListingImages(images);
        setValue('photos', images.map(img => img.url));
    };

    const handleCoverImageChange = (url: string | null) => {
        setCoverImageUrl(url);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Listing</h2>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input 
                        {...register('title', { required: 'Title is required' })} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter listing title"
                    />
                    {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (GHS)</label>
                    <input 
                        type="number" 
                        {...register('price', { required: 'Price is required', min: 1 })} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter monthly rent price"
                    />
                    {errors.price && <span className="text-red-500 text-sm">{errors.price.message}</span>}
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input 
                        {...register('location', { required: 'Location is required' })} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter location (e.g., East Legon, Accra)"
                    />
                    {errors.location && <span className="text-red-500 text-sm">{errors.location.message}</span>}
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea 
                        {...register('description')} 
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe your property..."
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                    <input 
                        {...register('amenities')} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., WiFi, Kitchen, Parking, A/C (comma separated)"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Photos ({listingImages.length}/10)
                    </label>
                    <ListingImageUploader
                        onImagesChange={handleImagesChange}
                        onCoverImageChange={handleCoverImageChange}
                        maxFiles={10}
                        allowReorder={true}
                        showImageInfo={true}
                        className="mb-4"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rent Advance (months)</label>
                    <input 
                        type="number" 
                        {...register('rentAdvance', { min: 0, max: 24 })} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Number of months advance required"
                    />
                </div>
                
                <button 
                    type="submit" 
                    disabled={loading || listingImages.length === 0}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
                >
                    {loading ? 'Uploading...' : 'Submit Listing'}
                </button>
                
                {listingImages.length === 0 && (
                    <p className="text-sm text-gray-500 text-center">
                        Please upload at least one photo before submitting
                    </p>
                )}
            </form>
        </div>
    );
};

export default ListingForm;