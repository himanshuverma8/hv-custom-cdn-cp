'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical, Edit, Trash2, Eye, Copy, ExternalLink } from 'lucide-react';

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  size?: number;
  lastModified?: string;
  url?: string;
  key?: string;
}

interface FileActionsDropdownProps {
  file: FileItem;
  onRename: (file: FileItem) => void;
  onDelete: (file: FileItem) => void;
  onViewDetails: (file: FileItem) => void;
  onCopyUrl: (url: string) => void;
}

export default function FileActionsDropdown({ 
  file, 
  onRename, 
  onDelete, 
  onViewDetails, 
  onCopyUrl 
}: FileActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{
    vertical: 'bottom' | 'top';
    horizontal: 'left' | 'right';
    top: number;
    left: number;
  }>({ vertical: 'bottom', horizontal: 'right', top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const calculatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const dropdownHeight = 200; // Approximate dropdown height
        const dropdownWidth = 192; // 48 * 4 (w-48 = 12rem = 192px)
        
        // Check if there's enough space below
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        
        // Check if there's enough space to the right
        const spaceRight = viewportWidth - rect.right;
        const spaceLeft = rect.left;
        
        // Determine vertical position
        const verticalPosition = spaceBelow < dropdownHeight + 20 && spaceAbove > dropdownHeight + 20 ? 'top' : 'bottom';
        
        // Determine horizontal position
        const horizontalPosition = spaceRight < dropdownWidth + 20 && spaceLeft > dropdownWidth + 20 ? 'left' : 'right';
        
        // Calculate absolute position
        let top = rect.bottom + 8; // Default: below button
        let left = rect.right - dropdownWidth; // Default: right-aligned
        
        if (verticalPosition === 'top') {
          top = rect.top - dropdownHeight - 8;
        }
        
        if (horizontalPosition === 'left') {
          left = rect.left;
        }
        
        // Ensure dropdown stays within viewport
        top = Math.max(8, Math.min(top, viewportHeight - dropdownHeight - 8));
        left = Math.max(8, Math.min(left, viewportWidth - dropdownWidth - 8));
        
        setDropdownPosition({
          vertical: verticalPosition,
          horizontal: horizontalPosition,
          top,
          left
        });
      }
    };

    if (isOpen) {
      calculatePosition();
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg hover:bg-white dark:hover:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:scale-110 border border-white/30 dark:border-gray-700/30"
          title="More actions"
        >
          <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {isOpen && createPortal(
        <div 
          ref={dropdownRef}
          className="fixed w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/30 dark:border-gray-700/30 z-50 animate-in fade-in-0 zoom-in-95 duration-200"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`
          }}
        >
          <div className="py-2">
            <button
              onClick={() => handleAction(() => onViewDetails(file))}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200"
            >
              <Eye className="w-4 h-4" />
              <span>View Details</span>
            </button>
            
            <button
              onClick={() => handleAction(() => onRename(file))}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200"
            >
              <Edit className="w-4 h-4" />
              <span>Rename</span>
            </button>

            {file.url && (
              <button
                onClick={() => handleAction(() => onCopyUrl(file.url!))}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200"
              >
                <Copy className="w-4 h-4" />
                <span>Copy URL</span>
              </button>
            )}

            {file.url && (
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open in New Tab</span>
              </a>
            )}

            <div className="border-t border-gray-200 dark:border-gray-600 my-1" />
            
            <button
              onClick={() => handleAction(() => onDelete(file))}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
