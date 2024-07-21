"use client";

import { useEffect, useState } from "react";
import { api } from "MixaDev/trpc/react";
import { useTree } from './_components/TreeContext';
import EditingPage from "./_components/EditingPage";

/* This is the editing page */
export default function MixModal({
  params: { id: mixId },
  }: {
  params: { id: string };
  }) {
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
    <div className="w-screen h-screen overflow-hidden bg-zinc-100">
      <EditingPage />
    </div>
  );
}
