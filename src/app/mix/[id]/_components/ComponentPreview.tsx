'use client'
import React from 'react';
import { useTree } from './TreeContext';
import { useCssTree } from './CssTreeContext';

// Helper function to convert kebab-case to camelCase for React styles
function kebabToCamelCase(kebabString) {
    return kebabString.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
}

// Helper function to convert CSS string to object
function cssToObject(cssString) {
    const cssObject = {};
    if (!cssString) return cssObject;
    const cssArray = cssString.split(';');
    
    cssArray.forEach((cssRule) => {
        const [property, value] = cssRule.split(':');
        if (property && value) {
            const formattedProperty = kebabToCamelCase(property.trim());
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
    const { generateCss } = useCssTree();
    
    // Get formatted CSS from CssTreeContext
    const formattedClasses = generateCss();
    
    // Convert to the format parseCssArray expects
    const cssArray = formattedClasses.map(item => {
        // Extract the CSS content between curly braces (remove selector and braces)
        const cssContent = item.cssString
            .replace(`.${item.className} {`, '')
            .replace(/}$/, '')
            .trim();
            
        // Return an object with the class name as key and CSS string as value
        return { [item.className]: cssContent };
    });
    
    // Parse the CSS array into an object of className to cssObject mappings
    const rootCss = parseCssArray(cssArray);
    
    // Render the tree starting from the root
    return <RenderTree node={tree} rootCss={rootCss} />;
};

export default HTMLVisualizer;
