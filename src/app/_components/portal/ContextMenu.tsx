"use client"

import { ReactNode } from 'react';
import Portal from './Portal';
import useContextMenu from './useContextMenu';

interface ContextMenuItem {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
}

interface ContextMenuProps {
  trigger: ReactNode;
  items: ContextMenuItem[];
  className?: string;
}

export default function ContextMenu({ trigger, items, className = '' }: ContextMenuProps) {
  const { isOpen, position, openMenu, closeMenu } = useContextMenu();
  
  return (
    <>
      {/* Trigger element with context menu event */}
      <div 
        onContextMenu={openMenu} 
        className="inline-block"
        style={{ touchAction: 'none' }} // Prevents touch events from triggering scroll on mobile
      >
        {trigger}
      </div>
      
      {/* The context menu portal */}
      <Portal
        show={isOpen}
        onClickOutside={closeMenu}
        position={{
          top: position.y,
          left: position.x
        }}
        maxHeight={300}
        className={`bg-white border border-gray-200 rounded shadow-lg overflow-y-auto ${className}`}
        zIndex={100}
        autoAdjust={true}
      >
        <div className="py-1 w-48">
          {items.map((item, index) => (
            <div
              key={index}
              className={`
                px-4 py-2 text-sm cursor-pointer flex items-center
                ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}
                ${item.danger ? 'text-red-600' : 'text-gray-700'}
              `}
              onClick={(e) => {
                e.stopPropagation();
                if (!item.disabled) {
                  item.onClick();
                  closeMenu();
                }
              }}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </div>
          ))}
        </div>
      </Portal>
    </>
  );
}
