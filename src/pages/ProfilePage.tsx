import React, { useState, useEffect } from 'react';
import { useFileStore } from '../store/fileStore';

const ProfilePage: React.FC = () => {
  const { currentUser, setCurrentUser, addNotification } = useFileStore();
  const [activeTab, setActiveTab] = useState<'account' | 'security' | 'notifications' | 'storage'>('account');

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [isChanged, setIsChanged] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Simulate fetching user data after login/signup
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (!currentUser) {
      fetchUserData();
    }
  }, [currentUser, setCurrentUser]);

  useEffect(() => {
    if (currentUser) {
      if (name !== currentUser.name || email !== currentUser.email || avatar !== currentUser.avatar) {
        setIsChanged(true);
      } else {
        setIsChanged(false);
      }
    }
  }, [name, email, avatar, currentUser]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSaveChanges = () => {
    if (currentUser) {
      // Simulate user update logic
      console.log('User updated:', { name, email, avatar });
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
      addNotification({
        id: Date.now().toString(),
        userId: currentUser.id, // Assuming currentUser has an id property
        message: 'Profile updated successfully!',
        type: 'system',
        read: false,
        createdAt: new Date(), // Changed to Date object to match the expected type
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 bg-blue-500 text-white">
          <div className="flex items-center">
            <img
              src={avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`}
              alt={name}
              className="h-20 w-20 rounded-full object-cover border-4 border-white"
            />
            <div className="ml-4">
              <h1 className="text-xl font-bold">{name}</h1>
              <p className="text-sm">{email}</p>
              <p className="text-sm">Free Account</p>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 px-6">
            <button
              onClick={() => setActiveTab('account')}
              className={`py-2 px-4 font-medium text-sm rounded-md ${
                activeTab === 'account'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Account
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-2 px-4 font-medium text-sm rounded-md ${
                activeTab === 'security'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Security
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-2 px-4 font-medium text-sm rounded-md ${
                activeTab === 'notifications'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('storage')}
              className={`py-2 px-4 font-medium text-sm rounded-md ${
                activeTab === 'storage'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Storage
            </button>
          </nav>
        </div>

        <div className="p-6 sm:p-8">
          {activeTab === 'account' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">Account Information</h2>
              <div className="space-y-6 max-w-xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Picture
                  </label>
                  <div className="flex items-center">
                    <img
                      src={avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`}
                      alt={name}
                      className="h-12 w-12 rounded-full object-cover mr-4"
                    />
                    <label className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700">
                      Change Picture
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <button
                  onClick={handleSaveChanges}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
                  disabled={!isChanged}
                >
                  Save Changes
                </button>
                {showPopup && (
                  <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md">
                    Changes saved successfully!
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">Security Settings</h2>
              <div className="bg-white rounded-lg shadow p-8 max-w-xl">
                <h3 className="text-lg font-medium text-gray-800 mb-6">Change Password</h3>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input type="password" placeholder="Enter current password" className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input type="password" placeholder="Enter new password" className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input type="password" placeholder="Confirm new password" className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <button type="submit" className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition">Update Password</button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">Notifications</h2>
              <div className="bg-white rounded-lg shadow p-6 max-w-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Recent Notifications</h3>
                  <button className="text-blue-600 hover:underline text-sm">Mark all as read</button>
                </div>
                <ul className="divide-y divide-gray-200">
                  <li className="py-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-800 font-medium">Jane Doe shared "Marketing Plan.docx" with you</p>
                        <p className="text-gray-500 text-sm">Feb 10, 2025</p>
                      </div>
                      <span className="text-blue-500">✔</span>
                    </div>
                  </li>
                  <li className="py-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-800 font-medium">Your file "Team Photo.jpg" was viewed 5 times</p>
                        <p className="text-gray-500 text-sm">Feb 9, 2025</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'storage' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-6">Storage Usage</h2>
              <div className="mb-6">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Storage Space</span>
                  <span className="text-sm text-gray-500">7.15 MB of 10 GB used</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '7%' }}></div>
                </div>
                <div className="mb-4">
                  <div className="font-semibold text-blue-700 mb-2">Storage Breakdown</div>
                  <div className="flex items-center mb-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                    <span className="font-medium">Documents</span>
                    <span className="ml-auto text-sm">2.5 GB</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
                    <span className="font-medium">Images</span>
                    <span className="ml-auto text-sm">4.2 GB</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                    <span className="font-medium">Videos</span>
                    <span className="ml-auto text-sm">1.8 GB</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-gray-500 mr-2"></span>
                    <span className="font-medium">Other</span>
                    <span className="ml-auto text-sm">0.5 GB</span>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="mb-2 font-semibold">Upgrade Plan</div>
                  <div className="mb-2 text-sm text-blue-900">
                    Upgrade to Premium for more storage and advanced features
                  </div>
                  <ul className="text-sm text-blue-900 mb-2 list-disc pl-5">
                    <li>100 GB storage space</li>
                    <li>Advanced file versioning</li>
                    <li>Enhanced security features</li>
                    <li>Priority support</li>
                  </ul>
                  <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Upgrade Now</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;