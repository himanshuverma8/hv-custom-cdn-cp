'use client';

import { useState, useEffect } from 'react';
import { Edit, FileText, Image as ImageIcon } from 'lucide-react';

interface RenameModalProps {
  file: {
    name: string;
    key?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onRename: (oldKey: string, newName: string) => Promise<void>;
  type: 'image' | 'file';
}

export default function RenameModal({ file, isOpen, onClose, onRename, type }: RenameModalProps) {
  const [newName, setNewName] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);

  useEffect(() => {
    if (isOpen && file.name) {
      setNewName(file.name);
    }
  }, [isOpen, file.name]);

  const handleRename = async () => {
    if (!newName.trim() || newName === file.name || !file.key) return;

    setIsRenaming(true);
    try {
      await onRename(file.key, newName.trim());
      onClose();
    } catch (error) {
      console.error('Rename failed:', error);
    } finally {
      setIsRenaming(false);
    }
  };

  const getFileExtension = (fileName: string) => {
    return fileName.split('.').pop() || '';
  };

  const handleNameChange = (value: string) => {
    const extension = getFileExtension(file.name);
    if (extension) {
      // Keep the extension
      const nameWithoutExt = value.replace(`.${extension}`, '');
      setNewName(`${nameWithoutExt}.${extension}`);
    } else {
      setNewName(value);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/30 dark:border-gray-700/30 animate-in zoom-in-95 duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-gray-700/10" />
        
        <div className="relative">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              <Edit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Rename File</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Enter a new name for your file</p>
            </div>
          </div>

          {/* Current file info */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
              <div className="p-2 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 rounded-xl">
                {type === 'image' ? (
                  <ImageIcon className="w-5 h-5 text-green-500" />
                ) : (
                  <FileText className="w-5 h-5 text-blue-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Current name</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate" title={file.name}>
                  {file.name}
                </p>
              </div>
            </div>
          </div>

          {/* New name input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              New file name
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200/50 dark:border-gray-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white/50 dark:bg-gray-700/50 backdrop-blur-md"
              placeholder="Enter new file name"
              autoFocus
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              The file extension will be preserved automatically
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isRenaming}
              className="px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white font-medium transition-colors duration-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleRename}
              disabled={!newName.trim() || newName === file.name || isRenaming}
              className="px-6 py-3 bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white rounded-2xl hover:from-blue-700/90 hover:to-indigo-700/90 disabled:opacity-50 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none backdrop-blur-md border border-white/20 flex items-center space-x-2"
            >
              {isRenaming ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Renaming...</span>
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4" />
                  <span>Rename File</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
