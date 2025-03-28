"use client"

// DashboardLayout.tsx
import DashboardTopNav from "./_components/DashboardTopNav";
import SearchBarActive from "./_components/SearchBarActive";
import TitleMenu from '../dashboard/_components/TitleMenu';
import React from 'react';
import FloatingMenu from '../dashboard/_components/FloatingMenu';
import SidePanel from '../dashboard/_components/SidePanel';
import { useDashboard } from '../_contexts/DashboardContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { leftPanelState } = useDashboard();
    return (
        <div className="w-full h-full relative">
            {/* Side Panel - Fixed Position */}
            <div 
                className={`fixed top-0 left-0 h-full z-20 bg-zinc-0 overflow-y-auto transition-all duration-300 ease-in-out ${leftPanelState === 'open' ? 'w-64' : 'w-0'}`}
            >
                <div className="p-2 h-full w-full">
                    <SidePanel />
                </div>
            </div>
            
            {/* Main Content Area */}
            <div 
                className={`min-h-screen flex flex-col transition-all duration-300 ease-in-out ${leftPanelState === 'open' ? 'ml-64' : 'ml-0'}`}
            >
                {/* FloatingMenu stays outside content flow with higher z-index */}
                <FloatingMenu />
                
                <main className="w-full flex flex-col">
                    {/* Simple Sticky Header - Inside main content */}
                    <div className="sticky top-0 z-20 py-2 px-6 flex justify-center items-center [background:linear-gradient(0deg,rgba(255,255,255,0.00)_0%,rgba(255,255,255,0.35)_25%,rgba(255,255,255,0.75)_60%,rgba(255,255,255,0.98)_85%)]">
                        <div className="w-full flex justify-center items-center">
                            <div className="w-full flex justify-center items-center" style={{maxWidth:"1440px"}}>
                                <TitleMenu title="Dashboard" />
                            </div>
                        </div>
                    </div>
                    
                    {/* Main content */}
                    {children}
                </main>
                <footer>{/* Footer content */}</footer>
            </div>
        </div>
    );
}

