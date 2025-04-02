"use client";

import React, { useRef, useEffect } from "react";
import { PaperclipIcon, PlusIcon, Square, LightbulbIcon, ArrowUpIcon } from "lucide-react";
import { useKitContext } from "../_contexts/KitContext";

/**
 * KitPrompter - Input area for the chat interface
 */
const KitPrompter: React.FC = () => {
  const { inputValue, setInputValue, sendMessage, stopResponse, isTyping } = useKitContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Adjust textarea height based on content
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    // Reset height to auto so we can calculate the actual height
    textarea.style.height = 'auto';
    
    // Calculate new height - capped at about 5 lines
    const newHeight = Math.min(textarea.scrollHeight, 120);
    textarea.style.height = `${newHeight}px`;
    
    // Keep scroll at the bottom if it's scrollable
    if (textarea.scrollHeight > 120) {
      textarea.scrollTop = textarea.scrollHeight;
    }
  };

  // Run height adjustment on input value change
  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);
  
  return (
    <div className="absolute bottom-0 sticky w-full flex justify-center px-2">
      <div className="bg-zinc-50/90 backdrop-blur-md rounded-t-xl border border-zinc-200 shadow-sm w-full max-w-[720px]">
        <div className="min-h-[20px] p-2">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full text-sm resize-none bg-transparent outline-none min-h-[24px] max-h-[120px] text-zinc-900 placeholder-zinc-400 block h-6"
            placeholder="Write a message..."
            rows={1}
            style={{ 
              overflowY: "auto",
              height: "24px",
              lineHeight: "24px"
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
        </div>
        
        <div className="flex items-center justify-between px-2 py-1 border-t border-zinc-200">
          <div className="flex flex-row gap-1">
            <button className="flex items-center gap-1 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-md px-2 py-1 transition-colors">
              <PlusIcon size={16} />
              <span className="text-xs font-medium">Add</span>
            </button>
            <button className="flex items-center gap-1 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-md px-2 py-1 transition-colors">
              <PaperclipIcon size={16} />
              <span className="text-xs font-medium">Attach</span>
            </button>
            <button className="flex items-center gap-1 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-md px-2 py-1 transition-colors">
              <LightbulbIcon size={16} />
              <span className="text-xs font-medium">Think</span>
            </button>
          </div>
          
          <button 
            onClick={isTyping ? stopResponse : sendMessage}
            disabled={!inputValue.trim() && !isTyping}
            className={`p-1 flex items-center justify-center rounded-full transition-all ${
              !inputValue.trim() && !isTyping 
                ? "text-zinc-300 bg-zinc-50 border border-zinc-200" 
                : "text-blue-600 bg-zinc-50 border border-blue-400 hover:border-blue-500"
            }`}
          >
            {isTyping ? <Square size={14} /> : <ArrowUpIcon size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KitPrompter;
