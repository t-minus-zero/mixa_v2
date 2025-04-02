"use client";

import React, { ChangeEvent, useState, useEffect, useRef } from 'react';
import { Bolt, Code, Sparkles, Save } from 'lucide-react';
import TextInput from './_fragments/TextInput';
import { useNotifications } from '../../../_contexts/NotificationsContext';


interface MixFloaterMenuProps {
  mixName: string;
  onMixNameChange: (newName: string) => void;
  onSave: () => Promise<void>;
}

export default function MixFloaterMenu({
  mixName,
  onMixNameChange,
  onSave
}: MixFloaterMenuProps) {
  const [name, setName] = useState(mixName);
  const [isSaving, setIsSaving] = useState(false);
  const { addNotification } = useNotifications();
  const initialRender = useRef(true);

  // Update local state when prop changes (e.g., when mix data loads)
  useEffect(() => {
    // Only update local state if it's different from current mixName
    // This prevents unnecessary state updates that can cause re-renders
    if (name !== mixName) {
      setName(mixName);
    }
  }, [mixName]);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setName(newValue);
    
    // Update the parent state immediately, but don't trigger API save
    onMixNameChange(newValue);
  };

  // We don't need handleNameBlur anymore since we're updating on every keystroke
  // and deferring saving to the save button

  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    addNotification({
      type: 'info',
      message: 'Saving mix...',
      duration: 2000
    });
    
    try {
      await onSave();
      addNotification({
        type: 'success',
        message: 'Mix saved successfully!',
        duration: 3000
      });
    } catch (error) {
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
    <div className="absolute top-4 right-4 z-20 md:right-auto md:left-1/2 md:transform md:-translate-x-1/2">
      <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center pr-2 border-r border-gray-200">
          <TextInput
            value={name}
            onChange={handleNameChange}
            placeholder="Untitled Mix"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button
            className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
            title="Settings"
          >
            <Bolt size={18} />
          </button>
          
          <button
            className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
            title="View Code"
          >
            <Code size={18} />
          </button>
          
          {/* AI Chat button removed as we no longer need it */}
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`p-1.5 ${
              isSaving 
                ? 'text-gray-400 bg-gray-100' 
                : 'text-gray-500 hover:text-green-500 hover:bg-green-50'
            } rounded-md transition-colors`}
            title="Save Mix"
          >
            <Save size={18} className={isSaving ? 'animate-pulse' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
}
