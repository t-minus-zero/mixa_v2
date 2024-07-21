'use client'
import React from 'react';
import { useTree } from './TreeContext';
import HTMLVisualizer from './ComponentPreview';
import EditBoardMenu from "./EditBoardMenu";
import ComponentsTree from "./ComponentsTree";
import StylesTree from "./StylesTree";

function EditingPage() {
  const { tree } = useTree();

  return (
    <div className="w-screen h-screen flex items-center justify-center overflow-hidden">
      <EditBoardMenu />
      <div className="absolute top-16 left-0 flex flex-row items-start">
          <ComponentsTree node={tree} />
          <StylesTree />
      </div>
      <div className="w-full h-full flex items-center justify-center overflow-hidden">
          {console.log(tree)}
          <HTMLVisualizer />
      </div>
    </div>
  );
}

export default EditingPage;
