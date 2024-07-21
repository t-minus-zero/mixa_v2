"use client"

// DashboardLayout.tsx
import { DashboardDataProvider } from '../context/DashboardContext';
import DashboardTopNav from "./_components/DashboardTopNav";
import SearchBarActive from "./_components/SearchBarActive";
import TitleMenu from '../dashboard/_components/TitleMenu';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <DashboardDataProvider>
            <div className="w-full h-full">
                <div className="w-full fixed top-0 left-0 flex justify-center z-20">
                    <DashboardTopNav>
                        <SearchBarActive />
                    </DashboardTopNav>
                </div>
                <main className="w-full">
                    <div 
                        className="w-full sticky top-0 left-0 flex justify-center items-center z-10 mt-24 mb-8">
                        <div className="w-full flex justify-center items-center px-4">
                            <div className="w-full flex justify-center items-center" style={{maxWidth:"1440px"}}>
                                <TitleMenu />
                            </div>
                        </div>
                    </div>
                    {children}
                </main>
                <footer>{/* Footer content */}</footer>
            </div>
        </DashboardDataProvider>
    );
};

export default DashboardLayout;

