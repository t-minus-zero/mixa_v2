"use client";

import React, { useState } from 'react';
import { useTree } from './TreeContext';
import AccordionWrapper from './_fragments/AccordionWrapper';
import InputClickAndText from './_fragments/InputClickAndText';
import HtmlTagSelector from './HtmlTagSelector';
import { ChevronDown, ChevronRight, Plus, Copy } from 'lucide-react';
import useDragAndDrop from '../_hooks/useDragAndDrop';

function HtmlElement({ node, level = 0, children }) {
  const {
    selection,
    selectionHandler,
    createElement,
    deleteElement,
    selectionParent,
    updateTitle,
    updateTag,
    draggedItem,
    setDraggedItem,
    dropTarget,
    setDropTarget,
    moveElement,
  } = useTree();
  
  const [isOpen, setIsOpen] = useState(true);
  const [position, setPosition] = useState(null);

  // Define drag event handlers to pass to useDragAndDrop
  const dragHandlers = {
    onDragStart: (e) => {
      setDraggedItem(node);
    },

    onDragOver: (e) => {
      if (!draggedItem || draggedItem.id === node.id) return;

      const rect = elementRef.current.getBoundingClientRect();
      const mouseY = e.clientY;
      const relativeY = mouseY - rect.top;
      
      // Define zones
      const topZone = rect.height * 0.20;
      const bottomZone = rect.height * 0.80;
      
      if (relativeY < topZone) {
        setPosition('before');
      } else if (relativeY > bottomZone) {
        setPosition('after');
      } else {
        setPosition('inside');
      }

      setDropTarget(node);
    },

    onDragLeave: (e) => {
      if (dropTarget?.id === node.id) {
        setDropTarget(null);
        setPosition(null);
      }
    },

    onDrop: (e) => {
      const sourceId = draggedItem.id;
      
      if (draggedItem && dropTarget && position) {
        moveElement(sourceId, node.id, position);
      }
      
      setDraggedItem(null);
      setDropTarget(null);
      setPosition(null);
    }
  };

  // Use the drag and drop hook
  const {
    elementRef,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop
  } = useDragAndDrop(dragHandlers);

  function changeTitle(elementTitle: string) {
    updateTitle(node.id, elementTitle);
  }

  const getDropIndicatorStyle = () => {
    if (dropTarget?.id !== node.id || !position) return '';
    
    switch (position) {
      case 'before':
        return 'before:absolute before:left-0 before:right-0 before:top-0 before:h-0.5 before:bg-blue-500';
      case 'after':
        return 'after:absolute after:left-0 after:right-0 after:bottom-0 after:h-0.5 after:bg-blue-500';
      case 'inside':
        return 'bg-blue-50';
      default:
        return '';
    }
  };

  return (
    <li
      ref={elementRef}
      className={`
        ${node.childrens && node.childrens.length > 0 && isOpen ? 'border-blue-400' : 'border-blue-400'}
        ${selectionParent && selectionParent.id === node.id ? 'border-l bg-zinc-100/50 rounded-lg' : ''}
        ${selection.id === node.id ? 'border-blue-400 bg-blue-50/50 rounded-lg' : 'border-transparent'}
        ${getDropIndicatorStyle()}
        relative border
      `}
      style={{ marginLeft: level / 5 + "rem" }}
      draggable="true"
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        onClick={() => {
          selectionHandler(node);
        }}
        className={`
          ${selection.id === node.id ? 'bg-blue-200/50' : ''}
          ${draggedItem?.id === node.id ? 'opacity-50' : ''}
          tracking-tight hover:bg-zinc-50/50 relative group w-full h-full flex flex-row items-center rounded-lg flex-start border border-transparent
        `}
      >
        <button
          onClick={(e) => {e.preventDefault; setIsOpen(!isOpen)}}
          className={"flex items-center justify-center w-6 hover:bg-zinc-100/50 h-6 rounded-lg"}
        > 
          {node.childrens && node.childrens.length > 0 &&
            (isOpen ? <ChevronDown size={14} className="text-zinc-700" /> : <ChevronRight size={14} className="text-zinc-700" />)
          }
        </button>
        <HtmlTagSelector nodeId={node.id} currentTag={node.tag || 'div'} />
        <InputClickAndText id={node.id} initValue={node.title} updateValue={changeTitle} />
        <div className="absolute right-1 flex items-center">
          {/* Copy Button */}
          <button
            className="hidden group-hover:flex items-center justify-center w-4 h-4 rounded-lg bg-zinc-50 text-zinc-700 hover:text-blue-500 text-xs"
          >
            <Copy size={12} />
          </button>
          
          {/* Add Button - + */}
          <button
            onClick={(e) => { e.preventDefault(); createElement(node.id); }}
            className="hidden group-hover:flex items-center justify-center w-4 h-4 rounded-lg bg-zinc-50 text-zinc-700 hover:text-blue-500"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>
      <AccordionWrapper openStatus={isOpen}>{children}</AccordionWrapper>
    </li>
  );
}

export default HtmlElement;