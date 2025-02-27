 "use client";

import React, { useState, useEffect } from 'react';
import { useTree } from './TreeContext';
import AccordionWrapper from './_fragments/AccordionWrapper';
import InputClickAndText from './_fragments/InputClickAndText';
 
 export function CssClassElement ({className, classCss} : {elementClass: string, classCss: string}) {
    const {tree, selection, updateClassCss } = useTree();
    const [isOpen, setIsOpen] = useState(true);
    const [cssString, setCssString] = useState(classCss);

    const changeClassName = (elementClass:string) => {
        {console.log("changing class name to " + elementClass)}
    };

    useEffect(() => {
      setCssString(classCss);
    }, [classCss]);

    return (
      <li className="w-full">
        <div className={`tracking-tight relative p-1 group w-full h-full flex flex-row items-center justify-start rounded-lg gap-2`}>
           <button
            onClick={(e) => {e.preventDefault; setIsOpen(!isOpen)}}
            className={"flex items-center justify-center w-6 hover:bg-zinc-200 h-6 rounded-lg"}
          > 
            <span className="group-hover/tree:flex hidden text-xs text-zinc-700">
                  {isOpen ? '▼' : '▶'}
            </span>
          </button>
          <InputClickAndText id={selection.id} initValue={className} updateValue={changeClassName} />
          <div className="absolute right-1 flex flex-row gap-1">
            <button
                onClick={(e) => { e.preventDefault() }}
                className={"flex items-center justify-center w-6 hover:bg-zinc-200 h-6 rounded-lg"}>
                <span className="text-xs group-hover:flex text-zinc-700 hidden">
                "[]"
                </span>
            </button>
            <button
                onClick={(e) => { e.preventDefault() }}
                className={"flex items-center justify-center w-6 hover:bg-zinc-200 h-6 rounded-lg"}>
                <span className="text-xs group-hover:flex text-zinc-700 hidden">
                +
                </span>
            </button>
          </div>
        </div>
        <AccordionWrapper openStatus={isOpen}>
          <textarea 
            value={cssString ? cssString : ''} 
            onChange={(e) => setCssString(e.target.value)} 
            style={{width: '100%', height: '50%', borderRadius: "16px"}}
            onBlur={()=>updateClassCss(className, cssString)}
            className="min-h-24"
          />
        </AccordionWrapper>
      </li>
    );
  }
  
export default CssClassElement;