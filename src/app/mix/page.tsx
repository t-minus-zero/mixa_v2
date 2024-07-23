"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "MixaDev/trpc/react";
import { v4 as uuidv4 } from 'uuid'; 

export default function NewMixPage() {
  const router = useRouter();
  const createMixMutation = api.mixRouter.createMix.useMutation();
  const [isCreating, setIsCreating] = useState(true);

  useEffect(() => {
    const createNewMix = async () => {
      try {
        const defaultJsonContent = {
          id: uuidv4(),
          tag: 'div',
          title: 'New Mix',
          classes: ["NewClass"],
          style: [{"NewClass": "width: 100%; height: 100%; background-color: rgba(200,200,200,1); border-radius: 24px; display: flex; justify-content: center; align-items: center;"}],
          content: 'New Content',
          childrens: []
        };

        const newMix = await createMixMutation.mutateAsync({
          jsonContent: defaultJsonContent,
        });

        const newMixId = newMix[0]?.id;
        if (newMixId) {
          router.push(`/mix/${newMixId}`);
        } else {
          console.error("Failed to create new mix: Invalid response format");
        }
      } catch (error) {
        console.error("Failed to create new mix:", error);
      } finally {
        setIsCreating(false);
      }
    };

    if (isCreating) {
      createNewMix();
    }
  }, [isCreating]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <div>Loading...</div>
    </div>
  );
}
