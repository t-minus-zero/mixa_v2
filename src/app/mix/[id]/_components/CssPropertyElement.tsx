"use client";

import React, { useState, useEffect, Children } from 'react';
import { useTree } from './TreeContext';
import AccordionWrapper from './_fragments/AccordionWrapper';
import InputClickAndText from './_fragments/InputClickAndText';

// component for a class in the css tree
// renders a collapsible section with a class name and its properties components
// 

export function CssPropertyElement (cssPropertySchema: object, children: React.ReactNode) {
    const [cssString, setCssString] = useState(classCss); // This is the formatted css string for the property

    
    // This component jsut displays the name of the property for now
    return (
        <div className="w-full flex flex-row items-center justify-start p-2">
            <h3>{cssPropertySchema.label}</h3>
            {children}
        </div>
    )
}
