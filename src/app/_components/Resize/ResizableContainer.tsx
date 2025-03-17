'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Smartphone, Tablet, Monitor, RotateCw } from 'lucide-react';

// Device preset dimensions
const DEVICE_PRESETS = {
  PHONE: { width: 390, height: 844 },
  TABLET: { width: 820, height: 1180 },
  DESKTOP: { width: 1920, height: 1080 }
};

type DeviceType = 'PHONE' | 'TABLET' | 'DESKTOP' | null;

interface ResizableContainerProps {
  children: React.ReactNode;
  initialWidth?: number;
  initialHeight?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  className?: string;
  style?: React.CSSProperties;
}

const ResizableContainer: React.FC<ResizableContainerProps> = ({
  children,
  initialWidth = 400,
  initialHeight = 400,
  minWidth = 200,
  minHeight = 200,
  maxWidth = Infinity,
  maxHeight = Infinity,
  className = '',
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentDevice, setCurrentDevice] = useState<DeviceType>(null);
  const [dimensions, setDimensions] = useState({
    width: initialWidth,
    height: initialHeight
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle device preset selection
  const handleDeviceSelect = (deviceType: DeviceType) => {
    // First set the current device
    setCurrentDevice(deviceType);
    
    // Enable transition for button clicks
    setIsTransitioning(true);
    
    // Calculate new dimensions
    let newWidth, newHeight;
    
    if (deviceType === 'DESKTOP') {
      // For desktop, use the max dimensions
      newWidth = Math.min(maxWidth, window.innerWidth - 100);
      newHeight = Math.min(maxHeight, window.innerHeight - 100);
    } else if (deviceType) {
      // For phone and tablet, use preset dimensions
      newWidth = DEVICE_PRESETS[deviceType].width;
      newHeight = DEVICE_PRESETS[deviceType].height;
    } else {
      // Default case
      return;
    }
    
    // Update dimensions
    setDimensions({
      width: newWidth,
      height: newHeight
    });
    
    // Disable transition after animation completes
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
    
    resizeTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 350); // Slightly longer than the transition duration
  };
  
  // Handle rotation (swap width and height)
  const handleRotate = () => {
    if (currentDevice && currentDevice !== 'DESKTOP') {
      // Enable transition for button clicks
      setIsTransitioning(true);
      
      setDimensions(prev => ({
        width: prev.height,
        height: prev.width
      }));
      
      // Disable transition after animation completes
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      
      resizeTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 350); // Slightly longer than the transition duration
    }
  };
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  // Styles for the resizable container
  const resizableContainerStyle = {
    width: dimensions.width,
    height: dimensions.height,
    minWidth: `${minWidth}px`,
    minHeight: `${minHeight}px`,
    maxWidth: maxWidth !== Infinity ? `${maxWidth}px` : 'none',
    maxHeight: maxHeight !== Infinity ? `${maxHeight}px` : 'none',
    overflow: 'hidden',
    position: 'relative' as const,
    ...style
  };

  return (
    // Outer wrapper div
    <div className="relative">
      <div className="absolute px-3 -top-2.5 z-10 gap-2 w-full flex items-center justify-between p-1 font-semibold text-zinc-700 text-xxs">
          <div className="flex flex-row gap-2">
            <button 
              className={`hover:bg-zinc-100/50 backdrop-blur-sm px-2 py-1 rounded-lg ${currentDevice === 'PHONE' ? 'bg-zinc-100/50' : ''}`}
              onClick={() => handleDeviceSelect('PHONE')}
            >
              <Smartphone size={16} />
            </button>
            <button 
              className={`hover:bg-zinc-100/50 backdrop-blur-sm px-2 py-1 rounded-lg ${currentDevice === 'TABLET' ? 'bg-zinc-100/50' : ''}`}
              onClick={() => handleDeviceSelect('TABLET')}
            >
              <Tablet size={16} />
            </button>
            <button 
              className={`hover:bg-zinc-100/50 backdrop-blur-sm px-2 py-1 rounded-lg ${currentDevice === 'DESKTOP' ? 'bg-zinc-100/50' : ''}`}
              onClick={() => handleDeviceSelect('DESKTOP')}
            >
              <Monitor size={16} />
            </button>
          </div>
          <div className="flex flex-row gap-2">
            <button 
              className={`hover:bg-zinc-100/50 backdrop-blur-sm px-2 py-1 rounded-lg ${currentDevice === 'DESKTOP' ? 'bg-zinc-100/50 cursor-not-allowed' : ''}`}
              onClick={handleRotate}
              disabled={currentDevice === 'DESKTOP'}
            >
              <RotateCw size={16} />
            </button>
          </div>
      </div>
      {/* Resizable container */}
      <div
        ref={containerRef}
        className={`resize-container overlay-scrollbar p-1 ${isTransitioning ? 'resize-smooth-transition' : ''} ${className}`}
        style={resizableContainerStyle}
      >

        <div className="relative w-full h-full border border-zinc-200/50 rounded-xl p-2 overflow-hidden">

          {/* Inner container with 100% width and height */}
          <div className="inner-container w-full h-full min-w-full min-h-full relative">
            {children}
          </div>

        </div>

      </div>
      
      
    </div>
  );
};

export default ResizableContainer;
