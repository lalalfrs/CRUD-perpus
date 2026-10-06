import React, { useState, useMemo } from 'react';
import { Book } from '../types/book';

interface BookManagementViewProps {
  books: Book[];
  onOpenCreateModal: () => void;
  onOpenEditModal: (book: Book) => void;
  onOpenDeleteModal: (book: Book) => void;
  onOpenDetailModal: (book: Book) => void;
  onExportCsv: () => void;
  successMessage?: string | null;
  onDismissSuccessMessage?: () => void;
}

export const BookManagementView: React.FC<BookManagementViewProps> = ({
  books,
  onOpenCreateModal,
  onOpenEditModal,
  onOpenDeleteModal,
  onOpenDetailModal,
  onExportCsv,
  successMessage,
  onDismissSuccessMessage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [selectedStatus, setSelectedStatus] = useState('Semua Status');
  const [selectedYearRange, setSelectedYearRange] = useState('Tahun Terbit');
  const [sortBy, setSortBy] = useState('Urutkan: Terakhir Diperbarui');
  const [selectedBookIds, setSelectedBookIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Filter logic
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesTitle = book.title.toLowerCase().includes(term);
        const matchesAuthor = book.author.toLowerCase().includes(term);
        const matchesIsbn = book.isbn.toLowerCase().includes(term);
        const matchesShelf = book.shelf_location.toLowerCase().includes(term);
        if (!matchesTitle && !matchesAuthor && !matchesIsbn && !matchesShelf) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'Semua Kategori') {
        if (!book.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
          return false;
        }
      }

      // Status
      if (selectedStatus !== 'Semua Status') {
        if (selectedStatus === 'Habis / Kosong' && book.status !== 'Habis') return false;
        if (selectedStatus === 'Stok Kritis' && book.status !== 'Stok Kritis') return false;
        if (selectedStatus === 'Tersedia' && book.status !== 'Tersedia') return false;
      }

      // Year range
      if (selectedYearRange !== 'Tahun Terbit') {
        if (selectedYearRange === '2024' && book.year !== 2024) return false;
        if (selectedYearRange === '2023' && book.year !== 2023) return false;
        if (selectedYearRange === '2020 - 2022' && (book.year < 2020 || book.year > 2022)) return false;
        if (selectedYearRange === '2010 - 2019' && (book.year < 2010 || book.year > 2019)) return false;
        if (selectedYearRange === '< 2010' && book.year >= 2010) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'Judul A-Z') return a.title.localeCompare(b.title);
      if (sortBy === 'Judul Z-A') return b.title.localeCompare(a.title);
      if (sortBy === 'Stok Terbanyak') return b.stock - a.stock;
      if (sortBy === 'Tahun Terbaru') return b.year - a.year;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  }, [books, searchTerm, selectedCategory, selectedStatus, selectedYearRange, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage) || 1;
  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBooks.slice(start, start + itemsPerPage);
  }, [filteredBooks, currentPage, itemsPerPage]);

  const toggleSelectAll = () => {
    if (selectedBookIds.length === paginatedBooks.length) {
      setSelectedBookIds([]);
    } else {
      setSelectedBookIds(paginatedBooks.map((b) => b.id));
    }
  };

  const toggleSelectOne = (id: number) => {
    if (selectedBookIds.includes(id)) {
      setSelectedBookIds(selectedBookIds.filter((item) => item !== id));
    } else {
      setSelectedBookIds([...selectedBookIds, id]);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Semua Kategori');
    setSelectedStatus('Semua Status');
    setSelectedYearRange('Tahun Terbit');
    setSortBy('Urutkan: Terakhir Diperbarui');
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Toast Banner Sukses Pembaruan */}
      {successMessage && (
        <div className="w-full mb-4 bg-[#a4f1b2]/40 rounded-xl p-3 flex items-center justify-between shadow-xs border border-[#8bd79b]/40 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#00652c] flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[18px]">check</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap text-sm">
              <span className="font-semibold text-[#121c2a]">Pembaruan Sukses:</span>
              <span className="text-[#3f493f]">{successMessage}</span>
            </div>
          </div>
          {onDismissSuccessMessage && (
            <button
              onClick={onDismissSuccessMessage}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6f7a6e] hover:text-[#121c2a] hover:bg-[#eff4ff] transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>
      )}

      {/* Header Halaman & Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-[#6f7a6e] text-[11px] uppercase tracking-wider font-bold">
            <span>Perpustakaan</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-[#00652c]">Manajemen Buku</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-headline text-3xl font-bold text-[#121c2a] tracking-tight">
              Katalog & Manajemen Buku
            </h1>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#eff4ff] text-[#00652c] text-xs font-semibold border border-[#dee9fc]">
              Total 1,420 Buku
            </span>
          </div>
          <p className="text-xs text-[#6f7a6e]">
            Kelola metadata sirkulasi, ketersediaan fisik di rak, dan inventaris pustaka pusat.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-[#121c2a] text-xs font-semibold shadow-xs hover:bg-[#eff4ff] transition-colors border border-[#dee9fc] cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-[#6f7a6e]">file_download</span>
            <span>Export CSV/Excel</span>
          </button>
          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#15803d] hover:bg-[#00652c] text-white font-semibold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>+ Tambah Buku Baru</span>
          </button>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-xs border border-[#e6eeff] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-[#6f7a6e] uppercase tracking-wider">
              Koleksi Terpasang
            </span>
            <span className="font-headline text-2xl font-bold text-[#121c2a] mt-1">1,420</span>
            <span className="text-xs text-[#00652c] flex items-center gap-0.5 mt-0.5 font-medium">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +14 pekan ini
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#00652c]">
            <span className="material-symbols-outlined text-[22px]">auto_stories</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-xs border border-[#e6eeff] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-[#6f7a6e] uppercase tracking-wider">
              Sedang Dipinjam
            </span>
            <span className="font-headline text-2xl font-bold text-[#121c2a] mt-1">388</span>
            <span className="text-xs text-[#6f7a6e] mt-0.5">27.3% dari total eksemplar</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#dee9fc] flex items-center justify-center text-[#1f6c3a]">
            <span className="material-symbols-outlined text-[22px]">sync_alt</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-xs border border-[#e6eeff] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-[#6f7a6e] uppercase tracking-wider">
              Stok Kritis
            </span>
            <span className="font-headline text-2xl font-bold text-[#ba1a1a] mt-1">19</span>
            <span className="text-xs text-[#ba1a1a] flex items-center gap-0.5 mt-0.5 font-medium">
              <span className="material-symbols-outlined text-[14px]">warning</span> Perlu pengadaan
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a]">
            <span className="material-symbols-outlined text-[22px]">inventory</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-xs border border-[#e6eeff] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-[#6f7a6e] uppercase tracking-wider">
              Kategori Aktif
            </span>
            <span className="font-headline text-2xl font-bold text-[#121c2a] mt-1">36</span>
            <span className="text-xs text-[#6f7a6e] mt-0.5">Klasifikasi DDC 23rd Ed.</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#00652c]">
            <span className="material-symbols-outlined text-[22px]">category</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Box */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-[#e6eeff] mb-4 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-[#6f7a6e]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari berdasarkan judul, penulis, ISBN, atau nomor rak..."
              className="w-full h-10 pl-11 pr-4 rounded-xl bg-[#eff4ff] text-[#121c2a] placeholder:text-[#6f7a6e] text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#00652c] border border-transparent focus:border-[#00652c] transition-all"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Category select */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none h-10 pl-3.5 pr-8 rounded-xl bg-[#eff4ff] text-sm text-[#121c2a] hover:bg-[#e6eeff] focus:outline-none cursor-pointer border border-[#dee9fc]"
              >
                <option>Semua Kategori</option>
                <option>Self Improvement</option>
                <option>Fiksi</option>
                <option>Filsafat</option>
                <option>Teknologi</option>
                <option>Referensi</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[18px] text-[#6f7a6e]">
                expand_more
              </span>
            </div>

            {/* Status select */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none h-10 pl-3.5 pr-8 rounded-xl bg-[#eff4ff] text-sm text-[#121c2a] hover:bg-[#e6eeff] focus:outline-none cursor-pointer border border-[#dee9fc]"
              >
                <option>Semua Status</option>
                <option>Tersedia</option>
                <option>Stok Kritis</option>
                <option>Habis / Kosong</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[18px] text-[#6f7a6e]">
                expand_more
              </span>
            </div>

            {/* Year select */}
            <div className="relative">
              <select
                value={selectedYearRange}
                onChange={(e) => {
                  setSelectedYearRange(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none h-10 pl-3.5 pr-8 rounded-xl bg-[#eff4ff] text-sm text-[#121c2a] hover:bg-[#e6eeff] focus:outline-none cursor-pointer border border-[#dee9fc]"
              >
                <option>Tahun Terbit</option>
                <option>2024</option>
                <option>2023</option>
                <option>2020 - 2022</option>
                <option>2010 - 2019</option>
                <option>&lt; 2010</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[18px] text-[#6f7a6e]">
                expand_more
              </span>
            </div>

            {/* Sort select */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none h-10 pl-3.5 pr-8 rounded-xl bg-[#eff4ff] text-sm text-[#121c2a] hover:bg-[#e6eeff] focus:outline-none cursor-pointer border border-[#dee9fc]"
              >
                <option>Urutkan: Terakhir Diperbarui</option>
                <option>Judul A-Z</option>
                <option>Judul Z-A</option>
                <option>Stok Terbanyak</option>
                <option>Tahun Terbaru</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[18px] text-[#6f7a6e]">
                sort
              </span>
            </div>

            {/* Reset Filters */}
            <button
              onClick={resetFilters}
              title="Muat Ulang Filter"
              type="button"
              className="w-10 h-10 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#6f7a6e] hover:text-[#121c2a] hover:bg-[#e6eeff] transition-colors border border-[#dee9fc] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">filter_alt_off</span>
            </button>
          </div>
        </div>

        {/* Bulk Action Subbar */}
        <div className="flex items-center justify-between pt-1 border-t border-[#f1f5f9] text-[#6f7a6e] text-xs">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1f6c3a]">
              Tindakan Massal:
            </span>
            <button
              onClick={() => alert(`Mencetak label barcode untuk ${selectedBookIds.length || 1} buku terpilih.`)}
              className="px-2.5 py-1 rounded-lg bg-[#eff4ff] hover:bg-[#dee9fc] text-[#121c2a] text-xs font-semibold flex items-center gap-1 transition-colors border border-[#dee9fc] cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">qr_code</span>
              <span>Cetak Label Barcode</span>
            </button>
            <button
              onClick={() => alert('Fitur Pindah Rak Massal siap digunakan untuk rak tujuan baru.')}
              className="px-2.5 py-1 rounded-lg bg-[#eff4ff] hover:bg-[#dee9fc] text-[#121c2a] text-xs font-semibold flex items-center gap-1 transition-colors border border-[#dee9fc] cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">drive_file_move</span>
              <span>Pindah Rak</span>
            </button>
          </div>
          <span>Memilih {selectedBookIds.length} entri terpilih</span>
        </div>
      </div>

      {/* Main Catalog Data Table */}
      <div className="bg-white rounded-xl shadow-xs border border-[#e6eeff] overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#eff4ff] text-[#6f7a6e] text-[11px] font-bold uppercase tracking-wider border-b border-[#dee9fc]">
                <th className="py-3 px-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={
                      paginatedBooks.length > 0 &&
                      selectedBookIds.length === paginatedBooks.length
                    }
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded text-[#15803d] focus:ring-0 cursor-pointer accent-[#15803d]"
                  />
                </th>
                <th className="py-3 px-3">Buku & Pengidentifikasi</th>
                <th className="py-3 px-3">Penulis & Penerbit</th>
                <th className="py-3 px-3">Kategori</th>
                <th className="py-3 px-3">Tahun</th>
                <th className="py-3 px-3">Stok & Status</th>
                <th className="py-3 px-3">Lokasi Rak</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-sm">
              {paginatedBooks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#6f7a6e]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-4xl text-[#becabc]">
                        library_books
                      </span>
                      <p className="font-semibold text-[#121c2a]">
                        Tidak ada buku yang sesuai dengan kriteria filter.
                      </p>
                      <button
                        onClick={resetFilters}
                        className="text-xs text-[#00652c] font-bold hover:underline"
                      >
                        Reset Filter Pencarian
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedBooks.map((book) => {
                  const isChecked = selectedBookIds.includes(book.id);
                  const isCritical = book.status === 'Stok Kritis';
                  const isOut = book.status === 'Habis';

                  return (
                    <tr
                      key={book.id}
                      className={`hover:bg-[#eff4ff]/60 transition-colors group ${
                        isChecked ? 'bg-[#d3ffd5]/20' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectOne(book.id)}
                          className="w-4 h-4 rounded text-[#15803d] focus:ring-0 cursor-pointer accent-[#15803d]"
                        />
                      </td>

                      {/* Buku & Cover */}
                      <td className="py-3.5 px-3">
                        <div
                          onClick={() => onOpenDetailModal(book)}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <img
                            src={book.cover_image}
                            alt={book.title}
                            className="w-10 h-14 object-cover rounded-lg shadow-xs flex-shrink-0 border border-[#dee9fc] group-hover:scale-105 transition-transform"
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="font-headline font-semibold text-sm text-[#121c2a] truncate group-hover:text-[#00652c] transition-colors">
                              {book.title}
                            </span>
                            <span className="text-xs text-[#6f7a6e] font-mono truncate">
                              ISBN {book.isbn}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Penulis & Penerbit */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-col">
                          <span className="text-[#121c2a] font-medium text-xs">
                            {book.author}
                          </span>
                          <span className="text-[#6f7a6e] text-xs">
                            {book.publisher}
                          </span>
                        </div>
                      </td>

                      {/* Kategori Badge */}
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#1f6c3a] text-[11px] font-semibold border border-[#dee9fc]">
                          {book.category}
                        </span>
                      </td>

                      {/* Tahun */}
                      <td className="py-3.5 px-3 text-[#121c2a] font-mono text-xs">
                        {book.year}
                      </td>

                      {/* Stok & Status */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-semibold text-xs ${
                              isCritical
                                ? 'text-[#ba1a1a]'
                                : isOut
                                ? 'text-[#6f7a6e]'
                                : 'text-[#121c2a]'
                            }`}
                          >
                            {book.stock} Eks
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isOut
                                ? 'bg-[#dee9fc] text-[#6f7a6e]'
                                : isCritical
                                ? 'bg-[#ffdad6] text-[#ba1a1a]'
                                : 'bg-[#a4f1b2]/60 text-[#1f6c3a]'
                            }`}
                          >
                            {book.status}
                          </span>
                        </div>
                      </td>

                      {/* Lokasi Rak */}
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#121c2a] px-2 py-1 rounded bg-[#eff4ff] border border-[#dee9fc]">
                          <span className="material-symbols-outlined text-[14px] text-[#6f7a6e]">
                            shelves
                          </span>
                          {book.shelf_location}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => onOpenEditModal(book)}
                            title="Edit Data Buku"
                            type="button"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6f7a6e] hover:text-[#00652c] hover:bg-[#eff4ff] transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            onClick={() => onOpenDeleteModal(book)}
                            title="Hapus Buku"
                            type="button"
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                              isCritical
                                ? 'text-[#ba1a1a] hover:bg-[#ffdad6]'
                                : 'text-[#6f7a6e] hover:text-[#ba1a1a] hover:bg-[#ffdad6]'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                          <button
                            onClick={() => onOpenDetailModal(book)}
                            title="Detail & Barcode"
                            type="button"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6f7a6e] hover:text-[#121c2a] hover:bg-[#eff4ff] transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[18px]">more_vert</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-[#eff4ff]/60 border-t border-[#dee9fc] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#6f7a6e]">
            Menampilkan{' '}
            <span className="font-semibold text-[#121c2a]">
              {filteredBooks.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} -{' '}
              {Math.min(currentPage * itemsPerPage, filteredBooks.length)}
            </span>{' '}
            dari <span className="font-semibold text-[#121c2a]">1,420</span> buku terdaftar
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="h-9 px-3 rounded-lg bg-white text-[#6f7a6e] hover:text-[#121c2a] hover:bg-[#dee9fc] transition-colors flex items-center gap-1 disabled:opacity-50 border border-[#dee9fc] cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
              <span className="text-xs font-semibold">Sebelumnya</span>
            </button>

            <div className="flex items-center gap-1 px-1">
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                className={`w-9 h-9 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                  currentPage === 1
                    ? 'bg-[#15803d] text-white shadow-xs'
                    : 'bg-white text-[#121c2a] hover:bg-[#eff4ff] border border-[#dee9fc]'
                }`}
              >
                1
              </button>
              {totalPages >= 2 && (
                <button
                  type="button"
                  onClick={() => setCurrentPage(2)}
                  className={`w-9 h-9 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                    currentPage === 2
                      ? 'bg-[#15803d] text-white shadow-xs'
                      : 'bg-white text-[#121c2a] hover:bg-[#eff4ff] border border-[#dee9fc]'
                  }`}
                >
                  2
                </button>
              )}
              {totalPages >= 3 && (
                <button
                  type="button"
                  onClick={() => setCurrentPage(3)}
                  className={`w-9 h-9 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                    currentPage === 3
                      ? 'bg-[#15803d] text-white shadow-xs'
                      : 'bg-white text-[#121c2a] hover:bg-[#eff4ff] border border-[#dee9fc]'
                  }`}
                >
                  3
                </button>
              )}
              <span className="px-1 text-[#6f7a6e] text-xs">...</span>
              <button
                type="button"
                onClick={() => setCurrentPage(totalPages)}
                className={`w-9 h-9 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                  currentPage === totalPages
                    ? 'bg-[#15803d] text-white shadow-xs'
                    : 'bg-white text-[#121c2a] hover:bg-[#eff4ff] border border-[#dee9fc]'
                }`}
              >
                142
              </button>
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-9 px-3 rounded-lg bg-white text-[#121c2a] hover:bg-[#dee9fc] transition-colors flex items-center gap-1 border border-[#dee9fc] cursor-pointer disabled:opacity-50"
              type="button"
            >
              <span className="text-xs font-semibold">Berikutnya</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
