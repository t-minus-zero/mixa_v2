"use client";

import React, { useState } from 'react';
import { useTree } from './TreeContext';
import AccordionWrapper from './AccordionWrapper';
import InputClickAndText from './_fragments/InputClickAndText';
import InputDropAndText from './_fragments/InputDropAndText';


function HtmlElement({ node, level = 0, children }) {
    const { selection, selectionHandler, createElement, selectionParent, updateTitle } = useTree();
    const [isOpen, setIsOpen] = useState(true);

    function changeTitle (elementTitle:string) {
        updateTitle(node.id, elementTitle);
    }
  
    return (
      <li className={`${node.childrens && node.childrens.length>0 && isOpen ? 'border-zinc-300' : 'border-transparent'} ${ selectionParent && selectionParent.id=== node.id ? `border-l` : ``} p-1`} 
      style={{ marginLeft: level/5 + "rem" }}>
        <div 
            onClick={() => { selectionHandler(node); }}
            className={`${selection.id === node.id ? 'bg-zinc-100' : ''} tracking-tight relative p-1 group w-full h-full flex flex-row items-center rounded-lg flex-start gap-2`}>
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
          <AccordionWrapper openStatus={isOpen}>
              {children}
          </AccordionWrapper>
      </li>
    );
  }
  
  export default HtmlElement;