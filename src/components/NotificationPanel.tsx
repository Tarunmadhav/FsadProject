import React from 'react';
import { Bell, Check, X } from 'lucide-react';
import { useFileStore } from '../store/fileStore';
import { formatDate } from '../utils/formatters';

interface NotificationPanelProps {
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const { 
    notifications, 
    markNotificationAsRead, 
    clearAllNotifications 
  } = useFileStore();
  
  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-30 flex justify-end"
      onClick={handleClickOutside}
    >
      <div className="w-96 bg-white h-full shadow-lg overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <div className="flex space-x-2">
            <button 
              onClick={clearAllNotifications}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Mark all as read
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {notifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
              <p className="mt-1 text-sm text-gray-500">
                You're all caught up! Check back later for updates.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 hover:bg-gray-50 ${notification.read ? '' : 'bg-blue-50'}`}
              >
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.message}
                  </p>
                  {!notification.read && (
                    <button 
                      onClick={() => markNotificationAsRead(notification.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(notification.createdAt)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;