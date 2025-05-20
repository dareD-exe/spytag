import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchBar({ id = "main-search" }) {
  const [tag, setTag] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentTags, setRecentTags] = useState([]);
  const navigate = useNavigate();
  
  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentTags(JSON.parse(saved).slice(0, 3));
      } catch (e) {
        console.error('Failed to parse recent searches:', e);
      }
    }
  }, []);
  
  // Save recent search
  const saveRecentSearch = (formattedTag) => {
    try {
      const saved = localStorage.getItem('recentSearches');
      let recent = saved ? JSON.parse(saved) : [];
      // Add to beginning and remove duplicates
      recent = [formattedTag, ...recent.filter(t => t !== formattedTag)].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(recent));
      setRecentTags(recent.slice(0, 3));
    } catch (e) {
      console.error('Failed to save recent search:', e);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!tag.trim()) {
      setError('Please enter a player or clan tag');
      return;
    }
    
    // Format the tag (add # if missing)
    let formattedTag = tag.trim();
    if (!formattedTag.startsWith('#')) {
      formattedTag = `#${formattedTag}`;
    }
    
    // Save to recent searches
    saveRecentSearch(formattedTag);
    
    // Navigate to search results
    navigate(`/search?tag=${encodeURIComponent(formattedTag)}`);
  };
  
  const handleRecentTagClick = (recentTag) => {
    navigate(`/search?tag=${encodeURIComponent(recentTag)}`);
  };
  
  return (
    <div id={id} className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className={`relative rounded-lg overflow-hidden shadow-md bg-dark-800 border ${isFocused ? 'border-accent-primary' : 'border-dark-600'} transition-colors duration-200`}>
          <div className="flex relative">
            {/* Hash symbol prefix */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl font-bold text-gray-500">
              {!tag.startsWith('#') && '#'}
            </div>
            
            <input
              type="text"
              value={tag}
              onChange={(e) => {
                setTag(e.target.value);
                setError('');
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Enter player or clan tag (e.g. ABC123)"
              className={`w-full text-lg py-3 px-4 bg-transparent border-0 focus:ring-0 transition-all ${!tag.startsWith('#') ? 'pl-8' : 'pl-4'}`}
            />
            
            <button
              type="submit"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-accent-primary text-white rounded-md px-6 py-2 text-sm font-medium"
            >
              <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </span>
            </button>
          </div>
        </div>
        
        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-red-400 text-sm mt-2 px-2"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
        
        {/* Recent searches */}
        {recentTags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {recentTags.map((recentTag, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleRecentTagClick(recentTag)}
                className="text-xs px-2 py-1 rounded bg-dark-700 text-gray-400 hover:text-accent-primary transition-colors flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {recentTag}
              </button>
            ))}
          </div>
        )}
      </form>
    </div>
  );
} 