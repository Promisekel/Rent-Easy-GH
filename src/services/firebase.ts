import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Listing } from '../types/Listing';
import { User } from '../types/User';

const LISTINGS_COLLECTION = 'listings';
const USERS_COLLECTION = 'users';

const toIsoString = (value: unknown): string | null => {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === 'object' && value !== null && 'toDate' in (value as Record<string, unknown>)) {
    try {
      const date = (value as { toDate: () => Date }).toDate();
      return date.toISOString();
    } catch (error) {
      console.warn('Failed to convert Firestore timestamp to ISO string', error);
    }
  }

  return null;
};

const cleanObject = (input: Record<string, unknown>): Record<string, any> => {
  return Object.entries(input).reduce<Record<string, any>>((accumulator, [key, value]) => {
    if (value === undefined || value === null) {
      return accumulator;
    }

    if (Array.isArray(value)) {
      accumulator[key] = value.filter(item => item !== undefined && item !== null);
      return accumulator;
    }

    if (typeof value === 'object' && !(value instanceof Date)) {
  const nested = cleanObject(value as Record<string, unknown>);
      if (Object.keys(nested).length > 0) {
        accumulator[key] = nested;
      }
      return accumulator;
    }

    accumulator[key] = value;
    return accumulator;
  }, {});
};

const mapListingDoc = (snapshot: QueryDocumentSnapshot<DocumentData>): Listing => {
  const data = snapshot.data() || {};
  const contact = data.contact || {};

  const geoPoint = data.geoPoint;
  const transformedGeoPoint = geoPoint && typeof geoPoint.latitude === 'number' && typeof geoPoint.longitude === 'number'
    ? { lat: geoPoint.latitude, lng: geoPoint.longitude }
    : undefined;

  return {
    id: snapshot.id,
    title: data.title ?? '',
    description: data.description ?? '',
    price: data.price ?? 0,
    rentAdvance: data.rentAdvance ?? data.rentAdvanceMonths,
    rentAdvanceMonths: data.rentAdvanceMonths ?? data.rentAdvance,
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
    size: data.size ?? data.sizeSqm,
    type: data.type,
    propertyType: data.propertyType ?? data.type,
    buildingType: data.buildingType,
    location: data.location ?? '',
    region: data.region,
    photos: data.photos ?? [],
    userId: data.userId,
    landlordId: data.landlordId,
    verified: data.verified ?? false,
    featured: data.featured ?? false,
    premium: data.premium ?? false,
    amenities: data.amenities ?? [],
    available: data.available ?? true,
    availabilityDate: data.availabilityDate,
    contactName: data.contactName ?? contact.name ?? undefined,
    contactPhone: data.contactPhone ?? contact.phone ?? undefined,
    contactEmail: data.contactEmail ?? contact.email ?? undefined,
    contactWhatsApp: data.contactWhatsApp ?? contact.whatsapp ?? undefined,
    coverPhoto: data.coverPhoto,
    securityDeposit: data.securityDeposit,
    additionalFeatures: data.additionalFeatures,
    status: data.status ?? 'pending',
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
    reportedCount: data.reportedCount ?? 0,
    landmark: data.landmark,
    securityLevel: data.securityLevel,
    securityFeatures: data.securityFeatures,
    electricityType: data.electricityType,
    electricityRange: data.electricityRange,
    waterAvailability: data.waterAvailability,
    noiseLevel: data.noiseLevel,
    roadCondition: data.roadCondition,
    category: data.category,
    geoPoint: transformedGeoPoint,
    directionsEnabled: data.directionsEnabled,
    advancePaymentNumber: data.advancePaymentNumber,
  };
};

const mapUserDoc = (snapshot: QueryDocumentSnapshot<DocumentData>): User => {
  const data = snapshot.data() || {};

  return {
    id: snapshot.id,
    name: data.displayName ?? data.name ?? '',
    email: data.email ?? '',
    role: data.role ?? 'renter',
    verified: data.verified ?? false,
    favorites: data.favorites ?? [],
    photoURL: data.photoURL,
    phone: data.phone ?? data.contactPhone,
    status: data.status ?? 'active',
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
  };
};

const fallbackOrderQuery = async (collectionName: string): Promise<QueryDocumentSnapshot<DocumentData>[]> => {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs;
};

export const getListings = async (): Promise<Listing[]> => {
  try {
    const listingsRef = collection(db, LISTINGS_COLLECTION);
    const listingsQuery = query(listingsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(listingsQuery);
    return snapshot.docs.map(mapListingDoc);
  } catch (error) {
    console.warn('Falling back to unordered listings fetch', error);
    const docs = await fallbackOrderQuery(LISTINGS_COLLECTION);
    return docs.map(mapListingDoc);
  }
};

export const getAllListings = async (): Promise<Listing[]> => {
  return getListings();
};

export const uploadListing = async (
  listingData: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'> & Record<string, unknown>
): Promise<string> => {
  const {
    id,
    createdAt,
    updatedAt,
    contactName,
    contactPhone,
    contactEmail,
    contactWhatsApp,
    ...rest
  } = listingData;

  const { contact, ...restWithoutContact } = rest;
  const existingContact = (contact as Record<string, unknown> | undefined) ?? {};

  const payload: Record<string, unknown> = {
    ...restWithoutContact,
    status: (restWithoutContact.status as string) ?? 'pending',
    contact: cleanObject({
      ...existingContact,
      name: contactName ?? existingContact.name,
      phone: contactPhone ?? existingContact.phone,
      email: contactEmail ?? existingContact.email,
      whatsapp: contactWhatsApp ?? existingContact.whatsapp,
    }),
  };

  const sanitizedPayload = cleanObject(payload);

  const docRef = await addDoc(collection(db, LISTINGS_COLLECTION), {
    ...sanitizedPayload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
};

export const updateListing = async (
  listingId: string,
  updates: Partial<Omit<Listing, 'id'>> & Record<string, unknown>
): Promise<void> => {
  const { contactName, contactPhone, contactEmail, contactWhatsApp, ...rest } = updates;

  const { contact, ...restWithoutContact } = rest;
  const existingContact = (contact as Record<string, unknown> | undefined) ?? {};

  const payload: Record<string, unknown> = {
    ...restWithoutContact,
    contact: cleanObject({
      ...existingContact,
      name: contactName ?? existingContact.name,
      phone: contactPhone ?? existingContact.phone,
      email: contactEmail ?? existingContact.email,
      whatsapp: contactWhatsApp ?? existingContact.whatsapp,
    }),
    updatedAt: serverTimestamp(),
  };

  const sanitizedPayload = cleanObject(payload);

  await updateDoc(doc(db, LISTINGS_COLLECTION, listingId), sanitizedPayload);
};

export const deleteListing = async (listingId: string): Promise<void> => {
  await deleteDoc(doc(db, LISTINGS_COLLECTION, listingId));
};

export const getListingById = async (listingId: string): Promise<Listing | null> => {
  try {
    const snapshot = await getDoc(doc(db, LISTINGS_COLLECTION, listingId));
    if (!snapshot.exists()) {
      return null;
    }
    return mapListingDoc(snapshot as unknown as QueryDocumentSnapshot<DocumentData>);
  } catch (error) {
    console.error('Error fetching listing by id:', error);
    throw error;
  }
};

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const snapshot = await getDoc(doc(db, USERS_COLLECTION, userId));
    if (!snapshot.exists()) {
      return null;
    }
    return mapUserDoc(snapshot as unknown as QueryDocumentSnapshot<DocumentData>);
  } catch (error) {
    console.error('Error fetching user by id:', error);
    throw error;
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const usersQuery = query(usersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(usersQuery);
    return snapshot.docs.map(mapUserDoc);
  } catch (error) {
    console.warn('Falling back to unordered users fetch', error);
    const docs = await fallbackOrderQuery(USERS_COLLECTION);
    return docs.map(mapUserDoc);
  }
};

export const approveVerification = async (listingId: string): Promise<void> => {
  await updateDoc(doc(db, LISTINGS_COLLECTION, listingId), {
    verified: true,
    status: 'active',
    updatedAt: serverTimestamp(),
  });
};

export const blockUser = async (userId: string): Promise<void> => {
  await updateDoc(doc(db, USERS_COLLECTION, userId), {
    status: 'blocked',
    updatedAt: serverTimestamp(),
  });
};