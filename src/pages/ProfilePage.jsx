import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // For fetching and updating profile
import { db } from '../services/firebase'; // Firebase config is in services/firebase.js

// Modified Modal Component with simpler design
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-dark-800 p-6 rounded-lg shadow-xl w-full max-w-md border border-dark-600"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-semibold text-gray-100">{title}</h3>
              <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default function ProfilePage() {
  useEffect(() => {
    document.title = "Profile | SpyTag";
  }, []);

  const { user, logOut, reauthenticateUser, updateUserPasswordInAuth } = useAuth(); 

  const [profileData, setProfileData] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState(null);

  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editableProfileData, setEditableProfileData] = useState({ firstName: '', lastName: '', gender: '', age: '' });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveProfileError, setSaveProfileError] = useState(null);
  
  // State for password change modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const generateAvatarGradient = (name) => {
    let hash = 0;
    for (let i = 0; i < name?.length || 0; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const c1 = (hash & 0xFF) % 360;
    const c2 = ((hash >> 8) & 0xFF) % 360;
    
    return `linear-gradient(135deg, hsl(${c1}, 70%, 40%) 0%, hsl(${c2}, 70%, 45%) 100%)`;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        setIsLoadingProfile(true);
        setProfileError(null);
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfileData(data);
            setEditableProfileData(data); // Initialize editable data
          } else {
            setProfileError('Profile data not found. You can add it by editing your profile.');
            // Initialize with empty strings if no profile data, but user exists
            setProfileData({ firstName: user.displayName?.split(' ')[0] || '', lastName: user.displayName?.split(' ').slice(1).join(' ') || '', gender: '', age: '' });
            setEditableProfileData({ firstName: user.displayName?.split(' ')[0] || '', lastName: user.displayName?.split(' ').slice(1).join(' ') || '', gender: '', age: '' });
          }
        } catch (err) {
          setProfileError('Failed to fetch profile data.');
          console.error("Fetch profile error:", err);
        }
        setIsLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [user]);
  
  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleOpenEditProfileModal = () => {
    if (profileData) {
      setEditableProfileData({ ...profileData, age: profileData.age || '' }); // Ensure age is a string for input
    }
    setSaveProfileError(null);
    setShowEditProfileModal(true);
  };
  
  const handleOpenPasswordModal = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setPasswordError('');
    setPasswordSuccess('');
    setShowPasswordModal(true);
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setEditableProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsSavingProfile(true);
    setSaveProfileError(null);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        ...editableProfileData,
        age: editableProfileData.age ? parseInt(editableProfileData.age, 10) : null // Store age as number
      });
      setProfileData(editableProfileData); // Update local display
      setShowEditProfileModal(false);
    } catch (err) {
      console.error("Save profile error:", err);
      setSaveProfileError('Failed to save profile. Please try again.');
    } finally {
      setIsSavingProfile(false);
    }
  };
  
  const handlePasswordUpdateSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords don't match.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password should be at least 6 characters.");
      return;
    }

    setPasswordLoading(true);
    try {
      // Reauthenticate first, then update password
      await reauthenticateUser(currentPassword); 
      await updateUserPasswordInAuth(newPassword); 
      
      setPasswordSuccess('Password updated successfully! Check your email if verification is needed.');
      // Close modal after successful password change
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess('');
      }, 2000);
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      console.error("Password update error:", err);
      setPasswordError(err.message || 'Failed to update password. Please check your current password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user && !isLoadingProfile) {
    return (
      <div className="container-custom py-16 text-center">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }
  
  if (isLoadingProfile) {
    return (
        <div className="container-custom py-16 text-center">
            <div className="w-12 h-12 border-4 border-dark-600 border-t-accent-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading profile...</p>
        </div>
    );
  }

  // User's initial for the avatar
  const userInitial = profileData?.firstName?.charAt(0)?.toUpperCase() || 
                      user?.email?.charAt(0)?.toUpperCase() || '?';
  
  // Generate a unique gradient for the user
  const avatarGradient = generateAvatarGradient(profileData?.firstName || user?.email || 'User');
  
  return (
    <div className="min-h-[calc(100vh-70px)] py-12 md:py-16">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Profile Header Card */}
          <div className="bg-dark-800 rounded-xl border border-dark-600 p-6 sm:p-8 mb-8 shadow-xl">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div 
                className="w-32 h-32 rounded-full flex items-center justify-center text-5xl font-bold text-white shadow-lg border-2 border-dark-500"
                style={{ background: avatarGradient }}
              >
                {userInitial}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                  {profileData?.firstName || profileData?.lastName 
                    ? `${profileData.firstName} ${profileData.lastName}` 
                    : (user?.displayName || 'User Profile')}
                </h1>
                <p className="text-gray-400 mb-4">{user?.email}</p>
                <p className="text-sm text-gray-500 mb-2">
                  Member since {new Date(user?.metadata?.creationTime || Date.now()).toLocaleDateString()}
                </p>
              </div>
                  <button 
                    onClick={handleLogout}
                className="btn-secondary px-6 py-2.5 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              </div>

          {/* Main Profile Content (2 Columns to 1 Column at smaller screens) */}
          <div className="space-y-8">
            {/* Personal Information */}
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-dark-800 rounded-xl border border-dark-600 p-6 shadow-lg overflow-hidden relative"
            >
              <div className="relative">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <h2 className="text-xl font-semibold text-gray-100">Personal Information</h2>
            </div>
                  <button 
                    onClick={handleOpenEditProfileModal} 
                    className="text-sm bg-dark-700 hover:bg-dark-600 text-accent-primary px-3 py-1.5 rounded-md transition-colors duration-200 flex items-center gap-1.5 shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit
                  </button>
          </div>
              
                {profileError && !profileData && <p className="text-orange-400 text-sm mb-4">{profileError}</p>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">First Name</label>
                    <p className="bg-dark-700 rounded-lg p-3 min-h-[45px] border border-dark-500">{profileData?.firstName || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Last Name</label>
                    <p className="bg-dark-700 rounded-lg p-3 min-h-[45px] border border-dark-500">{profileData?.lastName || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Gender</label>
                    <p className="bg-dark-700 rounded-lg p-3 min-h-[45px] border border-dark-500">{profileData?.gender || '-'}</p>
                  </div>
                      <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Age</label>
                    <p className="bg-dark-700 rounded-lg p-3 min-h-[45px] border border-dark-500">{profileData?.age || '-'}</p>
                      </div>
                </div>
            </div>
            </motion.section>

            {/* Account Security */}
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-dark-800 rounded-xl border border-dark-600 p-6 shadow-lg overflow-hidden relative"
            >
              <div className="relative">
                <div className="flex items-center gap-2 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <h2 className="text-xl font-semibold text-gray-100">Account Security</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Email</label>
                    <div className="flex items-center">
                      <p className="bg-dark-700 rounded-lg p-3 flex-grow border border-dark-500">{user?.email || '-'}</p>
                      <span className="text-xs text-gray-400 ml-2 italic">Cannot be changed</span>
                    </div>
                </div>
                
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Password</label>
                    <div className="h-full flex items-start pt-1">
                      <button 
                        onClick={handleOpenPasswordModal} 
                        className="btn-secondary shadow-md flex items-center gap-1.5"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1 1-1-.707-1.707A6 6 0 0118 8zm-6-6a5.99 5.99 0 00-4.243 1.757l1.414 1.414A3.987 3.987 0 0112 4a4 4 0 014 4 3.987 3.987 0 01-1.757 3.314l1.414 1.414A5.99 5.99 0 0016 8c0-3.309-2.691-6-6-6z" clipRule="evenodd" />
                        </svg>
                        Change Password
                  </button>
                </div>
              </div>
            </div>
              </div>
            </motion.section>
          </div>
        </motion.div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={showEditProfileModal} onClose={() => setShowEditProfileModal(false)} title="Edit Personal Information">
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
            <input 
              type="text" 
              name="firstName" 
              id="firstName" 
              value={editableProfileData.firstName} 
              onChange={handleProfileInputChange} 
              className="input-field" 
              required 
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
            <input 
              type="text" 
              name="lastName" 
              id="lastName" 
              value={editableProfileData.lastName} 
              onChange={handleProfileInputChange} 
              className="input-field" 
              required 
            />
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
            <select 
              name="gender" 
              id="gender" 
              value={editableProfileData.gender} 
              onChange={handleProfileInputChange} 
              className="input-field"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-1">Age</label>
            <input 
              type="number" 
              name="age" 
              id="age" 
              value={editableProfileData.age} 
              onChange={handleProfileInputChange} 
              className="input-field" 
              min="13" 
              max="120" 
            />
          </div>
          
          {saveProfileError && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-sm text-red-400 bg-red-900/20 p-2 rounded border border-red-900/30"
            >
              {saveProfileError}
            </motion.p>
          )}
          
          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={() => setShowEditProfileModal(false)} 
              className="btn-secondary px-5" 
              disabled={isSavingProfile}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary px-5" 
              disabled={isSavingProfile}
            >
              {isSavingProfile ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
      
      {/* Password Change Modal */}
      <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Change Password">
        <form onSubmit={handlePasswordUpdateSubmit} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-1">Current Password</label>
            <input 
              id="currentPassword" 
              type="password" 
              value={currentPassword} 
              onChange={(e) => setCurrentPassword(e.target.value)} 
              className="input-field" 
              required 
              disabled={passwordLoading}
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
            <input 
              id="newPassword" 
              type="password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              className="input-field" 
              required 
              disabled={passwordLoading}
            />
          </div>
          <div>
            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-300 mb-1">Confirm New Password</label>
            <input 
              id="confirmNewPassword" 
              type="password" 
              value={confirmNewPassword} 
              onChange={(e) => setConfirmNewPassword(e.target.value)} 
              className="input-field" 
              required 
              disabled={passwordLoading}
            />
          </div>
          
          {passwordError && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-sm text-red-400 bg-red-900/20 p-2 rounded border border-red-900/30"
            >
              {passwordError}
            </motion.p>
          )}
          
          {passwordSuccess && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-sm text-green-400 bg-green-900/20 p-2 rounded border border-green-900/30"
            >
              {passwordSuccess}
            </motion.p>
          )}
          
          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={() => setShowPasswordModal(false)} 
              className="btn-secondary px-5" 
              disabled={passwordLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary px-5" 
              disabled={passwordLoading}
            >
              {passwordLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
              ) : 'Save Password'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
} 

// Add a new CSS class for display-only input fields if you want them styled differently
// e.g., in your main CSS file (index.css or App.css):
/*
.input-field-display {
  @apply block w-full px-3 py-2 bg-dark-600 border border-dark-500 rounded-md shadow-sm text-gray-300 sm:text-sm opacity-75 cursor-not-allowed;
}
*/

// Ensure input-field class is defined, e.g.:
/*
.input-field {
  @apply block w-full px-3 py-2 bg-dark-700 border border-dark-500 rounded-md shadow-sm placeholder-gray-500 
  focus:outline-none focus:ring-accent-primary focus:border-accent-primary sm:text-sm text-gray-200;
}
*/
