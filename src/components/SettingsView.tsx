import React, { useState } from 'react';
import { BookRepository } from '../services/bookRepository';

interface SettingsViewProps {
  onResetDatabase: () => void;
  onExportSql: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onResetDatabase,
  onExportSql,
}) => {
  const [resetDone, setResetDone] = useState(false);

  const handleReset = () => {
    if (confirm('Apakah Anda yakin ingin mengatur ulang basis data ke data awal seeder bawaan?')) {
      BookRepository.resetToDefault();
      onResetDatabase();
      setResetDone(true);
      setTimeout(() => setResetDone(false), 3000);
    }
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      <div>
        <div className="flex items-center gap-1 text-[#6f7a6e] text-[11px] uppercase tracking-wider font-bold">
          <span>Perpustakaan</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-[#00652c]">Pengaturan &amp; Infrastruktur</span>
        </div>
        <h1 className="font-headline text-3xl font-bold text-[#121c2a] tracking-tight">
          Basis Data &amp; Konfigurasi Storage
        </h1>
        <p className="text-xs text-[#6f7a6e]">
          Informasi environment Laravel .env, koneksi MySQL, serta direktori penyimpanan aset gambar.
        </p>
      </div>

      {resetDone && (
        <div className="p-3 bg-[#d3ffd5] text-[#00652c] rounded-xl text-xs font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>Database berhasil diatur ulang ke benih data bawaan (BookSeeder.php).</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* MySQL Configuration */}
        <div className="bg-white p-6 rounded-xl shadow-xs border border-[#e6eeff]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#eff4ff]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00652c] text-[22px]">database</span>
              <h3 className="font-headline text-lg font-bold text-[#121c2a]">
                Koneksi Basis Data MySQL
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#a4f1b2]/60 text-[#1f6c3a] text-[10px] font-bold">
              Connected
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between p-2 rounded-lg bg-[#eff4ff]">
              <span className="text-[#6f7a6e]">DB_CONNECTION:</span>
              <strong className="text-[#121c2a]">mysql</strong>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-[#eff4ff]">
              <span className="text-[#6f7a6e]">DB_HOST:</span>
              <strong className="text-[#121c2a]">127.0.0.1</strong>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-[#eff4ff]">
              <span className="text-[#6f7a6e]">DB_PORT:</span>
              <strong className="text-[#121c2a]">3306</strong>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-[#eff4ff]">
              <span className="text-[#6f7a6e]">DB_DATABASE:</span>
              <strong className="text-[#00652c]">athenaeum_library</strong>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-[#eff4ff]">
              <span className="text-[#6f7a6e]">DB_CHARSET:</span>
              <strong className="text-[#121c2a]">utf8mb4_unicode_ci</strong>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#eff4ff]">
            <button
              type="button"
              onClick={onExportSql}
              className="w-full py-2.5 bg-[#15803d] hover:bg-[#00652c] text-white rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Unduh MySQL Dump Lengkap (.sql)</span>
            </button>
          </div>
        </div>

        {/* Filesystem Storage Symlink */}
        <div className="bg-white p-6 rounded-xl shadow-xs border border-[#e6eeff]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#eff4ff]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00652c] text-[22px]">
                folder_shared
              </span>
              <h3 className="font-headline text-lg font-bold text-[#121c2a]">
                Laravel Storage &amp; Symlink
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#a4f1b2]/60 text-[#1f6c3a] text-[10px] font-bold">
              Linked
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between p-2 rounded-lg bg-[#eff4ff]">
              <span className="text-[#6f7a6e]">FILESYSTEM_DISK:</span>
              <strong className="text-[#121c2a]">public</strong>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-[#eff4ff]">
              <span className="text-[#6f7a6e]">STORAGE_PATH:</span>
              <strong className="text-[#121c2a]">storage/app/public/books/</strong>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-[#eff4ff]">
              <span className="text-[#6f7a6e]">PUBLIC_URL:</span>
              <strong className="text-[#00652c]">/storage/books/</strong>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-[#eff4ff]">
              <span className="text-[#6f7a6e]">ARTISAN_COMMAND:</span>
              <strong className="text-[#121c2a]">php artisan storage:link</strong>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#eff4ff]">
            <button
              type="button"
              onClick={handleReset}
              className="w-full py-2.5 bg-[#ffdad6] hover:bg-[#ba1a1a] text-[#ba1a1a] hover:text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              <span>Reset Database ke Default (Seeders)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
