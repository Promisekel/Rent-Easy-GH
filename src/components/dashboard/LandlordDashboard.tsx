import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import useListings from '../../hooks/useListings';
import ListingCard from '../listings/ListingCard';
import { Listing } from '../../types/Listing';

const LandlordDashboard: React.FC = () => {
    const { currentUser, userProfile } = useAuth();
    const { listings, fetchListings, deleteListing, loading, error } = useListings();

    useEffect(() => {
        if (!currentUser?.uid) {
            return;
        }

        void fetchListings(currentUser.uid);
    }, [currentUser?.uid, fetchListings]);

    const handleDelete = async (listingId: string) => {
        await deleteListing(listingId);
        if (currentUser?.uid) {
            void fetchListings(currentUser.uid);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!currentUser) {
        return <div>Please log in to view your dashboard.</div>;
    }

    if (error) {
        return <div className="error-message">Failed to load listings: {error}</div>;
    }

    const displayName = userProfile?.displayName || currentUser.displayName || currentUser.email || 'Landlord';

    return (
        <div className="landlord-dashboard">
            <h1>Welcome, {displayName}</h1>
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