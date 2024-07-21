'use client'
import React, { useState } from 'react';
import { useTree } from './TreeContext';

const TreeElement = ({ node, level = 0, children, dispatch, visibilityState }) => {
  const { selection, setSelection, deleteElement, createElement, updateTag, updateTitle } = useTree();
  const [editing, setEditing] = useState(false);
  const [tag, setTag] = useState(node.tag);
  const [titling, setTitling] = useState(false);
  const [title, setTitle] = useState(node.title);

  return (
    <div name="element-wrapper" 
      className="w-full flex flex-row select-none transition-all duration-300 ease-in-out"
      style={{minWidth: `${Math.min(level * 1 + 12, 24)}rem`}}
    >
      <div name="element-container" 
        key={node.id}  
        className={`
          ${"relative w-full px-2 flex flex-row items-center h-8 overflow-hidden hover:bg-zinc-200 group"} 
          ${selection !== null ? selection.id === node.id ? "bg-blue-100 group" : '' : null}
        `}
        onClick={(e) => { 
          e.stopPropagation(); 
          setSelection(node); 
        }}
        onMouseOver={(e) => { e.stopPropagation(); }}
      >
        <span name="indentation" style={{width: `${level * 1-1}rem`}}></span>
        <button
          onClick={() => dispatch({type: 'toggle', id: node.id})}
          className={"flex items-center justify-center w-6 hover:bg-zinc-100 h-6 rounded-lg"}
          style={{ visibility: node.childrens.length > 0 ? 'visible' : 'hidden' }}
        >
            <span className="text-xs group-hover:flex hidden text-zinc-400">{visibilityState[node.id] === true ? '▼' : '►'}</span>
        </button>

        {editing ? (
            <input 
              value={tag} 
              onChange={(e) => setTag(e.target.value)}
              onBlur={() => { updateTag(node.id, tag); setEditing(false); }}
              className="px-2 h-6 text-xs font-bold bg-zinc-100 flex items-center text-zinc-400 rounded-lg"
              style={{boxSizing: "content-box", width:`${tag.length-1}ch`}} 
            />
          ) : (
            <div 
              onDoubleClick={() => setEditing(true)}
              className="overflow-hidden px-2 h-6 text-xs font-bold hover:bg-zinc-100 flex items-center text-zinc-400 rounded-lg cursor-default"
              style={{boxSizing: "content-box", width:`${tag.length-1}ch`}}
            >
              {node.tag}
            </div>
          )}

          {titling ? (
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => { updateTitle(node.id, title); setTitling(false); }}
              className="px-2 h-6 text-xs font-normal bg-zinc-100 flex items-center text-zinc-800 rounded-lg" 
              style={{boxSizing: "content-box", maxWidth: "16ch" , width: `${title.length}ch`}}
            />
          ) : (
            <div 
              onDoubleClick={() => setTitling(true)}
              className="overflow-hidden px-2 h-6 text-xs font-normal hover:bg-zinc-100 flex items-center text-zinc-800 rounded-lg cursor-default"
              style={{boxSizing: "content-box", maxWidth: "16ch" , width: `${title.length}ch`}}
            >
              {node.title}
            </div>
          )}

        <div className="absolute px-2 right-0 h-full flex flex-row items-center group-hover:flex hidden">
          <button 
            onClick={() => createElement(node.id)} 
            className="px-2 h-6 rounded-lg flex items-center justify-center bg-zinc-200 hover:bg-zinc-100 text-xs"
          >
              <span className="font-bold text-zinc-500">css</span>
          </button>
          <button 
            onClick={() => createElement(node.id)} 
            className="w-6 px-2 h-6 rounded-lg flex items-center justify-center bg-zinc-200 hover:bg-zinc-100 text-lg"
          >
              <span className="font-semibold text-zinc-500">+</span>
          </button>
        </div>
      </div>
      {visibilityState && children}
    </div>
  );
}

export default TreeElement;
