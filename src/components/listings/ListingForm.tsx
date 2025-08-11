import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { uploadListing } from '../../services/firebase';
import { Listing } from '../../types/Listing';

const ListingForm: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<Listing>();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const onSubmit = async (data: Listing) => {
        setLoading(true);
        setMessage('');
        try {
            await uploadListing(data);
            setMessage('Listing uploaded successfully!');
        } catch (error) {
            setMessage('Error uploading listing. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2>Add New Listing</h2>
            {message && <p>{message}</p>}
            <div>
                <label>Title</label>
                <input {...register('title', { required: true })} />
                {errors.title && <span>This field is required</span>}
            </div>
            <div>
                <label>Price</label>
                <input type="number" {...register('price', { required: true })} />
                {errors.price && <span>This field is required</span>}
            </div>
            <div>
                <label>Location</label>
                <input {...register('location', { required: true })} />
                {errors.location && <span>This field is required</span>}
            </div>
            <div>
                <label>Amenities</label>
                <input {...register('amenities')} />
            </div>
            <div>
                <label>Photos</label>
                <input type="file" {...register('photos')} multiple />
            </div>
            <div>
                <label>Rent Advance</label>
                <input type="number" {...register('rentAdvance')} />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Uploading...' : 'Submit Listing'}
            </button>
        </form>
    );
};

export default ListingForm;