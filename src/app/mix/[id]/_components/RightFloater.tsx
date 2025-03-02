'use client'
import React, { useState } from 'react';
import CssClassElement from './CssClassElement';
import { useCssTree } from './CssTreeContext';

const RightFloater = () => {
  const { cssTree } = useCssTree();

  return (
    <div 
      className="h-full min-w-52 max-w-80 flex flex-col justify-center group/tree">
      <div className="flex flex-col bg-zinc-50 rounded-xl gap-2" style={{maxHeight: '100% - 6rem'}}>
        <div className="flex flex-row gap-2 text-xs"> 
          <button className="w-6 h-6 hover:bg-zinc-100 rounded-lg">+</button>
        </div>
        <div className="overflow-y-scroll">
          <div className="flex-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
            <ul className="w-full h-full">
              {Object.keys(cssTree.classes).map((className) => (
                <CssClassElement key={className} className={className} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightFloater;
