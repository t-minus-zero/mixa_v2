'use client'
import React from 'react';

import { useTree } from './TreeContext';

export default function EditBoardMenu() {
  const { selection, setSelection, deleteElement, createElement, updateTag, updateTitle } = useTree();
  return (
    <div className="absolute top-0 left-0 w-full p-2 flex flex-row justify-between items-center">
        <div name="left-menu" className="p-1 flex flex-row items-center bg-white rounded-lg">
            <button className="font-bold text-lg flex items-center justify-center hover:bg-zinc-100 h-8 px-2 rounded-lg">Mixa</button>
            <input 
              name="element-name" 
              className="select-none h-8 focus:bg-zinc-100 text-xs px-2 flex-grow font-semibold rounded-lg hover:bg-zinc-100 flex-grow" 
              type="text" 
              id="fname" 
              value="ProjectName"
              onChange={() => console.log("hey")} 
            />
        </div>
        <div name="right-menu" className="p-1 flex flex-row items-center bg-white rounded-lg">

            <button className="text-xs font-semibold flex items-center justify-center hover:bg-zinc-100 h-8 px-2 rounded-lg">Profile</button>
        </div>
    </div>
  );
}
