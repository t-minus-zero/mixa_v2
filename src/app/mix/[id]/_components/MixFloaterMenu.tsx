"use client";

import React, { ChangeEvent, useState, useEffect, useRef } from 'react';
import { Bolt, Code, Sparkles, Save } from 'lucide-react';
import TextInput from './_fragments/TextInput';
import { useNotifications } from '../../../_contexts/NotificationsContext';
import { useMixEditor } from '../_contexts/MixEditorContext';
import { api } from "MixaDev/trpc/react";
import { latestFormatVersion } from '../_utils/mixUtils';


export default function MixFloaterMenu() {
  const { tree, cssTree, mixMetadata, setMixMetadata, codePageOpen, setCodePageOpen } = useMixEditor();
  const { addNotification } = useNotifications();
  const replaceMixMutation = api.mixRouter.replaceMixById.useMutation();
  
  const [name, setName] = useState(mixMetadata.name);
  const [isSaving, setIsSaving] = useState(false);

  // Update local state when context metadata changes (e.g., when mix data loads)
  useEffect(() => {
    if (name !== mixMetadata.name) {
      setName(mixMetadata.name);
    }
  }, [mixMetadata.name]);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setName(newValue);
    
    // Update the metadata in context
    setMixMetadata((prev: {id: number; name: string}) => ({
      ...prev,
      name: newValue
    }));
  };

  // We don't need handleNameBlur anymore since we're updating on every keystroke
  // and deferring saving to the save button

  const handleSave = async () => {
    if (isSaving) return;
    
    // Check if we have tree data to save
    if (!tree) {
      addNotification({
        type: 'error',
        message: 'No tree data to update',
        duration: 3000
      });
      console.error("No tree data to update");
      return;
    }
    
    setIsSaving(true);
    
    // Create the combined data structure
    const combinedData = {
      version: latestFormatVersion,
      treeData: tree,
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
        id: mixMetadata.id,
        jsonContent: combinedData,
        name: mixMetadata.name
      });
      
      // Show success notification
      addNotification({
        type: 'success',
        message: 'Mix saved successfully!',
        duration: 3000
      });
    } catch (error) {
      console.error("Failed to update mix:", error);
      
      // Show error notification
      addNotification({
        type: 'error',
        message: `Failed to save mix: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: 5000
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="absolute top-2 right-2 z-20">
      <div className="flex items-center gap-2 bg-white/75 backdrop-blur-md px-3 py-2 rounded-lg">
        <div className="flex items-center px-1 justify-center text-xs text-gray-900 border-b border-gray-100/0 hover:border-gray-500">
          <TextInput
            value={name}
            onChange={handleNameChange}
            placeholder="Untitled Mix"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`p-1.5 ${
              isSaving 
                ? 'text-gray-400 bg-zinc-100' 
                : 'text-gray-900 hover:text-green-500 hover:bg-green-50'
            } rounded-md transition-colors`}
            title="Save Mix"
          >
            <Save size={16} strokeWidth={1.5} className={isSaving ? 'animate-pulse' : ''} />
          </button>
          
          <button
            onClick={() => setCodePageOpen(!codePageOpen)}
            className={`p-1.5 ${codePageOpen ? 'text-blue-600 bg-blue-50' : 'text-gray-900 hover:text-blue-600 hover:bg-blue-50'} rounded-md transition-colors`}
            title={codePageOpen ? "Hide Code" : "View Code"}
          >
            <Code size={16} strokeWidth={1.5} />
          </button>
          
          <button
            className="p-1.5 text-gray-900 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Settings"
          >
            <Bolt size={16} strokeWidth={1.5} />
          </button>
          
          {/* AI Chat button removed as we no longer need it */}
        </div>
      </div>
    </div>
  );
}
