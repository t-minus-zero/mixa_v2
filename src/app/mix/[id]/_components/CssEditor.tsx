'use client'
import React, { useState, useEffect } from 'react';
import { useTree } from './TreeContext';

function findNodeInTree(tree, selection) {
  let id
  if (selection !== null){
    id = selection.id;
  } 
    else
  {
    return tree;
  }
  if (tree.id === id) return tree;
  
    for (const child of tree.childrens) {
      const found = findNodeInTree(child, id);
      if (found) return found;
    }
    return null;
  }

function CssEditor() {
  const { selection, tree, updateCss, updateContent } = useTree();
  const [css, setCss] = useState('');
  const [content, setContent] = useState('');

  // Whenever the selection changes, update the CSS state
  useEffect(() => {
    const selectedNode = findNodeInTree(tree, selection);
    setCss(selectedNode ? selectedNode.css : '');
    setContent(selectedNode ? selectedNode.content : '');
  }, [selection, tree]);

  const handleSaveCss = () => {
    updateCss(selection.id, css);
  };

  const handleSaveContent = () => {
    updateContent(selection.id, content);
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '100%'}}>
      <textarea 
        value={css} 
        onChange={(e) => setCss(e.target.value)} 
        style={{width: '100%', height: '50%', borderRadius: "16px"}}
      />
      <button onClick={handleSaveCss} style={{width: '100%'}}>
        Save CSS
      </button>
      <button onClick={handleSaveContent} style={{width: '100%'}}>
        Save Content
      </button>
      <textarea 
        value={content} 
        onChange={(e) => setContent(e.target.value)} 
        style={{width: '100%', height: '50%', borderRadius: "16px"}}
      />
    </div>
  );
}

export default CssEditor;
