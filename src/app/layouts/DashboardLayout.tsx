"use client"

// DashboardLayout.tsx
import { DashboardDataProvider } from '../context/DashboardContext';
import DashboardTopNav from "./_components/DashboardTopNav";
import SearchBarActive from "./_components/SearchBarActive";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <DashboardDataProvider>
            <div className="w-full">
                <div className="fixed w-full flex justify-center">
                    <DashboardTopNav>
                        <SearchBarActive />
                    </DashboardTopNav>
                </div>
                <main className="w-full">
                    {children}
                </main>
                <footer>{/* Footer content */}</footer>
            </div>
        </DashboardDataProvider>
    );
};

export default DashboardLayout;

