'use client'
import React, { useState } from 'react';
import HtmlElement from './HtmlElement';
import AccordionWrapper from './_fragments/AccordionWrapper';
import {useTree} from './TreeContext';

const renderTree = (node, level = 0) => (
  <HtmlElement key={node.id} node={node} level={level}>
    {node.childrens && node.childrens.length > 0 && (
      <ul>
        {node.childrens.map(childNode => renderTree(childNode, level + 1))}
      </ul>
    )}
  </HtmlElement>
);

const LeftFloater = () => {
  const { tree } = useTree();
  return (
    <div 
      className="h-full py-4 min-w-52 flex flex-col justify-center group/tree">
      <div className="flex flex-col bg-zinc-50 p-2 rounded-xl gap-2" style={{maxHeight: '100% - 6rem'}}>
        <div className="flex flex-row gap-2 text-xs">
          {/* To add quick actions like Add component */} 
          <button className="w-6 h-6 hover:bg-zinc-100 rounded-lg">A</button>
          <button className="w-6 h-6 hover:bg-zinc-100 rounded-lg">B</button>
          <button className="w-6 h-6 hover:bg-zinc-100 rounded-lg">C</button>
        </div>
        <div className="overflow-y-scroll">
          <AccordionWrapper openStatus={true}>
            <ul>
              {renderTree(tree)}
            </ul>
          </AccordionWrapper>
        </div>
      </div>
    </div>
  );
}

export default LeftFloater;


