import React from 'react';
import { Book } from '../types/book';

interface DeleteModalProps {
  isOpen: boolean;
  book: Book | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  book,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !book) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121c2a]/40 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#d9e3f6] animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 flex flex-col gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px]">warning</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="font-headline text-xl font-bold text-[#121c2a]">
              Konfirmasi Hapus Buku
            </h3>
            <p className="text-sm text-[#3f493f]">
              Apakah Anda yakin ingin menghapus buku{' '}
              <strong className="font-semibold text-[#121c2a]">“{book.title}”</strong>?
            </p>
            <p className="text-xs text-[#6f7a6e] leading-relaxed">
              Tindakan ini bersifat permanen dan akan menghapus seluruh data barcode eksemplar, kartu sirkulasi, riwayat peminjaman, serta file gambar cover (<code className="text-[#00652c] font-mono">{book.image_storage_path || 'storage/books'}</code>) di server.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 bg-[#eff4ff] flex items-center justify-end gap-3 border-t border-[#dee9fc]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white text-[#121c2a] text-xs font-semibold hover:bg-[#e6eeff] transition-colors shadow-xs border border-[#dee9fc]"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-[#ba1a1a] hover:bg-[#93000a] text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">delete_forever</span>
            <span>Hapus Buku</span>
          </button>
        </div>
      </div>
    </div>
  );
};
