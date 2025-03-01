"use client"

import { useState, useEffect, ReactNode, RefObject, useRef } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  show: boolean;
  onClickOutside?: () => void;
  
  // Different ways to position the portal
  anchorEl?: RefObject<HTMLElement>; // Position relative to this element
  position?: {     // Manual positioning
    top?: number | string;
    left?: number | string;
    right?: number | string;
    bottom?: number | string;
    width?: number | string;
  }; 
  
  className?: string;
  zIndex?: number;
  placement?: 'top' | 'right' | 'bottom' | 'left' | 'top-start' | 'top-end' | 
              'right-start' | 'right-end' | 'bottom-start' | 'bottom-end' | 
              'left-start' | 'left-end';
  offset?: number; // Distance from the anchor element
  autoAdjust?: boolean; // Whether to adjust to keep within viewport
  maxHeight?: number | string;
}

export default function Portal({
  children,
  show,
  onClickOutside,
  anchorEl,
  position,
  className = '',
  zIndex = 50,
  placement = 'bottom-start',
  offset = 4,
  autoAdjust = true,
  maxHeight,
}: PortalProps) {
  // Track if component is mounted (client-side only)
  const [mounted, setMounted] = useState(false);
  const [computedPosition, setComputedPosition] = useState<{
    top?: number | string;
    left?: number | string;
    right?: number | string;
    bottom?: number | string;
    width?: number | string;
    maxHeight?: number | string;
  }>({});
  
  const portalRef = useRef<HTMLDivElement>(null);

  // Calculate the position of the portal
  const calculatePosition = () => {
    // If manually positioned, use that directly
    if (position) {
      setComputedPosition(position);
      return;
    }

    // If no anchor element, center in viewport
    if (!anchorEl?.current) {
      setComputedPosition({
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      });
      return;
    }

    // Get anchor element position
    const anchorRect = anchorEl.current.getBoundingClientRect();
    const portalEl = portalRef.current;
    
    // Default position (bottom-start)
    let top = anchorRect.bottom + offset;
    let left = anchorRect.left;
    let width = position?.width || anchorRect.width;
    
    // Adjust based on placement
    switch (placement) {
      case 'top':
        top = anchorRect.top - (portalEl?.offsetHeight || 0) - offset;
        left = anchorRect.left + (anchorRect.width / 2) - ((portalEl?.offsetWidth || 0) / 2);
        break;
      case 'top-start':
        top = anchorRect.top - (portalEl?.offsetHeight || 0) - offset;
        left = anchorRect.left;
        break;
      case 'top-end':
        top = anchorRect.top - (portalEl?.offsetHeight || 0) - offset;
        left = anchorRect.right - (portalEl?.offsetWidth || 0);
        break;
      case 'right':
        top = anchorRect.top + (anchorRect.height / 2) - ((portalEl?.offsetHeight || 0) / 2);
        left = anchorRect.right + offset;
        break;
      case 'right-start':
        top = anchorRect.top;
        left = anchorRect.right + offset;
        break;
      case 'right-end':
        top = anchorRect.bottom - (portalEl?.offsetHeight || 0);
        left = anchorRect.right + offset;
        break;
      case 'bottom':
        top = anchorRect.bottom + offset;
        left = anchorRect.left + (anchorRect.width / 2) - ((portalEl?.offsetWidth || 0) / 2);
        break;
      case 'bottom-end':
        top = anchorRect.bottom + offset;
        left = anchorRect.right - (portalEl?.offsetWidth || 0);
        break;
      case 'left':
        top = anchorRect.top + (anchorRect.height / 2) - ((portalEl?.offsetHeight || 0) / 2);
        left = anchorRect.left - (portalEl?.offsetWidth || 0) - offset;
        break;
      case 'left-start':
        top = anchorRect.top;
        left = anchorRect.left - (portalEl?.offsetWidth || 0) - offset;
        break;
      case 'left-end':
        top = anchorRect.bottom - (portalEl?.offsetHeight || 0);
        left = anchorRect.left - (portalEl?.offsetWidth || 0) - offset;
        break;
      // Default is bottom-start
      default:
        top = anchorRect.bottom + offset;
        left = anchorRect.left;
    }

    // Auto-adjust to keep within viewport
    if (autoAdjust && portalEl) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const portalWidth = portalEl.offsetWidth;
      const portalHeight = portalEl.offsetHeight;

      // Adjust horizontally if off-screen
      if (left + portalWidth > viewportWidth - 8) {
        left = Math.max(8, viewportWidth - portalWidth - 8);
      }
      if (left < 8) {
        left = 8;
      }

      // Adjust vertically if off-screen
      if (top + portalHeight > viewportHeight - 8) {
        // Try to flip to top if there's room
        if (anchorRect.top > portalHeight + offset) {
          top = anchorRect.top - portalHeight - offset;
        } else {
          // Otherwise, just ensure it's visible with scrolling
          top = Math.max(8, viewportHeight - portalHeight - 8);
        }
      }
      if (top < 8) {
        top = 8;
      }
    }

    setComputedPosition({
      top: `${top}px`,
      left: `${left}px`,
      width: width ? `${width}px` : undefined,
      maxHeight: maxHeight ? typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight : undefined,
    });
  };
  
  // Effect for client-side mounting
  useEffect(() => {
    setMounted(true);
    
    // Container to hold the portal elements
    const portalRoot = document.getElementById('portal-root');
    if (!portalRoot) {
      const div = document.createElement('div');
      div.id = 'portal-root';
      document.body.appendChild(div);
    }
    
    return () => {
      // Only clean up if this is the last portal
      const root = document.getElementById('portal-root');
      if (root && !root.hasChildNodes()) {
        document.body.removeChild(root);
      }
    };
  }, []);
  
  // Calculate position when shown or anchor element changes
  useEffect(() => {
    if (!show) return;
    
    calculatePosition();
    
    // Update position on resize or scroll
    const handleUpdate = () => {
      if (show) {
        calculatePosition();
      }
    };
    
    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, true);
    
    // Small delay to calculate position again after initial render
    // This helps when the portal content affects its own size
    const timeoutId = setTimeout(handleUpdate, 50);
    
    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate, true);
      clearTimeout(timeoutId);
    };
  }, [show, anchorEl, placement, offset, autoAdjust, position]);
  
  // Handle click outside
  useEffect(() => {
    if (!show || !onClickOutside) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      const portalContent = portalRef.current;
      const anchorElement = anchorEl?.current;
      const target = e.target as Node;
      
      // Check if click is outside both portal content and anchor element
      if (
        portalContent && 
        !portalContent.contains(target) && 
        (!anchorElement || !anchorElement.contains(target))
      ) {
        onClickOutside();
      }
    };
    
    // Use mousedown instead of click to catch the event earlier
    // Add a small delay to prevent immediate closing
    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 10);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, onClickOutside, anchorEl]);
  
  // Don't render anything on the server or if not shown
  if (!mounted || !show) return null;
  
  // Get portal container
  const portalContainer = document.getElementById('portal-root') || document.body;
  
  return createPortal(
    <div
      ref={portalRef}
      className={`fixed ${className}`}
      style={{
        zIndex,
        ...computedPosition,
        visibility: Object.keys(computedPosition).length ? 'visible' : 'hidden',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>,
    portalContainer
  );
}
