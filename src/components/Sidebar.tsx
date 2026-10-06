import React from 'react';
import { ActiveTab } from '../types/book';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  booksCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, booksCount }) => {
  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: 'dashboard', badge: undefined },
    { id: 'manajemen-buku' as ActiveTab, label: 'Manajemen Buku', icon: 'menu_book', badge: booksCount.toString() },
    { id: 'kategori' as ActiveTab, label: 'Kategori', icon: 'category', badge: '5' },
    { id: 'laporan-inventaris' as ActiveTab, label: 'Laporan Inventaris', icon: 'inventory_2', badge: undefined },
    { id: 'laravel-studio' as ActiveTab, label: 'Laravel & Eloquent', icon: 'code_blocks', badge: 'Blade' },
    { id: 'pengaturan' as ActiveTab, label: 'Pengaturan', icon: 'settings', badge: undefined },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white flex flex-col justify-between z-50 shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-[#e6eeff]">
      <div className="flex flex-col">
        {/* Brand */}
        <div className="h-16 px-4 flex items-center gap-2.5 border-b border-[#f1f5f9]">
          <div className="w-9 h-9 rounded-xl bg-[#15803d] flex items-center justify-center text-white shadow-sm">
            <span className="material-symbols-outlined text-[20px]">local_library</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-semibold text-base text-[#121c2a] tracking-tight leading-none">
              Athenaeum
            </span>
            <span className="text-[10px] uppercase text-[#00652c] font-bold tracking-wider mt-0.5">
              Library System
            </span>
          </div>
        </div>

        {/* Section title */}
        <div className="px-4 pt-4 pb-2">
          <span className="text-[11px] font-bold text-[#6f7a6e] uppercase tracking-wider px-1">
            Navigasi Arsip
          </span>
        </div>

        {/* Navigation list */}
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                type="button"
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-sm text-left ${
                  isActive
                    ? 'bg-[#15803d] text-white font-semibold shadow-sm'
                    : 'text-[#3f493f] hover:bg-[#eff4ff] hover:text-[#121c2a]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isActive ? 'text-white' : 'text-[#6f7a6e]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.id === 'laravel-studio'
                        ? 'bg-[#d3ffd5] text-[#00652c]'
                        : 'bg-[#eff4ff] text-[#6f7a6e]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* System status card */}
      <div className="p-3 m-3 bg-[#eff4ff] rounded-xl border border-[#dee9fc]">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#15803d] animate-pulse"></span>
            <span className="text-[11px] font-bold text-[#1f6c3a] uppercase tracking-wider">
              Sistem Aktif
            </span>
          </div>
          <span className="text-[11px] text-[#6f7a6e] font-mono">v2.4.0</span>
        </div>
        <div className="text-xs text-[#3f493f] font-medium">Sesi Katalog Terpusat</div>
        <div className="mt-2 pt-2 border-t border-[#dee9fc] flex items-center justify-between text-[10px] text-[#6f7a6e]">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] text-[#00652c]">database</span>
            MySQL & Eloquent
          </span>
          <span className="text-[#00652c] font-semibold">Tersinkron</span>
        </div>
      </div>
    </aside>
  );
};
