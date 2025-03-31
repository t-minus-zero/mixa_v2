"use client"

// DashboardLayout.tsx
import React from 'react';
import FloatingMenu from '../dashboard/_components/FloatingMenu';
import { useDashboard } from '../_contexts/DashboardContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { leftPanelState } = useDashboard();
    return (
        <div className="relative w-full h-full overflow-hidden">
            {/* FloatingMenu that contains both app icon and side panel */}
            <div className="fixed top-0 left-0 z-50">
                <FloatingMenu />
            </div>
            
            {/* Main Content Area */}
            <div 
                className={`relative overflow-hidden min-h-screen flex flex-col transition-all duration-300 ease-in-out ${leftPanelState === 'open' ? 'ml-16' : 'ml-0'}`}
            >
                <main className="relative overflow-hidden w-full h-full flex flex-col">      
                    {/* Main content */}
                    {children}
                </main>
            </div>
        </div>
    );
}

