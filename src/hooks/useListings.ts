import { useState, useEffect } from 'react';
import { Listing } from '../types/Listing';
import { getListings } from '../services/firebase';

export const useListings = () => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch listings from Firebase mock service
                const fetchedListings = await getListings();
                setListings(fetchedListings);
            } catch (err) {
                console.error('Error fetching listings:', err);
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
            // Fetch all listings
            const allListings = await getListings();
            
            // Filter by userId if provided
            let filteredListings = allListings;
            if (userId) {
                filteredListings = allListings.filter((listing: Listing) => listing.userId === userId);
            }

            setListings(filteredListings);
        } catch (err) {
            console.error('Error fetching listings:', err);
            setError('Failed to fetch listings');
        } finally {
            setLoading(false);
        }
    };

    const addListing = async (listing: Omit<Listing, 'id' | 'createdAt'>) => {
        try {
            const newListing: Listing = {
                ...listing,
                id: Date.now().toString(),
                createdAt: new Date().toISOString()
            };
            setListings(prev => [...prev, newListing]);
            return newListing;
        } catch (err) {
            console.error('Error adding listing:', err);
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
            console.error('Error updating listing:', err);
            setError('Failed to update listing');
            throw err;
        }
    };

    const deleteListing = async (id: string) => {
        try {
            setListings(prev => prev.filter(listing => listing.id !== id));
        } catch (err) {
            console.error('Error deleting listing:', err);
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
