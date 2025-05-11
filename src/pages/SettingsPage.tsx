import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const savedDarkMode = localStorage.getItem('darkMode') === 'true';
  const [isDarkMode, setIsDarkMode] = useState(savedDarkMode);
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
        Back
      </button>
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Appearance</h2>
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isDarkMode ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mt-6">
        <h2 className="text-lg font-semibold mb-2">File Sharing</h2>
        <p className="text-gray-700 dark:text-gray-300">Manage your file sharing preferences and permissions.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mt-6">
        <h2 className="text-lg font-semibold mb-2">Notifications</h2>
        <p className="text-gray-700 dark:text-gray-300">Customize your notification preferences.</p>
      </div>
    </div>
  );
};

export default SettingsPage;
