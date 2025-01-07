"use client";
import React, { useState, ReactNode } from "react";


export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
    
        {/* <!-- ===== Content Area Start ===== --> */}
        
          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        
        {/* <!-- ===== Content Area End ===== --> */}
      
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </>
  );
}
