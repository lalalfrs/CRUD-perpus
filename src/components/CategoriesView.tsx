import React from 'react';
import { Category, Book } from '../types/book';

interface CategoriesViewProps {
  categories: Category[];
  books: Book[];
  onSelectCategory: (catName: string) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  books,
  onSelectCategory,
}) => {
  return (
    <div className="flex flex-col w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1 text-[#6f7a6e] text-[11px] uppercase tracking-wider font-bold">
            <span>Perpustakaan</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-[#00652c]">Klasifikasi Kategori</span>
          </div>
          <h1 className="font-headline text-3xl font-bold text-[#121c2a] tracking-tight">
            Klasifikasi &amp; Rak DDC
          </h1>
          <p className="text-xs text-[#6f7a6e]">
            Pengelompokan sistematis buku berdasarkan Dewey Decimal Classification (DDC 23rd Edition).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const matchedBooks = books.filter((b) =>
            b.category.toLowerCase().includes(cat.name.toLowerCase())
          );
          return (
            <div
              key={cat.id}
              className="bg-white p-5 rounded-xl shadow-xs border border-[#e6eeff] hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#eff4ff] text-[#00652c] border border-[#dee9fc]">
                    DDC {cat.ddc_code}
                  </span>
                  <span className="text-xs font-semibold text-[#6f7a6e]">
                    {matchedBooks.length} Buku Aktif
                  </span>
                </div>
                <h3 className="font-headline text-lg font-bold text-[#121c2a] mb-1">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#6f7a6e] mb-4 leading-relaxed">
                  {cat.description}
                </p>

                {/* Sample book covers in this category */}
                <div className="flex items-center -space-x-2 mb-4 overflow-hidden py-1">
                  {matchedBooks.slice(0, 4).map((b) => (
                    <img
                      key={b.id}
                      src={b.cover_image}
                      alt={b.title}
                      title={b.title}
                      className="w-8 h-11 object-cover rounded-md ring-2 ring-white shadow-2xs"
                    />
                  ))}
                  {matchedBooks.length === 0 && (
                    <span className="text-[11px] text-[#6f7a6e] italic">
                      Belum ada eksemplar terdaftar
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectCategory(cat.name)}
                className="w-full py-2 bg-[#eff4ff] hover:bg-[#15803d] text-[#00652c] hover:text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Lihat Koleksi di Katalog</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
