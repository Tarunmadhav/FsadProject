import React, { useState } from 'react';
import { X, Copy, Link, Lock, Calendar, Users } from 'lucide-react';
import { useFileStore } from '../store/fileStore';
import { FileItem, FilePermission, User } from '../types';

interface ShareModalProps {
  file: FileItem;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ file, onClose }) => {
  const { generateShareLink, shareFile } = useFileStore();
  
  const [shareLink, setShareLink] = useState<string>(file.shareLink || '');
  const [expiryDate, setExpiryDate] = useState<string>(
    file.shareExpiry 
      ? new Date(file.shareExpiry).toISOString().split('T')[0]
      : ''
  );
  const [password, setPassword] = useState<string>(file.sharePassword || '');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>('');
  const [accessLevel, setAccessLevel] = useState<'view' | 'edit'>('view');
  const [linkCopied, setLinkCopied] = useState<boolean>(false);
  
  // Mock users for demo
  const mockUsers: User[] = [
    { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com', avatar: 'https://i.pravatar.cc/150?u=user-2' },
    { id: 'user-3', name: 'Bob Johnson', email: 'bob@example.com', avatar: 'https://i.pravatar.cc/150?u=user-3' },
    { id: 'user-4', name: 'Alice Williams', email: 'alice@example.com', avatar: 'https://i.pravatar.cc/150?u=user-4' }
  ];
  
  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  const handleGenerateLink = () => {
    const expiry = expiryDate ? new Date(expiryDate) : undefined;
    const newLink = generateShareLink(file.id, expiry, password || undefined);
    setShareLink(newLink);
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };
  
  const handleAddUser = () => {
    if (!emailInput.trim()) return;
    
    // In a real app, this would validate the email and find the user
    const user = mockUsers.find(u => u.email === emailInput);
    
    if (user) {
      // Check if user already has access
      const hasAccess = file.permissions.some(p => p.userId === user.id);
      
      if (!hasAccess) {
        const newPermissions: FilePermission[] = [
          ...file.permissions,
          { userId: user.id, access: accessLevel }
        ];
        
        shareFile(file.id, newPermissions);
      }
    } else {
      // In a real app, this would send an invitation email
      alert(`Invitation sent to ${emailInput}`);
    }
    
    setEmailInput('');
  };
  
  const handleRemovePermission = (userId: string) => {
    const newPermissions = file.permissions.filter(p => p.userId !== userId);
    shareFile(file.id, newPermissions);
  };
  
  const handleUpdatePermission = (userId: string, access: 'view' | 'edit' | 'owner') => {
    const newPermissions = file.permissions.map(p => 
      p.userId === userId ? { ...p, access } : p
    );
    
    shareFile(file.id, newPermissions);
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={handleClickOutside}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Share "{file.name}"</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Share Link
            </label>
            <div className="flex">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 p-2 border border-gray-300 rounded-l-md text-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleCopyLink}
                className={`px-3 py-2 rounded-r-md ${
                  linkCopied 
                    ? 'bg-green-500 text-white' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {linkCopied ? 'Copied!' : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showAdvanced ? 'Hide advanced options' : 'Show advanced options'}
            </button>
            
            {showAdvanced && (
              <div className="mt-2 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Expiration Date
                    </div>
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <Lock className="h-4 w-4 mr-1" />
                      Password Protection
                    </div>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Set a password (optional)"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <button
                  onClick={handleGenerateLink}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
                >
                  <Link className="h-4 w-4 mr-2" />
                  Generate Link
                </button>
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                Share with people
              </div>
            </label>
            <div className="flex">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter email address"
                className="flex-1 p-2 border border-gray-300 rounded-l-md text-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <select
                value={accessLevel}
                onChange={(e) => setAccessLevel(e.target.value as 'view' | 'edit')}
                className="p-2 border-y border-r border-gray-300 rounded-r-md text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="view">Can view</option>
                <option value="edit">Can edit</option>
              </select>
            </div>
            <button
              onClick={handleAddUser}
              className="mt-2 w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Share
            </button>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">People with access</h3>
            <ul className="space-y-2">
              {file.permissions.map((permission) => {
                // Find user info
                const user = [
                  { id: 'user-1', name: 'John Doe', email: 'john@example.com', avatar: 'https://i.pravatar.cc/150?u=user-1' },
                  ...mockUsers
                ].find(u => u.id === permission.userId);
                
                if (!user) return null;
                
                return (
                  <li key={permission.userId} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <div className="ml-2">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {permission.access !== 'owner' ? (
                        <>
                          <select
                            value={permission.access}
                            onChange={(e) => handleUpdatePermission(
                              permission.userId, 
                              e.target.value as 'view' | 'edit' | 'owner'
                            )}
                            className="mr-2 p-1 text-xs border border-gray-300 rounded"
                          >
                            <option value="view">Viewer</option>
                            <option value="edit">Editor</option>
                          </select>
                          
                          <button
                            onClick={() => handleRemovePermission(permission.userId)}
                            className="text-gray-500 hover:text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-gray-500">Owner</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;