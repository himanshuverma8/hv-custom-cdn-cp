'use client';

import { useState } from 'react';
import { X, Copy, ExternalLink, Calendar, HardDrive, FileText, Image as ImageIcon } from 'lucide-react';

interface FileDetailsModalProps {
  file: {
    name: string;
    size?: number;
    lastModified?: string;
    url?: string;
    key?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  type: 'image' | 'file';
}

export default function FileDetailsModal({ file, isOpen, onClose, type }: FileDetailsModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileExtension = (fileName: string) => {
    return fileName.split('.').pop()?.toUpperCase() || '';
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-3xl p-8 w-full max-w-2xl shadow-2xl border border-white/30 dark:border-gray-700/30 animate-in zoom-in-95 duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-gray-700/10" />
        
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                {type === 'image' ? (
                  <ImageIcon className="w-6 h-6 text-white" />
                ) : (
                  <FileText className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">File Details</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Information about your file</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* File Preview */}
          <div className="mb-6">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
              <div className="p-3 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 rounded-xl">
                {type === 'image' ? (
                  <ImageIcon className="w-8 h-8 text-green-500" />
                ) : (
                  <FileText className="w-8 h-8 text-blue-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white truncate" title={file.name}>
                  {file.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {getFileExtension(file.name)} File
                </p>
              </div>
            </div>
          </div>

          {/* File Information */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-700/50 rounded-xl">
                <HardDrive className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">File Size</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {file.size ? formatFileSize(file.size) : 'Unknown'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-700/50 rounded-xl">
                <Calendar className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Last Modified</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {file.lastModified ? formatDate(file.lastModified) : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CDN URL */}
          {file.url && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                CDN URL
              </label>
              <div className="flex items-center space-x-2">
                <code className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-200 font-mono break-all">
                  {file.url}
                </code>
                <button
                  onClick={() => copyToClipboard(file.url!)}
                  className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200"
                  title="Copy URL"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copied && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-2 animate-in fade-in duration-200">
                  URL copied to clipboard!
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white font-medium transition-colors duration-300"
            >
              Close
            </button>
            {file.url && (
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white rounded-2xl hover:from-blue-700/90 hover:to-indigo-700/90 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-md border border-white/20 flex items-center space-x-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open File</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
