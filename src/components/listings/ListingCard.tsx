import React from 'react';
import { Listing } from '../../types/Listing';

interface ListingCardProps {
  listing: Listing;
  onContact?: (contactMethod: 'whatsapp' | 'call') => void;
  onApprove?: () => void;
  onDelete?: (listingId: string) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onContact, onApprove, onDelete }) => {
  return (
    <div className="listing-card">
      <img src={listing.photos[0]} alt={listing.title} className="listing-image" />
      <div className="listing-details">
        <h3 className="listing-title">{listing.title}</h3>
        <p className="listing-price">GHS {listing.price}</p>
        <p className="listing-location">{listing.location}</p>
        <p className="listing-amenities">
          Amenities: {listing.amenities.join(', ')}
        </p>
        <div className="flex space-x-2 mt-4">
          {onContact && (
            <>
              <button onClick={() => onContact('whatsapp')} className="contact-button bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Contact via WhatsApp
              </button>
              <button onClick={() => onContact('call')} className="contact-button bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Call Landlord
              </button>
            </>
          )}
          {onApprove && (
            <button onClick={onApprove} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Approve
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(listing.id)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingCard;