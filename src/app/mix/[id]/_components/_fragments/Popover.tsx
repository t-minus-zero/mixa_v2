'use client'

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface PopoverProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function Popover({ 
  isOpen, 
  onClose, 
  trigger, 
  children, 
  className = "" 
}: PopoverProps) {
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const updatePosition = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX
        });
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
      updatePosition();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, onClose]);

  if (!mounted) return <div ref={triggerRef}>{trigger}</div>;

  return (
    <>
      <div ref={triggerRef}>{trigger}</div>
      {isOpen &&
        createPortal(
          <div
            ref={contentRef}
            style={{
              position: 'absolute',
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
            className={`z-[100] ${className}`}
          >
            {children}
          </div>,
          document.body
        )}
    </>
  );
} 