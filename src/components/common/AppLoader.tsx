import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Heart, MapPin, Star } from 'lucide-react';

interface AppLoaderProps {
  onLoadingComplete: () => void;
}

const AppLoader: React.FC<AppLoaderProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);

  const loadingMessages = [
    "Welcome to Ghana's premier rental platform...",
    "Connecting you with verified landlords...",
    "Preparing your perfect home search...",
    "Almost ready to find your dream home!"
  ];

  const inspirationalQuotes = [
    "Home is where your story begins 🏡",
    "Every journey starts with finding the right place 🌟",
    "Your perfect home in Ghana awaits you 🇬🇭",
    "Welcome home to endless possibilities ✨"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => onLoadingComplete(), 500);
          return 100;
        }
        return prevProgress + 2;
      });
    }, 60);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  useEffect(() => {
    const messageTimer = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % loadingMessages.length);
    }, 1500);

    return () => clearInterval(messageTimer);
  }, [loadingMessages.length]);

  const floatingVariants = {
    animate: {
      y: [-20, 20, -20],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50"
      >
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="absolute top-20 left-20 w-32 h-32 rounded-full bg-gradient-to-br from-primary-200 to-primary-300 opacity-30"
          />
          <motion.div
            variants={floatingVariants}
            animate="animate"
            style={{ animationDelay: '1s' }}
            className="absolute top-40 right-32 w-24 h-24 rounded-full bg-gradient-to-br from-secondary-200 to-secondary-300 opacity-30"
          />
          <motion.div
            variants={floatingVariants}
            animate="animate"
            style={{ animationDelay: '2s' }}
            className="absolute bottom-32 left-1/3 w-20 h-20 rounded-full bg-gradient-to-br from-accent-200 to-accent-300 opacity-30"
          />
          <motion.div
            variants={floatingVariants}
            animate="animate"
            style={{ animationDelay: '0.5s' }}
            className="absolute bottom-20 right-20 w-16 h-16 rounded-full bg-gradient-to-br from-primary-300 to-secondary-300 opacity-30"
          />
        </div>

        <div className="relative z-10 text-center max-w-md mx-auto px-6">
          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <motion.div
                variants={pulseVariants}
                animate="animate"
                className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center text-white shadow-2xl mx-auto"
              >
                <Home className="w-12 h-12" />
              </motion.div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-500 rounded-full flex items-center justify-center"
              >
                <Star className="w-4 h-4 text-white" />
              </motion.div>
            </div>
          </motion.div>

          {/* Brand Name */}
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl font-display font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4"
          >
            RentEasy GH
          </motion.h1>

          {/* Inspirational Quote */}
          <motion.div
            key={currentMessage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <p className="text-lg text-primary-700 font-medium mb-2">
              {inspirationalQuotes[currentMessage]}
            </p>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{loadingMessages[currentMessage]}</span>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Loading</span>
              <span className="text-sm font-medium text-primary-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary-500 via-primary-400 to-secondary-500 rounded-full relative overflow-hidden"
              >
                {/* Shimmer Effect */}
                <motion.div
                  animate={{ x: [-100, 400] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent transform skew-x-12"
                />
              </motion.div>
            </div>
          </div>

          {/* Loading Icons */}
          <div className="flex items-center justify-center space-x-6">
            {[Home, Heart, MapPin, Star].map((Icon, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ 
                  scale: progress > (index + 1) * 25 ? 1.2 : 0.8,
                  opacity: progress > (index + 1) * 25 ? 1 : 0.5
                }}
                transition={{ duration: 0.3 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  progress > (index + 1) * 25 
                    ? 'bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </motion.div>
            ))}
          </div>

          {/* Footer Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-xs text-gray-500 mt-8"
          >
            Preparing your amazing rental experience...
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AppLoader;
