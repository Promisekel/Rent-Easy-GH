import { User } from '../types/User';
import { Listing } from '../types/Listing';

// Mock Firebase service for development
let mockUser: User | null = null;

// Mock listings data with correct properties
let mockListings: Listing[] = [
  {
    id: '1',
    title: 'Modern 2BR Apartment in East Legon',
    description: 'Beautiful modern apartment with all amenities in prime location.',
    price: 1500,
    rentAdvance: 3000,
    bedrooms: 2,
    bathrooms: 2,
    size: 75,
    type: 'apartment',
    buildingType: 'Apartment',
    location: 'East Legon, Accra',
    photos: ['/api/placeholder/400/300'],
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'],
    userId: 'user1',
    landlordId: 'user1',
    verified: true,
    featured: true,
    premium: false,
    amenities: ['WiFi', 'AC', 'Parking', 'Security'],
    available: true,
    createdAt: new Date(),
    reportedCount: 0,
    landmark: 'Near A&C Mall',
    securityLevel: 'High' as const,
    securityFeatures: ['24/7 Security', 'CCTV', 'Access Control'],
    electricityType: 'Prepaid' as const,
    electricityRange: '50-100 GHS/month',
    waterAvailability: 'Regular' as const,
    noiseLevel: 'Quiet' as const,
    roadCondition: 'Tiled' as const,
    category: 'Residential',
    geoPoint: { lat: 5.6037, lng: -0.1870 },
    directionsEnabled: true,
  }
];

// Mock Auth Service
export const auth = {
  currentUser: mockUser,
  signInWithEmailAndPassword: async (email: string, password: string): Promise<{ user: User }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'test@example.com' && password === 'password') {
      const user: User = {
        id: 'user1',
        email,
        name: 'Test User',
        role: 'renter',
        verified: true,
        favorites: [],
        createdAt: new Date(),
      };
      mockUser = user;
      return { user };
    }
    
    throw new Error('Invalid credentials');
  },
  
  createUserWithEmailAndPassword: async (email: string, password: string): Promise<{ user: User }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: `user_${Date.now()}`,
      email,
      name: email.split('@')[0],
      role: 'renter',
      verified: false,
      favorites: [],
      createdAt: new Date(),
    };
    
    mockUser = user;
    return { user };
  },
  
  signOut: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    mockUser = null;
  },
  
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    // Simulate auth state change
    setTimeout(() => callback(mockUser), 100);
    
    // Return unsubscribe function
    return () => {};
  }
};

// Mock Firestore Service
export const firestore = {
  collection: (name: string) => ({
    add: async (data: any) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { id: `${name}_${Date.now()}` };
    },
    
    get: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (name === 'listings') {
        return {
          docs: mockListings.map(listing => ({
            id: listing.id,
            data: () => listing
          }))
        };
      }
      
      return { docs: [] };
    },
    
    doc: (id: string) => ({
      get: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (name === 'listings') {
          const listing = mockListings.find(l => l.id === id);
          return {
            exists: !!listing,
            data: () => listing
          };
        }
        
        return { exists: false };
      },
      
      update: async (data: any) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (name === 'listings') {
          const index = mockListings.findIndex(l => l.id === id);
          if (index !== -1) {
            mockListings[index] = { ...mockListings[index], ...data };
          }
        }
      },
      
      delete: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (name === 'listings') {
          const index = mockListings.findIndex(l => l.id === id);
          if (index !== -1) {
            mockListings.splice(index, 1);
          }
        }
      }
    })
  })
};

// Mock Storage Service
export const storage = {
  ref: (path: string) => ({
    put: async (file: File) => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return {
        ref: {
          getDownloadURL: async () => {
            return `/api/placeholder/400/300?filename=${file.name}`;
          }
        }
      };
    }
  })
};

// Service functions
export const getAllListings = async (): Promise<Listing[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockListings;
};

export const getAllUsers = async (): Promise<User[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const mockUsers: User[] = [
    {
      id: 'user1',
      name: 'John Landlord',
      email: 'john@example.com',
      role: 'landlord',
      verified: true,
      favorites: [],
      createdAt: new Date()
    },
    {
      id: 'user2', 
      name: 'Jane Renter',
      email: 'jane@example.com',
      role: 'renter',
      verified: false,
      favorites: ['1'],
      createdAt: new Date()
    }
  ];
  return mockUsers;
};

export const uploadListing = async (listingData: Omit<Listing, 'id' | 'createdAt'>): Promise<string> => {
  const newListing: Listing = {
    ...listingData,
    id: `listing_${Date.now()}`,
    createdAt: new Date()
  };
  mockListings.push(newListing);
  return newListing.id;
};

export const approveVerification = async (listingId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const listing = mockListings.find(l => l.id === listingId);
  if (listing) {
    listing.verified = true;
  }
};

export const blockUser = async (userId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log(`Blocking user ${userId}`);
  // In a real app, this would update the user's status in the database
};