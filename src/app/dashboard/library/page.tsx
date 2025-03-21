export default async function LibraryPage({ children }: { children: React.ReactNode }) {
    
    return (
      <div className="w-screen flex items-center flex-col overflow-hidden">
        <div className="w-full flex items-center flex-col px-4">
            {children}
        </div>
      </div>
    );
  }
  