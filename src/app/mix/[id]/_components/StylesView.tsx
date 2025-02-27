'use client'
import React, { useState, ChangeEvent } from 'react';
import CssClassElement from './CssClassElement';
import AccordionWrapper from './_fragments/AccordionWrapper';
import {useTree} from './TreeContext';
import { Ruler } from 'lucide-react'; // Example SVG icon from Lucide
import LengthInput from './_fragments/LengthInput';
import PropertyContainer from './_fragments/PropertyContainer';
import InputContainer from './_fragments/InputContainer';
import TextInput from './_fragments/TextInput'; 

const StylesView = () => {
  const { tree, selection } = useTree();

  const findCssString = (styles, targetClass) => {
    const targetStyle = styles.find(style => Object.keys(style)[0] === targetClass);
    const cssString = targetStyle ? targetStyle[targetClass] : null;
    console.log(`CSS String for "${targetClass}": ${cssString}`);
    return cssString;
  };

  const [length, setLength] = useState<string>('10px');
  const units = ['px', '%', 'rem', 'em', 'vh', 'vw', 'fr'];
  const [text, setText] = useState<string>('');

  // Handle text input change
  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  return (
    <AccordionWrapper openStatus={true}>
      <ul>
        {selection && selection.classes.map((elementClass, index) => (
          <CssClassElement key={index} className={elementClass} classCss={findCssString(tree.style, elementClass)} />
        ))}
        <PropertyContainer label="Margin">
            <LengthInput
              label="Top"
              value={length}
              onChange={setLength}
              icon={Ruler}
              units={units}
            />
            <LengthInput
              label="Right"
              value={length}
              onChange={setLength}
              icon={Ruler}
              units={units}
            />
            <LengthInput
              label="Bottom"
              value={length}
              onChange={setLength}
              icon={Ruler}
              units={units}
            />
            <LengthInput
              label="Left"
              value={length}
              onChange={setLength}
              icon={Ruler}
              units={units}
            />
            <PropertyContainer label="ClassName">
              <InputContainer label="Width">
                <TextInput
                  value={text}
                  onChange={handleTextChange}
                  placeholder="Enter class name..."
                />
              </InputContainer>
            </PropertyContainer>
        </PropertyContainer>
      </ul>
    </AccordionWrapper>
  );
}

export default StylesView;
