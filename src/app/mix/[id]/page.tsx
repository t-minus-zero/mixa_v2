"use client";

import { useEffect, useState } from "react";
import { api } from "MixaDev/trpc/react";
import { useMixEditor } from './_contexts/MixEditorContext';
import { useCssTree } from './_components/CssTreeContext';
import HTMLVisualizer from './_components/ComponentPreview';
import MixFloaterMenu from './_components/MixFloaterMenu';
import ResizableContainer from '../../_components/Resize/ResizableContainer';
import { useNotifications } from '../../_contexts/NotificationsContext';
import TitleMenu from '../../dashboard/_components/TitleMenu';
import { CssClass } from './_types/types';
import { loadMixData, latestFormatVersion } from './_utils/mixUtils';


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
  version: string;
  treeData: TreeData;
  cssData: { classes: CssClass[] };

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


  const [mixTitle, setMixTitle] = useState('');
  const [mixData, setMixData] = useState<MixData | null>(null);
  const { updateTree: updateMixTree } = useMixEditor();
  const { cssTree, updateTree: updateCssTree } = useCssTree();
  const { addNotification } = useNotifications();
  
  const { data: mix, error, isLoading } = api.mixRouter.getMixById.useQuery({
    id: idAsNumber,
  });

  const replaceMixMutation = api.mixRouter.replaceMixById.useMutation();

  // This effect handles initial data loading and runs only when mix data changes
  // It does not depend on local state variables to avoid circular dependencies
  useEffect(() => {
    if (mix) {
      const jsonContent = mix.jsonContent as any;
      
      setMixTitle(mix.name || 'Untitled Mix');

      // Convert the mix to the latest format
      const mixData = loadMixData(jsonContent);
      
      // Update the version in the state with the actual version used
      updateMixTree(() => mixData.treeData);
      updateCssTree(() => mixData.cssData);

      addNotification({
        type: 'info',
        message: `Converted mix data's format version to: ${mixData.version }`,
        duration: 2000
      });
      
    }
  }, [mix]);

  // Handle mix name change - just updates the local state without saving to the server
  const handleMixNameChange = (newName: string) => {
    // Simply update the local state for immediate feedback
    setMixTitle(newName);
  };

  // Get MixEditor context at the component level (not inside a function)
  const { tree: mixTree } = useMixEditor();

  const handleUpdateMix = async () => {
    // Use the tree from the component-level hook
    if (!mixTree) {
      addNotification({
        type: 'error',
        message: 'No tree data to update',
        duration: 3000
      });
      console.error("No tree data to update");
      return;
    }

    // Create the combined data structure with background image
    // Now we can use the array-based structure directly since we updated the API schema
    const combinedData = {
      version: latestFormatVersion,
      treeData: mixTree,
      cssData: cssTree
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
      >
        <HTMLVisualizer />
      </ResizableContainer>
    </div>
  );
}
