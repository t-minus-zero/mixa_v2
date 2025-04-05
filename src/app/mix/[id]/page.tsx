"use client";

import { useEffect, useState } from "react";
import { api } from "MixaDev/trpc/react";
import { useMixEditor } from './_contexts/MixEditorContext';
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


  const [mixData, setMixData] = useState<MixData | null>(null);
  const { updateTree, cssTree, updateCssTree, mixMetadata, setMixMetadata } = useMixEditor();
  const { addNotification } = useNotifications();
  
  const { data: mix, error, isLoading } = api.mixRouter.getMixById.useQuery(
    {
      id: idAsNumber,
    },
    {
      // Keep data cached and treat it as fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Don't refetch on window focus
      refetchOnWindowFocus: false,
      // Don't refetch when component remounts
      refetchOnMount: true,
      // Don't refetch on reconnect
      refetchOnReconnect: false,
    }
  );

  const replaceMixMutation = api.mixRouter.replaceMixById.useMutation();

  // This effect handles initial data loading and runs only when mix data changes
  // It does not depend on local state variables to avoid circular dependencies
  useEffect(() => {
    if (mix) {
      const jsonContent = mix.jsonContent as any;
      
      // Update the mix metadata
      setMixMetadata({
        id: mix.id,
        name: mix.name || 'Untitled Mix'
      });

      // Get current version before conversion
      const currentVersion = jsonContent.version || 1.0;
      
      // Convert the mix to the latest format
      const mixData = loadMixData(jsonContent);
      
      // Update the version in the state with the actual version used
      updateTree(() => mixData.treeData);
      updateCssTree(() => mixData.cssData);

      // Only show notification if version actually changed
      if (currentVersion < mixData.version) {
        addNotification({
          type: 'info',
          message: `Converted mix data's format version from ${currentVersion} to ${mixData.version}`,
          duration: 2000
        });
      }
      
    }
  }, [mix]);

  // Name changes and saving are now handled directly in MixFloaterMenu component
  // which uses the mixMetadata from context


  if (mix === undefined) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Title Menu with Mix Floater controls - now using context directly */}
      <MixFloaterMenu />
      
      <ResizableContainer 
        initialWidth={400} 
        initialHeight={400}
        minWidth={200} 
        minHeight={200}
        backgroundImageUrl={mixMetadata.backgroundImageUrl}
        onBackgroundImageChange={(newUrl) => {
          setMixMetadata((prev: {id: number; name: string; backgroundImageUrl?: string}) => ({
            ...prev,
            backgroundImageUrl: newUrl
          }));
        }}
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
