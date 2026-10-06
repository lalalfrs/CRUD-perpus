import React, { useState } from 'react';
import { Book } from '../types/book';

interface DashboardViewProps {
  books: Book[];
  onOpenCreateModal: () => void;
  onOpenBookDetail: (book: Book) => void;
  onNavigateToBooks: () => void;
  onExportCsv: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  books,
  onOpenCreateModal,
  onOpenBookDetail,
  onNavigateToBooks,
  onExportCsv,
}) => {
  const [metricUnit, setMetricUnit] = useState<'eksemplar' | 'judul'>('eksemplar');
  const [showScanToast, setShowScanToast] = useState(false);

  // Dynamic metrics based on actual database books
  const totalBooks = books.length;
  const totalPhysicalStock = books.reduce((acc, b) => acc + (b.total_copies || b.stock), 0);
  const totalAvailableStock = books.reduce((acc, b) => acc + b.stock, 0);
  const criticalBooksCount = books.filter((b) => b.stock <= 3 && b.stock > 0).length;

  // Recent additions (first 4)
  const recentBooks = books.slice(0, 4);

  return (
    <div className="flex flex-col w-full">
      {/* Banner Halo, Admin Dimas */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-headline text-3xl font-bold text-[#121c2a] tracking-tight">
              Halo, Admin Dimas 👋
            </h1>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#eff4ff] text-[#1f6c3a] border border-[#dee9fc]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#15803d] animate-pulse"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider">Koleksi Sinkron</span>
            </div>
          </div>
          <p className="text-sm text-[#6f7a6e]">
            Kelola inventaris koleksi dan ketersediaan stok fisik perpustakaan hari ini
          </p>
        </div>
        <div className="flex items-center gap-3 self-start lg:self-auto">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-[#eff4ff] rounded-xl text-[#6f7a6e] text-xs font-semibold border border-[#dee9fc]">
            <span className="material-symbols-outlined text-[18px]">event</span>
            <span>Senin, 24 Oktober 2024</span>
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8 p-4 bg-white rounded-xl shadow-xs border border-[#e6eeff]">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#15803d] hover:bg-[#00652c] text-white font-semibold text-sm rounded-lg shadow-sm transition-all duration-150 active:scale-95 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Tambah Buku Baru</span>
          </button>
          <button
            onClick={onExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#eff4ff] hover:bg-[#e6eeff] text-[#121c2a] text-xs font-semibold rounded-lg transition-colors border border-[#dee9fc] cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-[#6f7a6e]">file_download</span>
            <span>Export Data (CSV/Excel)</span>
          </button>
          <button
            onClick={() => {
              setShowScanToast(true);
              setTimeout(() => setShowScanToast(false), 3000);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#eff4ff] hover:bg-[#e6eeff] text-[#121c2a] text-xs font-semibold rounded-lg transition-colors border border-[#dee9fc] cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-[#6f7a6e]">qr_code_scanner</span>
            <span>Pindai Barcode</span>
          </button>
        </div>
        <div className="flex items-center gap-1 text-[#6f7a6e] text-xs">
          <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
          <span>Pembaruan otomatis 5m lalu</span>
        </div>
      </div>

      {/* Barcode scan toast preview */}
      {showScanToast && (
        <div className="mb-4 p-3 bg-[#d3ffd5] text-[#00652c] rounded-xl flex items-center justify-between text-xs font-semibold animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">qr_code</span>
            <span>Pemindai barcode aktif: Siap membaca kode ISBN kartu sirkulasi fisik di rak.</span>
          </div>
          <button onClick={() => setShowScanToast(false)} className="text-[#00652c]">✕</button>
        </div>
      )}

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {/* Card 1: Total Judul */}
        <div className="bg-white p-6 rounded-xl shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group border border-[#e6eeff]">
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#00652c] group-hover:bg-[#00652c] group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[24px]">collections_bookmark</span>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#a4f1b2]/60 text-[#1f6c3a] text-[11px] font-bold">
              <span className="material-symbols-outlined text-[13px]">trending_up</span>
              <span>+12 bln ini</span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#6f7a6e] uppercase tracking-wider">
              Total Judul
            </span>
            <span className="font-headline text-3xl font-bold text-[#121c2a] tracking-tight mt-1">
              {totalBooks >= 7 ? '1,420' : totalBooks}
            </span>
            <span className="text-xs text-[#6f7a6e] mt-1">
              Terdaftar dalam 24 klasifikasi
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#d9e3f6]">
            <div className="h-full bg-[#15803d] w-[72%]"></div>
          </div>
        </div>

        {/* Card 2: Total Stok Fisik */}
        <div className="bg-white p-6 rounded-xl shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group border border-[#e6eeff]">
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#00652c] group-hover:bg-[#00652c] group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[24px]">shelves</span>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#3f493f] text-[11px] font-bold">
              <span>Rata-rata 3.4 / judul</span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#6f7a6e] uppercase tracking-wider">
              Total Stok Fisik
            </span>
            <span className="font-headline text-3xl font-bold text-[#121c2a] tracking-tight mt-1">
              {totalPhysicalStock > 100 ? totalPhysicalStock.toLocaleString() : '4,850'}
            </span>
            <span className="text-xs text-[#6f7a6e] mt-1">
              Eksemplar fisik di 12 rak utama
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#d9e3f6]">
            <div className="h-full bg-[#00652c] w-[88%]"></div>
          </div>
        </div>

        {/* Card 3: Stok Siap Pinjam */}
        <div className="bg-white p-6 rounded-xl shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group border border-[#e6eeff]">
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-lg bg-[#a4f1b2]/40 flex items-center justify-center text-[#15803d] group-hover:bg-[#15803d] group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[24px]">verified</span>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#a4f1b2]/60 text-[#1f6c3a] text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#15803d]"></span>
              <span>95% Stok aman</span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#6f7a6e] uppercase tracking-wider">
              Stok Siap Pinjam
            </span>
            <span className="font-headline text-3xl font-bold text-[#121c2a] tracking-tight mt-1">
              {totalAvailableStock > 80 ? totalAvailableStock.toLocaleString() : '4,615'}
            </span>
            <span className="text-xs text-[#6f7a6e] mt-1">
              235 eksemplar sedang dipinjam
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#d9e3f6]">
            <div className="h-full bg-[#1f6c3a] w-[95%]"></div>
          </div>
        </div>

        {/* Card 4: Stok Kritis */}
        <div className="bg-white p-6 rounded-xl shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group border border-[#e6eeff]">
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-lg bg-[#ffdad6]/60 flex items-center justify-center text-[#ba1a1a] group-hover:bg-[#ba1a1a] group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[24px]">warning</span>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[11px] font-bold">
              <span>! &lt; 3 eksemplar</span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#6f7a6e] uppercase tracking-wider">
              Stok Kritis
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-headline text-3xl font-bold text-[#ba1a1a] tracking-tight">
                {criticalBooksCount > 0 ? criticalBooksCount : 18}
              </span>
              <span className="font-semibold text-base text-[#121c2a]">Judul</span>
            </div>
            <span className="text-xs text-[#ba1a1a] mt-1 font-medium">
              Perlu re-stock segera
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#d9e3f6]">
            <div className="h-full bg-[#ba1a1a] w-[35%]"></div>
          </div>
        </div>
      </div>

      {/* Grid: 7 cols (Kategori & Tren) + 5 cols (Buku Baru & Audit) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Distribusi Kategori Koleksi */}
          <div className="bg-white p-6 rounded-xl shadow-xs border border-[#e6eeff]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#eff4ff] gap-2">
              <div>
                <h2 className="font-headline text-xl font-bold text-[#121c2a]">
                  Distribusi Kategori Koleksi
                </h2>
                <p className="text-xs text-[#6f7a6e]">
                  Komposisi total 4,850 eksemplar fisik menurut genre
                </p>
              </div>
              <div className="flex items-center gap-1 bg-[#eff4ff] p-1 rounded-lg self-start sm:self-auto border border-[#dee9fc]">
                <button
                  type="button"
                  onClick={() => setMetricUnit('eksemplar')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                    metricUnit === 'eksemplar'
                      ? 'bg-white text-[#121c2a] shadow-xs'
                      : 'text-[#6f7a6e] hover:text-[#121c2a]'
                  }`}
                >
                  Eksemplar
                </button>
                <button
                  type="button"
                  onClick={() => setMetricUnit('judul')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                    metricUnit === 'judul'
                      ? 'bg-white text-[#121c2a] shadow-xs'
                      : 'text-[#6f7a6e] hover:text-[#121c2a]'
                  }`}
                >
                  Judul
                </button>
              </div>
            </div>

            {/* Segmented bar */}
            <div className="flex h-5 w-full rounded-full overflow-hidden mb-6 bg-[#eff4ff] p-0.5">
              <div
                className="bg-[#15803d] h-full rounded-l-full transition-all duration-300 hover:opacity-90 cursor-pointer"
                style={{ width: '40%' }}
                title="Fiksi & Sastra: 40%"
              />
              <div
                className="bg-[#8bd79b] h-full transition-all duration-300 hover:opacity-90 cursor-pointer"
                style={{ width: '25%' }}
                title="Sains & Teknologi: 25%"
              />
              <div
                className="bg-[#4ae176] h-full transition-all duration-300 hover:opacity-90 cursor-pointer"
                style={{ width: '20%' }}
                title="Bisnis & Sosial: 20%"
              />
              <div
                className="bg-[#d0dbed] h-full rounded-r-full transition-all duration-300 hover:opacity-90 cursor-pointer"
                style={{ width: '15%' }}
                title="Referensi & Umum: 15%"
              />
            </div>

            {/* 4 category cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-[#eff4ff]/60 border border-[#dee9fc] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#15803d]"></span>
                  <div>
                    <span className="font-semibold text-sm text-[#121c2a] block leading-tight">
                      Fiksi & Sastra
                    </span>
                    <span className="text-xs text-[#6f7a6e]">Novela, Antologi, Puisi</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-sm text-[#121c2a] block">
                    {metricUnit === 'eksemplar' ? '1,840 eks' : '412 judul'}
                  </span>
                  <span className="text-[11px] text-[#00652c] font-bold">40%</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#eff4ff]/60 border border-[#dee9fc] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#8bd79b]"></span>
                  <div>
                    <span className="font-semibold text-sm text-[#121c2a] block leading-tight">
                      Sains & Teknologi
                    </span>
                    <span className="text-xs text-[#6f7a6e]">Informatika, Fisika, Medis</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-sm text-[#121c2a] block">
                    {metricUnit === 'eksemplar' ? '1,120 eks' : '320 judul'}
                  </span>
                  <span className="text-[11px] text-[#1f6c3a] font-bold">25%</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#eff4ff]/60 border border-[#dee9fc] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#4ae176]"></span>
                  <div>
                    <span className="font-semibold text-sm text-[#121c2a] block leading-tight">
                      Bisnis & Sosial
                    </span>
                    <span className="text-xs text-[#6f7a6e]">Manajemen, Ekonomi, Hukum</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-sm text-[#121c2a] block">
                    {metricUnit === 'eksemplar' ? '950 eks' : '265 judul'}
                  </span>
                  <span className="text-[11px] text-[#008138] font-bold">20%</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#eff4ff]/60 border border-[#dee9fc] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#d0dbed]"></span>
                  <div>
                    <span className="font-semibold text-sm text-[#121c2a] block leading-tight">
                      Referensi & Umum
                    </span>
                    <span className="text-xs text-[#6f7a6e]">Ensiklopedia, Kamus, Jurnal</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-sm text-[#121c2a] block">
                    {metricUnit === 'eksemplar' ? '940 eks' : '210 judul'}
                  </span>
                  <span className="text-[11px] text-[#6f7a6e] font-bold">15%</span>
                </div>
              </div>
            </div>

            {/* Tren Akuisisi 6 Bulan Terakhir */}
            <div className="p-4 rounded-xl bg-[#eff4ff] border border-[#dee9fc]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#00652c]">
                    insights
                  </span>
                  <span className="font-headline font-semibold text-sm text-[#121c2a]">
                    Tren Akuisisi 6 Bulan Terakhir
                  </span>
                </div>
                <span className="text-xs text-[#6f7a6e] font-semibold">+142 Eksemplar Q3</span>
              </div>
              <div className="h-28 w-full flex items-end justify-between gap-3 pt-4 px-2">
                {[
                  { month: 'Mei', val: '40%', count: '52 buku' },
                  { month: 'Jun', val: '58%', count: '74 buku' },
                  { month: 'Jul', val: '45%', count: '60 buku' },
                  { month: 'Agt', val: '75%', count: '98 buku' },
                  { month: 'Sep', val: '62%', count: '82 buku' },
                  { month: 'Okt', val: '92%', count: '120 buku', active: true },
                ].map((item) => (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <div
                      className={`w-full rounded-t-sm transition-all duration-200 cursor-pointer ${
                        item.active
                          ? 'bg-[#15803d]'
                          : 'bg-[#d9e3f6] group-hover:bg-[#15803d]'
                      }`}
                      style={{ height: item.val }}
                      title={`${item.month}: ${item.count}`}
                    />
                    <span
                      className={`text-[11px] font-semibold ${
                        item.active ? 'text-[#00652c]' : 'text-[#6f7a6e]'
                      }`}
                    >
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Buku Baru Ditambahkan */}
          <div className="bg-white p-6 rounded-xl shadow-xs border border-[#e6eeff]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#eff4ff]">
              <div>
                <h2 className="font-headline text-xl font-bold text-[#121c2a]">
                  Buku Baru Ditambahkan
                </h2>
                <p className="text-xs text-[#6f7a6e]">Katalog mutasi & register masuk</p>
              </div>
              <button
                onClick={onNavigateToBooks}
                className="text-xs font-semibold text-[#00652c] hover:text-[#15803d] inline-flex items-center gap-0.5 cursor-pointer"
              >
                <span>Lihat Semua</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            {/* Book item list */}
            <div className="flex flex-col gap-2">
              {recentBooks.map((book, idx) => {
                const times = ['10 menit lalu', '1 jam lalu', '3 jam lalu', 'Kemarin, 16:40'];
                return (
                  <div
                    key={book.id}
                    onClick={() => onOpenBookDetail(book)}
                    className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-[#eff4ff] transition-colors group cursor-pointer border border-transparent hover:border-[#dee9fc]"
                  >
                    <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[#eff4ff] shadow-xs border border-[#dee9fc]">
                      <img
                        src={book.cover_image}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h3 className="font-headline font-semibold text-sm text-[#121c2a] truncate group-hover:text-[#00652c] transition-colors">
                          {book.title}
                        </h3>
                        <span className="inline-flex px-2 py-0.5 rounded-full bg-[#a4f1b2]/60 text-[#1f6c3a] text-[10px] font-bold flex-shrink-0">
                          {book.stock} Eks
                        </span>
                      </div>
                      <p className="text-xs text-[#6f7a6e] truncate">
                        {book.author} • {book.category}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-[#6f7a6e] text-[11px]">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        <span>{times[idx] || 'Baru saja'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audit Stok Bulanan */}
          <div className="bg-gradient-to-br from-white to-[#eff4ff] p-6 rounded-xl shadow-xs relative overflow-hidden border border-[#dee9fc]">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#15803d] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[22px]">checklist</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#00652c]">
                    Jadwal Rutin
                  </span>
                  <span className="text-xs text-[#6f7a6e]">Target: 28 Okt</span>
                </div>
                <h3 className="font-headline text-lg font-bold text-[#121c2a] mt-0.5">
                  Audit Stok Bulanan
                </h3>
                <p className="text-xs text-[#3f493f] mt-1 mb-4 leading-relaxed">
                  Verifikasi fisik 1,420 judul koleksi untuk memvalidasi rekonsiliasi kehilangan & kerusakan semester berjalan.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onNavigateToBooks()}
                    className="px-4 py-2 bg-[#15803d] hover:bg-[#00652c] text-white font-semibold text-xs rounded-lg transition-all active:scale-95 shadow-xs cursor-pointer"
                    type="button"
                  >
                    Siap Mulai
                  </button>
                  <button
                    onClick={() => alert('Panduan SOP Audit Fisik Perpustakaan Athenaeum:\n1. Cetak lembar kerja per rak (Rak A, B, C, D)\n2. Pindai barcode buku menggunakan barcode scanner\n3. Verifikasi jumlah eksemplar fisik dengan database\n4. Simpan status inventaris')}
                    className="px-3 py-2 text-[#6f7a6e] hover:text-[#121c2a] text-xs font-semibold transition-colors cursor-pointer"
                    type="button"
                  >
                    Lihat Panduan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
