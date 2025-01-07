// app/layout.tsx or app/layout.js
'use client';  // Ensure this is a client component

import './globals.css';
import { SessionProvider } from 'next-auth/react';
import Footer from '@/components/ui/footer';
import Header from '@/components/header';
import { Providers } from './providers';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Only the client-side part needs SessionProvider */}
        <SessionProvider>
          <div>
            {/* Navbar Component */}
            <Header />
           
            {/* Main Content */}
            <main className="p-0">
            <Providers>
          {children}
          </Providers>
              
            </main>
            <Footer/>
          </div>
        </SessionProvider>
      </body>
      
    </html>
  );
}
