'use client'
import React, { useState } from 'react';
import StylesView from './StylesView';

const RightFloater = () => {

  return (
    <div 
      className="h-full py-4 pl-4 min-w-52 flex flex-col justify-center group/tree">
      <div className="flex flex-col bg-zinc-50 p-2 rounded-xl gap-2" style={{maxHeight: '100% - 6rem'}}>
        <div className="flex flex-row gap-2 text-xs"> 
          <button className="w-6 h-6 hover:bg-zinc-100 rounded-lg">A</button>
          <button className="w-6 h-6 hover:bg-zinc-100 rounded-lg">B</button>
          <button className="w-6 h-6 hover:bg-zinc-100 rounded-lg">C</button>
        </div>
        <div className="overflow-y-scroll">
          <StylesView />
        </div>
      </div>
    </div>
  );
}

export default RightFloater;


