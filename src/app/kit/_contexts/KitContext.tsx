"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

// Define types for our chat messages and chats
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface Chat {
  id: string;
  name: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the context type
interface KitContextType {
  // State
  messages: ChatMessage[];
  inputValue: string;
  isTyping: boolean;
  chats: Chat[];
  currentChat: Chat | null;
  
  // Methods
  setInputValue: (value: string) => void;
  sendMessage: () => void;
  stopResponse: () => void;
  createNewChat: () => void;
  setCurrentChat: (chatId: string) => void;
  renameCurrentChat: (newName: string) => void;
}

// Create the context with default values
export const KitContext = createContext<KitContextType | undefined>(undefined);

// Context provider component
export const KitProvider = ({ children }: { children: React.ReactNode }) => {
  // State management
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "default",
      name: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);

  // Send message function
  const sendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message to the chat
    const newMessage: ChatMessage = { role: "user", content: inputValue };
    setMessages([...messages, newMessage]);
    setInputValue("");
    
    // Simulate assistant response for UI demo purposes
    setIsTyping(true);
    setTimeout(() => {
      setMessages([
        ...messages, 
        newMessage, 
        { 
          role: "assistant", 
          content: "This is a placeholder response. No actual AI functionality has been implemented yet." 
        }
      ]);
      setIsTyping(false);
    }, 3000);
  };

  // Stop the current response
  const stopResponse = () => {
    setIsTyping(false);
  };

  // Create a new chat
  const createNewChat = () => {
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      name: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setChats([newChat, ...chats]);
    setCurrentChatById(newChat.id);
  };

  // Set current chat by ID
  const setCurrentChatById = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setCurrentChat(chat);
      setMessages(chat.messages);
    } else {
      setCurrentChat(null);
      setMessages([]);
    }
  };

  // Rename current chat
  const renameCurrentChat = (newName: string) => {
    if (!currentChat) return;
    
    const updatedChats = chats.map(chat => {
      if (chat.id === currentChat.id) {
        return {
          ...chat,
          name: newName,
          updatedAt: new Date()
        };
      }
      return chat;
    });
    
    setChats(updatedChats);
    setCurrentChat({
      ...currentChat,
      name: newName,
      updatedAt: new Date()
    });
  };

  // Initialize with the first chat if none is selected
  useEffect(() => {
    if (!currentChat && chats.length > 0) {
      const firstChat = chats[0];
      // TypeScript safe check that firstChat exists
      if (firstChat) {
        setCurrentChat(firstChat);
        setMessages(firstChat.messages || []);
      }
    }
  }, [chats, currentChat]);

  return (
    <KitContext.Provider 
      value={{
        messages,
        inputValue,
        isTyping,
        chats,
        currentChat,
        setInputValue,
        sendMessage,
        stopResponse,
        createNewChat,
        setCurrentChat: setCurrentChatById,
        renameCurrentChat
      }}
    >
      {children}
    </KitContext.Provider>
  );
};

// Custom hook for using the context
export const useKitContext = () => {
  const context = useContext(KitContext);
  
  if (context === undefined) {
    throw new Error("useKitContext must be used within a KitProvider");
  }
  
  return context;
};
