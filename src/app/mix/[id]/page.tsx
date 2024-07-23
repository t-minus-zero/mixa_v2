"use client";

import { useEffect, useState } from "react";
import { api } from "MixaDev/trpc/react";
import { useTree } from './_components/TreeContext';
import HTMLVisualizer from './_components/ComponentPreview';

/* This is the editing page */
export default function MixModal({params: { id: mixId },}: {params: { id: string };}) {
  
  const idAsNumber = Number(mixId);
  if (Number.isNaN(idAsNumber)) {
    throw new Error("Invalid mix id");
  }

  const [mixData, setMixData] = useState(null);
  const { tree } = useTree();
  const { setTree } = useTree();
  const { data: mix, error, isLoading } = api.mixRouter.getMixById.useQuery({
    id: idAsNumber,
  });

  useEffect(() => {
    if (mix) {
      setMixData(mix);
      setTree(mix.jsonContent);
    }
  }, [mix]);

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
    </div>
  );
}
