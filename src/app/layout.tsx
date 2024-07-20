import "MixaDev/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "MixaDev/trpc/react";

export const metadata: Metadata = {
  title: "Mixa",
  description: "Created by MixaDev",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
  modal
}: Readonly<{ 
  children: React.ReactNode; 
  modal: React.ReactNode 
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          {children}
          {modal}
          <div id="modal-root"></div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
