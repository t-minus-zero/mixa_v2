'use client';

import React, { useState, useEffect } from 'react';

// Popular icon sets to show by default
const POPULAR_ICONS = [
  { prefix: 'mdi', name: 'account' },
  { prefix: 'mdi', name: 'home' },
  { prefix: 'mdi', name: 'star' },
  { prefix: 'mdi', name: 'heart' },
  { prefix: 'mdi', name: 'check' },
  { prefix: 'mdi', name: 'close' },
  { prefix: 'fa', name: 'user' },
  { prefix: 'fa', name: 'home' },
  { prefix: 'fa', name: 'star' },
  { prefix: 'fa', name: 'heart' },
  { prefix: 'bx', name: 'user' },
  { prefix: 'bx', name: 'home' },
  { prefix: 'carbon', name: 'user' },
  { prefix: 'carbon', name: 'home' },
  { prefix: 'carbon', name: 'star' },
  { prefix: 'carbon', name: 'close' },
  { prefix: 'ci', name: 'user' },
  { prefix: 'ci', name: 'home' },
  { prefix: 'icon-park-outline', name: 'user' },
  { prefix: 'icon-park-outline', name: 'home' },
  { prefix: 'iconoir', name: 'user' },
  { prefix: 'iconoir', name: 'home' },
  { prefix: 'majesticons', name: 'user-line' },
  { prefix: 'majesticons', name: 'home-line' }
];

// Available colors for the icons
const ICON_COLORS = [
  { name: 'Black', value: 'black' },
  { name: 'White', value: 'white' },
  { name: 'Gray', value: 'gray' },
  { name: 'Red', value: 'red' },
  { name: 'Green', value: 'green' },
  { name: 'Blue', value: 'blue' }
];

interface IconInfo {
  prefix: string;
  name: string;
  width?: number;
  height?: number;
  color?: string; 
  customUrl?: string; // Add this property for direct custom URLs
}

interface IconBrowserProps {
  onSelectIcon?: (icon: IconInfo) => void;
  onClose?: () => void;
}

const IconBrowser: React.FC<IconBrowserProps> = ({ onSelectIcon, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [icons, setIcons] = useState<IconInfo[]>(POPULAR_ICONS);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<IconInfo | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('black'); 
  const [totalIcons, setTotalIcons] = useState(POPULAR_ICONS.length);
  const [error, setError] = useState<string | null>(null);
  const [searchStatus, setSearchStatus] = useState<'idle' | 'searching' | 'completed'>('idle');
  const [customImageUrl, setCustomImageUrl] = useState<string>('');

  // Function to search for icons
  const searchIcons = async () => {
    if (!searchQuery.trim()) {
      setIcons(POPULAR_ICONS);
      setTotalIcons(POPULAR_ICONS.length);
      setError(null);
      setSearchStatus('idle');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSearchStatus('searching');
    
    try {
      // Fixed limit at 30 icons since there's no pagination anymore
      const url = `https://api.iconify.design/search?query=${encodeURIComponent(searchQuery)}&limit=30`;
      console.log('Searching icons with URL:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      console.log('API response:', data);
      
      // Log details about the response structure
      if (data.icons) {
        console.log('Response has icons array with length:', data.icons.length);
        
        if (data.icons.length > 0) {
          console.log('First icon sample:', data.icons[0]);
        }
      } else {
        console.log('Response does not have an icons array');
      }
      
      if (data && data.icons && Array.isArray(data.icons) && data.icons.length > 0) {
        console.log('Found icons:', data.icons.length);
        
        // Process the icons to ensure they have the right structure
        const processedIcons = data.icons.map((icon: any) => {
          // If icon is already in the right format
          if (icon && typeof icon === 'object' && icon.prefix && icon.name) {
            return icon;
          }
          
          // Handle different potential response formats
          if (typeof icon === 'string') {
            // Format might be "prefix:name"
            const parts = icon.split(':');
            if (parts.length === 2) {
              return { prefix: parts[0], name: parts[1] };
            }
          }
          
          // If we can't make sense of it, return null to be filtered out
          return null;
        }).filter(Boolean);
        
        console.log('Processed icons:', processedIcons.length);
        
        if (processedIcons.length > 0) {
          setIcons(processedIcons);
          // Ensure we're setting the correct total for display purposes
          const total = data.total && typeof data.total === 'number' ? data.total : processedIcons.length;
          console.log(`Found ${total} icons in total (showing ${processedIcons.length})`);
          setTotalIcons(total);
        } else {
          setIcons([]);
          setTotalIcons(0);
          setError('Could not process icons from API response.');
        }
      } else {
        console.log('No icons found or invalid response:', data);
        setIcons([]);
        setTotalIcons(0);
        setError('No icons found. Try a different search term.');
      }
    } catch (error) {
      console.error('Error searching icons:', error);
      setIcons([]);
      setTotalIcons(0);
      setError('Error fetching icons. Please try again.');
    } finally {
      setIsLoading(false);
      setSearchStatus('completed');
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchIcons();
  };

  // Handle icon selection - now just sets the selected icon but doesn't call onSelectIcon yet
  const handleIconSelect = (icon: IconInfo) => {
    setSelectedIcon(icon);
  };

  // Handle using the selected icon with the chosen color
  const handleUseIcon = () => {
    if (selectedIcon && onSelectIcon) {
      // Add the selected color to the icon information
      const iconWithColor = { ...selectedIcon, color: selectedColor };
      onSelectIcon(iconWithColor);
      if (onClose) onClose();
    }
  };

  // Handle using a custom image URL
  const handleUseCustomUrl = () => {
    if (customImageUrl && onSelectIcon) {
      // Create a custom icon object with the provided URL
      const customIcon: IconInfo = {
        prefix: 'custom',
        name: 'custom-image',
        color: selectedColor
      };
      
      // The actual URL will be used directly in the LeftFloater component
      // We're setting a special flag on the icon object to indicate it's a direct URL
      onSelectIcon({ ...customIcon, customUrl: customImageUrl });
      if (onClose) onClose();
    }
  };

  // Helper to safely get first letter
  const getFirstLetter = (name?: string) => {
    if (!name || typeof name !== 'string') return '?';
    return name.substring(0, 1).toUpperCase();
  };

  // Get the icon URL with the selected color
  const getIconUrl = (icon: IconInfo, size: number = 24, previewColor?: string) => {
    const colorToUse = previewColor || selectedColor;
    return `https://api.iconify.design/${icon.prefix}/${icon.name}.svg?height=${size}&width=${size}&color=${encodeURIComponent(colorToUse)}`;
  };

  return (
    <div className="flex flex-col h-full max-h-[90vh]">
      {/* Header */}
      <div className="flex justify-between items-center border-b p-4">
        <h2 className="text-xl font-bold">Browse Icons</h2>
        {onClose && (
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Main content - using flex-grow to ensure it takes up available space */}
      <div className="p-4 flex-grow flex flex-col overflow-auto">
        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="mb-6">
          <div className="flex">
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-l-md"
              placeholder="Search icons..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Searching...</span>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </>
              )}
            </button>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>
              {searchStatus === 'idle' && 'Showing popular icons. Search for more.'}
              {searchStatus === 'searching' && 'Searching...'}
              {searchStatus === 'completed' && searchQuery && `Found ${totalIcons} icons for "${searchQuery}"`}
            </span>
          </div>
        </form>

        {/* Custom Image URL input */}
        <div className="mb-6 border-t pt-4 border-gray-200">
          <h3 className="font-medium mb-2 text-sm">Use a Custom Image URL</h3>
          <div className="flex">
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-l-md"
              placeholder="Paste image URL here..."
              value={customImageUrl}
              onChange={(e) => setCustomImageUrl(e.target.value)}
            />
            <button
              type="button"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-r-md"
              disabled={!customImageUrl}
              onClick={handleUseCustomUrl}
            >
              Use URL
            </button>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Paste a direct URL to any image (PNG, SVG, JPG, etc.)</span>
          </div>
          
          {/* Custom URL preview */}
          {customImageUrl && (
            <div className="mt-2 flex items-center gap-2">
              <div className="h-10 w-10 border border-gray-200 rounded flex items-center justify-center">
                <img
                  src={customImageUrl}
                  alt="Custom image preview"
                  className="max-h-8 max-w-8 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const placeholder = document.createElement('div');
                      placeholder.innerHTML = '!';
                      placeholder.className = 'w-6 h-6 bg-red-200 flex items-center justify-center text-xs rounded';
                      parent.appendChild(placeholder);
                    }
                  }}
                />
              </div>
              <span className="text-xs">Preview</span>
            </div>
          )}
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-2 bg-red-50 text-red-600 rounded text-sm">
            {error}
          </div>
        )}
        
        {/* Icons grid - using flex-grow to take up available space */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6 flex-grow">
          {isLoading ? (
            <div className="col-span-full text-center py-10">Loading icons...</div>
          ) : icons.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500">
              No icons found. Try a different search term.
            </div>
          ) : (
            icons.map((icon, index) => (
              <div
                key={`${icon.prefix}-${icon.name}-${index}`}
                className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedIcon && selectedIcon.prefix === icon.prefix && selectedIcon.name === icon.name
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
                onClick={() => handleIconSelect(icon)}
              >
                <div className="h-12 flex items-center justify-center mb-2">
                  {/* Fallback is rendered directly if prefix or name is missing */}
                  {!icon.prefix || !icon.name ? (
                    <div className="w-6 h-6 bg-gray-200 flex items-center justify-center text-xs rounded">
                      {getFirstLetter(icon.name)}
                    </div>
                  ) : (
                    <img 
                      src={getIconUrl(icon)}
                      alt={`${icon.name} icon`}
                      className="w-6 h-6"
                      onError={(e) => {
                        // On error, replace with a placeholder
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const placeholder = document.createElement('div');
                          placeholder.innerHTML = getFirstLetter(icon.name);
                          placeholder.className = 'w-6 h-6 bg-gray-200 flex items-center justify-center text-xs rounded';
                          parent.appendChild(placeholder);
                        }
                      }}
                    />
                  )}
                </div>
                <div className="text-xs text-center truncate" title={`${icon.prefix || ''}:${icon.name || 'unknown'}`}>
                  {icon.name || 'Unnamed'}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected icon with color options */}
        {selectedIcon && (
          <div className="mt-2 pt-4 border-t border-gray-200">
            <h3 className="font-medium mb-2">Selected Icon: {selectedIcon.name}</h3>
            <div className="flex gap-4 mb-4">
              <div className="h-16 w-16 flex items-center justify-center border border-gray-200 rounded p-2">
                {selectedIcon.prefix && selectedIcon.name ? (
                  <img 
                    src={getIconUrl(selectedIcon, 32)}
                    alt={selectedIcon.name}
                    className="w-8 h-8"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const placeholder = document.createElement('div');
                        placeholder.innerHTML = getFirstLetter(selectedIcon.name);
                        placeholder.className = 'w-8 h-8 bg-gray-200 flex items-center justify-center text-sm rounded';
                        parent.appendChild(placeholder);
                      }
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 flex items-center justify-center text-sm rounded">
                    {getFirstLetter(selectedIcon.name)}
                  </div>
                )}
              </div>
              <div>
                <div className="text-sm">
                  <span className="font-medium">Collection:</span> {selectedIcon.prefix || 'Unknown'}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Name:</span> {selectedIcon.name || 'Unnamed'}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Full name:</span> <code className="bg-gray-100 px-1 rounded text-xs">{selectedIcon.prefix || 'unknown'}:{selectedIcon.name || 'unknown'}</code>
                </div>
              </div>
            </div>
            
            {/* Color selection */}
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Select Icon Color:</h4>
              <div className="flex flex-wrap gap-2">
                {ICON_COLORS.map((color) => (
                  <div 
                    key={color.value} 
                    className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded border ${selectedColor === color.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    onClick={() => setSelectedColor(color.value)}
                  >
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color.value, border: color.value === 'white' ? '1px solid #ddd' : 'none' }}
                    ></div>
                    <span className="text-sm">{color.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Color preview */}
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Color Preview:</h4>
              <div className="flex gap-3 items-center">
                {ICON_COLORS.map((color) => (
                  <div key={color.value} className="flex flex-col items-center">
                    <div 
                      className="h-10 w-10 flex items-center justify-center border border-gray-200 rounded mb-1"
                      style={{ backgroundColor: color.value === 'white' ? '#f0f0f0' : 'transparent' }}
                    >
                      {selectedIcon.prefix && selectedIcon.name && (
                        <img 
                          src={getIconUrl(selectedIcon, 24, color.value)}
                          alt={`${selectedIcon.name} in ${color.name}`}
                          className="w-6 h-6"
                        />
                      )}
                    </div>
                    <span className="text-xs">{color.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="border-t p-4 flex justify-end mt-auto">
        {onClose && (
          <button 
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
        )}
        {selectedIcon && (
          <button 
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
            onClick={handleUseIcon}
          >
            Use Icon
          </button>
        )}
      </div>
    </div>
  );
};

export default IconBrowser;
