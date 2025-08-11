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