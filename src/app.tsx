import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import BrowseListingsPage from './pages/BrowseListingsPage';
import ListingDetailsPage from './pages/ListingDetailsPage';
import AddListingPage from './pages/AddListingPage';
import DashboardPage from './pages/DashboardPage';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import ContactPage from './pages/ContactPage';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import AppLoader from './components/common/AppLoader';
import AuthForm from './components/auth/AuthForm';
import LoginForm from './components/auth/LoginForm';
import UserProfile from './components/auth/UserProfile';
import CloudinaryUploadTest from './components/CloudinaryUploadTest';
import CloudinaryDiagnostic from './components/CloudinaryDiagnostic';
import CloudinaryQuickTest from './components/CloudinaryQuickTest';
import CloudinaryDirectTest from './components/CloudinaryDirectTest';
import CloudinaryPresetTester from './components/CloudinaryPresetTester';
import CloudinarySignedUpload from './components/CloudinarySignedUpload';
import { AuthProvider, useAuth } from './context/AuthContext';
import './styles/globals.css';

const AppContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showApp, setShowApp] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { currentUser } = useAuth();

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setShowApp(true);
    }, 300);
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
  };

  const handleShowAuth = () => {
    setShowAuth(true);
  };

  const handleLogout = () => {
    setShowAuth(false);
  };

  // Show app loader first
  if (isLoading) {
    return <AppLoader onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <Router>
      {/* Show auth form if requested and not logged in */}
      {showAuth && !currentUser && (
        <AuthForm onSuccess={handleAuthSuccess} />
      )}

      {/* Show user profile if logged in and auth was requested */}
      {showAuth && currentUser && (
        <UserProfile onLogout={handleLogout} />
      )}

      {/* Show main app */}
      {!showAuth && (
        <div className={`min-h-screen flex flex-col transition-opacity duration-500 ${showApp ? 'opacity-100' : 'opacity-0'}`}>
          <Header onAuthClick={handleShowAuth} />
          <main className="flex-1 pt-24">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/browse" element={<BrowseListingsPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/listing/:id" element={<ListingDetailsPage />} />
              <Route path="/add-listing" element={<AddListingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/my-dashboard" element={<Dashboard />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/test-cloudinary" element={<CloudinaryUploadTest />} />
              <Route path="/cloudinary-diagnostic" element={<CloudinaryDiagnostic />} />
              <Route path="/cloudinary-quick-test" element={<CloudinaryQuickTest />} />
              <Route path="/cloudinary-direct-test" element={<CloudinaryDirectTest />} />
              <Route path="/cloudinary-preset-tester" element={<CloudinaryPresetTester />} />
              <Route path="/cloudinary-signed-upload" element={<CloudinarySignedUpload />} />
            </Routes>
          </main>
          <Footer />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      )}
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;