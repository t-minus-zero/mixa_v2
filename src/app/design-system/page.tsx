import DesignSystemGrid from './_components/DesignSystemGrid';

export const dynamic = "force-dynamic";

export default async function DesignSystemPage({ children }: { children: React.ReactNode }) {
  
  return (
    <div className="w-screen flex items-center flex-col overflow-hidden">
      <div className="w-full flex items-center flex-col px-4">
        <div>
          <h1>Design System</h1>
        </div>
        <DesignSystemGrid>
            {children}
        </DesignSystemGrid>
      </div>
    </div>
  );
}
