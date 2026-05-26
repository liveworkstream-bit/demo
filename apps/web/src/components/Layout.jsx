import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

export default function Layout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#070b15] text-[#f1f5f9] flex overflow-hidden">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      <main className="flex-1 h-screen overflow-y-auto lg:ml-64 custom-scrollbar relative">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#090d17]/80 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-[#FE2C55] to-[#25F4EE]" />
            <span className="font-black tracking-tight">TokVault</span>
          </div>
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 text-[#94a3b8] hover:text-[#25F4EE]"
          >
            <Menu size={24} />
          </button>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto">{children}</div>

        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #090d17;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #1e293b;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #25F4EE;
          }
        `}</style>
      </main>
    </div>
  );
}
