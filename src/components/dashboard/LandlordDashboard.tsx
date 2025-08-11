import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useListings from '../../hooks/useListings';
import ListingCard from '../listings/ListingCard';
import { Listing } from '../../types/Listing';

const LandlordDashboard: React.FC = () => {
    const { user } = useAuth();
    const { listings, fetchListings, deleteListing } = useListings();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadListings = async () => {
            await fetchListings(user?.id);
            setLoading(false);
        };

        if (user) {
            loadListings();
        }
    }, [user, fetchListings]);

    const handleDelete = async (listingId: string) => {
        await deleteListing(listingId);
        fetchListings(user?.id);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="landlord-dashboard">
            <h1>Welcome, {user?.name}</h1>
            <h2>Your Listings</h2>
            <div className="listing-cards">
                {listings.length > 0 ? (
                    listings.map((listing: Listing) => (
                        <ListingCard
                            key={listing.id}
                            listing={listing}
                            onDelete={handleDelete}
                        />
                    ))
                ) : (
                    <p>No listings found. Please add a listing.</p>
                )}
            </div>
        </div>
    );
};

export default LandlordDashboard;