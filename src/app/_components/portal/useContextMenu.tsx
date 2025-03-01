"use client"

import { useState, useEffect, useCallback, MouseEvent } from 'react';

interface ContextMenuPosition {
  x: number;
  y: number;
}

interface UseContextMenuReturn {
  isOpen: boolean;
  position: ContextMenuPosition;
  openMenu: (e: MouseEvent) => void;
  closeMenu: () => void;
}

export default function useContextMenu(): UseContextMenuReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<ContextMenuPosition>({ x: 0, y: 0 });

  const openMenu = useCallback((e: MouseEvent) => {
    // Always prevent default browser context menu
    e.preventDefault();
    
    // Save the mouse position (client coordinates)
    setPosition({ x: e.clientX, y: e.clientY });
    setIsOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Close the context menu on any click
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClick = () => {
      closeMenu();
    };

    // Add the listener with a slight delay to prevent it from
    // capturing the same click that opened the menu
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClick);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClick);
    };
  }, [isOpen, closeMenu]);

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeMenu]);

  // Close on scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = () => {
      closeMenu();
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, closeMenu]);

  return { isOpen, position, openMenu, closeMenu };
}
