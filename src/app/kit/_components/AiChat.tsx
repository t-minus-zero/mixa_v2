"use client";

import React, { useState, useRef, useEffect } from "react";
import { PaperclipIcon, PlusIcon, Square, LightbulbIcon, ArrowUpIcon } from "lucide-react";

const AiChat = () => {
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Placeholder functions (no actual implementation)
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Just update UI state without making any actual API calls
    const newMessage = { role: "user" as const, content: inputValue };
    setMessages([...messages, newMessage]);
    setInputValue("");
    
    // Simulate assistant response for UI demo purposes
    setIsTyping(true);
    setTimeout(() => {
      setMessages([
        ...messages, 
        newMessage, 
        { role: "assistant" as const, content: "This is a placeholder response. No actual AI functionality has been implemented yet." }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const handleStopResponse = () => {
    setIsTyping(false);
  };

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
    <div className="relative w-full h-full align-center">
      {/* Chat messages area */}
      <div className="h-full overflow-y-auto p-2 space-y-4">
        {/* Top gradient overlay */}
        <div className="from-zinc-100 via-zinc-100 via-15% to-zinc-100/0 pointer-events-none sticky -top-2 left-0 right-0 h-8 z-10 bg-gradient-to-b"></div>
        
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "assistant" 
                  ? "bg-zinc-100 text-zinc-900" 
                  : "bg-zinc-800 text-white"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-zinc-100 rounded-lg p-3 max-w-[80%]">
              <div className="flex space-x-2">
                <div className="h-2 w-2 bg-zinc-400 rounded-full animate-bounce"></div>
                <div className="h-2 w-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="h-2 w-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Chat input area */}
      <div className="absolute bottom-0 sticky w-full flex justify-center">
        <div className="bg-zinc-50/90 backdrop-blur-md rounded-t-xl border border-zinc-200 shadow-sm w-full max-w-[720px]">
          <div className="min-h-[20px] p-2">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
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
                  handleSendMessage();
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
              onClick={isTyping ? handleStopResponse : handleSendMessage}
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
    </div>
  );
};

export default AiChat;
