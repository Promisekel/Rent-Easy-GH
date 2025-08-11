import React, { useEffect, useState } from 'react';
import { getAllListings, getAllUsers, approveVerification, blockUser } from '../../services/firebase';
import ListingCard from '../listings/ListingCard';
import UserCard from './UserCard';
import { Listing } from '../../types/Listing';
import { User } from '../../types/User';

const AdminDashboard = () => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const fetchedListings = await getAllListings();
            const fetchedUsers = await getAllUsers();
            setListings(fetchedListings);
            setUsers(fetchedUsers);
        };

        fetchData();
    }, []);

    const handleApprove = async (listingId: string) => {
        await approveVerification(listingId);
        setListings(listings.filter(listing => listing.id !== listingId));
    };

    const handleBlockUser = async (userId: string) => {
        await blockUser(userId);
        setUsers(users.filter(user => user.id !== userId));
    };

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <h2>Listings</h2>
            <div className="listings-container">
                {listings.map(listing => (
                    <ListingCard 
                        key={listing.id} 
                        listing={listing} 
                        onApprove={() => handleApprove(listing.id)} 
                    />
                ))}
            </div>
            <h2>Users</h2>
            <div className="users-container">
                {users.map(user => (
                    <UserCard 
                        key={user.id} 
                        user={user} 
                        onBlock={() => handleBlockUser(user.id)} 
                    />
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;