import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Upload, 
  Plus, 
  Folder, 
  File, 
  X,
  Check
} from 'lucide-react';
import { useFileStore } from '../store/fileStore';
import { User } from '../types';
import NotificationPanel from './NotificationPanel';

interface HeaderProps {
  user: User;
  unreadNotifications: number;
}

const Header: React.FC<HeaderProps> = ({ user, unreadNotifications }) => {
  const { 
    setSearchQuery, 
    addFile, 
    isUploading,
    uploadProgress
  } = useFileStore();
  
  const [searchValue, setSearchValue] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchValue);
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Upload each file
    Array.from(files).forEach(async (file) => {
      await addFile({
        name: file.name,
        type: file.type,
        size: file.size,
        isFolder: false
      }, file);
    });
    
    setShowUploadMenu(false);
  };
  
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    
    setIsCreatingFolder(true);
    
    await addFile({
      name: newFolderName,
      type: 'folder',
      isFolder: true,
      size: 0
    });
    
    setNewFolderName('');
    setIsCreatingFolder(false);
    setShowCreateMenu(false);
  };

  const handleCreateFile = () => {
    if (!newFileName.trim()) return;
    addFile({
      name: newFileName,
      type: 'text/plain',
      size: 0,
      isFolder: false,
    });
    setNewFileName('');
    setIsCreatingFile(false);
  };
  
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <form onSubmit={handleSearch} className="w-full max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search files and folders..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </form>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Upload Button */}
          <div className="relative">
            <button
              onClick={() => setShowUploadMenu(!showUploadMenu)}
              className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <Upload className="h-5 w-5 mr-1" />
              <span>Upload</span>
            </button>
            
            {showUploadMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <label className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  Upload Files
                </label>
                <label className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  Upload Folder
                </label>
              </div>
            )}
          </div>
          
          {/* Create New Button */}
          <div className="relative">
            <button
              onClick={() => setShowCreateMenu(!showCreateMenu)}
              className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <Plus className="h-5 w-5 mr-1" />
              <span>Create New</span>
            </button>
            
            {showCreateMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-10">
                <div className="px-4 py-2">
                  <form onSubmit={handleCreateFolder}>
                    <div className="flex items-center">
                      <Folder className="h-5 w-5 text-blue-500 mr-2" />
                      <input
                        type="text"
                        className="flex-1 p-1 text-sm border border-gray-300 rounded"
                        placeholder="New Folder Name"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        autoFocus
                      />
                      <button
                        type="submit"
                        disabled={isCreatingFolder}
                        className="ml-2 p-1 text-blue-600 hover:text-blue-800"
                      >
                        {isCreatingFolder ? (
                          <span className="animate-spin">⌛</span>
                        ) : (
                          <Check className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </form>
                </div>
                {isCreatingFile ? (
                  <div className="px-4 py-2">
                    <input
                      type="text"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      placeholder="Enter file name"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleCreateFile}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Create
                      </button>
                      <button
                        onClick={() => setIsCreatingFile(false)}
                        className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsCreatingFile(true)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                  >
                    <File className="h-5 w-5 mr-2 text-blue-500" />
                    New File
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1 rounded-full text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              <Bell className="h-6 w-6" />
              {unreadNotifications > 0 && (
                <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <NotificationPanel onClose={() => setShowNotifications(false)} />
            )}
          </div>
          
          {/* User Profile */}
          <Link to="/profile" className="flex items-center">
            <img
              className="h-8 w-8 rounded-full object-cover"
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
              alt={user.name}
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              {user.name}
            </span>
          </Link>
        </div>
      </div>
      
      {/* Upload Progress */}
      {isUploading && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 w-80 z-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Uploading Files...</h3>
            <button className="text-gray-500 hover:text-gray-700">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {uploadProgress}% complete
          </p>
        </div>
      )}
    </header>
  );
};

export default Header;