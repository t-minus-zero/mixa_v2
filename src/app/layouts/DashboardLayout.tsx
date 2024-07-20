"use client"

import DashboardTopNav from "./_components/DashboardTopNav";
import SearchBarActive from "./_components/SearchBarActive";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
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
  );
};

export default DashboardLayout;
