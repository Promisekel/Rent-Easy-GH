import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useListings from '../../hooks/useListings';
import LoadingSpinner from '../common/LoadingSpinner';
import { Listing } from '../../types/Listing';

const ListingDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { listings, loading, error } = useListings();
    const [listing, setListing] = useState<Listing | null>(null);

    useEffect(() => {
        if (id && listings.length > 0) {
            const foundListing = listings.find(l => l.id === id);
            setListing(foundListing || null);
        }
    }, [id, listings]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error || !listing) {
        return <div>Error loading listing details.</div>;
    }

    return (
        <div className="listing-details">
            <h1>{listing.title}</h1>
            {listing.photos?.[0] && <img src={listing.photos[0]} alt={listing.title} />}
            <p>Price: GHS {listing.price}</p>
            <p>Location: {listing.location}</p>
            <p>Amenities: {listing.amenities?.join(', ') || 'None specified'}</p>
            {listing.rentAdvance && <p>Rent Advance: {listing.rentAdvance} months</p>}
            {listing.buildingType && <p>Building Type: {listing.buildingType}</p>}
            <p>Security Features: {listing.securityFeatures?.join(', ') || 'None specified'}</p>
            {listing.electricityType && (
                <p>Electricity: {listing.electricityType} {listing.electricityRange && `(Range: GHS ${listing.electricityRange})`}</p>
            )}
            {listing.waterAvailability && <p>Water Availability: {listing.waterAvailability}</p>}
            {listing.noiseLevel && <p>Noise Level: {listing.noiseLevel}</p>}
            {listing.roadCondition && <p>Road Condition: {listing.roadCondition}</p>}
            {listing.landmark && <p>Landmark: {listing.landmark}</p>}
            {listing.advancePaymentNumber && (
                <p>Contact: <a href={`tel:${listing.advancePaymentNumber}`}>{listing.advancePaymentNumber}</a></p>
            )}
        </div>
    );
};

export default ListingDetails;