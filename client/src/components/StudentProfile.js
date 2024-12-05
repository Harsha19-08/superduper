import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './StudentProfile.css';

const StudentProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user?.name || "John Doe",
    class: "Final Year",
    section: "A",
    rollNo: "20CS235",
    stream: "BTECH",
    mobileNo: "+91 9876543210",
    email: user?.email || "john.doe@example.com",
    department: "Computer Science",
    semester: "8th",
    admissionYear: "2020"
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    darkMode: true,
    language: 'English',
    showGrades: true,
    showProgress: true
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSettingsChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleLanguageChange = (e) => {
    setSettings(prev => ({
      ...prev,
      language: e.target.value
    }));
  };

  const handleSaveProfile = () => {
    // Here you would typically make an API call to save the profile
    setIsEditing(false);
  };

  const handleSaveSettings = () => {
    // Here you would typically make an API call to save the settings
    alert('Settings saved successfully!');
  };

  return (
    <div className="student-profile-container">
      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button 
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      {activeTab === 'profile' ? (
        <div className="profile-content">
          <div className="profile-header">
            <h2>Student Profile</h2>
            <button 
              className="edit-btn"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <div className="profile-card">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {formData.name.charAt(0)}
              </div>
            </div>

            <div className="profile-details">
              {Object.entries(formData).map(([key, value]) => (
                <div className="detail-row" key={key}>
                  <div className="detail-item">
                    <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name={key}
                        value={value}
                        onChange={handleInputChange}
                        className="edit-input"
                      />
                    ) : (
                      <p>{value}</p>
                    )}
                  </div>
                </div>
              ))}

              {isEditing && (
                <div className="profile-actions">
                  <button className="save-btn" onClick={handleSaveProfile}>
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="settings-content">
          <div className="settings-header">
            <h2>Settings</h2>
          </div>

          <div className="settings-card">
            <div className="settings-section">
              <h3>Preferences</h3>
              
              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={() => handleSettingsChange('emailNotifications')}
                  />
                  Email Notifications
                </label>
              </div>

              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={() => handleSettingsChange('darkMode')}
                  />
                  Dark Mode
                </label>
              </div>

              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.showGrades}
                    onChange={() => handleSettingsChange('showGrades')}
                  />
                  Show Grades on Dashboard
                </label>
              </div>

              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.showProgress}
                    onChange={() => handleSettingsChange('showProgress')}
                  />
                  Show Progress Tracking
                </label>
              </div>

              <div className="setting-item">
                <label>Language</label>
                <select 
                  value={settings.language}
                  onChange={handleLanguageChange}
                  className="language-select"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Spanish">Spanish</option>
                </select>
              </div>
            </div>

            <div className="settings-actions">
              <button className="save-btn" onClick={handleSaveSettings}>
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
