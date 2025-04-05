'use client'
import React, { useState, useRef, useEffect } from 'react';
import { useMixEditor } from '../_contexts/MixEditorContext';
import {generateStyleFromTree} from '../_utils/treeUtils';

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
  const { cssTree } = useMixEditor();
  
  return (
    <pre className="whitespace-pre-wrap break-all text-xs p-2 bg-zinc-100/90 rounded border border-zinc-200 shadow-inner font-mono text-zinc-800">
      {JSON.stringify(cssTree, null, 2)}
    </pre>
  );
};

// Component to display the HTML tree state
const HtmlTreeDebugPage = () => {
  const { tree } = useMixEditor();
  
  return (
    <pre className="whitespace-pre-wrap break-all text-xs p-2 bg-zinc-100/90 rounded border border-zinc-200 shadow-inner font-mono text-zinc-800">
      {JSON.stringify(tree, null, 2)}
    </pre>
  );
};

// Component to display the generated HTML
const GeneratedHtmlDebugPage = () => {
  const { tree } = useMixEditor();
  const rootCss = parseCssArray(tree?.style || []);
  const htmlString = tree ? nodeToHtmlString(tree, rootCss) : '';
  
  return (
    <div>
      <pre 
        className="whitespace-pre-wrap break-all bg-zinc-100/90 p-2 rounded text-zinc-800 text-xs border border-zinc-200 shadow-inner font-mono"
      >
        {htmlString}
      </pre>
    </div>
  );
};

// Component to display the generated CSS
const CssDebugPage = () => {
  const { cssTree } = useMixEditor();
  const generatedCss = generateStyleFromTree(cssTree);
  
  return (
    <div>
      {generatedCss.map((item, index) => (
        <div key={index} className="mb-3">
          <div className="font-medium text-xs text-blue-600 mb-1 px-1">{item.className}</div>
          <pre className="whitespace-pre-wrap break-all bg-zinc-100/90 p-2 rounded text-zinc-800 text-xs border border-zinc-200 shadow-inner font-mono">
            {item.cssString}
          </pre>
        </div>
      ))}
    </div>
  );
};

// Component to display all state variables from MixEditorContext
const StateDebugPage = () => {
  const mixEditor = useMixEditor();
  
  // Extract specific properties we don't want to display directly
  const { tree, cssTree, htmlSchemas, ...restState } = mixEditor;
  
  // Format specific state variables
  const formatValue = (key: string, value: any) => {
    // For selection and selectionParent, show ID and classes
    if (key === 'selection' && value && typeof value === 'object' && value.id) {
      return { 
        id: value.id,
        classes: value.classes || []
      };
    }
    if (key === 'selectionParent' && value && typeof value === 'object' && value.id) {
      return { 
        id: value.id,
        classes: value.classes || []
      };
    }
    // For draggedItem, only show ID
    if (key === 'draggedItem' && value && typeof value === 'object' && value.id) {
      return { id: value.id };
    }
    // For dropTarget, only show ID
    if (key === 'dropTarget' && value && typeof value === 'object' && value.id) {
      return { id: value.id };
    }
    if (typeof value === 'function') {
      return '[Function]';
    }
    return value;
  };
  
  // Get all state keys excluding functions
  const stateKeys = Object.keys(restState).filter(key => {
    return typeof restState[key] !== 'function';
  });
  
  return (
    <div className="space-y-3">
      {stateKeys.map(key => (
        <div key={key} className="mb-3">
          <div className="font-medium text-xs text-blue-600 mb-1 px-1">{key}</div>
          <pre className="whitespace-pre-wrap break-all text-xs p-2 bg-zinc-100/90 rounded border border-zinc-200 shadow-inner font-mono text-zinc-800">
            {JSON.stringify(formatValue(key, restState[key]), null, 2)}
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
    { id: 'css', label: 'Generated CSS' },
    { id: 'state', label: 'State Variables' }
    // More tabs can be added here in the future
  ];
  
  return (
    <div className="flex border-b border-zinc-200 flex-wrap">
      {tabs.map(tab => (
        <button 
          key={tab.id}
          className={`py-1.5 px-3 text-xs ${activeTab === tab.id ? 'bg-blue-50 text-blue-600 font-medium' : 'text-zinc-500 hover:text-zinc-800'}`}
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
  const [activeTab, setActiveTab] = useState('state');
  
  // Map of tab IDs to their respective components
  const tabComponents = {
    'htmlTree': <HtmlTreeDebugPage />,
    'generatedHtml': <GeneratedHtmlDebugPage />,
    'cssTree': <CssTreeDebugPage />,
    'css': <CssDebugPage />,
    'state': <StateDebugPage />
    // More tabs can be added here in the future
  };
  
  return (
    <div className="w-full h-full flex flex-col bg-zinc-50/75 backdrop-blur-md text-zinc-800 text-xs border-l border-zinc-200 shadow-sm">
      {/* Tab navigation - fixed at top */}
      <div className="sticky top-0 bg-zinc-50/95 border-b border-zinc-200 z-10">
        <DebuggerTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
      </div>
      
      {/* Tab content - scrollable */}
      <div className="flex-grow overflow-auto p-2">
        {tabComponents[activeTab]}
      </div>
    </div>
  );
};

export default MixDebugger;
