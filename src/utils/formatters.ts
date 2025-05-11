/**
 * Formats a file size in bytes to a human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Formats a date to a human-readable string
 */
export function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const day = 24 * 60 * 60 * 1000;
  
  if (diff < day) {
    return 'Today';
  } else if (diff < 2 * day) {
    return 'Yesterday';
  } else if (diff < 7 * day) {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  } else {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
}

/**
 * Returns a color based on file type
 */
export function getFileColor(type: string): string {
  if (type === 'folder') {
    return 'text-blue-500';
  }
  
  if (type.startsWith('image/')) {
    return 'text-purple-500';
  }
  
  if (type.startsWith('video/')) {
    return 'text-pink-500';
  }
  
  if (type.startsWith('audio/')) {
    return 'text-green-500';
  }
  
  if (type.includes('pdf')) {
    return 'text-red-500';
  }
  
  if (type.includes('word') || type.includes('document')) {
    return 'text-blue-600';
  }
  
  if (type.includes('excel') || type.includes('sheet')) {
    return 'text-green-600';
  }
  
  if (type.includes('powerpoint') || type.includes('presentation')) {
    return 'text-orange-500';
  }
  
  return 'text-gray-500';
}

/**
 * Returns an icon name based on file type
 */
export function getFileIcon(type: string): string {
  if (type === 'folder') {
    return 'Folder';
  }
  
  if (type.startsWith('image/')) {
    return 'Image';
  }
  
  if (type.startsWith('video/')) {
    return 'Video';
  }
  
  if (type.startsWith('audio/')) {
    return 'Music';
  }
  
  if (type.includes('pdf')) {
    return 'FileText';
  }
  
  if (type.includes('word') || type.includes('document')) {
    return 'FileText';
  }
  
  if (type.includes('excel') || type.includes('sheet')) {
    return 'Table';
  }
  
  if (type.includes('powerpoint') || type.includes('presentation')) {
    return 'Presentation';
  }
  
  if (type.includes('zip') || type.includes('archive')) {
    return 'Archive';
  }
  
  return 'File';
}

/**
 * Truncates a string if it's longer than maxLength
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  
  const half = Math.floor(maxLength / 2);
  return str.slice(0, half) + '...' + str.slice(-half);
}