"use client";

import React, { useState } from 'react';
import { useMixEditor } from '../_contexts/MixEditorContext';
import { TreeNode } from '../_types/types';
import AccordionWrapper from './_fragments/AccordionWrapper';
import InputClickAndText from './_fragments/InputClickAndText';
import HtmlTagSelector from './HtmlTagSelector';
import { ChevronDown, ChevronRight, Plus, Copy } from 'lucide-react';
import useDragAndDrop from '../_hooks/useDragAndDrop';
import { moveElement, updateElementTitle, createElement } from '../_utils/treeUtils';
import { useNotifications } from '../../../_contexts/NotificationsContext';

function HtmlElement({ node, level = 0, parentNode, children }: { node: TreeNode, level?: number, parentNode?: TreeNode, children?: React.ReactNode }) {
  // Get tree operations from TreeContext
  const {
    selection,
    selectionParent,
    draggedItem,
    dropTarget,
    setSelection: selectionHandler,
    setDraggedItem,
    setDropTarget,
  } = useMixEditor();
  
  // Get tree state and updateTree from MixEditorContext
  const { updateTree } = useMixEditor();
  
  // Get notification system
  const { addNotification } = useNotifications();
  
  const [isOpen, setIsOpen] = useState(false);
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
      const sourceId = draggedItem?.id;
      
      if (draggedItem && dropTarget && position) {
        updateTree(tree => {
          const result = moveElement(tree, sourceId, node.id, position);
          
          // Show notification if needed
          if (result.notification) {
            addNotification({
              type: result.notification.type,
              message: result.notification.message,
              duration: 5000
            });
          }
        });
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
    updateTree(tree => {
      updateElementTitle(tree, node.id, elementTitle);
    });
  }

  const handleAddElement = () => {
    updateTree(tree => {
      createElement(tree, node.id);
    });
  };

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
        ${selectionParent && selectionParent.id === node.id ? 'bg-gray-100/80' : ''}
        ${selection.id === node.id ? 'bg-gray-900 text-white' : 'text-gray-900 border-transparent'}
        ${getDropIndicatorStyle()}
        relative rounded-3xl
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
          ${selection.id === node.id ? '' : ''}
          ${draggedItem?.id === node.id ? 'opacity-50' : ''}
          tracking-tight py-0.5 px-1 text-xs relative group w-full h-full flex flex-row items-center rounded-3xl flex-start border border-transparent
        `}
      >
        <button
          onClick={(e) => {e.preventDefault; setIsOpen(!isOpen)}}
          className={"flex items-center justify-center w-6 hover:bg-zinc-100/50 h-6 rounded-3xl"}
        > 
          {node.childrens && node.childrens.length > 0 &&
            (isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />)
          }
        </button>
        <HtmlTagSelector nodeId={node.id} currentTag={node.tag || 'div'} />
        <InputClickAndText id={node.id} initValue={node.title} updateValue={changeTitle} />
        <div className="absolute right-1 flex items-center">
          {/* Copy Button */}
          <button
            className="hidden group-hover:flex items-center justify-center w-6 h-6 rounded-3xl hover:bg-white/50 text-xs"
          >
            <Copy size={12} />
          </button>
          
          {/* Add Button - + */}
          <button
            onClick={(e) => { e.preventDefault(); handleAddElement(); }}
            className="hidden group-hover:flex items-center justify-center w-6 h-6 rounded-3xl hover:bg-white/50"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>
      <div className={`${selection.id === node.id ? 'bg-white/90 rounded-3xl' : ''}`}>
        <AccordionWrapper openStatus={isOpen}>{children}</AccordionWrapper>
      </div>
    </li>
  );
}

export default HtmlElement;