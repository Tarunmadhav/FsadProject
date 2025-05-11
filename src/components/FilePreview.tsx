import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Share2, 
  Star, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  FileText,
  Image,
  Video,
  Music,
  File,
  Clock
} from 'lucide-react';
import { useFileStore } from '../store/fileStore';
import { FileItem, FileVersion } from '../types';
import { formatFileSize, formatDate, getFileIcon } from '../utils/formatters';
import ShareModal from './ShareModal';

interface FilePreviewProps {
  file: FileItem;
  onClose: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onClose }) => {
  const { 
    starFile, 
    deleteFile, 
    addFileVersion,
    files
  } = useFileStore();
  
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<string>(file.currentVersionId);
  const [showVersions, setShowVersions] = useState(false);
  
  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;
    
    await addFileVersion(file.id, {
      name: uploadedFile.name
    }, uploadedFile);
  };
  
  // Get current version
  const currentVersion = file.versions.find(v => v.id === selectedVersion) || file.versions[0];
  
  // Get next and previous files
  const currentFolderFiles = files.filter(f => f.parentId === file.parentId && !f.isFolder);
  const currentIndex = currentFolderFiles.findIndex(f => f.id === file.id);
  const prevFile = currentIndex > 0 ? currentFolderFiles[currentIndex - 1] : null;
  const nextFile = currentIndex < currentFolderFiles.length - 1 ? currentFolderFiles[currentIndex + 1] : null;
  
  // Render preview based on file type
  const renderPreview = () => {
    if (!currentVersion) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No preview available</p>
        </div>
      );
    }
    
    if (file.type.startsWith('image/')) {
      return (
        <img 
          src={file.previewUrl || currentVersion.url} 
          alt={file.name}
          className="max-h-full max-w-full object-contain"
        />
      );
    }
    
    if (file.type.startsWith('video/')) {
      return (
        <video 
          src={currentVersion.url} 
          controls
          className="max-h-full max-w-full"
        >
          Your browser does not support video playback.
        </video>
      );
    }
    
    if (file.type.startsWith('audio/')) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <Music className="h-24 w-24 text-gray-400 mb-4" />
          <audio 
            src={currentVersion.url} 
            controls
            className="w-full max-w-md"
          >
            Your browser does not support audio playback.
          </audio>
        </div>
      );
    }
    
    if (file.type.includes('pdf')) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <FileText className="h-24 w-24 text-red-500 mb-4" />
          <p className="text-gray-700 mb-4">PDF Preview</p>
          {file.previewUrl ? (
            <img 
              src={file.previewUrl} 
              alt={file.name}
              className="max-h-64 max-w-full object-contain"
            />
          ) : (
            <p className="text-gray-500">Preview not available</p>
          )}
        </div>
      );
    }
    
    // Default preview for other file types
    const IconComponent = (() => {
      const iconName = getFileIcon(file.type);
      switch (iconName) {
        case 'Image': return Image;
        case 'Video': return Video;
        case 'Music': return Music;
        case 'FileText': return FileText;
        default: return File;
      }
    })();
    
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <IconComponent className="h-24 w-24 text-gray-400 mb-4" />
        <p className="text-gray-700">{file.name}</p>
        <p className="text-gray-500 mt-2">{formatFileSize(file.size)}</p>
      </div>
    );
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center"
      onClick={handleClickOutside}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold truncate max-w-lg">{file.name}</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => starFile(file.id, !file.starred)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Star className={`h-5 w-5 ${file.starred ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`} />
            </button>
            <button 
              onClick={() => setShowShareModal(true)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Share2 className="h-5 w-5 text-gray-500" />
            </button>
            <button 
              onClick={() => {
                // In a real app, this would download the file
                window.open(currentVersion?.url, '_blank');
              }}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Download className="h-5 w-5 text-gray-500" />
            </button>
            <button 
              onClick={() => {
                deleteFile(file.id);
                onClose();
              }}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Trash2 className="h-5 w-5 text-gray-500" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden relative">
          {/* Preview Content */}
          <div className="h-full flex items-center justify-center p-4">
            {renderPreview()}
          </div>
          
          {/* Navigation Arrows */}
          {prevFile && (
            <button 
              onClick={() => {
                onClose();
                // Open previous file
                const previewEvent = new CustomEvent('preview-file', { detail: prevFile });
                window.dispatchEvent(previewEvent);
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-75 hover:bg-opacity-100 shadow-md"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
          )}
          
          {nextFile && (
            <button 
              onClick={() => {
                onClose();
                // Open next file
                const previewEvent = new CustomEvent('preview-file', { detail: nextFile });
                window.dispatchEvent(previewEvent);
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-75 hover:bg-opacity-100 shadow-md"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>
          )}
        </div>
        
        <div className="p-4 border-t">
          <div className="flex justify-between items-center">
            <div>
              <button
                onClick={() => setShowVersions(!showVersions)}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <Clock className="h-4 w-4 mr-1" />
                {showVersions ? 'Hide version history' : 'Show version history'}
              </button>
            </div>
            
            <div>
              <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                Upload New Version
              </label>
            </div>
          </div>
          
          {showVersions && (
            <div className="mt-4 border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Version
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Modified
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Modified By
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {file.versions.map((version, index) => (
                    <tr 
                      key={version.id}
                      className={`hover:bg-gray-50 cursor-pointer ${version.id === selectedVersion ? 'bg-blue-50' : ''}`}
                      onClick={() => setSelectedVersion(version.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {`Version ${file.versions.length - index}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(version.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatFileSize(version.size)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {version.createdBy === 'user-1' ? 'You' : 'Other User'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {showShareModal && (
        <ShareModal 
          file={file} 
          onClose={() => setShowShareModal(false)} 
        />
      )}
    </div>
  );
};

export default FilePreview;