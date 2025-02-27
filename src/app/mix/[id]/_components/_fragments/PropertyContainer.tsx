"use client"

import { useState } from 'react';
import AccordionWrapper from './AccordionWrapper';

// Define props interface for the container
interface PropertyContainerProps {
  children: React.ReactNode; // Child components to render inside the container
  label: string; // Label text to display above the input
}

// Container component that provides consistent styling and layout
export default function PropertyContainer({ children, label }: PropertyContainerProps) {

    const [open, setOpen] = useState(true);

  return (
    <div>
        <div className="flex flex-row items-center gap-4">
            <h3 
            className="text-sm text-zinc-800 pb-2 font-medium cursor-pointer"   
            onClick={() => setOpen(!open)}> 
                {label} 
            </h3>
            <div className="flex flex-row items-center gap-4">
               
            </div>
            
        </div>
        <AccordionWrapper openStatus={open}>
            <div className="flex flex-row items-center gap-2 flex-wrap">
                {children}
            </div>
        </AccordionWrapper>
    </div>
  );
}
