import "MixaDev/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "MixaDev/trpc/react";
import NotificationsProvider from "./_contexts/NotificationsContext";

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
          <NotificationsProvider>
            {children}
            {modal}
            <div id="modal-root"></div>
          </NotificationsProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
