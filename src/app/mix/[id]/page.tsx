"use client";

import { useEffect, useState } from "react";
import { api } from "MixaDev/trpc/react";
import { useTree } from './_components/TreeContext';
import { useCssTree } from './_components/CssTreeContext';
import HTMLVisualizer from './_components/ComponentPreview';
import MixFloaterMenu from './_components/MixFloaterMenu';
import ResizableContainer from '../../_components/Resize/ResizableContainer';
import { useNotifications } from '../../_contexts/NotificationsContext';
import TitleMenu from '../../dashboard/_components/TitleMenu';

// Define interfaces for type safety
interface TreeData {
  id: string;
  tag: string;
  title: string;
  classes: string[];
  style: any[];
  content: string;
  childrens: any[];
}

interface MixJsonContent {
  treeData: TreeData;
  cssData: { classes: Record<string, any> };
  backgroundImageUrl?: string;
}

interface MixData {
  id: number;
  name: string | null;
  mixType: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  jsonContent: MixJsonContent | unknown;
  deletedAt?: Date | null;
}

/* This is the editing page */
export default function MixModal({ params: { id: mixId } }: { params: { id: string }; }) {

  const idAsNumber = Number(mixId);
  if (Number.isNaN(idAsNumber)) {
    throw new Error("Invalid mix id");
  }

  const [mixData, setMixData] = useState<MixData | null>(null);
  const [mixTitle, setMixTitle] = useState('');
  const [backgroundImageUrl, setBackgroundImageUrl] = useState('');
  const { tree, setTree } = useTree();
  const { cssTree, updateTree } = useCssTree();
  
  const { data: mix, error, isLoading } = api.mixRouter.getMixById.useQuery({
    id: idAsNumber,
  });

  const replaceMixMutation = api.mixRouter.replaceMixById.useMutation();

  // This effect handles initial data loading and runs only when mix data changes
  // It does not depend on local state variables to avoid circular dependencies
  useEffect(() => {
    if (mix) {
      setMixData(mix);
      // Only set the title if it hasn't been manually changed
      if (!mixTitle || mixTitle === '') {
        setMixTitle(mix.name || 'Untitled Mix');
      }
      
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

  const { addNotification } = useNotifications();

  // Handle mix name change - just updates the local state without saving to the server
  const handleMixNameChange = (newName: string) => {
    // Simply update the local state for immediate feedback
    setMixTitle(newName);
  };

  const handleUpdateMix = async () => {
    if (!tree) {
      addNotification({
        type: 'error',
        message: 'No tree data to update',
        duration: 3000
      });
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
      // Show in-progress notification
      addNotification({
        type: 'info',
        message: 'Saving mix...',
        duration: 2000
      });

      const updatedMix = await replaceMixMutation.mutateAsync({
        id: idAsNumber,
        jsonContent: combinedData,
        name: mixTitle  // Include the current name from state
      });
      
      // Handle the returned data properly
      if (updatedMix && !Array.isArray(updatedMix)) {
        setMixData(updatedMix as unknown as MixData);
      }
      
      // Show success notification
      addNotification({
        type: 'success',
        message: 'Mix saved successfully!',
        duration: 3000
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error("Failed to update mix:", error);
      
      // Show error notification
      addNotification({
        type: 'error',
        message: `Failed to save mix: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: 5000
      });
      
      return Promise.reject(error);
    }
  };

  // Handle background image update
  const handleBackgroundImageChange = (url: string) => {
    setBackgroundImageUrl(url);
  };

  // Handle image URL input


  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Title Menu with Mix Floater controls */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <TitleMenu 
          title={mixTitle}
          controls={
            <MixFloaterMenu 
              mixName={mixTitle}
              onMixNameChange={handleMixNameChange}
              onSave={handleUpdateMix}
            />
          }
        />
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
        backgroundImageUrl={backgroundImageUrl}
        onBackgroundImageChange={handleBackgroundImageChange}
      >
        <HTMLVisualizer />
      </ResizableContainer>
    </div>
  );
}
