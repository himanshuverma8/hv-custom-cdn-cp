'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Folder, 
  File, 
  Image as ImageIcon, 
  Copy, 
  ExternalLink, 
  ArrowLeft,
  RefreshCw
} from 'lucide-react';

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  size?: number;
  lastModified?: string;
  url?: string;
  key?: string;
}

interface FileListProps {
  type: 'image' | 'file';
  currentFolder: string;
  onFolderChange: (folder: string) => void;
  onRefresh: () => void;
}

export default function FileList({ type, currentFolder, onFolderChange, onRefresh }: FileListProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [folders, setFolders] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const loadFiles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/list?type=${type}&prefix=${currentFolder}`);
      const result = await response.json();

      if (result.success) {
        setFiles(result.files || []);
        setFolders(result.folders || []);
      }
    } catch (error) {
      console.error('Failed to load files:', error);
    } finally {
      setLoading(false);
    }
  }, [type, currentFolder]);

  useEffect(() => {
    loadFiles();
  }, [type, currentFolder, loadFiles]);

  const handleFolderClick = (folderName: string) => {
    const newPath = currentFolder ? `${currentFolder}/${folderName}` : folderName;
    onFolderChange(newPath);
  };

  const handleBackClick = () => {
    const pathParts = currentFolder.split('/');
    pathParts.pop();
    onFolderChange(pathParts.join('/'));
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600">Loading files...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {currentFolder && (
            <button
              onClick={handleBackClick}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <h3 className="text-lg font-semibold">
            {type === 'image' ? 'Images' : 'Files'}
            {currentFolder && ` - ${currentFolder}`}
          </h3>
        </div>
        <button
          onClick={onRefresh}
          className="p-2 hover:bg-gray-100 rounded-md"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Folders */}
      {folders.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Folders</h4>
          <div className="grid grid-cols-1 gap-2">
            {folders.map((folder, index) => (
              <div
                key={index}
                onClick={() => handleFolderClick(folder.name)}
                className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-md cursor-pointer transition-colors"
              >
                <Folder className="w-5 h-5 text-blue-500" />
                <span className="font-medium">{folder.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Files */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Files</h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {type === 'image' ? (
                    <ImageIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <File className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">{file.name}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {file.size && <span>{formatFileSize(file.size)}</span>}
                      {file.lastModified && <span>{formatDate(file.lastModified)}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {file.url && (
                    <>
                      <button
                        onClick={() => copyToClipboard(file.url!)}
                        className="p-2 hover:bg-gray-100 rounded-md"
                        title="Copy URL"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-gray-100 rounded-md"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {folders.length === 0 && files.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No {type === 'image' ? 'images' : 'files'} found in this folder.</p>
          <p className="text-sm">Upload some files to get started!</p>
        </div>
      )}

      {/* Copy Success Message */}
      {copiedUrl && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
          URL copied to clipboard!
        </div>
      )}
    </div>
  );
}
