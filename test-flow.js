// Test file to verify the integration
import { getListings, uploadListing } from './src/services/firebase';

const testFlow = async () => {
    console.log('🧪 Testing the listing flow...');
    
    try {
        // Test 1: Check initial listings
        console.log('\n1️⃣ Fetching initial listings...');
        const initialListings = await getListings();
        console.log(`Found ${initialListings.length} listings`);
        console.log('Sample listing:', initialListings[0]?.title || 'None');
        
        // Test 2: Add a new listing
        console.log('\n2️⃣ Adding a new test listing...');
        const newListing = {
            title: 'Test Property',
            description: 'A test property for verification',
            price: 1000,
            location: 'Test Location',
            bedrooms: 2,
            bathrooms: 1,
            size: 80,
            type: 'apartment' as const,
            buildingType: 'Apartment',
            photos: ['test-photo.jpg'],
            userId: 'test-user-123',
            landlordId: 'test-user-123',
            verified: false,
            featured: false,
            premium: false,
            amenities: ['wifi'],
            available: true,
            reportedCount: 0,
            landmark: 'Test Landmark',
            securityLevel: 'High' as const,
            securityFeatures: ['Security Guard'],
            electricityType: 'Prepaid' as const,
            electricityRange: '50-100 GHS/month',
            waterAvailability: 'Regular' as const,
            noiseLevel: 'Low' as const,
            roadCondition: 'Paved' as const,
            category: 'Residential',
            geoPoint: { lat: 5.6037, lng: -0.1870 },
            directionsEnabled: true
        };
        
        await uploadListing(newListing);
        console.log('✅ New listing added successfully');
        
        // Test 3: Verify the new listing appears
        console.log('\n3️⃣ Verifying new listing appears in getListings...');
        const updatedListings = await getListings();
        console.log(`Now found ${updatedListings.length} listings`);
        
        const testListing = updatedListings.find(l => l.title === 'Test Property');
        if (testListing) {
            console.log('✅ Test listing found in results');
            console.log('Listing ID:', testListing.id);
            console.log('User ID:', testListing.userId);
        } else {
            console.log('❌ Test listing not found');
        }
        
        console.log('\n🎉 Flow test completed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
};

testFlow();
