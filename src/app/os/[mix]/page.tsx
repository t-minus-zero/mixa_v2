"use client";

import { useEffect, useState } from "react";
import { api } from "MixaDev/trpc/react";
import { MixEditorProvider, useMixEditor } from '../../mix/[id]/_contexts/MixEditorContext';
import HTMLVisualizer from '../../mix/[id]/_components/ComponentPreview';
import { CssClass, TreeNode, CssTree } from '../../mix/[id]/_types/types';
import { loadMixData } from '../../mix/[id]/_utils/mixUtils';
import DashboardShell from '../_components/DashboardShell';

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
  version: number;
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

// Preview Content Component that updates context with loaded data
const PreviewContent = ({ mixData }: { mixData: MixData }) => {
  const { updateTree, updateCssTree } = useMixEditor();

  useEffect(() => {
    if (mixData?.jsonContent) {
      try {
        const jsonContent = mixData.jsonContent as MixJsonContent;
        const loadedData = loadMixData(jsonContent);
        updateTree((draft: TreeNode) => {
          Object.assign(draft, loadedData.treeData);
        });
        updateCssTree((draft: CssTree) => {
          Object.assign(draft, loadedData.cssData);
        });
      } catch (error) {
        console.error('Error loading mix data:', error);
      }
    }
  }, [mixData, updateTree, updateCssTree]);

  return (
    <div className="w-full h-full bg-white flex items-center justify-center overflow-hidden">
      <div className="w-full h-full flex items-center justify-center p-4">
        <HTMLVisualizer />
      </div>
    </div>
  );
};

/* This is the preview-only page for mix viewing */
export default function MixPreview({ params: { mix: mixId } }: { params: { mix: string }; }) {
  const idAsNumber = Number(mixId);
  if (Number.isNaN(idAsNumber)) {
    throw new Error("Invalid mix id");
  }

  const { data: mixData, isLoading, error } = api.mixRouter.getMixById.useQuery({
    id: idAsNumber,
  });

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading mix...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-lg text-red-600">Error: {error.message}</div>
      </div>
    );
  }

  if (!mixData) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-lg text-gray-600">No mix data found</div>
      </div>
    );
  }

  return (
    <div className="os-dashboard h-screen w-full">
      <DashboardShell 
        mainContent={
          <MixEditorProvider>
            <PreviewContent mixData={mixData} />
          </MixEditorProvider>
        }
      />
    </div>
  );
}
