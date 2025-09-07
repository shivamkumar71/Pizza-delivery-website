import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    zipCode: user?.zipCode || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      // Error handled in updateProfile
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      zipCode: user?.zipCode || ''
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  // Change password
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const handlePwdChange = (e) => {
    const { name, value } = e.target;
    setPwdForm(prev => ({ ...prev, [name]: value }));
  };

  const submitChangePassword = async () => {
    if (pwdForm.newPassword !== pwdForm.confirmPassword) return toast.error('Passwords do not match');
    try {
      await authAPI.changePassword(pwdForm.currentPassword, pwdForm.newPassword);
      toast.success('Password changed');
      setShowChangePwd(false);
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    }
  };

  // Notification settings
  const [showNotifications, setShowNotifications] = useState(false);
  const [notif, setNotif] = useState(user?.notifications || { email: true, sms: false, push: true });

  const toggleNotif = (key) => {
    const newVal = { ...notif, [key]: !notif[key] };
    setNotif(newVal);
  };

  const saveNotifications = async () => {
    try {
      await authAPI.updateProfile({ notifications: notif });
      toast.success('Notification settings saved');
      setShowNotifications(false);
    } catch (err) {
      toast.error(err.message || 'Failed to save settings');
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="container">
          <motion.h1
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="page-title"
          >
            My Profile
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="page-subtitle"
          >
            Manage your account information and preferences
          </motion.p>
        </div>
      </div>

      <div className="container">
        <div className="profile-content">
          <motion.div
            className="profile-card"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="profile-avatar">
              <FaUser />
            </div>

            <div className="profile-info">
              {isEditing ? (
                <div className="edit-form">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your address"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Enter your city"
                      />
                    </div>

                    <div className="form-group">
                      <label>ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="Enter ZIP code"
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="btn btn-success" onClick={handleSave}>
                      <FaSave />
                      Save Changes
                    </button>
                    <button className="btn btn-secondary" onClick={handleCancel}>
                      <FaTimes />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="profile-details">
                  <div className="detail-row">
                    <FaUser className="detail-icon" />
                    <div className="detail-content">
                      <label>Full Name</label>
                      <span>{user.name || 'Not provided'}</span>
                    </div>
                  </div>

                  <div className="detail-row">
                    <FaEnvelope className="detail-icon" />
                    <div className="detail-content">
                      <label>Email</label>
                      <span>{user.email}</span>
                    </div>
                  </div>

                  <div className="detail-row">
                    <FaPhone className="detail-icon" />
                    <div className="detail-content">
                      <label>Phone</label>
                      <span>{user.phone || 'Not provided'}</span>
                    </div>
                  </div>

                  <div className="detail-row">
                    <FaMapMarkerAlt className="detail-icon" />
                    <div className="detail-content">
                      <label>Address</label>
                      <span>
                        {user.address ? (
                          <>
                            {user.address}, {user.city} {user.zipCode}
                          </>
                        ) : (
                          'Not provided'
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="profile-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setIsEditing(true)}
                    >
                      <FaEdit />
                      Edit Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            className="account-actions"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="action-card">
              <h3>Account Actions</h3>
              <div className="action-buttons">
                <button className="btn btn-warning" onClick={() => setShowChangePwd(true)}>
                  Change Password
                </button>
                <button className="btn btn-secondary" onClick={() => setShowNotifications(true)}>
                  Notification Settings
                </button>
                <button className="btn btn-secondary">
                  Privacy Settings
                </button>
                <button className="btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      {/* Modals */}
      {showChangePwd && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Change Password</h3>
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" name="currentPassword" value={pwdForm.currentPassword} onChange={handlePwdChange} />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" name="newPassword" value={pwdForm.newPassword} onChange={handlePwdChange} />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" name="confirmPassword" value={pwdForm.confirmPassword} onChange={handlePwdChange} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowChangePwd(false)}>Cancel</button>
              <button className="btn btn-success" onClick={submitChangePassword}>Change</button>
            </div>
          </div>
        </div>
      )}

      {showNotifications && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Notification Settings</h3>
            <div className="form-group">
              <label>
                <input type="checkbox" checked={notif.email} onChange={() => toggleNotif('email')} /> Email Notifications
              </label>
            </div>
            <div className="form-group">
              <label>
                <input type="checkbox" checked={notif.sms} onChange={() => toggleNotif('sms')} /> SMS Notifications
              </label>
            </div>
            <div className="form-group">
              <label>
                <input type="checkbox" checked={notif.push} onChange={() => toggleNotif('push')} /> Push Notifications
              </label>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowNotifications(false)}>Cancel</button>
              <button className="btn btn-success" onClick={saveNotifications}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

