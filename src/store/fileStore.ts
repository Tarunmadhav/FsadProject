import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { FileItem, FileVersion, Notification, UsageStats, User } from '../types';

interface FileState {
  files: FileItem[];
  currentUser: User | null;
  notifications: Notification[];
  usageStats: UsageStats;
  currentFolder: string | null;
  selectedFiles: string[];
  searchQuery: string;
  isUploading: boolean;
  uploadProgress: number;

  // Actions
  setCurrentUser: (user: User) => void;
  addFile: (file: Partial<FileItem>, content?: File) => Promise<FileItem>;
  updateFile: (id: string, updates: Partial<FileItem>) => void;
  deleteFile: (id: string) => void;
  moveFile: (id: string, newParentId: string | null) => void;
  starFile: (id: string, starred: boolean) => void;
  addFileVersion: (fileId: string, version: Partial<FileVersion>, content?: File) => Promise<void>;
  shareFile: (id: string, permissions: FileItem['permissions']) => string;
  generateShareLink: (id: string, expiry?: Date, password?: string) => string;
  navigateToFolder: (folderId: string | null) => void;
  selectFile: (id: string, selected: boolean) => void;
  selectAllFiles: (selected: boolean) => void;
  setSearchQuery: (query: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (notification: Notification) => void;
}

// Mock data for demo purposes
const mockFiles: FileItem[] = [
  {
    id: 'folder-1',
    name: 'My Documents',
    type: 'folder',
    size: 0,
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15'),
    createdBy: 'user-1',
    parentId: null,
    isFolder: true,
    starred: false,
    permissions: [{ userId: 'user-1', access: 'owner' }],
    versions: [],
    currentVersionId: '',
  },
  {
    id: 'folder-2',
    name: 'Work Projects',
    type: 'folder',
    size: 0,
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-01-20'),
    createdBy: 'user-1',
    parentId: null,
    isFolder: true,
    starred: true,
    permissions: [{ userId: 'user-1', access: 'owner' }],
    versions: [],
    currentVersionId: '',
  },
  {
    id: 'file-1',
    name: 'Project Proposal.pdf',
    type: 'application/pdf',
    size: 2500000,
    createdAt: new Date('2025-01-25'),
    updatedAt: new Date('2025-02-01'),
    createdBy: 'user-1',
    parentId: 'folder-2',
    isFolder: false,
    starred: false,
    permissions: [{ userId: 'user-1', access: 'owner' }],
    versions: [
      {
        id: 'version-1',
        name: 'Project Proposal v1.pdf',
        size: 2500000,
        type: 'application/pdf',
        createdAt: new Date('2025-01-25'),
        createdBy: 'user-1',
        url: 'https://example.com/files/project-proposal-v1.pdf'
      }
    ],
    currentVersionId: 'version-1',
    previewUrl: 'https://example.com/previews/project-proposal.png'
  },
  {
    id: 'file-2',
    name: 'Team Photo.jpg',
    type: 'image/jpeg',
    size: 5000000,
    createdAt: new Date('2025-01-30'),
    updatedAt: new Date('2025-01-30'),
    createdBy: 'user-1',
    parentId: null,
    isFolder: false,
    starred: true,
    permissions: [
      { userId: 'user-1', access: 'owner' },
      { userId: 'user-2', access: 'view' }
    ],
    versions: [
      {
        id: 'version-2',
        name: 'Team Photo.jpg',
        size: 5000000,
        type: 'image/jpeg',
        createdAt: new Date('2025-01-30'),
        createdBy: 'user-1',
        url: 'https://example.com/files/team-photo.jpg'
      }
    ],
    currentVersionId: 'version-2',
    shareLink: 'https://secureshare.app/s/abcd1234',
    shareExpiry: new Date('2025-03-30'),
    previewUrl: 'https://example.com/files/team-photo.jpg'
  }
];

const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    message: 'Jane Doe shared "Marketing Plan.docx" with you',
    read: false,
    createdAt: new Date('2025-02-10'),
    fileId: 'file-3',
    type: 'share'
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    message: 'Your file "Team Photo.jpg" was viewed 5 times',
    read: true,
    createdAt: new Date('2025-02-09'),
    fileId: 'file-2',
    type: 'system'
  }
];

const mockUsageStats: UsageStats = {
  totalStorage: 10737418240, // 10 GB in bytes
  usedStorage: 7500000, // 7.5 MB in bytes
  fileCount: 2,
  folderCount: 2,
  recentActivity: [
    {
      date: new Date('2025-02-01'),
      action: 'updated',
      fileId: 'file-1',
      fileName: 'Project Proposal.pdf'
    },
    {
      date: new Date('2025-01-30'),
      action: 'uploaded',
      fileId: 'file-2',
      fileName: 'Team Photo.jpg'
    }
  ]
};

export const useFileStore = create<FileState>((set, get) => ({
  files: mockFiles,
  currentUser: null,
  notifications: mockNotifications,
  usageStats: mockUsageStats,
  currentFolder: null,
  selectedFiles: [],
  searchQuery: '',
  isUploading: false,
  uploadProgress: 0,
  
  setCurrentUser: (user) => set({ currentUser: user }),
  
  addFile: async (fileData, content) => {
    const { currentFolder } = get();
    
    // In a real app, this would upload the file to a server
    // For demo purposes, we're just creating a file object
    const newFile: FileItem = {
      id: uuidv4(),
      name: fileData.name || 'Untitled',
      type: fileData.type || 'application/octet-stream',
      size: fileData.size || (content?.size || 0),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'user-1',
      parentId: currentFolder,
      isFolder: fileData.isFolder || false,
      starred: false,
      permissions: [{ userId: 'user-1', access: 'owner' }],
      versions: [],
      currentVersionId: '',
      ...fileData
    };
    
    // If it's a file (not a folder) and we have content, create the first version
    if (!newFile.isFolder && content) {
      const version: FileVersion = {
        id: uuidv4(),
        name: newFile.name,
        size: content.size,
        type: content.type,
        createdAt: new Date(),
        createdBy: 'user-1',
        url: URL.createObjectURL(content) // In a real app, this would be a server URL
      };
      
      newFile.versions = [version];
      newFile.currentVersionId = version.id;
      
      // For image files, create a preview URL
      if (content.type.startsWith('image/')) {
        newFile.previewUrl = URL.createObjectURL(content);
      }
    }
    
    set(state => ({
      files: [...state.files, newFile],
      usageStats: {
        ...state.usageStats,
        usedStorage: state.usageStats.usedStorage + newFile.size,
        fileCount: newFile.isFolder ? state.usageStats.fileCount : state.usageStats.fileCount + 1,
        folderCount: newFile.isFolder ? state.usageStats.folderCount + 1 : state.usageStats.folderCount,
        recentActivity: [
          {
            date: new Date(),
            action: 'uploaded',
            fileId: newFile.id,
            fileName: newFile.name
          },
          ...state.usageStats.recentActivity
        ]
      }
    }));
    
    return newFile;
  },
  
  updateFile: (id, updates) => {
    set(state => ({
      files: state.files.map(file => 
        file.id === id ? { ...file, ...updates, updatedAt: new Date() } : file
      )
    }));
  },
  
  deleteFile: (id) => {
    const { files } = get();
    const fileToDelete = files.find(f => f.id === id);
    
    if (!fileToDelete) return;
    
    // Also delete all children if it's a folder
    const getAllChildrenIds = (parentId: string): string[] => {
      const children = files.filter(f => f.parentId === parentId);
      const childrenIds = children.map(c => c.id);
      const nestedChildrenIds = children
        .filter(c => c.isFolder)
        .flatMap(folder => getAllChildrenIds(folder.id));
      
      return [...childrenIds, ...nestedChildrenIds];
    };
    
    const idsToDelete = fileToDelete.isFolder 
      ? [id, ...getAllChildrenIds(id)]
      : [id];
    
    set(state => ({
      files: state.files.filter(file => !idsToDelete.includes(file.id)),
      selectedFiles: state.selectedFiles.filter(fileId => !idsToDelete.includes(fileId)),
      usageStats: {
        ...state.usageStats,
        usedStorage: state.usageStats.usedStorage - fileToDelete.size,
        fileCount: fileToDelete.isFolder 
          ? state.usageStats.fileCount - idsToDelete.filter(id => !state.files.find(f => f.id === id)?.isFolder).length
          : state.usageStats.fileCount - 1,
        folderCount: fileToDelete.isFolder 
          ? state.usageStats.folderCount - idsToDelete.filter(id => state.files.find(f => f.id === id)?.isFolder).length
          : state.usageStats.folderCount,
        recentActivity: [
          {
            date: new Date(),
            action: 'deleted',
            fileId: fileToDelete.id,
            fileName: fileToDelete.name
          },
          ...state.usageStats.recentActivity
        ]
      }
    }));
  },
  
  moveFile: (id, newParentId) => {
    set(state => ({
      files: state.files.map(file => 
        file.id === id ? { ...file, parentId: newParentId, updatedAt: new Date() } : file
      ),
      usageStats: {
        ...state.usageStats,
        recentActivity: [
          {
            date: new Date(),
            action: 'moved',
            fileId: id,
            fileName: state.files.find(f => f.id === id)?.name || 'Unknown'
          },
          ...state.usageStats.recentActivity
        ]
      }
    }));
  },
  
  starFile: (id, starred) => {
    set(state => ({
      files: state.files.map(file => 
        file.id === id ? { ...file, starred } : file
      )
    }));
  },
  
  addFileVersion: async (fileId, versionData, content) => {
    if (!content) return;
    
    const { files } = get();
    const file = files.find(f => f.id === fileId);
    
    if (!file) return;
    
    const newVersion: FileVersion = {
      id: uuidv4(),
      name: versionData.name || file.name,
      size: content.size,
      type: content.type,
      createdAt: new Date(),
      createdBy: 'user-1',
      url: URL.createObjectURL(content), // In a real app, this would be a server URL
      ...versionData
    };
    
    // Update file with new version
    set(state => ({
      files: state.files.map(f => 
        f.id === fileId 
          ? { 
              ...f, 
              versions: [...f.versions, newVersion],
              currentVersionId: newVersion.id,
              size: newVersion.size,
              updatedAt: new Date(),
              // Update preview URL for images
              previewUrl: content.type.startsWith('image/') 
                ? URL.createObjectURL(content) 
                : f.previewUrl
            } 
          : f
      ),
      usageStats: {
        ...state.usageStats,
        usedStorage: state.usageStats.usedStorage + newVersion.size,
        recentActivity: [
          {
            date: new Date(),
            action: 'updated',
            fileId,
            fileName: file.name
          },
          ...state.usageStats.recentActivity
        ]
      }
    }));
    
    // Add notification
    const notification: Notification = {
      id: uuidv4(),
      userId: 'user-1',
      message: `You uploaded a new version of "${file.name}"`,
      read: false,
      createdAt: new Date(),
      fileId,
      type: 'upload'
    };
    
    set(state => ({
      notifications: [notification, ...state.notifications]
    }));
  },
  
  shareFile: (id, permissions) => {
    const { files } = get();
    const file = files.find(f => f.id === id);
    
    if (!file) return '';
    
    // Update file permissions
    set(state => ({
      files: state.files.map(f => 
        f.id === id ? { ...f, permissions } : f
      )
    }));
    
    // Generate a share link if it doesn't exist
    if (!file.shareLink) {
      const shareLink = `https://secureshare.app/s/${uuidv4().slice(0, 8)}`;
      
      set(state => ({
        files: state.files.map(f => 
          f.id === id ? { ...f, shareLink } : f
        )
      }));
      
      return shareLink;
    }
    
    return file.shareLink;
  },
  
  generateShareLink: (id, expiry, password) => {
    const shareLink = `https://secureshare.app/s/${uuidv4().slice(0, 8)}`;
    
    set(state => ({
      files: state.files.map(f => 
        f.id === id 
          ? { 
              ...f, 
              shareLink, 
              shareExpiry: expiry,
              sharePassword: password
            } 
          : f
      )
    }));
    
    return shareLink;
  },
  
  navigateToFolder: (folderId) => {
    set({ currentFolder: folderId });
  },
  
  selectFile: (id, selected) => {
    set(state => ({
      selectedFiles: selected 
        ? [...state.selectedFiles, id]
        : state.selectedFiles.filter(fileId => fileId !== id)
    }));
  },
  
  selectAllFiles: (selected) => {
    const { files, currentFolder } = get();
    const currentFolderFiles = files
      .filter(file => file.parentId === currentFolder)
      .map(file => file.id);
    
    set({
      selectedFiles: selected ? currentFolderFiles : []
    });
  },
  
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },
  
  markNotificationAsRead: (id) => {
    set(state => ({
      notifications: state.notifications.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    }));
  },
  
  clearAllNotifications: () => {
    set(state => ({
      notifications: state.notifications.map(notif => ({ ...notif, read: true }))
    }));
  },

  addNotification: (notification) => {
    set(state => ({
      notifications: [notification, ...state.notifications]
    }));
  },
}));