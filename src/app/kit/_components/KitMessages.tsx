"use client";

import React from "react";
import { useKitContext } from "../_contexts/KitContext";
import { ChatMessage } from "../_contexts/KitContext";

/**
 * UserMessage - Component for displaying user messages
 */
interface MessageProps {
  content: string;
}

const UserMessage: React.FC<MessageProps> = ({ content }) => {
  return (
    <div className="flex justify-end">
      <div className="max-w-[70%] bg-zinc-100 text-zinc-900 rounded-2xl p-3 text-xs">
        {content}
      </div>
    </div>
  );
};

/**
 * AssistantMessage - Component for displaying assistant messages
 */
const AssistantMessage: React.FC<MessageProps> = ({ content }) => {
  return (
    <div className="flex w-full">
      <div className="w-full text-zinc-900 rounded-lg text-xs">
        {content}
      </div>
    </div>
  );
};

/**
 * TypingIndicator - Component for the 'Thinking' animation with shine effect
 */
const TypingIndicator: React.FC = () => {
  return (
    <div className="flex w-full">
      <div className="w-full">
        <div className="inline-block rounded-lg">
          {/* Animated text with gradient - simpler implementation */}
          <div className="text-xs relative overflow-hidden animate-pulse">
            <span className="text-zinc-400 font-medium">Thinking...</span>
            <span className="inline-block absolute top-0 left-0 w-full h-full animate-shine" />
          </div>
          
          {/* Animation for the shine effect */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes shine {
              0% { 
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
                background-size: 200% 100%;
                background-position: -100% 0;
              }
              66%, 100% { 
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
                background-size: 200% 100%;
                background-position: 200% 0;
              }
            }
            .animate-shine {
              animation: shine 3s infinite;
            }
            .animate-pulse {
              animation: pulse 3s infinite;
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.8; }
            }
          `}} />
        </div>
      </div>
    </div>
  );
};

/**
 * KitMessages - Displays the chat messages and typing indicator
 */
const KitMessages: React.FC = () => {
  const { messages, isTyping } = useKitContext();
  
  return (
    <div className="h-full overflow-y-auto p-2 pt-12 space-y-4 pb-24">
      {messages.map((message, index) => (
        message.role === "assistant" ? 
          <AssistantMessage key={index} content={message.content} /> : 
          <UserMessage key={index} content={message.content} />
      ))}
      
      {isTyping && <TypingIndicator />}
    </div>
  );
};

export default KitMessages;
