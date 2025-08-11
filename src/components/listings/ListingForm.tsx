import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { uploadListing } from '../../services/firebase';
import { Listing } from '../../types/Listing';
import ImageUpload from '../common/ImageUpload';
import toast from 'react-hot-toast';

const ListingForm: React.FC = () => {
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<Listing>();
    const [loading, setLoading] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    
    const onSubmit = async (data: Listing) => {
        setLoading(true);
        
        try {
            // Include uploaded image URLs in the listing data
            const listingData = {
                ...data,
                photos: uploadedImages,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            await uploadListing(listingData);
            toast.success('Listing uploaded successfully!');
            
            // Reset form
            setUploadedImages([]);
            // You might want to redirect or reset the form here
            
        } catch (error) {
            console.error('Error uploading listing:', error);
            toast.error('Error uploading listing. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (urls: string[]) => {
        setUploadedImages(prev => [...prev, ...urls]);
        setValue('photos', [...uploadedImages, ...urls]);
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
                        Property Photos ({uploadedImages.length}/5)
                    </label>
                    <ImageUpload
                        multiple={true}
                        maxFiles={5}
                        onUploadComplete={handleImageUpload}
                        className="mb-4"
                    />
                    {uploadedImages.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-4">
                            {uploadedImages.map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`Property ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg border"
                                />
                            ))}
                        </div>
                    )}
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
                    disabled={loading || uploadedImages.length === 0}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
                >
                    {loading ? 'Uploading...' : 'Submit Listing'}
                </button>
                
                {uploadedImages.length === 0 && (
                    <p className="text-sm text-gray-500 text-center">
                        Please upload at least one photo before submitting
                    </p>
                )}
            </form>
        </div>
    );
};

export default ListingForm;