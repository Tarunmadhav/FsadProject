export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface FilePermission {
  userId: string;
  access: 'view' | 'edit' | 'owner';
}

export interface FileVersion {
  id: string;
  name: string;
  size: number;
  type: string;
  createdAt: Date;
  createdBy: string;
  url: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  parentId: string | null;
  isFolder: boolean;
  starred: boolean;
  permissions: FilePermission[];
  versions: FileVersion[];
  currentVersionId: string;
  shareLink?: string;
  shareExpiry?: Date;
  sharePassword?: string;
  previewUrl?: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: Date;
  fileId?: string;
  type: 'share' | 'upload' | 'comment' | 'system';
}

export interface UsageStats {
  totalStorage: number;
  usedStorage: number;
  fileCount: number;
  folderCount: number;
  recentActivity: {
    date: Date;
    action: string;
    fileId: string;
    fileName: string;
  }[];
}