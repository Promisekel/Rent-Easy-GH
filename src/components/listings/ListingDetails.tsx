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
            <img src={listing.photos[0]} alt={listing.title} />
            <p>Price: GHS {listing.price}</p>
            <p>Location: {listing.location}</p>
            <p>Amenities: {listing.amenities.join(', ')}</p>
            <p>Rent Advance: {listing.rentAdvance} months</p>
            <p>Building Type: {listing.buildingType}</p>
            <p>Security Features: {listing.securityFeatures.join(', ')}</p>
            <p>Electricity: {listing.electricityType} (Range: GHS {listing.electricityRange})</p>
            <p>Water Availability: {listing.waterAvailability}</p>
            <p>Noise Level: {listing.noiseLevel}</p>
            <p>Road Condition: {listing.roadCondition}</p>
            <p>Landmark: {listing.landmark}</p>
            <p>Contact: <a href={`tel:${listing.advancePaymentNumber}`}>{listing.advancePaymentNumber}</a></p>
        </div>
    );
};

export default ListingDetails;