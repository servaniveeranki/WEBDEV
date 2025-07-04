import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaKey, FaEnvelope, FaCalendarAlt, FaUserEdit, FaCheck } from 'react-icons/fa';
import Header from './Header';

const Profile = () => {
  const { user, loading, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  
  // Form state
  const [profileData, setProfileData] = useState({
    firstname: '',
    lastname: '',
    profilePicture: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    } else if (user) {
      setProfileData({
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        profilePicture: user.profilePicture || ''
      });
    }
  }, [user, loading, navigate]);
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateProfileForm = () => {
    const errors = {};
    if (!profileData.firstname.trim()) {
      errors.firstname = 'First name is required';
    }
    if (!profileData.lastname.trim()) {
      errors.lastname = 'Last name is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const validatePasswordForm = () => {
    const errors = {};
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfileForm()) return;
    
    try {
      // Call the updateProfile function from AuthContext
      const result = await updateProfile(profileData);
      
      if (result.success) {
        setSuccessMessage('Profile updated successfully');
        setEditMode(false);
        setError('');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;
    
    try {
      // Simulating API call - replace with actual API call
      // await updatePassword(passwordData.currentPassword, passwordData.newPassword);
      
      setSuccessMessage('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setError('');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to update password');
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex">
              {/* Sidebar */}
              <div className="md:w-1/3 bg-indigo-600 p-6 text-white">
                <div className="flex flex-col items-center mb-8">
                  <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center text-3xl font-bold text-indigo-600 mb-4 overflow-hidden">
                    {user.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt="Profile" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      user.firstname?.charAt(0).toUpperCase() + user.lastname?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <h2 className="text-xl font-bold">{user.firstname} {user.lastname}</h2>
                  <p className="text-indigo-200 mt-1">{user.email}</p>
                </div>
                
                <nav className="mt-8 space-y-2">
                  <button 
                    onClick={() => setActiveTab('profile')} 
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-white text-indigo-600' : 'hover:bg-indigo-700 text-white'}`}
                  >
                    <FaUser className="mr-3" />
                    Profile Information
                  </button>
                  <button 
                    onClick={() => setActiveTab('security')} 
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'security' ? 'bg-white text-indigo-600' : 'hover:bg-indigo-700 text-white'}`}
                  >
                    <FaKey className="mr-3" />
                    Security Settings
                  </button>
                </nav>
                
                {/* Stats Section */}
                <div className="mt-8 pt-6 border-t border-indigo-500">
                  <h3 className="text-lg font-medium mb-4">Your Stats</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-indigo-200">Problems Solved</p>
                      <p className="font-bold">24 / 150</p>
                    </div>
                    <div>
                      <p className="text-sm text-indigo-200">Current Rank</p>
                      <p className="font-bold">#42 (Top 15%)</p>
                    </div>
                    <div>
                      <p className="text-sm text-indigo-200">Contests</p>
                      <p className="font-bold">5 Participated</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="md:w-2/3 p-6">
                {successMessage && (
                  <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded">
                    <div className="flex items-center">
                      <FaCheck className="text-green-500 mr-2" />
                      <p className="text-sm text-green-700">{successMessage}</p>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
                
                {activeTab === 'profile' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
                      {!editMode && (
                        <button 
                          onClick={() => setEditMode(true)} 
                          className="flex items-center text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded transition-colors"
                        >
                          <FaUserEdit className="mr-2" />
                          Edit Profile
                        </button>
                      )}
                    </div>
                    
                    {editMode ? (
                      <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">First Name</label>
                          <input
                            id="firstname"
                            name="firstname"
                            type="text"
                            value={profileData.firstname}
                            onChange={handleProfileChange}
                            className={`mt-1 block w-full px-3 py-2 border ${formErrors.firstname ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                          />
                          {formErrors.firstname && <p className="mt-1 text-sm text-red-600">{formErrors.firstname}</p>}
                        </div>
                        
                        <div>
                          <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Last Name</label>
                          <input
                            id="lastname"
                            name="lastname"
                            type="text"
                            value={profileData.lastname}
                            onChange={handleProfileChange}
                            className={`mt-1 block w-full px-3 py-2 border ${formErrors.lastname ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                          />
                          {formErrors.lastname && <p className="mt-1 text-sm text-red-600">{formErrors.lastname}</p>}
                        </div>
                        
                        <div>
                          <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">Profile Picture URL (optional)</label>
                          <input
                            id="profilePicture"
                            name="profilePicture"
                            type="text"
                            value={profileData.profilePicture}
                            onChange={handleProfileChange}
                            placeholder="https://example.com/your-image.jpg"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        
                        <div className="flex space-x-4 pt-4">
                          <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                          >
                            Save Changes
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditMode(false);
                              setProfileData({
                                firstname: user.firstname || '',
                                lastname: user.lastname || '',
                                profilePicture: user.profilePicture || ''
                              });
                              setFormErrors({});
                            }}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex items-center">
                          <FaUser className="text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="font-medium">{user.firstname} {user.lastname}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <FaEnvelope className="text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Email Address</p>
                            <p className="font-medium">{user.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <FaCalendarAlt className="text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Member Since</p>
                            <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === 'security' && (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">Security Settings</h2>
                      <p className="text-gray-600 mt-1">Update your password</p>
                    </div>
                    
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                        <input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className={`mt-1 block w-full px-3 py-2 border ${formErrors.currentPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                        />
                        {formErrors.currentPassword && <p className="mt-1 text-sm text-red-600">{formErrors.currentPassword}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className={`mt-1 block w-full px-3 py-2 border ${formErrors.newPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                        />
                        {formErrors.newPassword && <p className="mt-1 text-sm text-red-600">{formErrors.newPassword}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className={`mt-1 block w-full px-3 py-2 border ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                        />
                        {formErrors.confirmPassword && <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>}
                      </div>
                      
                      <div className="pt-4">
                        <button
                          type="submit"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                          Update Password
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
