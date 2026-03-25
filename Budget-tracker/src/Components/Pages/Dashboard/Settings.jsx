import React, { useState, useEffect, useRef } from 'react';
import { useBudget } from '../../Context/Context';
import { useAuth } from '../../Context/AuthContext';
import { toast } from 'react-toastify';
import { Settings, User, Bell, Lock, Globe, Palette, DollarSign, Mail, Shield, Eye, EyeOff, Save, Camera, LogOut, Loader2 } from 'lucide-react';

function SettingsPage() {
  const { userProfile, updateUserProfile, loading, fetchUserProfile } = useAuth();
  const { logout } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null)
  const fileInputRef = useRef(null)

  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    avatar: null,
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  // Fetch user profile on mount
  useEffect(() => {
    if (fetchUserProfile) {
      fetchUserProfile();
    }
  }, [fetchUserProfile]);

  useEffect(() => {
    if (userProfile) {
      setProfileForm({
        first_name: userProfile.first_name || '',
        last_name: userProfile.last_name || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        avatar: null,
      });
      if (userProfile.avatar) {
        setAvatarPreview(userProfile.avatar)
      }
    }
  }, [userProfile]);

  const getInitials = () => {
    const first = profileForm.first_name?.[0] || userProfile?.username?.[0] || 'U';
    const last = profileForm.last_name?.[0] || '';
    return (first + last).toUpperCase();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]; 
    if (file) {
      if (!file.type.startsWith('image/')) { 
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader(); 
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);

      setProfileForm({...profileForm, avatar: file}); 
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const result = await updateUserProfile(profileForm);
      if (result?.ok) {
        toast.success('Profile updated successfully!');
        setProfileForm({ ...profileForm, avatar: null });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        toast.error(result?.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error('An error occurred while updating profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!passwordForm.current_password || !passwordForm.new_password) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.new_password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setSubmitting(true);

    try {
      const result = await updateUserProfile({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });

      if (result?.ok) {
        toast.success('Password updated successfully!');
        setPasswordForm({
          current_password: '',
          new_password: '',
          confirm_password: '',
        });
      } else {
        toast.error(result?.error || 'Failed to update password');
      }
    } catch (error) {
      console.error('Password change failed:', error);
      toast.error('An error occurred while changing password');
    } finally {
      setSubmitting(false);
    }
  };


  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout('/login');
      toast.success('Logged out successfully');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone!')) {
      const confirmed = window.confirm('This will permanently delete all your data. Are you absolutely sure?');
      if (confirmed) {
        toast.error('Account deletion not yet implemented');
      }
    }
  };

  return (
    <div className='min-h-screen text-white bg-[#0b0b0f]'>
      {/* Header - Mobile Responsive */}
      <div className='border-b border-[#2F2F2F] p-4 sm:p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              <h1 className='text-2xl sm:text-3xl font-bold text-white'>Settings</h1>
            </div>
            <p className='text-gray-400 text-sm sm:text-base'>
              Manage your account settings and preferences
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-6xl mx-auto">
        {/* Profile Section - Mobile Responsive */}
        <div className="bg-[#111111] border border-[#2F2F2F] rounded-xl p-4 sm:p-6">
          <div className="flex items-center space-x-2 mb-4 sm:mb-6">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <h2 className="text-lg sm:text-xl font-semibold text-white">Profile Information</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleProfileUpdate}>
              {/* Profile Avatar - Mobile Responsive */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
                <div className="relative">
                  <input 
                    type="file"
                    ref={fileInputRef}
                    accept='image/*'
                    onChange={handleAvatarChange}
                    className='hidden'
                    disabled={submitting}
                  />
                  {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="profile"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-primary"
                  />
                  ) : (
                    <div className='w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl sm:text-2xl font-bold'>
                      {getInitials()}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={submitting}
                    className="absolute bottom-0 right-0 p-1 sm:p-1.5 bg-primary rounded-full hover:bg-primary/90 transition-colors"
                  >
                    <Camera className='w-3 h-3' />
                  </button>
        
                </div>
              
                <div className="text-center sm:text-left">
                  <h3 className="text-base sm:text-lg font-semibold text-white">
                    {profileForm.first_name} {profileForm.last_name || userProfile?.username || 'User'}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm">{profileForm.email || 'No email set'}</p>
                  <p className="text-gray-500 text-xs mt-1" >Click camera icon to Upload photo</p>
                </div>
              </div>

              {/* Form Fields - Mobile Responsive */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-gray-400 text-xs sm:text-sm font-medium mb-2">First Name</label>
                  <input
                    type="text"
                    value={profileForm.first_name}
                    onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                    disabled={submitting}
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs sm:text-sm font-medium mb-2">Last Name</label>
                  <input
                    type="text"
                    value={profileForm.last_name}
                    onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                    disabled={submitting}
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-xs sm:text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    disabled={submitting}
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-xs sm:text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    disabled={submitting}
                    placeholder="+1 (555) 123-4567"
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4 sm:mt-6">
                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Security Section - Mobile Responsive */}
        <div className="bg-[#111111] border border-[#2F2F2F] rounded-xl p-4 sm:p-6">
          <div className="flex items-center space-x-2 mb-4 sm:mb-6">
            <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <h2 className="text-lg sm:text-xl font-semibold text-white">Security</h2>
          </div>
          
          <form onSubmit={handlePasswordChange}>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-gray-400 text-xs sm:text-sm font-medium mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordForm.current_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                    disabled={submitting}
                    placeholder="Enter current password"
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 pr-10 sm:pr-12 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-xs sm:text-sm font-medium mb-2">New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordForm.new_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                  disabled={submitting}
                  placeholder="Enter new password (min 8 characters)"
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs sm:text-sm font-medium mb-2">Confirm New Password</label>
                <input
                  value={passwordForm.confirm_password}
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                  disabled={submitting}
                  placeholder="Confirm new password"
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex justify-end mt-4 sm:mt-6">
              <button
                type='submit'
                disabled={submitting}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {submitting ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin' />
                    Updating...
                  </>
                ) : (
                  <>
                    <Lock className='w-4 h-4' />
                    Update Password
                  </>
                )}              
              </button>
            </div>
          </form>  
        </div>

        {/* Danger Zone - Mobile Responsive */}
        <div className="bg-[#111111] border border-red-500/20 rounded-xl p-4 sm:p-6">
          <div className="flex items-center space-x-2 mb-4 sm:mb-6">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            <h2 className="text-lg sm:text-xl font-semibold text-red-400">Account Actions</h2>
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            <button
              onClick={() => toast.info('Export feature coming soon')}
              className="w-full px-4 py-2.5 sm:py-3 bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
            >
              <Save className="w-4 h-4" />
              Export All Data
            </button>

            <button 
              onClick={handleLogout}
              className="w-full px-4 py-2.5 sm:py-3 bg-[#1a1a1a] hover:bg-[#222] text-gray-300 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>

            <button 
              onClick={handleDeleteAccount}
              className="w-full px-4 py-2.5 sm:py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg transition-colors text-sm sm:text-base"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;