'use client'
import React from 'react';
import StylesEditor from './_stylesEditor/StylesEditor';

const StylesView = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
        <StylesEditor />
      </div>
    </div>
  );
}

export default StylesView;
