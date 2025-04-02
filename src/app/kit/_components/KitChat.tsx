"use client";

import React from "react";
import { KitProvider } from "../_contexts/KitContext";
import KitHeader from "./KitHeader";
import KitMessages from "./KitMessages";
import KitPrompter from "./KitPrompter";

/**
 * KitChat - Main component that composes all Kit chat components
 */
const KitChat: React.FC = () => {
  return (
    <KitProvider>
      <div className="relative w-full h-full align-center">
        <KitHeader />
        <KitMessages />
        <KitPrompter />
      </div>
    </KitProvider>
  );
};

export default KitChat;
