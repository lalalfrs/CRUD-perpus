import React from 'react';
import { ActiveTab } from '../types/book';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenCreateModal: () => void;
  onExportSql: () => void;
  onExportCsv: () => void;
  onSearchClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenCreateModal,
  onExportSql,
  onExportCsv,
  onSearchClick,
}) => {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white/95 backdrop-blur-xl z-40 border-b border-[#e6eeff] px-8 flex items-center justify-between shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-[#3f493f] text-sm">
          <span className="font-semibold text-[#121c2a]">Athenaeum</span>
          <span className="material-symbols-outlined text-[16px] text-[#6f7a6e]">chevron_right</span>
          <span className="text-[#6f7a6e]">
            {activeTab === 'dashboard' && 'Dashboard Utama'}
            {activeTab === 'manajemen-buku' && 'Sirkulasi & Katalog Buku'}
            {activeTab === 'kategori' && 'Klasifikasi Kategori'}
            {activeTab === 'laporan-inventaris' && 'Inventaris & Audit Rak'}
            {activeTab === 'pengaturan' && 'Pengaturan Database & Storage'}
            {activeTab === 'laravel-studio' && 'Laravel Eloquent & Blade Studio'}
          </span>
        </div>
        <div className="h-4 w-px bg-[#d9e3f6] hidden md:block" />
        <div className="hidden md:flex items-center gap-1.5 text-[#6f7a6e] text-xs font-medium">
          <span className="material-symbols-outlined text-[16px]">calendar_today</span>
          <span>Kamis, 24 Oktober 2024</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Toggle Mode Laravel Eloquent Code vs Interactive Blade */}
        <div className="hidden xl:flex items-center bg-[#eff4ff] p-1 rounded-xl border border-[#dee9fc]">
          <button
            onClick={() => setActiveTab('manajemen-buku')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab !== 'laravel-studio'
                ? 'bg-white text-[#00652c] shadow-sm'
                : 'text-[#6f7a6e] hover:text-[#121c2a]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">web</span>
            <span>Blade App UI</span>
          </button>
          <button
            onClick={() => setActiveTab('laravel-studio')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'laravel-studio'
                ? 'bg-[#15803d] text-white shadow-sm'
                : 'text-[#6f7a6e] hover:text-[#121c2a]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">code</span>
            <span>Laravel Eloquent & Blade Source</span>
          </button>
        </div>

        {/* Global Search trigger */}
        <button
          onClick={onSearchClick}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#eff4ff] hover:bg-[#e6eeff] rounded-xl text-[#6f7a6e] hover:text-[#121c2a] transition-colors border border-[#dee9fc]"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">search</span>
          <span className="text-xs hidden lg:inline">Cari judul, ISBN, rak...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold bg-white text-[#121c2a] rounded shadow-xs">
            ⌘K
          </kbd>
        </button>

        {/* MySQL SQL Dump Export */}
        <div className="relative group">
          <button
            onClick={onExportSql}
            title="Download MySQL Dump (.sql)"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-[#eff4ff] hover:bg-[#d9e3f6] text-[#00652c] rounded-xl text-xs font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">database</span>
            <span className="hidden sm:inline">MySQL .sql</span>
          </button>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[#3f493f] hover:bg-[#eff4ff] transition-colors"
            type="button"
            title="Notifikasi Sistem"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
          </button>
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-white"></span>
        </div>

        <div className="h-6 w-px bg-[#d9e3f6]" />

        {/* User profile */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#00652c] text-white flex items-center justify-center font-bold text-xs shadow-sm">
            DP
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-[#121c2a] leading-tight">Dimas Prakoso</span>
            <span className="text-[11px] text-[#6f7a6e] leading-tight">Head Librarian</span>
          </div>
        </div>
      </div>
    </header>
  );
};
