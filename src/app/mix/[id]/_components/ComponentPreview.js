'use client'
import React from 'react';
import { useTree } from './TreeContext';

function cssToObject(cssString) {
    const cssArray = cssString.split(';');
    const cssObject = {};
  
    cssArray.forEach((cssRule) => {
      const [property, value] = cssRule.split(':');
      if (property && value) {
        const formattedProperty = property.trim();
        const formattedValue = value.trim();
        cssObject[formattedProperty] = formattedValue;
      }
    });
  
    return cssObject;
}
  
const RenderTree = ({ node }) => {
  if (!node) return null;

  // Parse CSS into an object
  const css = cssToObject(node.css);

  // Create child elements
  const children = node.childrens.map(child => <RenderTree key={child.id} node={child} />);

  // Create the element
  return React.createElement(node.tag, { style: css, className: node.classes.join(' ') }, [...children, node.content || '']);
};

const HTMLVisualizer = () => {
  const { tree } = useTree();

  // Render the tree starting from the root
  return <RenderTree node={tree} />;
};

export default HTMLVisualizer;
