"use client";

import { useEffect, useState } from "react";
import { api } from "MixaDev/trpc/react";
import { useTree } from './_components/TreeContext';
import { useCssTree } from './_components/CssTreeContext';
import HTMLVisualizer from './_components/ComponentPreview';

/* This is the editing page */
export default function MixModal({ params: { id: mixId } }: { params: { id: string }; }) {

  const idAsNumber = Number(mixId);
  if (Number.isNaN(idAsNumber)) {
    throw new Error("Invalid mix id");
  }

  const [mixData, setMixData] = useState(null);
  const { tree, setTree } = useTree();
  const { cssTree, updateTree } = useCssTree();
  
  const { data: mix, error, isLoading } = api.mixRouter.getMixById.useQuery({
    id: idAsNumber,
  });

  const replaceMixMutation = api.mixRouter.replaceMixById.useMutation();

  useEffect(() => {
    if (mix) {
      setMixData(mix);
      
      // Handle backwards compatibility
      if (typeof mix.jsonContent === 'object') {
        // New format with combined data
        if (mix.jsonContent.treeData) {
          setTree(mix.jsonContent.treeData);
        }
        
        if (mix.jsonContent.cssData && mix.jsonContent.cssData.classes) {
          // Use updateTree to update the cssTree
          updateTree(draft => {
            // Directly set the classes on the draft object
            draft.classes = mix.jsonContent.cssData.classes;
          });
        }
      } else {
        // Legacy format with only tree data
        setTree(mix.jsonContent);
      }
    }
  }, [mix]);

  const handleUpdateMix = async () => {
    if (!tree) {
      console.error("No tree data to update");
      return;
    }

    const defaultJsonContent = {
      id: '',
      tag: '',
      title: '',
      classes: [],
      style: [],
      content: '',
      childrens: []
    };

    const updatedTree = {
      ...defaultJsonContent,
      ...tree
    };
    
    // Create the combined data structure
    const combinedData = {
      treeData: updatedTree,
      cssData: cssTree
    };

    try {
      const updatedMix = await replaceMixMutation.mutateAsync({
        id: idAsNumber,
        jsonContent: combinedData,
      });
      setMixData(updatedMix);
      console.log("Mix updated successfully:", updatedMix);
    } catch (error) {
      console.error("Failed to update mix:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <div className="w-64 h-64 overflow-hidden resize border border-zinc-300 rounded-lg" style={{ maxHeight: 'calc(100vh - 1rem)', maxWidth: 'calc(100vw - 1rem)' }}>
        <HTMLVisualizer />
      </div>
      <button onClick={handleUpdateMix} className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded">
        Update Mix
      </button>
    </div>
  );
}
