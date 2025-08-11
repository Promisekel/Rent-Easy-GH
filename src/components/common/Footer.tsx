import React from 'react';
import { motion } from 'framer-motion';
import { Home, Twitter, Facebook, Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const socialLinks = [
    { icon: Twitter, href: '#', color: 'hover:text-blue-400' },
    { icon: Facebook, href: '#', color: 'hover:text-blue-600' },
    { icon: Instagram, href: '#', color: 'hover:text-pink-500' }
  ];

  const footerLinks = {
    renters: [
      'Browse Listings',
      'Search by Location', 
      'Saved Favorites',
      'Renter Guide',
      'Virtual Tours'
    ],
    landlords: [
      'Post a Listing',
      'Feature Your Property',
      'Get Verified',
      'Landlord Dashboard',
      'Premium Plans'
    ],
    support: [
      'Contact Us',
      'FAQ',
      'Safety Tips',
      'Report a Problem',
      'Help Center'
    ],
    company: [
      'About Us',
      'Our Story',
      'Careers',
      'Press Kit',
      'Blog'
    ]
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container mx-auto px-6 py-16 relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Home className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl opacity-20 animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold">RentEasy GH</h2>
                <p className="text-primary-300 text-sm">Find Your Perfect Home</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
              Ghana's most trusted platform for rental properties. We connect verified landlords 
              with serious renters, making the home search process simple, safe, and efficient.
            </p>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin className="w-5 h-5 text-primary-400" />
                <span>Accra, Kumasi, Ho & 12 other cities</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="w-5 h-5 text-primary-400" />
                <span>support@renteasygh.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="w-5 h-5 text-primary-400" />
                <span>+233 24 123 4567</span>
              </div>
            </div>
            
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 hover:bg-gray-700`}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          {/* Links Sections */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-6 text-white">For Renters</h3>
            <ul className="space-y-3">
              {footerLinks.renters.map((link, index) => (
                <li key={index}>
                  <motion.a 
                    href="#" 
                    whileHover={{ x: 4 }}
                    className="text-gray-400 hover:text-white transition-all duration-200 block relative group"
                  >
                    {link}
                    <div className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></div>
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-6 text-white">For Landlords</h3>
            <ul className="space-y-3">
              {footerLinks.landlords.map((link, index) => (
                <li key={index}>
                  <motion.a 
                    href="#" 
                    whileHover={{ x: 4 }}
                    className="text-gray-400 hover:text-white transition-all duration-200 block relative group"
                  >
                    {link}
                    <div className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></div>
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-6 text-white">Support & Company</h3>
            <ul className="space-y-3 mb-6">
              {footerLinks.support.slice(0, 3).map((link, index) => (
                <li key={index}>
                  <motion.a 
                    href="#" 
                    whileHover={{ x: 4 }}
                    className="text-gray-400 hover:text-white transition-all duration-200 block relative group"
                  >
                    {link}
                    <div className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></div>
                  </motion.a>
                </li>
              ))}
            </ul>
            
            <ul className="space-y-3">
              {footerLinks.company.slice(0, 2).map((link, index) => (
                <li key={index}>
                  <motion.a 
                    href="#" 
                    whileHover={{ x: 4 }}
                    className="text-gray-400 hover:text-white transition-all duration-200 block relative group"
                  >
                    {link}
                    <div className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300"></div>
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
        
        {/* Bottom Section */}
        <motion.div 
          variants={itemVariants}
          className="border-t border-gray-700 mt-12 pt-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-2 text-gray-400">
              <span>© 2025 RentEasy GH. Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              >
                <Heart className="w-4 h-4 text-red-500 fill-current" />
              </motion.div>
              <span>in Ghana</span>
            </div>
            
            <div className="flex flex-wrap items-center space-x-6 text-sm">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security'].map((link, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ y: -1 }}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {link}
                </motion.a>
              ))}
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="flex flex-col lg:flex-row justify-between items-center text-sm text-gray-500 space-y-2 lg:space-y-0">
              <p>All rights reserved. Licensed real estate platform in Ghana.</p>
              <p>🇬🇭 Proudly serving Ghana since 2025</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;