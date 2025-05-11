import React, { useState, useRef } from 'react';
import { Grid, List, Upload, SlidersHorizontal, Plus, UploadCloud } from 'lucide-react';
import FileList from '../components/FileList';
import { useFileStore } from '../store/fileStore';
import { v4 as uuidv4 } from 'uuid';

const FilesPage: React.FC = () => {
  const { currentFolder, files, addFile, currentUser } = useFileStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [fileTypeFilter, setFileTypeFilter] = useState('all');
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const folderInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFolderUpload = () => {
    if (folderInputRef.current) {
      folderInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        addFile({
          id: uuidv4(),
          name: file.name,
          type: file.type,
          size: file.size,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: currentUser?.id || 'unknown',
          parentId: currentFolder,
          isFolder: false,
          starred: false,
          permissions: [],
          versions: [],
          currentVersionId: '',
        });
      });
    }
  };

  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        addFile({
          id: uuidv4(),
          name: file.webkitRelativePath || file.name,
          type: file.type,
          size: file.size,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: currentUser?.id || 'unknown',
          parentId: currentFolder,
          isFolder: file.webkitRelativePath ? true : false,
          starred: false,
          permissions: [],
          versions: [],
          currentVersionId: '',
        });
      });
    }
  };

  const handleCreateFile = () => {
    const fileName = prompt('Enter the name of the new file:');
    if (fileName) {
      addFile({
        name: fileName,
        type: 'text/plain',
        size: 0,
        isFolder: false,
      });
      alert(`File '${fileName}' created successfully!`);
    }
  };

  // Get current folder name
  const currentFolderName = currentFolder 
    ? files.find(f => f.id === currentFolder)?.name || 'Unknown Folder'
    : 'My Files';
  
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    
    // In a real app, this would upload the files
    console.log('Dropped files:', droppedFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 bg-white shadow">
        <h1 className="text-xl font-bold">Files</h1>
        <div className="flex space-x-4">
          <button
            onClick={handleFileUpload}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <UploadCloud className="h-5 w-5 mr-2" /> Upload Files
          </button>
          <button
            onClick={handleFolderUpload}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <UploadCloud className="h-5 w-5 mr-2" /> Upload Folder
          </button>
          <button
            onClick={handleCreateFile}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Plus className="h-5 w-5 mr-2" /> Create File
          </button>
        </div>
      </header>

      <input
        type="file"
        ref={fileInputRef}
        multiple
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <input
        type="file"
        ref={folderInputRef}
        style={{ display: 'none' }}
        onChange={handleFolderChange}
        {...{ webkitdirectory: true }}
      />

      <div 
        className="h-full"
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}
      >
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {currentFolderName}
            </h1>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${
                  viewMode === 'grid' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${
                  viewMode === 'list' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-md ${
                  showFilters
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <SlidersHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {showFilters && (
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="name">Name</option>
                  <option value="date">Date Modified</option>
                  <option value="size">Size</option>
                  <option value="type">File Type</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File Type
                </label>
                <select
                  value={fileTypeFilter}
                  onChange={(e) => setFileTypeFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Files</option>
                  <option value="image">Images</option>
                  <option value="document">Documents</option>
                  <option value="video">Videos</option>
                  <option value="audio">Audio</option>
                  <option value="archive">Archives</option>
                </select>
              </div>
            </div>
          )}
        </div>
        
        <FileList />
        
        {/* Drop Zone Overlay - shown when dragging files */}
        <div 
          id="dropzone-overlay" 
          className="fixed inset-0 bg-blue-600 bg-opacity-70 z-50 hidden flex items-center justify-center"
        >
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <Upload className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Drop files to upload</h2>
            <p className="text-gray-600">Your files will be uploaded to the current folder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilesPage;