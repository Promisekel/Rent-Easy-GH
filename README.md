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
   cp .env.example .env
   ```
   Fill in your Firebase, Google Maps, and Paystack configuration.

4. **Start the development server:**
   ```bash
   npm start
   ```

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Google Maps API
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Paystack Configuration
REACT_APP_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
```

## 📁 Project Structure

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
- [ ] Firebase integration
- [ ] Authentication system
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