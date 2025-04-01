import React from 'react';

export const metadata = {
  title: 'KIT | Mixa',
  description: 'Knowledge Interface Terminal - Chat with AI assistant',
};

export default function KITLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full w-full">
      {children}
    </div>
  );
}
