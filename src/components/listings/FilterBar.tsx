import React, { ChangeEvent } from 'react';

interface FilterBarProps {
    filters: {
        location: string;
        minPrice: string;
        maxPrice: string;
        bedrooms: string;
        type: string;
    };
    setFilters: React.Dispatch<React.SetStateAction<{
        location: string;
        minPrice: string;
        maxPrice: string;
        bedrooms: string;
        type: string;
    }>>;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters }) => {
    const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    return (
        <div className="filter-bar">
            <select name="location" onChange={handleChange}>
                <option value="">Select Location</option>
                <option value="Accra">Accra</option>
                <option value="Kumasi">Kumasi</option>
                <option value="Ho">Ho</option>
                {/* Add more locations as needed */}
            </select>

            <input
                type="number"
                name="minPrice"
                placeholder="Min Price"
                onChange={handleChange}
            />

            <input
                type="number"
                name="maxPrice"
                placeholder="Max Price"
                onChange={handleChange}
            />

            <select name="roomType" onChange={handleChange}>
                <option value="">Select Room Type</option>
                <option value="Single">Single Room</option>
                <option value="Self-contained">Self-contained</option>
                <option value="Apartment">Apartment</option>
                {/* Add more room types as needed */}
            </select>

            <button onClick={() => setFilters({
                location: '',
                minPrice: '',
                maxPrice: '',
                bedrooms: '',
                type: ''
            })}>Reset Filters</button>
        </div>
    );
};

export default FilterBar;