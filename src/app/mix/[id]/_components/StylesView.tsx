'use client'
import React, { useState } from 'react';
import CssClassElement from './CssClassElement';
import AccordionWrapper from './AccordionWrapper';
import {useTree} from './TreeContext';

const StylesView = () => {
  const { tree, selection } = useTree();

  const findCssString = (styles, targetClass) => {
    const targetStyle = styles.find(style => Object.keys(style)[0] === targetClass);
    const cssString = targetStyle ? targetStyle[targetClass] : null;
    console.log(`CSS String for "${targetClass}": ${cssString}`);
    return cssString;
  };

  return (
    <AccordionWrapper openStatus={true}>
      <ul>
        {selection && selection.classes.map((elementClass, index) => (
          <CssClassElement key={index} className={elementClass} classCss={findCssString(tree.style, elementClass)} />
        ))}
      </ul>
    </AccordionWrapper>
  );
}

export default StylesView;


