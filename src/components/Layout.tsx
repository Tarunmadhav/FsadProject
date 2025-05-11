import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useFileStore } from '../store/fileStore';

const Layout: React.FC = () => {
  const { currentUser, notifications } = useFileStore();
  const unreadNotifications = notifications.filter(n => !n.read).length;
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          user={currentUser} 
          unreadNotifications={unreadNotifications} 
        />
        
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;