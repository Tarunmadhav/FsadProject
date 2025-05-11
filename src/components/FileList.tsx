import React, { useState } from 'react';
import { useFileStore } from '../store/fileStore';
import { FileItem } from '../types';
import { getFileIcon } from '../utils/formatters';

const generateSharableLink = (file: FileItem) => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/shared/${file.id}`;
};

const downloadFile = (file: FileItem) => {
  if (!file.previewUrl) {
    alert('File preview URL is not available for download.');
    return;
  }

  const a = document.createElement('a');
  a.href = file.previewUrl;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const FileList: React.FC = () => {
  const { files, updateFile } = useFileStore();
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [accessType, setAccessType] = useState<'view' | 'edit' | 'owner'>('view');

  const handleShare = (file: FileItem) => {
    setSelectedFile(file);
    setAccessType(file.permissions[0]?.access || 'view');
  };

  const handleSaveAccess = () => {
    if (selectedFile) {
      updateFile(selectedFile.id, {
        permissions: [{ userId: 'currentUserId', access: accessType }],
      });
      const link = generateSharableLink(selectedFile);
      navigator.clipboard.writeText(link);
      alert(`Sharable link copied: ${link}`);
      setSelectedFile(null);
    }
  };

  return (
    <div>
      {files.map((file) => (
        <div key={file.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow mb-4">
          <div className="flex items-center">
            <span className="mr-4">{getFileIcon(file.type)}</span>
            <span>{file.name}</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleShare(file)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Share
            </button>
            <button
              onClick={() => downloadFile(file)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Download
            </button>
          </div>
        </div>
      ))}

      {selectedFile && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Set Access Type</h2>
            <select
              value={accessType}
              onChange={(e) => setAccessType(e.target.value as 'view' | 'edit' | 'owner')}
              className="mb-4 p-2 border rounded"
            >
              <option value="view">View</option>
              <option value="edit">Edit</option>
              <option value="owner">Owner</option>
            </select>
            <div className="flex space-x-4">
              <button
                onClick={handleSaveAccess}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save & Copy Link
              </button>
              <button
                onClick={() => setSelectedFile(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileList;