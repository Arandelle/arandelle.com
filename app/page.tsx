'use client'

import Sidebar, { TabId } from "@/components/portfolio/Sidebar";
import MobileNav from "@/components/portfolio/MobileNav";
import TabContent from "@/components/portfolio/TabContent";
import ChatButton from "@/components/portfolio/ChatButton";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("about");
  return (
    <div className="min-h-screen bg-background text-foreground antialiased transition-colors duration-500">
      {/* Halftone accent — fades out radially */}
      <div
        className="halftone-bg pointer-events-none fixed inset-0 opacity-[0.07] dark:opacity-[0.05]"
        style={{
          maskImage:
            "radial-gradient(ellipse at top right, black 20%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at top right, black 20%, transparent 70%)",
        }}
      />

      {/* Desktop sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Mobile nav */}
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main content area */}
      <main className="lg:ml-[14rem] min-h-screen pt-14 lg:pt-0">
        <div className="mx-auto max-w-[42rem] px-4 sm:px-6 py-8 lg:py-16">
          <TabContent activeTab={activeTab} />
        </div>

        {/* Footer — always visible */}
        <div className="mx-auto max-w-[42rem] px-4 sm:px-6 pb-8 lg:pb-16">
          <footer className="border-t border-gray-200 pt-8 transition-colors duration-500">
            <p className="text-center font-mono-label text-[9px] uppercase tracking-[1px] text-gray-400">
              © {new Date().getFullYear()} Arandelle Paguinto. All rights
              reserved.
            </p>
          </footer>
        </div>
      </main>

      <ChatButton />
    </div>
  );
}
