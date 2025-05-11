import React from 'react';
import { Star } from 'lucide-react';
import FileList from '../components/FileList';
import { useFileStore } from '../store/fileStore';
import { useNavigate } from 'react-router-dom';

const StarredPage: React.FC = () => {
  const { files } = useFileStore();
  const navigate = useNavigate();
  
  // Count starred files
  const starredCount = files.filter(file => file.starred).length;
  
  return (
    <div className="h-full">
      <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
        Back
      </button>
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Star className="h-6 w-6 text-yellow-400 fill-yellow-400 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">
            Starred
          </h1>
        </div>
        
        <p className="text-gray-600">
          {starredCount} items starred
        </p>
      </div>
      
      <FileList />
    </div>
  );
};

export default StarredPage;