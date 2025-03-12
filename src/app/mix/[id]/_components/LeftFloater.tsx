'use client'
import React, { useState, useRef } from 'react';
import HtmlElement from './HtmlElement';
import AccordionWrapper from './_fragments/AccordionWrapper';
import { useTree } from './TreeContext';
import Portal from '../../../_components/portal/Portal';
import IconBrowser from './IconBrowser';

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
  
  return (
    <div className="ml-1 h-full w-full min-w-64 py-4 flex flex-col justify-between group/tree">
      <div className="flex flex-col bg-zinc-50 p-2 rounded-xl gap-2" style={{maxHeight: 'calc(100% - 8rem)'}}>
        <div className="flex flex-row gap-2 text-xs">
          {/* To add quick actions like Add component */} 
          <button className="w-6 h-6 hover:bg-zinc-100 rounded-lg">A</button>
          <button className="w-6 h-6 hover:bg-zinc-100 rounded-lg">B</button>
          <button className="w-6 h-6 hover:bg-zinc-100 rounded-lg">C</button>
        </div>
        <div className="overflow-y-scroll">
          <AccordionWrapper openStatus={true}>
            <ul>
              {renderTree(tree)}
            </ul>
          </AccordionWrapper>
        </div>
      </div>
      
      {/* Icon Browser Button */}
      <div className="w-full mt-4">
        <button 
          ref={iconButtonRef}
          onClick={() => setShowIconBrowser(true)}
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
        onClickOutside={() => setShowIconBrowser(false)}
        className="z-50 w-full h-full flex items-center justify-center"
      >
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <IconBrowser 
              onSelectIcon={handleSelectIcon} 
              onClose={() => setShowIconBrowser(false)} 
            />
          </div>
        </div>
      </Portal>
    </div>
  );
}

export default LeftFloater;
