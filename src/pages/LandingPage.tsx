import React from 'react';
import Sidebar from '../components/Sidebar';

const LandingPage: React.FC = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6 bg-gray-50">
        <header className="flex flex-col items-center justify-center mb-6">
          <h1 className="text-5xl font-extrabold text-blue-600 mb-4 text-center">Welcome to the File Sharer App</h1>
          <p className="text-xl text-gray-700 text-center">Your secure and efficient file management solution.</p>
        </header>

        {/* Storage Usage */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2 text-center">Storage Usage</h2>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '7%' }}></div>
          </div>
          <p className="text-sm text-gray-500 text-center">7.15 MB of 10 GB used</p>
        </div>

        {/* Removed other content */}
      </div>
    </div>
  );
};

export default LandingPage;
