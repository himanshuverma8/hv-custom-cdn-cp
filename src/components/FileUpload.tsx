'use client';

import { useState, useRef } from 'react';
import { Upload, FolderPlus, FileText, Image as ImageIcon } from 'lucide-react';

interface FileUploadProps {
  type: 'image' | 'file';
  currentFolder: string;
  onUploadSuccess: (url: string, fileName: string) => void;
  onFolderCreate: (folderName: string) => void;
}

export default function FileUpload({ type, currentFolder, onUploadSuccess, onFolderCreate }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', currentFolder);
        formData.append('type', type);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          onUploadSuccess(result.url, result.fileName);
        } else {
          console.error('Upload failed:', result.error);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!folderName.trim()) return;

    setIsCreatingFolder(true);
    try {
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          folderName: folderName.trim(),
          type: type,
        }),
      });

      const result = await response.json();

      if (result.success) {
        onFolderCreate(folderName.trim());
        setFolderName('');
      } else {
        console.error('Folder creation failed:', result.error);
      }
    } catch (error) {
      console.error('Folder creation error:', error);
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-4">
          {type === 'image' ? (
            <ImageIcon className="w-12 h-12 text-gray-400" />
          ) : (
            <FileText className="w-12 h-12 text-gray-400" />
          )}
          <div>
            <p className="text-lg font-medium text-gray-900">
              Drop {type === 'image' ? 'images' : 'files'} here or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Upload to: {currentFolder || `/${type === 'image' ? 'images' : 'files'}`}
            </p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Uploading...' : 'Choose Files'}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={type === 'image' ? 'image/*' : '*'}
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      </div>

      {/* Create Folder */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="New folder name"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
        />
        <button
          onClick={handleCreateFolder}
          disabled={!folderName.trim() || isCreatingFolder}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
        >
          <FolderPlus className="w-4 h-4" />
          <span>{isCreatingFolder ? 'Creating...' : 'Create Folder'}</span>
        </button>
      </div>
    </div>
  );
}
