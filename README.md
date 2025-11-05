# Ghana Rental Platform - RentEasy GH

An automated, scalable web platform where landlords in Ghana can upload rooms/apartments for rent, and renters can browse, contact landlords, and filter by location, price, and features.

## 🌟 Features

### For Landlords
- Register/Login with Firebase Auth
- Upload listing with photos, price, description, location, amenities
- Indicate rent advance required and building type
- Pay to feature listings (Paystack integration)
- Upload Ghana Card for verification
- Add nearby landmarks and security features
- Manage listings from dashboard

### For Renters
- Browse all listings without login
- Filter by location, price, amenities, security level
- Contact landlords via WhatsApp/call
- View directions with Google Maps
- Save listings to favorites
- Report suspicious listings

### For Admin
- View and manage all listings
- Approve verifications
- Monitor featured listing payments
- Handle reported listings
- Block/ban scammers

## 🚀 Tech Stack

- **Frontend:** React 18 with TypeScript
- **Styling:** Tailwind CSS + Framer Motion
- **Backend:** Firebase Functions
- **Database:** Firebase Firestore
- **Storage:** Firebase Storage
- **Authentication:** Firebase Auth
- **Payment:** Paystack
- **Maps:** Google Maps API
- **Hosting:** Firebase Hosting / Vercel

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ghana-rental-platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Update `.env.local` with your Firebase, Google Maps, Paystack, and Cloudinary credentials (see below).

4. **Start the development server:**
   ```bash
   npm start
   ```

## 🧪 Local Verification

- `npm start` launches the Create React App dev server with hot reloading so you can exercise signup, login, Google auth, and listing flows against your configured Firebase project in real time.
- `npm run build` compiles a production bundle and validates the TypeScript configuration; run this before deploying.
- If you use Firebase emulators locally, point the SDKs to the emulator hosts before running the app (not yet wired by default).

## 🔧 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Configuration (required)
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Optional: Firebase measurement id (if Analytics is enabled)
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Cloudinary (for image uploads)
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=rental_images

# Google Maps API
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Paystack Configuration
REACT_APP_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
```

## � Firebase Setup

1. **Create a Firebase project** and register a Web App to obtain the configuration keys above.
2. **Enable Authentication** under *Build → Authentication*:
    - Turn on *Email/Password* sign-in.
    - Turn on *Google* sign-in and add the OAuth redirect URIs (`http://localhost:3000`, production domains).
3. **Enable Cloud Firestore** in *Firestore Database* (use production or test mode as appropriate). The current app uses these collections:
    - `users` – profile metadata written automatically on first sign-in.
    - `listings` – property listings created via landlord workflows.
    - `user_activities` and `user_images` – created on demand for activity logging and media uploads.
4. **Example Firestore security rules:**
    ```
    rules_version = '2';
    service cloud.firestore {
       match /databases/{database}/documents {
          match /users/{uid} {
             allow read: if request.auth != null;
             allow write: if request.auth != null && request.auth.uid == uid;
          }

          match /listings/{id} {
             allow read: if true;
             allow create: if request.auth != null;
             allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
          }

          match /user_images/{id} {
             allow read: if request.auth != null;
             allow write: if request.auth != null && request.auth.uid == request.resource.data.uid;
          }

          match /user_activities/{id} {
             allow read, write: if request.auth != null;
          }
       }
    }
    ```
    Adjust these rules to match your security requirements before going live.
5. **Enable Firebase Storage** if you plan to store assets there (Cloudinary remains the default image host). Update storage rules to allow authenticated uploads as needed.

## 🧱 Firestore Data Model

### `users` collection

```json
{
   "uid": "firebase-auth-uid",
   "email": "user@example.com",
   "displayName": "Jane Doe",
   "photoURL": "https://...",
   "provider": "google.com" | "password",
   "role": "renter" | "landlord" | "admin",
   "verified": false,
   "createdAt": "ISO timestamp",
   "updatedAt": "ISO timestamp"
}
```

### `listings` collection

```json
{
   "title": "Modern 2-Bedroom Apartment",
   "price": 2500,
   "location": "East Legon, Accra",
   "photos": ["https://..."],
   "coverPhoto": "https://...",
   "amenities": ["wifi", "parking"],
   "status": "pending" | "active" | "archived",
   "userId": "uid",
   "landlordId": "uid",
   "contact": {
      "name": "Jane Doe",
      "phone": "+233123456789",
      "email": "contact@example.com"
   },
   "createdAt": "ISO timestamp",
   "updatedAt": "ISO timestamp"
}
```

Additional fields such as `rentAdvance`, `availabilityDate`, `securityFeatures`, `geoPoint`, and `reportedCount` are optional and populated when the UI captures that data.

## 🔑 Authentication Flow

- The app wraps the router with `AuthProvider` (`src/context/AuthContext.tsx`).
- Email/password signup uploads optional profile images to Cloudinary, persists the Firebase Auth profile, and writes a Firestore `users/{uid}` document.
- Google sign-in is supported via Firebase Auth and the profile is normalised into Firestore on first login.
- Components consume authentication data through the `useAuth()` hook, which now exposes `currentUser`, the Firestore-backed `userProfile`, and helpers such as `login`, `signup`, `loginWithGoogle`, `logout`, `resetPassword`, and `refreshUserProfile`.
- Dashboards and media upload flows refresh profile data without reloading the page.
## �📁 Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── common/         # Shared components
│   ├── dashboard/      # Dashboard components
│   └── listings/       # Listing-related components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── styles/             # CSS and styling
├── assets/             # Images, icons, etc.
└── context/            # React context providers
```

## 🎨 Design System

The platform uses a modern, mobile-first design with:
- **Primary Colors:** Blue (#0ea5e9) for trust and safety
- **Secondary Colors:** Green (#22c55e) for success and verification
- **Accent Colors:** Yellow (#f59e0b) for featured content
- **Typography:** Inter for body text, Poppins for headings

## 🛠️ Development Roadmap

### Phase 1 (MVP) - Current
- [x] Project setup with React + Tailwind + Framer Motion
- [x] Firebase integration
- [x] Authentication system
- [ ] Listing management
- [ ] Browse and filter listings
- [ ] Contact system
- [ ] Admin dashboard

### Phase 2 (Future)
- [ ] Payment integration
- [ ] Mobile app
- [ ] Advanced features

## 🚀 Deployment

### Vercel Deployment

This project is configured for deployment on Vercel. Follow these steps:

1. **Fork/Clone this repository**

2. **Set up Cloudinary (for image uploads):**
   - Create a free Cloudinary account at [cloudinary.com](https://cloudinary.com)
   - Create an unsigned upload preset named `rental_images`
   - Get your Cloud Name, API Key, and API Secret from the dashboard

3. **Set up environment variables in Vercel:**
   ```bash
   # Firebase Configuration
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
   
   # Cloudinary Configuration
   REACT_APP_CLOUDINARY_CLOUD_NAME=dwwbegf2y
   REACT_APP_CLOUDINARY_API_KEY=416313624663736
   REACT_APP_CLOUDINARY_API_SECRET=hyJxqiguS3y0IZjaodpT-BR43DU
   REACT_APP_CLOUDINARY_UPLOAD_PRESET=rental_images
   
   # Google Maps API
   REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   
   # Paystack Configuration
   REACT_APP_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
   ```

4. **Deploy to Vercel:**
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect this as a Create React App project
   - The `vercel.json` configuration will handle the build and deployment

5. **Build Configuration:**
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Promisekel/Rent-Easy-GH.git
   cd Rent-Easy-GH
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Fill in your actual API keys and credentials

4. **Start the development server:**
   ```bash
   npm start
   ```

### 📋 Setup Guides
- [Cloudinary Setup Guide](./CLOUDINARY_SETUP.md) - Detailed instructions for setting up image uploads

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@renteasygh.com or join our community chat.