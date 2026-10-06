import React from 'react';
import { Book } from '../types/book';

interface BookDetailModalProps {
  book: Book | null;
  onClose: () => void;
  onEdit: (book: Book) => void;
  onStockChange: (bookId: number, delta: number) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  onClose,
  onEdit,
  onStockChange,
}) => {
  if (!book) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121c2a]/50 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#d9e3f6] my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-[#eff4ff] border-b border-[#dee9fc] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00652c] text-[22px]">
              menu_book
            </span>
            <span className="font-headline font-semibold text-base text-[#121c2a]">
              Detail Sirkulasi & Aset Buku
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6f7a6e] hover:text-[#121c2a] hover:bg-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Book Cover Image */}
            <div className="w-full sm:w-44 flex-shrink-0">
              <div className="relative rounded-xl overflow-hidden shadow-md border border-[#dee9fc] bg-[#eff4ff] aspect-[2/3]">
                <img
                  src={book.cover_image}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                <span
                  className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    book.status === 'Tersedia'
                      ? 'bg-[#a4f1b2] text-[#1f6c3a]'
                      : book.status === 'Stok Kritis'
                      ? 'bg-[#ffdad6] text-[#ba1a1a]'
                      : 'bg-[#e6eeff] text-[#6f7a6e]'
                  }`}
                >
                  {book.status}
                </span>
              </div>
              <div className="mt-2 text-center text-[10px] text-[#6f7a6e] font-mono truncate">
                {book.image_storage_path || 'storage/books'}
              </div>
            </div>

            {/* Book Info */}
            <div className="flex-1 space-y-3">
              <div>
                <span className="inline-block px-2 py-0.5 rounded bg-[#eff4ff] text-[#00652c] text-[11px] font-bold mb-1">
                  {book.category}
                </span>
                <h2 className="font-headline text-2xl font-bold text-[#121c2a] leading-tight">
                  {book.title}
                </h2>
                {book.subtitle && (
                  <p className="text-xs text-[#6f7a6e] italic mt-0.5">{book.subtitle}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-[#eff4ff]">
                <div>
                  <span className="text-[#6f7a6e] block text-[11px]">Penulis:</span>
                  <strong className="text-[#121c2a]">{book.author}</strong>
                </div>
                <div>
                  <span className="text-[#6f7a6e] block text-[11px]">Penerbit:</span>
                  <strong className="text-[#121c2a]">{book.publisher}</strong>
                </div>
                <div>
                  <span className="text-[#6f7a6e] block text-[11px]">Tahun Terbit:</span>
                  <strong className="text-[#121c2a]">{book.year}</strong>
                </div>
                <div>
                  <span className="text-[#6f7a6e] block text-[11px]">Lokasi Rak Fisik:</span>
                  <strong className="text-[#15803d] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">shelves</span>
                    {book.shelf_location}
                  </strong>
                </div>
              </div>

              {/* Stock controller */}
              <div className="bg-[#eff4ff] p-3 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#6f7a6e] block font-medium">
                    Ketersediaan Eksemplar:
                  </span>
                  <span className="text-base font-bold text-[#121c2a]">
                    {book.stock}{' '}
                    <span className="text-xs font-normal text-[#6f7a6e]">
                      dari {book.total_copies} eksemplar
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onStockChange(book.id, -1)}
                    disabled={book.stock <= 0}
                    className="w-8 h-8 rounded-lg bg-white border border-[#dee9fc] hover:bg-[#dee9fc] text-[#121c2a] flex items-center justify-center font-bold text-base disabled:opacity-40 transition-colors"
                    title="Pinjam (Kurangi 1)"
                  >
                    -
                  </button>
                  <button
                    onClick={() => onStockChange(book.id, 1)}
                    className="w-8 h-8 rounded-lg bg-[#15803d] text-white hover:bg-[#00652c] flex items-center justify-center font-bold text-base transition-colors"
                    title="Kembalikan (Tambah 1)"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Barcode Mockup */}
              <div className="bg-white border border-[#dee9fc] p-2.5 rounded-xl flex flex-col items-center">
                <div className="font-mono text-[9px] text-[#6f7a6e] tracking-widest mb-1">
                  *ATHENAEUM-{book.isbn.replace(/-/g, '')}*
                </div>
                {/* SVG Barcode Bars */}
                <div className="flex items-end gap-[2px] h-8 w-48 justify-center">
                  {[3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4, 6, 2, 6, 4, 3, 3, 8, 3, 2, 7, 9].map(
                    (val, idx) => (
                      <div
                        key={idx}
                        className="bg-[#121c2a]"
                        style={{
                          width: val % 2 === 0 ? '3px' : '1.5px',
                          height: `${18 + (val % 5) * 2}px`,
                        }}
                      />
                    )
                  )}
                </div>
                <span className="font-mono text-[10px] text-[#121c2a] mt-1 font-semibold">
                  ISBN {book.isbn}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {book.description && (
            <div className="bg-[#f8f9ff] p-3.5 rounded-xl border border-[#dee9fc]">
              <span className="text-[11px] font-bold text-[#6f7a6e] uppercase tracking-wider block mb-1">
                Deskripsi & Sinopsis
              </span>
              <p className="text-xs text-[#3f493f] leading-relaxed">{book.description}</p>
            </div>
          )}

          {/* Eloquent JSON mapping preview */}
          <div className="bg-[#121c2a] text-[#eff4ff] p-3 rounded-xl text-xs font-mono overflow-x-auto">
            <div className="text-[10px] text-[#79db8d] font-bold mb-1 flex items-center justify-between">
              <span>// Eloquent Model Serialization: Book::find({book.id})</span>
              <span className="text-[#dee9fc]/60">JSON Representation</span>
            </div>
            <pre className="text-[11px] text-[#d3ffd5] leading-relaxed">
{JSON.stringify(
  {
    id: book.id,
    title: book.title,
    isbn: book.isbn,
    author: book.author,
    stock: book.stock,
    shelf: book.shelf_location,
    status: book.status,
    cover_image_url: `/storage/${book.image_storage_path}`,
    created_at: book.created_at,
  },
  null,
  2
)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#eff4ff] border-t border-[#dee9fc] flex items-center justify-between">
          <span className="text-[11px] text-[#6f7a6e]">
            Terakhir diperbarui: {book.updated_at}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(book);
              }}
              className="px-4 py-1.5 rounded-xl bg-white text-[#121c2a] text-xs font-semibold hover:bg-[#dee9fc] transition-colors border border-[#dee9fc] flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
              <span>Edit Data</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-[#15803d] text-white text-xs font-semibold hover:bg-[#00652c] transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
