import React, { useState } from 'react';
import { Share2, Users } from 'lucide-react';
import FileList from '../components/FileList';
import { useFileStore } from '../store/fileStore';
import { useNavigate } from 'react-router-dom';

const SharedPage: React.FC = () => {
  const { files } = useFileStore();
  const [activeTab, setActiveTab] = useState<'shared-with-me' | 'shared-by-me'>('shared-with-me');
  const navigate = useNavigate();
  
  // Files shared with the current user (mock data for demo)
  const sharedWithMe = files.filter(file => 
    file.permissions.some(p => p.userId !== 'user-1' && p.access !== 'owner')
  );
  
  // Files shared by the current user
  const sharedByMe = files.filter(file => 
    file.permissions.some(p => p.userId !== 'user-1') && 
    file.permissions.some(p => p.userId === 'user-1' && p.access === 'owner')
  );
  
  return (
    <div className="h-full">
      <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
        Back
      </button>
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Share2 className="h-6 w-6 text-blue-500 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">
            Shared Files
          </h1>
        </div>
        
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('shared-with-me')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'shared-with-me'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Shared with me
            </button>
            <button
              onClick={() => setActiveTab('shared-by-me')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'shared-by-me'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Shared by me
            </button>
          </nav>
        </div>
      </div>
      
      {activeTab === 'shared-with-me' && sharedWithMe.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No files shared with you</h3>
          <p className="mt-1 text-sm text-gray-500">
            When someone shares files or folders with you, they'll appear here.
          </p>
        </div>
      ) : activeTab === 'shared-by-me' && sharedByMe.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Share2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">You haven't shared any files</h3>
          <p className="mt-1 text-sm text-gray-500">
            Files and folders you share with others will appear here.
          </p>
        </div>
      ) : (
        <FileList />
      )}
    </div>
  );
};

export default SharedPage;