import { motion } from 'framer-motion';
import { useEffect } from 'react';

export default function AboutPage() {
  useEffect(() => {
    document.title = "About | SpyTag";
  }, []);

  return (
    <div className="container-custom py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8 text-accent-primary">About SpyTag</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed">
              SpyTag provides Clash of Clans players with detailed analytics and statistics to help 
              improve their gameplay and track progress. We aim to be the most comprehensive and 
              user-friendly stats tracking platform for the Clash of Clans community.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              SpyTag uses the official Clash of Clans API to fetch real-time data about players and clans.
              Simply enter a player or clan tag in the search bar, and we'll show you comprehensive statistics
              and analytics.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Create an account to unlock additional features like historical tracking, advanced war analytics,
              and more detailed player information.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Privacy</h2>
            <p className="text-gray-300 leading-relaxed">
              We value your privacy. SpyTag only accesses publicly available information through the
              official Clash of Clans API. We do not collect or sell any personal data. Your account 
              information is securely stored and used only to provide you with our services.
            </p>
          </section>
          
          <section className="bg-dark-800 p-6 rounded-lg border border-dark-600">
            <h2 className="text-2xl font-bold mb-4">Legal Notice</h2>
            <p className="text-gray-400 leading-relaxed">
              This site is not affiliated with, endorsed, sponsored, or specifically approved by Supercell.
              Supercell is not responsible for the operation or content of this site.
              For more information about Supercell, please visit their website: www.supercell.com
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
} 