'use client'
import React, { useReducer } from 'react';
import TreeElement from './TreeElement';

function visibilityReducer(state, action) {
  switch (action.type) {
    case 'toggle':
      return {...state, [action.id]: !state[action.id]};
    default:
      return state;
  }
}

const ComponentsTree = ({ node, level = 0 }) => {

  const [visibilityState, dispatch] = useReducer(visibilityReducer, false);

  const flattenTree = (node, level = 0) => {
    let flattenedTree = [
      <TreeElement key={node.id} node={node} level={level + 1} dispatch={dispatch} visibilityState={visibilityState} />
    ];
  
    // Check visibilityState before rendering children
    if (visibilityState[node.id] === true) {
      node.childrens.forEach(childNode => {
        flattenedTree = [...flattenedTree, ...flattenTree(childNode, level + 1)];
      });
    }
  
    return flattenedTree;
  }

  return (
    <div className="flex flex-col ml-2 bg-zinc-50 rounded-xl max-h-56 overflow-auto">
        <div name="components" className="w-full flex flex-row items-center justify-between p-2 bg-zinc-50 select-none">
            <h3  className="text-xs font-semibold h-8 flex items-center justify-center px-2"> 
                Component
            </h3>
            <div className="flex flex-row h-8">
                <button name="add-more" className="w-8 px-2 h-full flex items-center justify-center hover:bg-zinc-100 text-lg rounded-lg">D</button>
                <button name="add-more" className="w-8 px-2 h-full flex items-center justify-center hover:bg-zinc-100 text-lg rounded-lg">&#x192;</button>
                <button name="add-more" className="w-8 px-2 h-full flex items-center justify-center hover:bg-zinc-100 text-lg rounded-lg">&#x2206;</button>
            </div>
        </div>
        <div name="scroller" className="scroller w-full flex-grow overflow-y-scroll">
            {flattenTree(node)}
        </div>
    </div>
  );
}

export default ComponentsTree;


