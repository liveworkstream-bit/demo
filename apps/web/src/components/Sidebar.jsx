import React from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Globe,
  FileText,
  ShieldCheck,
  X,
} from "lucide-react";

export default function Sidebar({ isMobileOpen, setIsMobileOpen }) {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/";

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/" },
    { label: "Marketplace", icon: ShoppingCart, href: "/marketplace" },
    { label: "Rumi Converter", icon: Globe, href: "/converter" },
    { label: "My Orders", icon: FileText, href: "/orders" },
    { label: "Admin Panel", icon: ShieldCheck, href: "/admin" },
  ];

  function isActive(href) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#090d17] border-r border-white/5 z-50 transition-transform duration-300 transform
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FE2C55] to-[#25F4EE] flex items-center justify-center font-bold text-white shadow-lg shadow-[#25F4EE]/20">
                T
              </div>
              <div>
                <h1 className="text-xl font-black text-white tracking-tight">
                  TokVault
                </h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
                    Proxy Secure
                  </span>
                </div>
              </div>
            </div>
            <button
              className="lg:hidden text-[#94a3b8] hover:text-white"
              onClick={() => setIsMobileOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    active
                      ? "bg-[#1e293b] text-[#25F4EE] border-l-2 border-[#25F4EE]"
                      : "text-[#94a3b8] hover:text-white hover:bg-[#1e293b]/50"
                  }`}
                >
                  <Icon
                    size={20}
                    className={`transition-transform group-hover:scale-110 ${active ? "text-[#25F4EE]" : ""}`}
                  />
                  <span className="font-medium">{item.label}</span>
                  {active && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#25F4EE]" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-[#1e293b]/30">
              <div className="w-10 h-10 rounded-full bg-[#25F4EE]/10 border border-[#25F4EE]/20 flex items-center justify-center text-[#25F4EE] font-bold">
                AD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  Admin User
                </p>
                <p className="text-[10px] text-[#94a3b8] uppercase tracking-wider">
                  Root Access
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
