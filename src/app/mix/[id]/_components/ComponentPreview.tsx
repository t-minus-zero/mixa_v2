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

    // Process inlineStyle - convert kebab-case to camelCase for React
    const processedInlineStyle = {};
    if (node.inlineStyle) {
        Object.entries(node.inlineStyle).forEach(([prop, value]) => {
            // Convert CSS property names from kebab-case to camelCase for React
            const camelCaseProp = prop.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
            processedInlineStyle[camelCaseProp] = value;
        });
    }

    // Merge with existing combined CSS (giving priority to inline styles)
    const finalStyles = { ...combinedCss, ...processedInlineStyle };

    // Start with basic props (style and className)
    const elementProps = { 
        style: finalStyles, 
        className: (node.classes || []).join(' ') 
    };

    // Process additional attributes if they exist
    if (node.attributes && Array.isArray(node.attributes)) {
        // Add each attribute to the props object
        node.attributes.forEach(attr => {
            if (attr && attr.attribute && attr.value !== undefined) {
                // Special handling for certain attributes
                if (attr.attribute === 'style') {
                    console.warn('Style attribute found in node attributes, but styles are handled separately');
                    return;
                }
                if (attr.attribute === 'className') {
                    console.warn('className attribute found in node attributes, but classes are handled separately');
                    return;
                }
                
                // Add the attribute to props
                elementProps[attr.attribute] = attr.value;
            }
        });
    }

    // Create child elements
    const children = (node.childrens || []).map(child => <RenderTree key={child.id} node={child} rootCss={rootCss} />);
    
    // Get content
    const content = node.content || '';
    
    // Determine what to include as children for this element
    let elementChildren;
    if (children.length === 0 && !content) {
        // No children or content, pass null
        elementChildren = null;
    } else if (children.length === 0) {
        // Only content, no child elements
        elementChildren = content;
    } else if (!content) {
        // Only child elements, no content
        elementChildren = children;
    } else {
        // Both child elements and content
        elementChildren = [...children, content];
    }

    // Create the element with all props including attributes
    return React.createElement(
        node.tag, 
        elementProps, 
        elementChildren
    );
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
