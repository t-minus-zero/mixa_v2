'use client'
import React, { useState, useEffect } from 'react';
import TreeClass from './TreeClass';
import { useTree } from './TreeContext';

const StylesTree = () => {
  const { selection, addClass, setSelection } = useTree();
  const [classes, setClasses] = useState([]);

  // Effect to update classes whenever selection changes
  useEffect(() => {
    if (selection && selection.classes) {
      setClasses(selection.classes);
    } else {
      setClasses([]);
    }
  }, [selection]);

  const handleAddClass = () => {
    if (selection && selection.classes) {
      addClass(selection.id, "newClass");
      // Update local state and context state to trigger re-render
      setClasses([...selection.classes, "newClass"]);
      setSelection({ ...selection, classes: [...selection.classes, "newClass"] });
    }
  };

  return (
    <div className="flex flex-col ml-2 bg-zinc-50 rounded-xl max-h-56 overflow-auto">
      <div name="components" className="w-full flex flex-row items-center justify-between p-2 bg-zinc-50 select-none">
        <h3 className="text-xs font-semibold h-8 flex items-center justify-center px-2"> 
          Styles
        </h3>
        <div className="flex flex-row h-8">
          <button name="add-more" className="w-8 px-2 h-full flex items-center justify-center hover:bg-zinc-100 text-xs text-zinc-400 rounded-lg">Pin</button>
          <button 
            name="add-more" 
            className="w-8 px-2 h-full flex items-center justify-center hover:bg-zinc-100 text-lg rounded-lg"
            onClick={handleAddClass}
          >
            +
          </button>
        </div>
      </div>
      <div name="scroller" className="scroller w-full flex-grow overflow-y-scroll">
        {selection && classes.map((c, i) => (
          <TreeClass node={selection} index={i} key={i} />
        ))}
      </div>
    </div>
  );
}
export default StylesTree;
