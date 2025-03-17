"use client";

import { useEffect, useState } from "react";
import { api } from "MixaDev/trpc/react";
import { useTree } from './_components/TreeContext';
import { useCssTree } from './_components/CssTreeContext';
import HTMLVisualizer from './_components/ComponentPreview';
import ResizableContainer from '../../_components/Resize/ResizableContainer';

/* This is the editing page */
export default function MixModal({ params: { id: mixId } }: { params: { id: string }; }) {

  const idAsNumber = Number(mixId);
  if (Number.isNaN(idAsNumber)) {
    throw new Error("Invalid mix id");
  }

  const [mixData, setMixData] = useState(null);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
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
      if (typeof mix.jsonContent === 'object' && mix.jsonContent !== null) {
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

        // Load background image if exists
        // Using optional chaining to safely access the property
        if ('backgroundImageUrl' in mix.jsonContent && 
            typeof mix.jsonContent.backgroundImageUrl === 'string') {
          setBackgroundImageUrl(mix.jsonContent.backgroundImageUrl);
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
    
    // Create the combined data structure with background image
    const combinedData = {
      treeData: updatedTree,
      cssData: cssTree,
      backgroundImageUrl
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

  // Background Image Component
  const BackgroundImage = () => {
    if (!backgroundImageUrl) return null;

    return (
      <div className="absolute inset-0 overflow-hidden z-0">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${backgroundImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.8, // Increased opacity for better visibility
          }}
        />
      </div>
    );
  };

  // Handle image URL input
  const handleImageUrlSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('imageUrl') as HTMLInputElement;
    if (input && input.value) {
      setBackgroundImageUrl(input.value);
      setShowImageInput(false);
      // Log to confirm the URL was set
      console.log("Background image URL set to:", input.value);
    }
  };

  const toggleImageInput = () => {
    setShowImageInput(!showImageInput);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <BackgroundImage />
      
      {/* Background image URL input button */}
      <div className="absolute top-4 right-4 z-10">
        {showImageInput ? (
          <form onSubmit={handleImageUrlSubmit} className="flex gap-2">
            <input 
              type="text" 
              name="imageUrl"
              placeholder="Enter image URL" 
              className="px-2 py-1 text-sm rounded border border-gray-300" 
              defaultValue={backgroundImageUrl}
            />
            <button 
              type="submit" 
              className="bg-blue-500 text-white px-2 py-1 text-sm rounded"
            >
              Set
            </button>
            <button 
              type="button" 
              onClick={toggleImageInput}
              className="bg-gray-500 text-white px-2 py-1 text-sm rounded"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button 
            onClick={toggleImageInput} 
            className="bg-blue-500 text-white px-3 py-1 rounded flex items-center"
          >
            {backgroundImageUrl ? 'Change Background Image' : 'Set Background Image'}
            {backgroundImageUrl && <span className="ml-2 text-xs whitespace-nowrap">(currently set)</span>}
          </button>
        )}
      </div>
      
      <ResizableContainer 
        initialWidth={400} 
        initialHeight={400}
        minWidth={200} 
        minHeight={200}
        style={{ 
          maxHeight: 'calc(100vh - 1rem)', 
          maxWidth: 'calc(100vw - 1rem)' 
        }}
      >
        <HTMLVisualizer />
      </ResizableContainer>
      
      <button onClick={handleUpdateMix} className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded">
        Update Mix
      </button>
    </div>
  );
}
