import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logOut } = useAuth();
  const location = useLocation();
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    user ? { name: 'Profile', path: '/profile' } : { name: 'Login', path: '/login' },
  ];
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  
  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  return (
    <nav className={`sticky top-0 z-50 transition-all duration-200 ${
      scrolled ? 'bg-dark-900/95 backdrop-blur-sm shadow-md' : 'bg-dark-900'
    }`}>
      <div className="container-custom py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-1 group">
          <span className="text-2xl font-bold text-white group-hover:text-accent-primary transition-colors duration-200">
            Spy<span className="text-accent-primary group-hover:text-white transition-colors duration-200">Tag</span>
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              className={`text-sm font-medium transition-colors duration-200 hover:text-accent-primary relative py-1 ${
                location.pathname === item.path ? 'text-accent-primary' : 'text-gray-300'
              }`}
            >
              {item.name}
              {location.pathname === item.path && (
                <motion.div 
                  layoutId="navbar-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent-primary"
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
          ))}
          
          {user && (
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-gray-300 hover:text-accent-primary transition-colors duration-200 py-1 px-3 border border-transparent hover:border-dark-600 rounded-md"
            >
              Logout
            </button>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-300 hover:text-accent-primary p-1 rounded-md focus:outline-none focus:ring-1 focus:ring-accent-primary"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-dark-800 border-t border-dark-600">
          <div className="container-custom py-4 flex flex-col space-y-3">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.path}
                className={`text-sm font-medium py-2 px-3 rounded transition-colors duration-200 hover:bg-dark-700 ${
                  location.pathname === item.path ? 'text-accent-primary bg-dark-700' : 'text-gray-300'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {user && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="text-sm font-medium text-gray-300 hover:text-accent-primary hover:bg-dark-700 transition-colors duration-200 py-2 px-3 rounded text-left"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 