import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  useEffect(() => {
    document.title = "Login | SpyTag";
  }, []);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { logIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (isLogin) {
      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }
    } else {
      // Validate signup fields
      if (!firstName || !lastName || !gender || !age || !email || !password || !confirmPassword) {
        setError('Please fill in all fields');
        return;
      }
      
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }
    
    try {
      setLoading(true);
      if (isLogin) {
        await logIn(email, password);
      } else {
        // Pass the additional user data to signUp
        await signUp(email, password, {
          firstName,
          lastName,
          gender,
          age: parseInt(age, 10)
        });
      }
      navigate('/');
    } catch (err) {
      console.error(err);
      // Provide more user-friendly error messages
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Email is already in use');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak');
      } else {
        setError(err.message || 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const renderLoginForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          disabled={loading}
          placeholder="your@email.com"
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          disabled={loading}
          placeholder="••••••••"
        />
      </div>
      
      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="btn-primary w-full"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Sign In'}
      </motion.button>
    </form>
  );

  const renderSignupForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-400 mb-1">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="input-field"
            disabled={loading}
            placeholder="John"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-400 mb-1">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="input-field"
            disabled={loading}
            placeholder="Doe"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-400 mb-1">
            Gender
          </label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="input-field"
            disabled={loading}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-400 mb-1">
            Age
          </label>
          <input
            id="age"
            type="number"
            min="13"
            max="120"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="input-field"
            disabled={loading}
            placeholder="25"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="signup-email" className="block text-sm font-medium text-gray-400 mb-1">
          Email
        </label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          disabled={loading}
          placeholder="your@email.com"
        />
      </div>
      
      <div>
        <label htmlFor="signup-password" className="block text-sm font-medium text-gray-400 mb-1">
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          disabled={loading}
          placeholder="••••••••"
        />
      </div>
      
      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-400 mb-1">
          Confirm Password
        </label>
        <input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input-field"
          disabled={loading}
          placeholder="••••••••"
        />
      </div>
      
      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="btn-primary w-full"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Sign Up'}
      </motion.button>
    </form>
  );
  
  return (
    <div className="min-h-[calc(100vh-80px)] py-12 flex items-center justify-center">
      <div className="container-custom relative mx-auto max-w-screen-lg px-4">
        {/* Background elements */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            initial={{ opacity: 0.05 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent-primary/20 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0.05 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 5, delay: 1, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-accent-secondary/20 blur-3xl"
          />
        </div>
        
        <div className="grid md:grid-cols-5 gap-8">
          {/* Left content - only visible on md and larger screens */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden md:flex md:col-span-2 flex-col justify-center items-start"
          >
            <h2 className="text-3xl font-bold mb-4">
              {isLogin ? "Welcome back to CoC Stats" : "Join CoC Stats"}
            </h2>
            <p className="text-gray-400 mb-6">
              {isLogin 
                ? "Sign in to access detailed player and clan statistics, track war performance, and analyze your gameplay." 
                : "Create an account to unlock full access to all features and get detailed insights into your Clash of Clans performance."}
            </p>
            <ul className="space-y-3">
              {['Complete player statistics', 'War analytics', 'Clan performance tracking'].map((feature, i) => (
                <li key={i} className="flex items-center">
                  <span className="text-accent-primary mr-2">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* Right content - form panel */}
          <div className="md:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-panel p-8 border border-dark-600 rounded-lg backdrop-blur-sm shadow-lg"
            >
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">
                  {isLogin ? 'Sign In' : 'Create Account'}
                </h1>
                <p className="text-gray-400 text-sm">
                  {isLogin ? 'Access your CoC stats' : 'Sign up to unlock full features'}
                </p>
              </div>
              
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-md p-3 mb-6 text-sm">
                  {error}
                </div>
              )}
              
              {isLogin ? renderLoginForm() : renderSignupForm()}
              
              <div className="my-6 flex items-center">
                <div className="flex-1 border-t border-dark-600"></div>
                <p className="mx-4 text-sm text-gray-500">OR</p>
                <div className="flex-1 border-t border-dark-600"></div>
              </div>
              
              <motion.button
                onClick={handleGoogleSignIn}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-dark-700 hover:bg-dark-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                  <path fill="none" d="M1 1h22v22H1z" />
                </svg>
                Continue with Google
              </motion.button>
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-accent-primary hover:underline text-sm"
                >
                  {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 