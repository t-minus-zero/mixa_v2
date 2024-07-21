'use client'
import React, { useState, useEffect } from 'react';
import { useTree } from './TreeContext';

const TreeClass = ({ node, index }) => {
  const { updateClassName } = useTree();
  const [naming, setNaming] = useState(false);
  const [className, setClassName] = useState(node.classes[index] || "");
  const [open, setOpen] = useState(false);
  const [properties, setProperties] = useState([]);

  // Effect to update className whenever the node's classes change
  useEffect(() => {
    setClassName(node.classes[index]);
  }, [node.classes, index]);

  const handleBlur = () => {
    updateClassName(node.id, className, index);
    setNaming(false);
  };

  return (
    <div name="element-wrapper" 
      className="w-full flex flex-col select-none transition-all duration-300 ease-in-out"
      style={{ minWidth: "12rem" }}
    >
      <div name="element-container" 
        className="relative w-full px-2 flex flex-row items-center h-8 overflow-hidden hover:bg-zinc-200 group"
        onClick={(e) => { 
          e.stopPropagation();
        }}
        onMouseOver={(e) => { e.stopPropagation(); }}
      >
        <span name="indentation" className="w-0"></span>
        <button
          onClick={() => setOpen(!open)}
          className={"flex items-center justify-center w-6 hover:bg-zinc-100 h-6 rounded-lg"}
          style={{ visibility: properties.length <= 0 ? 'visible' : 'hidden' }}
        >
          <span className="text-xs group-hover:flex hidden text-zinc-400">{properties.length > 0 ? '▼' : '►'}</span>
        </button>

        <div 
          className="overflow-hidden px-2 h-6 text-xs font-bold hover:bg-zinc-100 flex items-center text-zinc-400 rounded-lg cursor-default"
          style={{boxSizing: "content-box", width: `${5-1}ch`}}
        >
          Class
        </div>

        {naming ? (
          <input 
            value={className} 
            onChange={(e) => setClassName(e.target.value)}
            onBlur={handleBlur}
            className="px-2 h-6 text-xs font-normal bg-zinc-100 flex items-center text-zinc-800 rounded-lg" 
            style={{boxSizing: "content-box", maxWidth: "16ch", width: `${className.length}ch`}}
          />
        ) : (
          <div 
            onDoubleClick={() => setNaming(true)}
            className="overflow-hidden px-2 h-6 text-xs font-normal hover:bg-zinc-100 flex items-center text-zinc-800 rounded-lg cursor-default"
            style={{boxSizing: "content-box", maxWidth: "16ch", width: `${className.length}ch`}}
          >
            {className}
          </div>
        )}

        <div className="absolute px-2 right-0 h-full flex flex-row items-center group-hover:flex hidden">
          <button 
            className="w-6 px-2 h-6 rounded-lg flex items-center justify-center bg-zinc-200 hover:bg-zinc-100 text-lg"
          >
            <span className="font-semibold text-zinc-500">+</span>
          </button>
        </div>
      </div>
      <span className="text-xs"></span>
    </div>
  );
}

export default TreeClass;
