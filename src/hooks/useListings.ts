import { useEffect, useState } from 'react';
import { Listing } from '../types/Listing';

const useListings = () => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                setLoading(true);
                // Mock listings data
                const mockListings: Listing[] = [
                    {
                        id: '1',
                        title: 'Modern 2-Bedroom Apartment in East Legon',
                        description: 'Beautiful modern apartment with stunning views',
                        price: 2500,
                        rentAdvance: 5000,
                        location: 'East Legon, Accra',
                        bedrooms: 2,
                        bathrooms: 2,
                        size: 75,
                        type: 'apartment',
                        buildingType: 'Apartment',
                        photos: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'],
                        userId: 'landlord-1',
                        landlordId: 'landlord-1',
                        verified: true,
                        featured: true,
                        premium: false,
                        amenities: ['wifi', 'parking', 'security'],
                        available: true,
                        createdAt: new Date().toISOString(),
                        reportedCount: 0,
                        landmark: 'Near A&C Mall',
                        securityLevel: 'High' as const,
                        securityFeatures: ['24/7 Security', 'CCTV'],
                        electricityType: 'Prepaid' as const,
                        electricityRange: '50-100 GHS/month',
                        waterAvailability: 'Regular' as const,
                        noiseLevel: 'Quiet' as const,
                        roadCondition: 'Tiled' as const,
                        category: 'Residential',
                        geoPoint: { lat: 5.6037, lng: -0.1870 },
                        directionsEnabled: true,
                    },
                    {
                        id: '2',
                        title: 'Luxury Studio in Cantonments',
                        description: 'Furnished studio apartment in prime location',
                        price: 1800,
                        rentAdvance: 3600,
                        location: 'Cantonments, Accra',
                        bedrooms: 1,
                        bathrooms: 1,
                        size: 45,
                        type: 'studio',
                        buildingType: 'Studio',
                        photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'],
                        userId: 'landlord-2',
                        landlordId: 'landlord-2',
                        verified: false,
                        featured: false,
                        premium: false,
                        amenities: ['wifi', 'ac', 'security'],
                        available: true,
                        createdAt: new Date().toISOString(),
                        reportedCount: 0,
                        landmark: 'Near Embassy',
                        securityLevel: 'Moderate' as const,
                        securityFeatures: ['Security Guard'],
                        electricityType: 'Postpaid' as const,
                        electricityRange: '100-150 GHS/month',
                        waterAvailability: 'Regular' as const,
                        noiseLevel: 'Moderate' as const,
                        roadCondition: 'Tiled' as const,
                        category: 'Residential',
                        geoPoint: { lat: 5.5502, lng: -0.2174 },
                        directionsEnabled: true,
                    }
                ];

                // Simulate API delay
                setTimeout(() => {
                    setListings(mockListings);
                    setLoading(false);
                }, 1000);
            } catch (err) {
                setError('Failed to fetch listings');
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    const fetchListings = async (userId?: string): Promise<void> => {
        setLoading(true);
        setError(null);
        
        try {
            // Mock fetch - filter by userId if provided
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            let filteredListings = listings;
            if (userId) {
                filteredListings = listings.filter((listing: Listing) => listing.userId === userId);
            }
            
            setListings(filteredListings);
        } catch (err) {
            setError('Failed to fetch listings');
        } finally {
            setLoading(false);
        }
    };

    const addListing = async (listingData: Omit<Listing, 'id' | 'createdAt'>) => {
        try {
            const newListing: Listing = {
                ...listingData,
                id: Date.now().toString(),
                createdAt: new Date().toISOString()
            };
            setListings(prev => [...prev, newListing]);
            return newListing;
        } catch (err) {
            setError('Failed to add listing');
            throw err;
        }
    };

    const updateListing = async (id: string, updates: Partial<Listing>) => {
        try {
            setListings(prev => prev.map(listing => 
                listing.id === id ? { ...listing, ...updates } : listing
            ));
        } catch (err) {
            setError('Failed to update listing');
            throw err;
        }
    };

    const deleteListing = async (id: string) => {
        try {
            setListings(prev => prev.filter(listing => listing.id !== id));
        } catch (err) {
            setError('Failed to delete listing');
            throw err;
        }
    };

    return {
        listings,
        loading,
        error,
        fetchListings,
        addListing,
        updateListing,
        deleteListing
    };
};

export default useListings;