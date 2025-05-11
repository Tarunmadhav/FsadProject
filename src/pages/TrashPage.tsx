import React from 'react';
import { Trash2 } from 'lucide-react';
import FileList from '../components/FileList';
import { useNavigate } from 'react-router-dom';

const TrashPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full">
      <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
        Back
      </button>
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Trash2 className="h-6 w-6 text-red-500 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">
            Trash
          </h1>
        </div>
        
        <p className="text-gray-600">
          Files in trash will be automatically deleted after 30 days
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <Trash2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Trash is empty</h3>
        <p className="mt-1 text-sm text-gray-500">
          Items you delete will appear here for 30 days before being permanently removed.
        </p>
      </div>
    </div>
  );
};

export default TrashPage;