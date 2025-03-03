'use client'
import React, { useState, useRef, useEffect } from 'react';
import { useCssTree } from './CssTreeContext';
import { useTree } from './TreeContext';

// Helper function to convert tree to HTML string (adapted from ComponentPreview.tsx)
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
  return cssObject;
}

// Convert a tree node to HTML string
function nodeToHtmlString(node, rootCss, indentLevel = 0) {
  if (!node) return '';
  
  // Create indentation
  const indent = '  '.repeat(indentLevel);
  
  // Build the opening tag with classes
  let htmlString = `${indent}<${node.tag}`;
  if (node.classes && node.classes.length > 0) {
    htmlString += ` class="${node.classes.join(' ')}"`;
  }
  
  // Add inline style based on classes
  const combinedCss = (node.classes || []).reduce((acc, className) => {
    return { ...acc, ...(rootCss[className] || {}) };
  }, {});
  
  if (Object.keys(combinedCss).length > 0) {
    const styleString = Object.entries(combinedCss)
      .map(([prop, value]) => `${prop}: ${value}`)
      .join('; ');
    htmlString += ` style="${styleString}"`;
  }
  
  // Close opening tag
  htmlString += '>';
  
  // Add content or children
  if (node.childrens && node.childrens.length > 0) {
    htmlString += '\n';
    // Add children
    node.childrens.forEach(child => {
      htmlString += nodeToHtmlString(child, rootCss, indentLevel + 1);
    });
    // Add closing tag with proper indentation
    htmlString += node.content ? `${indent}${node.content}\n${indent}` : `${indent}`;
  } else {
    // Just add content if no children
    htmlString += node.content || '';
  }
  
  // Add closing tag
  htmlString += `</${node.tag}>\n`;
  
  return htmlString;
}

// Component to display the raw CSS tree state
const CssTreeDebugPage = () => {
  const { cssTree } = useCssTree();
  
  return (
    <pre className="whitespace-pre-wrap break-all">
      {JSON.stringify(cssTree, null, 2)}
    </pre>
  );
};

// Component to display the HTML tree state
const HtmlTreeDebugPage = () => {
  const { tree } = useTree();
  
  return (
    <pre className="whitespace-pre-wrap break-all">
      {JSON.stringify(tree, null, 2)}
    </pre>
  );
};

// Component to display the generated HTML
const GeneratedHtmlDebugPage = () => {
  const { tree } = useTree();
  const rootCss = parseCssArray(tree.style);
  const htmlString = nodeToHtmlString(tree, rootCss);
  
  return (
    <div>
      <pre 
        className="whitespace-pre-wrap break-all bg-gray-900 p-3 rounded text-green-300"
      >
        {htmlString}
      </pre>
    </div>
  );
};

// Component to display the generated CSS
const CssDebugPage = () => {
  const { generateCss } = useCssTree();
  const generatedCss = generateCss();
  
  return (
    <div>
      {generatedCss.map((item, index) => (
        <div key={index} className="mb-4">
          <div className="font-bold text-green-400">{item.className}</div>
          <pre className="whitespace-pre-wrap break-all bg-gray-900 p-2 rounded">
            {item.cssString}
          </pre>
        </div>
      ))}
    </div>
  );
};

// Tab navigation component
const DebuggerTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'htmlTree', label: 'HTML Tree' },
    { id: 'generatedHtml', label: 'Generated HTML' },
    { id: 'cssTree', label: 'CSS Tree' },
    { id: 'css', label: 'Generated CSS' }
    // More tabs can be added here in the future
  ];
  
  return (
    <div className="flex mb-2 border-b border-gray-700 flex-wrap">
      {tabs.map(tab => (
        <button 
          key={tab.id}
          className={`py-1 px-3 ${activeTab === tab.id ? 'bg-gray-700 rounded-t' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

// Main debugger component
const MixDebugger = () => {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('htmlTree');
  
  // Map of tab IDs to their respective components
  const tabComponents = {
    'htmlTree': <HtmlTreeDebugPage />,
    'generatedHtml': <GeneratedHtmlDebugPage />,
    'cssTree': <CssTreeDebugPage />,
    'css': <CssDebugPage />
    // More tabs can be added here in the future
  };
  
  return (
    <div className="fixed top-4 left-4 z-50 bg-black bg-opacity-80 text-white text-xs rounded-lg shadow-lg">
      <div className="p-2 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center justify-between">
          <span className="font-bold">Mix Debugger</span>
          <span>{expanded ? '▼' : '▶'}</span>
        </div>
      </div>
      
      {expanded && (
        <div className="p-2 max-h-[80vh] overflow-auto max-w-[500px]">
          {/* Tab navigation */}
          <DebuggerTabs 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
          
          {/* Tab content */}
          <div className="mt-2">
            {tabComponents[activeTab]}
          </div>
        </div>
      )}
    </div>
  );
};

export default MixDebugger;
