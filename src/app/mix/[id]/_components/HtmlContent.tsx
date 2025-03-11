'use client'

import React, { useState, useEffect } from 'react';
import { useTree } from './TreeContext';
import AccordionWrapper from './_fragments/AccordionWrapper';

const HtmlContent = () => {
  const { selection, updateContent } = useTree();
  const [content, setContent] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Update local content state when selection changes
  useEffect(() => {
    if (selection && selection.content !== undefined) {
      setContent(selection.content);
    } else {
      setContent('');
    }
  }, [selection]);

  // Handle content change in the input
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    // Update the content in the tree
    if (selection && selection.id) {
      updateContent(selection.id, newContent);
    }
  };

  // If no element is selected, don't render anything
  if (!selection) {
    return null;
  }

  return (
    <div className="border border-zinc-200 rounded-xl hover:bg-zinc-50">
      <h3 className="p-2 text-sm font-medium" onClick={() => setIsOpen(!isOpen)}>Content</h3>
      <AccordionWrapper openStatus={isOpen}>
      <textarea
        value={content}
        onChange={handleContentChange}
        placeholder="Enter HTML content..."
        className="w-full p-2 border-t border-zinc-200 bg-transparent text-sm focus:outline-none"
      />
      </AccordionWrapper>
    </div>
  );
};

export default HtmlContent;
