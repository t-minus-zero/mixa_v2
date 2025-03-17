'use client'

import React, { useState, useEffect, useRef, MouseEvent, ChangeEvent } from 'react';
import { useTree } from './TreeContext';
import AccordionWrapper from './_fragments/AccordionWrapper';
import { Eraser, Copy, Check } from 'lucide-react';

// Define TreeContext types
interface TreeNode {
  id: string;
  content?: string;
  [key: string]: any;
}

interface TreeContextType {
  selection: TreeNode | null;
  updateContent: (id: string, content: string) => void;
  [key: string]: any;
}

const HtmlContent = () => {
  const { selection, updateContent } = useTree() as TreeContextType;
  const [content, setContent] = useState('');
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update local content state when selection changes
  useEffect(() => {
    if (selection && selection.content !== undefined) {
      setContent(selection.content);
    } else {
      setContent('');
    }
  }, [selection]);

  // Handle content change in the input
  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    // Update the content in the tree
    if (selection && selection.id) {
      updateContent(selection.id, newContent);
    }
  };

  // Toggle the accordion open/close state
  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  // Reset content to empty
  const handleReset = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent triggering accordion toggle
    setContent('');
    
    // Update the content in the tree
    if (selection && selection.id) {
      updateContent(selection.id, '');
    }
  };

  // Copy content to clipboard
  const handleCopy = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent triggering accordion toggle
    
    if (content) {
      try {
        await navigator.clipboard.writeText(content);
        setCopySuccess(true);
        setTimeout(() => {
          setCopySuccess(false);
        }, 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  // If no element is selected, don't render anything
  if (!selection) {
    return null;
  }

  return (
    <div className={`flex flex-col bg-zinc-50/75 backdrop-blur-md rounded-l-xl shadow-sm border border-zinc-200 mt-4 overflow-hidden transition-all duration-300 ${isAccordionOpen ? 'w-64' : 'w-32'}`}>
      {/* Header with title */}
      <div 
        className="w-full p-1 flex flex-row items-center justify-start group transition-colors cursor-pointer border-b border-zinc-200" 
        onClick={toggleAccordion}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className='flex flex-row items-center flex-grow px-2'>
          <div className='font-medium text-sm'>
            Content
          </div>
        </div>
        <div className='flex flex-row items-center justify-end'>
          {/* Reset button with eraser icon */}
          <button 
            className={`w-6 h-6 flex items-center justify-center ${isHovering ? 'opacity-100' : 'opacity-0'} text-zinc-400 hover:text-red-500 transition-opacity`}
            onClick={handleReset}
            title="Clear content"
          >
            <Eraser size={16} />
          </button>
          
          {/* Copy button */}
          <button 
            className={`w-6 h-6 mr-1 flex items-center justify-center ${isHovering ? 'opacity-100' : 'opacity-0'} text-zinc-400 hover:text-blue-500 transition-opacity`}
            onClick={handleCopy}
            title="Copy content"
          >
            {copySuccess ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      {/* Accordion content */}
      <div className="overflow-y-auto">
        <AccordionWrapper openStatus={isAccordionOpen}>
          <div className="w-full py-2 flex flex-col gap-2">
            <div className="px-2">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleContentChange}
                placeholder="Write content..."
              className="w-full p-2 rounded-lg bg-zinc-100/50 border-zinc-200 border text-sm focus:outline-none min-h-[100px]"
            />
            </div>
            <div className="px-2">
              <button className="w-full text-xs p-2 rounded-lg bg-zinc-100/50 border-zinc-200 border">
                Save
              </button>
            </div>
          </div>
        </AccordionWrapper>
      </div>
    </div>
  );
};

export default HtmlContent;
