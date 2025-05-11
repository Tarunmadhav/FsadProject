import React from 'react';
import { Clock } from 'lucide-react';
import FileList from '../components/FileList';
import { useFileStore } from '../store/fileStore';
import { useNavigate } from 'react-router-dom';

const RecentPage: React.FC = () => {
  const navigate = useNavigate();
  const { usageStats } = useFileStore();
  
  return (
    <div className="h-full">
      <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
        Back
      </button>
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Clock className="h-6 w-6 text-blue-500 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">
            Recent Files
          </h1>
        </div>
        
        <p className="text-gray-600">
          Files you've recently accessed or modified
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
        <div className="space-y-3">
          {usageStats.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  You {activity.action} <span className="text-blue-600">{activity.fileName}</span>
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(activity.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <FileList />
    </div>
  );
};

export default RecentPage;