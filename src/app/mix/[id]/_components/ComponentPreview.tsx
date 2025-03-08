'use client'
import React from 'react';
import { useTree } from './TreeContext';
import { useCssTree } from './CssTreeContext';

// Helper function to convert CSS string to object
function cssToObject(cssString) {
    const cssObject = {};
    if (!cssString) return cssObject;
    const cssArray = cssString.split(';');
    
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


// Parse the root's CSS array into an object of className to cssObject mappings
function parseCssArray(cssArray) {
    const cssObject = {};

    if (Array.isArray(cssArray)) {
        cssArray.forEach(entry => {
            const className = Object.keys(entry)[0];
            const cssString = entry[className];
            cssObject[className] = cssToObject(cssString);
        });
    }
    console.log(cssObject);
    return cssObject;
}

const RenderTree = ({ node, rootCss }) => {
    if (!node) return null;

    // Merge CSS from all classes
    const combinedCss = (node.classes || []).reduce((acc, className) => {
        return { ...acc, ...rootCss[className] };
    }, {});

    // Create child elements
    const children = (node.childrens || []).map(child => <RenderTree key={child.id} node={child} rootCss={rootCss} />);

    // Create the element
    return React.createElement(node.tag, { style: combinedCss, className: (node.classes || []).join(' ') }, [...children, node.content || '']);
};

const HTMLVisualizer = () => {
    const { tree } = useTree();

    // Parse the root's css array into an object
    const rootCss = parseCssArray(tree.style);

    // Render the tree starting from the root
    return <RenderTree node={tree} rootCss={rootCss} />;
};

export default HTMLVisualizer;
