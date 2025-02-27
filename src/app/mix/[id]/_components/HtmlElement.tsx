"use client";

import React, { useState, useRef } from 'react';
import { useTree } from './TreeContext';
import AccordionWrapper from './_fragments/AccordionWrapper';
import InputClickAndText from './_fragments/InputClickAndText';
import InputDropAndText from './_fragments/InputDropAndText';

function HtmlElement({ node, level = 0, children }) {
  const {
    selection,
    selectionHandler,
    createElement,
    selectionParent,
    updateTitle,
    draggedItem,
    setDraggedItem,
    dropTarget,
    setDropTarget,
    dropPosition,
    setDropPosition,
    moveElement,
  } = useTree();
  
  const [isOpen, setIsOpen] = useState(true);
  const elementRef = useRef(null);

  const handleDragStart = (e) => {
    e.stopPropagation();
    setDraggedItem(node);
    e.dataTransfer.setData('text/plain', node.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedItem || draggedItem.id === node.id) return;

    const rect = elementRef.current.getBoundingClientRect();
    const mouseY = e.clientY;
    const relativeY = mouseY - rect.top;
    
    // Define zones
    const topZone = rect.height * 0.25;
    const bottomZone = rect.height * 0.75;
    
    let position;
    if (relativeY < topZone) {
      position = 'before';
    } else if (relativeY > bottomZone) {
      position = 'after';
    } else {
      position = 'inside';
    }

    setDropTarget(node);
    setDropPosition(position);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropTarget?.id === node.id) {
      setDropTarget(null);
      setDropPosition(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const sourceId = e.dataTransfer.getData('text/plain');
    
    if (draggedItem && dropTarget && dropPosition) {
      moveElement(sourceId, node.id, dropPosition);
    }
    
    setDraggedItem(null);
    setDropTarget(null);
    setDropPosition(null);
  };

  function changeTitle(elementTitle: string) {
    updateTitle(node.id, elementTitle);
  }

  const getDropIndicatorStyle = () => {
    if (dropTarget?.id !== node.id || !dropPosition) return '';
    
    switch (dropPosition) {
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
        ${node.childrens && node.childrens.length > 0 && isOpen ? 'border-zinc-300' : 'border-transparent'}
        ${selectionParent && selectionParent.id === node.id ? 'border-l' : ''}
        ${getDropIndicatorStyle()}
        relative p-1
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
          ${selection.id === node.id ? 'bg-zinc-100' : ''}
          ${draggedItem?.id === node.id ? 'opacity-50' : ''}
          tracking-tight relative p-1 group w-full h-full flex flex-row items-center rounded-lg flex-start gap-2
        `}
      >
        <button
          onClick={(e) => {e.preventDefault; setIsOpen(!isOpen)}}
          className={"flex items-center justify-center w-6 hover:bg-zinc-200 h-6 rounded-lg"}
        > 
          {node.childrens && node.childrens.length > 0 &&
            <span className="group-hover/tree:flex hidden text-xs text-zinc-700">
                {isOpen ? '▼' : '▶'}
            </span>
          }
        </button>
        <InputDropAndText id={node.id} initValue={"[]"} listOfValues={['[]', 'T', 'O']} />
        <InputClickAndText id={node.id} initValue={node.title} updateValue={changeTitle} />
        <div className="absolute right-1">
          <button
              onClick={(e) => { e.preventDefault(); createElement(node.id); }}
              className={"flex items-center justify-center w-6 hover:bg-zinc-200 h-6 rounded-lg"}>
              <span className="text-xs group-hover:flex text-zinc-700 hidden">
              +
              </span>
          </button>
        </div>
      </div>
      <AccordionWrapper openStatus={isOpen}>{children}</AccordionWrapper>
    </li>
  );
}

export default HtmlElement;