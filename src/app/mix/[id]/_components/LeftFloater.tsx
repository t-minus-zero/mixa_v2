'use client'
import React, { useState, useRef, useEffect } from 'react';
import HtmlElement from './HtmlElement';
import AccordionWrapper from './_fragments/AccordionWrapper';
import { useTree } from './TreeContext';
import Portal from '../../../_components/portal/Portal';
import IconBrowser from './IconBrowser';
import InputClickAndText from './_fragments/InputClickAndText';
import { SearchIcon, X } from 'lucide-react';

interface IconInfo {
  prefix: string;
  name: string;
  width?: number;
  height?: number;
  color?: string;
  customUrl?: string;
}

const renderTree = (node, level = 0) => (
  <HtmlElement key={node.id} node={node} level={level}>
    {node.childrens && node.childrens.length > 0 && (
      <ul>
        {node.childrens.map(childNode => renderTree(childNode, level + 1))}
      </ul>
    )}
  </HtmlElement>
);

const LeftFloater = () => {
  const { tree, selection, createImageElement } = useTree();
  const [showIconBrowser, setShowIconBrowser] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<IconInfo | null>(null);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const iconButtonRef = useRef<HTMLButtonElement>(null);
  
  const handleSelectIcon = (icon: IconInfo) => {
    console.log('Selected icon with color:', icon);
    
    let iconUrl = '';
    
    // Check if this is a custom URL icon
    if (icon.customUrl) {
      iconUrl = icon.customUrl;
    }
    // Otherwise, only proceed if we have a valid icon with prefix and name
    else if (icon && icon.prefix && icon.name) {
      // Create the image URL for the Iconify API with the color parameter
      iconUrl = `https://api.iconify.design/${icon.prefix}/${icon.name}.svg${icon.color ? `?color=${encodeURIComponent(icon.color)}` : ''}`;
    } else {
      console.error('Invalid icon data received');
      setShowIconBrowser(false);
      return;
    }
    
    // Add image element as a child of the currently selected element
    // If successful, show a success message
    if (createImageElement(selection.id, iconUrl)) {
      console.log(`Added ${icon.customUrl ? 'custom image' : `icon ${icon.prefix}:${icon.name}`} to element ${selection.id}`);
    } else {
      console.error('Failed to add icon to the selected element');
    }
    
    // Close the icon browser after selection
    setShowIconBrowser(false);
  };
  
  const handleOpenIconBrowser = () => {
    setShowIconBrowser(true);
  };
  
  const handleCloseIconBrowser = () => {
    setShowIconBrowser(false);
  };
  
  const toggleSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSearchMode(!isSearchMode);
    if (!isSearchMode) {
      // When entering search mode, ensure accordion is open
      setIsAccordionOpen(true);
      // Focus search input after rendering
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    } else {
      // When exiting search mode, clear search text
      setSearchText('');
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };
  
  // Handle clicks outside of the search area to exit search mode
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isSearchMode && searchText === '' && 
          searchInputRef.current && 
          !searchInputRef.current.contains(e.target as Node)) {
        setIsSearchMode(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchMode, searchText]);
  
  const toggleAccordion = () => {
    // Only toggle if not in search mode
    if (!isSearchMode) {
      setIsAccordionOpen(!isAccordionOpen);
    }
  };
  
  return (
    <div className="h-full w-full min-w-64 py-4 flex flex-col justify-between group/tree">

      {/* Layers section */}
      <div className={`flex flex-col bg-zinc-50/75 backdrop-blur-md rounded-r-xl shadow-sm border border-zinc-200 max-h-[90vh] overflow-y-scroll transition-all duration-300 ${isSearchMode || isAccordionOpen ? 'w-64' : 'w-32'}`}>
       
        {/* Header with title or search */}
        <div 
          className="w-full p-1 flex flex-row items-center justify-start group transition-colors cursor-pointer border-b border-zinc-200" 
          onClick={toggleAccordion}
        >
          <div className='flex flex-row items-center flex-grow px-2'>
            {isSearchMode ? (
              // Search input
              <div className='cursor-text w-full' onClick={(e) => e.stopPropagation()}>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchText}
                  onChange={handleSearchChange}
                  className="w-full text-sm bg-transparent outline-none"
                  placeholder="Search..."
                />
              </div>
            ) : (
              // Title "Layers"
              <div className='font-medium text-sm'>
                Layers
              </div>
            )}
          </div>
          <div className='flex flex-row items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity'>
            {/* Search/Close button */}
            <button 
              className={`w-6 h-6 flex items-center justify-center ${isSearchMode ? 'text-zinc-400 hover:text-red-500' : 'text-zinc-400 hover:text-zinc-600'}`}
              onClick={toggleSearch}
            >
              {isSearchMode ? <X size={16} /> : <SearchIcon size={16} />}
            </button>
          </div>
        </div>

        <div className="h-full overflow-y-scroll max-h-[75vh]">
          <AccordionWrapper openStatus={isSearchMode || isAccordionOpen}>
            <ul className="p-2">
              {renderTree(tree)}
            </ul>
          </AccordionWrapper>
        </div>
      </div>
      
      {/* Icon Browser Button */}
      <div className="w-full mt-4 hidden">
        <button 
          ref={iconButtonRef}
          onClick={handleOpenIconBrowser}
          className="w-full py-2 px-4 bg-zinc-100 hover:bg-zinc-200 rounded-xl text-sm font-medium text-zinc-700 flex items-center justify-center gap-2 transition-colors"
        >
          {selection?.id !== 'root' ? (
            <>Add Icon to Selected Element</>
          ) : (
            <>Browse Icons</>
          )}
        </button>
      </div>
      
      {/* Icon Browser Portal */}
      <Portal 
        show={showIconBrowser}
        onClickOutside={handleCloseIconBrowser}
        className="z-50 w-full h-full flex items-center justify-center"
      >
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <IconBrowser 
              onSelectIcon={handleSelectIcon} 
              onClose={handleCloseIconBrowser} 
            />
          </div>
        </div>
      </Portal>
    </div>
  );
}

export default LeftFloater;
