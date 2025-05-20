import { motion } from 'framer-motion';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('player');
  
  useEffect(() => {
    document.title = "Home | SpyTag";
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Stats showcase data
  const stats = {
    player: [
      { label: "Trophies", value: "5,400", icon: "🏆" },
      { label: "War Stars", value: "1,200", icon: "⭐" },
      { label: "Troops Donated", value: "25,000+", icon: "👥" },
      { label: "Hero Levels", value: "Max", icon: "👑" }
    ],
    clan: [
      { label: "War Win Streak", value: "15", icon: "🔥" },
      { label: "Clan Level", value: "20", icon: "⚔️" },
      { label: "Active Members", value: "45/50", icon: "👥" },
      { label: "League", value: "Legend", icon: "🏅" }
    ]
  };
  
  // Features data with real icons and more detailed descriptions
  const features = [
    {
      title: 'Advanced Player Analytics',
      description: 'Track progression, compare stats with friends, and identify areas for improvement with our detailed player analytics.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      title: 'Clan Performance Tracking',
      description: 'Monitor your clan\'s performance, track member contributions, and analyze war strategies for better coordination.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      title: 'War Strategy Insights',
      description: 'Get detailed war analysis, attack patterns, and defense recommendations based on real battle data and statistics.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with Animated Background */}
      <section className="py-16 md:py-28 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-dark-900 opacity-95"></div>
          <motion.div
            initial={{ opacity: 0.2, scale: 1 }}
            animate={{ opacity: 0.4, scale: 1.1 }}
            transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-accent-primary/30 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0.1, scale: 1 }}
            animate={{ opacity: 0.3, scale: 1.05 }}
            transition={{ duration: 6, delay: 1, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute -bottom-40 -left-20 w-[30rem] h-[30rem] rounded-full bg-accent-secondary/20 blur-3xl"
          />
        </div>
        
        <div className="container-custom relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              variants={itemVariants}
              className="mb-3 inline-block bg-gradient-to-r from-accent-primary to-accent-secondary p-[1px] rounded-full"
            >
              <div className="bg-dark-800 rounded-full px-4 py-1">
                <span className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">
                  #1 CoC Statistics Tracker
                </span>
              </div>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-6 leading-tight"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-white">
                Dominate with <span className="text-accent-primary">SpyTag</span>
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto"
            >
              Get detailed insights into your Clash of Clans gameplay. Track your stats, analyze your performance, and dominate the battlefield.
            </motion.p>
            
            <motion.div variants={itemVariants} className="mb-8">
              <SearchBar />
            </motion.div>
            
              <motion.div 
                variants={itemVariants}
              className="flex flex-wrap justify-center gap-4 mb-12"
            >
              {!user ? (
                <>
                  <Link to="/login" className="btn-primary px-8 py-3 text-lg shadow-lg shadow-accent-primary/20 hover:shadow-accent-primary/30 transition-all">
                    Get Started
                  </Link>
                  <Link to="/about" className="btn-secondary px-8 py-3 text-lg">
                    Learn More
                  </Link>
                </>
              ) : null}
              </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section with Card Hover Effects */}
      <section className="py-20 bg-dark-800 relative">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="inline-block text-3xl md:text-4xl font-bold relative before:absolute before:h-1 before:w-24 before:bg-accent-primary before:-bottom-4 before:left-1/2 before:-translate-x-1/2">
              Why Choose SpyTag?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-dark-700 border border-dark-600 p-6 rounded-xl flex flex-col h-full relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="mb-5">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-accent-primary transition-colors">{feature.title}</h3>
                <p className="text-gray-400 flex-grow">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Stats Showcase with Tabs */}
      <section className="py-20 bg-gradient-to-b from-dark-900 to-dark-800 relative">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-5">
              Powerful <span className="text-accent-primary">Insights</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Track your progression, compare stats with friends, and identify areas for improvement with our detailed analytics.
            </p>
          </div>
          
          {/* Tab Selector */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-dark-800 rounded-lg p-1 border border-dark-600">
              <button
                onClick={() => setActiveTab('player')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'player'
                    ? 'bg-accent-primary text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Player Stats
              </button>
              <button
                onClick={() => setActiveTab('clan')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'clan'
                    ? 'bg-accent-primary text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Clan Stats
              </button>
            </div>
              </div>
              
          {/* Stats Display with Animation */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-dark-800 border border-dark-600 rounded-xl overflow-hidden shadow-xl max-w-4xl mx-auto"
          >
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Left side - Avatar/Icon */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-accent-primary/30 to-accent-secondary/30 flex items-center justify-center shadow-lg">
                    {activeTab === 'player' ? (
                      <img src="https://api-assets.clashofclans.com/badges/512/jqGKUmnU_d6bUcYDt0UgXbOJXeKzVpnZYpnTjiZbclM.png" alt="Player" className="w-24 h-24 object-contain" />
                    ) : (
                      <img src="https://api-assets.clashofclans.com/badges/512/jxSgvHyZ-SA5DcZYwrYU_hfUaHVPOxMcg7KZf7NU3YA.png" alt="Clan" className="w-24 h-24 object-contain" />
                    )}
                  </div>
                </div>
                
                {/* Right side - Stats */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary mb-2">
                    {activeTab === 'player' ? 'Legendary Player' : 'Elite Clan'}
                  </h3>
                  <p className="text-gray-400 mb-6">
                    {activeTab === 'player' 
                      ? 'Town Hall 14 • Level 200 • Legend League' 
                      : 'Level 20 • Crystal League I • War Win Streak: 15'}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats[activeTab].map((stat, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-dark-700 rounded-lg p-4 text-center hover:bg-dark-600 transition-colors group"
                      >
                        <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{stat.icon}</div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{stat.label}</p>
                        <p className="text-xl font-bold text-white">{stat.value}</p>
                      </motion.div>
                    ))}
                </div>
                
                {!user && (
                    <div className="mt-8 bg-dark-700 rounded-lg p-4 relative overflow-hidden">
                      <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center bg-dark-800/80">
                        <Link to="/login" className="btn-primary px-6 py-2.5 z-10 shadow-lg hover:shadow-accent-primary/20 transition-all">
                        Login to see full stats
                      </Link>
                      </div>
                      <p className="text-gray-500 text-center">Unlock detailed statistics and personalized recommendations when you log in.</p>
                    </div>
                  )}
                  </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-dark-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://api-assets.clashofclans.com/battlegrounds/T_ClashOfClans.jpg')] bg-cover bg-center opacity-5"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Ready to <span className="text-accent-primary">Level Up</span> Your Clash Game?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 mb-8 text-lg"
            >
              Join thousands of players who are already using SpyTag to improve their strategy and dominate the competition.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {!user ? (
                <Link to="/login" className="btn-primary px-10 py-3 text-lg shadow-lg shadow-accent-primary/20 hover:shadow-xl hover:shadow-accent-primary/30 transition-all">
                  Get Started Now
                </Link>
              ) : null}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
} 