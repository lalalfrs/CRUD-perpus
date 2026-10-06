import React from 'react';
import { Book } from '../types/book';

interface InventoryViewProps {
  books: Book[];
  onOpenBookDetail: (book: Book) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ books, onOpenBookDetail }) => {
  // Group by shelf
  const shelves = [
    { code: 'Rak A', name: 'Rak Koleksi Self Improvement & Psikologi', location: 'Lantai 1 Sayap Barat' },
    { code: 'Rak B', name: 'Rak Sastra & Fiksi Indonesia', location: 'Lantai 1 Sayap Timur' },
    { code: 'Rak C', name: 'Rak Filsafat, Sejarah & Sosial', location: 'Lantai 2 Sayap Barat' },
    { code: 'Rak D', name: 'Rak Referensi & Sistem Informasi', location: 'Lantai 2 Sayap Timur' },
    { code: 'Rak T', name: 'Rak Rekayasa Teknologi & Komputer', location: 'Lantai 2 Ruang Khusus' },
  ];

  return (
    <div className="flex flex-col w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1 text-[#6f7a6e] text-[11px] uppercase tracking-wider font-bold">
            <span>Perpustakaan</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-[#00652c]">Laporan Inventaris Fisik</span>
          </div>
          <h1 className="font-headline text-3xl font-bold text-[#121c2a] tracking-tight">
            Distribusi Fisik &amp; Audit Rak
          </h1>
          <p className="text-xs text-[#6f7a6e]">
            Monitoring fisik eksemplar buku di tiap rak penyimpanan dan status ketersediaan sirkulasi.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {shelves.map((shelf) => {
          const matchingBooks = books.filter((b) =>
            b.shelf_location.toLowerCase().includes(shelf.code.toLowerCase())
          );
          const totalShelfStock = matchingBooks.reduce((acc, b) => acc + b.stock, 0);

          return (
            <div
              key={shelf.code}
              className="bg-white p-5 rounded-xl shadow-xs border border-[#e6eeff] flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#eff4ff] text-[#00652c] flex items-center justify-center font-bold text-base flex-shrink-0 border border-[#dee9fc]">
                  {shelf.code.replace('Rak ', '')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline font-bold text-base text-[#121c2a]">
                      {shelf.name}
                    </h3>
                    <span className="text-[11px] text-[#6f7a6e] bg-[#eff4ff] px-2 py-0.5 rounded-md">
                      {shelf.location}
                    </span>
                  </div>
                  <p className="text-xs text-[#6f7a6e] mt-1">
                    {matchingBooks.length} judul terdaftar • {totalShelfStock} eksemplar fisik tersedia
                  </p>

                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {matchingBooks.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => onOpenBookDetail(b)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#eff4ff] hover:bg-[#d9e3f6] text-xs text-[#121c2a] font-medium transition-colors border border-[#dee9fc] cursor-pointer"
                      >
                        <img
                          src={b.cover_image}
                          alt={b.title}
                          className="w-4 h-5 object-cover rounded shadow-2xs"
                        />
                        <span className="truncate max-w-[140px]">{b.title}</span>
                        <span className="text-[10px] text-[#00652c] font-bold">
                          ({b.stock})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-xs text-[#6f7a6e] block">Kapasitas Rak</span>
                <span className="font-headline text-xl font-bold text-[#121c2a]">
                  {totalShelfStock} / 150
                </span>
                <div className="w-32 h-1.5 bg-[#eff4ff] rounded-full overflow-hidden mt-1.5 ml-auto">
                  <div
                    className="bg-[#15803d] h-full rounded-full"
                    style={{ width: `${Math.min(100, (totalShelfStock / 150) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
