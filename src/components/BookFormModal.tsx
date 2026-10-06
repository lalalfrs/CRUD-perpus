import React, { useState, useEffect, useRef } from 'react';
import { Book, Category } from '../types/book';

interface BookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Book, 'id' | 'created_at' | 'updated_at' | 'status'> & { status?: Book['status'] }) => void;
  editingBook?: Book | null;
  categories: Category[];
}

const PRESET_COVERS = [
  {
    name: 'Laskar Pelangi',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBithebMUdUulLyhN5WrNVtvuyJ9pU7uDrz_Sdu0qeZvV4eFB-SRng3nMsx04M82pJz-rCXuAvwRc5lKaKIDjqHxWBOVWxbCk38sEo9Y6BSp6VBOXP7FtO26yIxzW1mqNwNYFQTEYPgDey2lQ7Vp4zCKmU-IgUBIm5Ctlh0j61D1_83bhZl3wS0TFiqa8pqhBJPj5HFG_i3BTQEsUyE7DJtWSa1oHyV0O4kMPtX8TrcINU2AMf98WLv',
  },
  {
    name: 'Filosofi Teras',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAylDzhS69C6c_wFZDHdgwm1Ypy31UFEHMxhTitS9DFZODJtje34dJmVbrMw7HQ53upC5KYfWXtzGBmv3uIQ7Kz51DKUA6sd6VnZ3LRN3e5C0gE44u-iMNjF5Z60NzFgg_9aMqZpZdpiz3fenEhI02YN71v2W-7CRI3lOKWL08iA_Zs2mM41ecOs7oKRwq9ftnFZF7yDF2zpidL9TtiRcioUFMJqQVs257UHMoQr1fe5nkgLziOjVCd',
  },
  {
    name: 'Clean Software Architecture',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFGNT3XheiIYPlqxxSefMAz_14hOzFOGeEvZmIwpfN4tZ9H6dkBFmKMPqAwTEYpm97YTdnoV9FJ7ZVP4hpUfwH8zqJh6C2NXm6x08q0H-3ur5-NQO8BzexbmgTo_aABfX3ijppIgO_GoWZd_HCZszRMlGCyTtXw8h704MJHq6OX0r4djSjSj0lBmgwQBD9xhct1bdW0_95kJOv9h9YF3dkME8kjK0dxTSGiZoeokYQIdb_xMV0lNls',
  },
  {
    name: 'Atomic Habits',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFDBQosu4lBnJao3h9KL0iR0jVaOFwYEmC4mppJPQHCrc5yxG05H0N7sBros66J5zBYOC-FiqmFuzRsw0w0mtn2VkWbZbEzFMLPJqHBGgNgCUJ8sHcrPTh71b1iv37mr64OKd5KGkoIVI63ULdQWgogSYG58Pt8rrD_rv0X4uj4VBWHzKZ0Da4AOerXjRHXWZ0qV01zEMeEj4s7PyqeEv0Jy9l7tLWfFAycKUtsRZjmVA2mV5czPu1',
  },
  {
    name: 'Bumi Manusia',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZqqlKVL33hNY6rFRjetjfYG1qs5lE-dCmLHkGL2ZXyQFniqQlIWdW5PPFQUluQso6lrPu6ZAhg-zw31qsk9XzXo09wUpas8TLbIJ5vYGphNmHzNNz6DCeGOmMYerMQRXYlPpk5KNU_FpW1T8OG0YVrcnaSZ2m2vPuTM9YH9RgX_JL6QNEc_hUWY1sZL9sUg406IkCKE_tnIU1E6ZP_5upRnBwti4aswu8xVZuGAA_W_HIZQmUE2Cg',
  },
  {
    name: 'Pengantar Sistem Informasi',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxr25631MOraMM8EMu_28k2aE-tBREKbSeKlIUQ_eyQCKe2DTdZ-W2ArJ6C88Cb0hpxz83NVHq8F_ZC2yTxH0xp_5R3B7UH_Eoo5pH33k4zOyYUlNt-pmtwnMiI7sA7GJD8amOOvcnSV7KjewEx-wxvjnMFlnu4BabdZvksKY0rJ4E9JmwDjH7VgDENOUscnRpxVPaIsmnTjWsEGlhsX29kO9TErb2ZFdS4dtOW3wtfq7nhkc4VL-9',
  },
  {
    name: 'Madilog',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoOouWuo0xDp-J5kjSvEDPcThEmXZp9bBc_uJ6UEWcleF7oK4bKVZq7LFVH7eYZZleJLZ2h4-s5Et248CLV1z8OQdJFm53AyoovZAgD7ta5Bz2dS_Ky42eBuD54r23bBrIZo0GzjZvCn7LiLcyUj2Ahmzis3SyG_h2bwo3ezfPvo9liqsmtfmjTOzwvWlwLtrIGBCXp3ctHdy7mz35eGsa5hUogofs34DcVcAIHKLxcdaJjmBNSxpH',
  },
];

export const BookFormModal: React.FC<BookFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingBook,
  categories,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [isbn, setIsbn] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [category, setCategory] = useState('Self Improvement');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [stock, setStock] = useState<number>(10);
  const [totalCopies, setTotalCopies] = useState<number>(10);
  const [shelfLocation, setShelfLocation] = useState('Rak A-01');
  const [coverImage, setCoverImage] = useState(PRESET_COVERS[0].url);
  const [description, setDescription] = useState('');
  const [imageSizeKb, setImageSizeKb] = useState(50);
  const [uploadMode, setUploadMode] = useState<'preset' | 'file' | 'url'>('preset');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingBook) {
      setTitle(editingBook.title);
      setSubtitle(editingBook.subtitle || '');
      setIsbn(editingBook.isbn);
      setAuthor(editingBook.author);
      setPublisher(editingBook.publisher);
      setCategory(editingBook.category);
      setYear(editingBook.year);
      setStock(editingBook.stock);
      setTotalCopies(editingBook.total_copies || editingBook.stock);
      setShelfLocation(editingBook.shelf_location);
      setCoverImage(editingBook.cover_image);
      setDescription(editingBook.description || '');
      setImageSizeKb(editingBook.file_size_kb || 50);
    } else {
      setTitle('');
      setSubtitle('');
      setIsbn(`978-602-${Math.floor(10 + Math.random() * 89)}-${Math.floor(1000 + Math.random() * 8999)}-${Math.floor(1 + Math.random() * 9)}`);
      setAuthor('');
      setPublisher('');
      setCategory('Self Improvement');
      setYear(2024);
      setStock(12);
      setTotalCopies(12);
      setShelfLocation('Rak A-12');
      setCoverImage(PRESET_COVERS[0].url);
      setDescription('');
      setImageSizeKb(65);
    }
  }, [editingBook, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeKb = Math.round(file.size / 1024);
      setImageSizeKb(sizeKb);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCoverImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const generateRandomIsbn = () => {
    const prefix = '978';
    const reg = Math.floor(600 + Math.random() * 300);
    const pub = Math.floor(10 + Math.random() * 89);
    const titleNum = Math.floor(1000 + Math.random() * 8999);
    const check = Math.floor(1 + Math.random() * 9);
    setIsbn(`${prefix}-${reg}-${pub}-${titleNum}-${check}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !isbn.trim() || !author.trim()) return;

    onSubmit({
      title: title.trim(),
      subtitle: subtitle.trim(),
      isbn: isbn.trim(),
      author: author.trim(),
      publisher: publisher.trim(),
      category,
      year: Number(year),
      stock: Number(stock),
      total_copies: Number(totalCopies),
      shelf_location: shelfLocation.trim(),
      cover_image: coverImage,
      image_storage_path: `books/cover_${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}.webp`,
      file_size_kb: imageSizeKb,
      description: description.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121c2a]/50 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#d9e3f6] my-8 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#eff4ff] border-b border-[#dee9fc] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#15803d] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">
                {editingBook ? 'edit_note' : 'add_box'}
              </span>
            </div>
            <div>
              <h3 className="font-headline text-lg font-bold text-[#121c2a]">
                {editingBook ? 'Edit Data Buku & Aset Cover' : 'Tambah Buku Baru ke Katalog'}
              </h3>
              <p className="text-xs text-[#6f7a6e]">
                Formulir terintegrasi model Eloquent dengan upload file cover dinamis ke MySQL
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6f7a6e] hover:text-[#121c2a] hover:bg-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Dynamic Image Asset Upload */}
          <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#dee9fc]">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-[#121c2a] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#00652c]">image</span>
                Aset Cover Gambar Buku (Laravel Storage Disk)
              </label>
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-[#d9e3f6]">
                <button
                  type="button"
                  onClick={() => setUploadMode('preset')}
                  className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                    uploadMode === 'preset' ? 'bg-[#15803d] text-white' : 'text-[#6f7a6e]'
                  }`}
                >
                  Pilihan Gambar
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('file')}
                  className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                    uploadMode === 'file' ? 'bg-[#15803d] text-white' : 'text-[#6f7a6e]'
                  }`}
                >
                  Unggah File
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                    uploadMode === 'url' ? 'bg-[#15803d] text-white' : 'text-[#6f7a6e]'
                  }`}
                >
                  URL Link
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* Preview Box */}
              <div className="w-24 h-32 rounded-lg bg-white border-2 border-dashed border-[#15803d] flex-shrink-0 overflow-hidden relative shadow-sm group">
                <img
                  src={coverImage}
                  alt="Cover Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] text-center p-1">
                  Cover Aktif ({imageSizeKb} KB)
                </div>
              </div>

              {/* Upload Controls */}
              <div className="flex-1 w-full space-y-2">
                {uploadMode === 'preset' && (
                  <div>
                    <span className="text-[11px] text-[#6f7a6e] block mb-1.5 font-medium">
                      Pilih dari cover buku terdaftar:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {PRESET_COVERS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => setCoverImage(preset.url)}
                          className={`flex items-center gap-2 p-1.5 rounded-lg border text-left transition-all ${
                            coverImage === preset.url
                              ? 'border-[#15803d] bg-[#d3ffd5]/30'
                              : 'border-[#dee9fc] bg-white hover:bg-[#eff4ff]'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-6 h-8 object-cover rounded shadow-2xs flex-shrink-0"
                          />
                          <span className="text-[11px] font-semibold text-[#121c2a] truncate">
                            {preset.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {uploadMode === 'file' && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#becabc] hover:border-[#15803d] bg-white rounded-xl p-4 text-center cursor-pointer transition-colors"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <span className="material-symbols-outlined text-[28px] text-[#15803d] block mb-1">
                      cloud_upload
                    </span>
                    <p className="text-xs font-semibold text-[#121c2a]">
                      Klik atau seret gambar cover ke sini
                    </p>
                    <p className="text-[10px] text-[#6f7a6e] mt-0.5">
                      Mendukung PNG, JPEG, WEBP (Otomatis disimpan via Eloquent)
                    </p>
                  </div>
                )}

                {uploadMode === 'url' && (
                  <div>
                    <label className="text-[11px] font-medium text-[#6f7a6e] block mb-1">
                      Alamat URL Gambar Cover:
                    </label>
                    <input
                      type="url"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="https://domain.com/path-ke-cover.jpg"
                      className="w-full h-9 px-3 rounded-lg bg-white border border-[#dee9fc] text-xs text-[#121c2a] focus:outline-none focus:border-[#15803d]"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 text-[10px] text-[#6f7a6e] bg-[#eff4ff] px-2.5 py-1 rounded-lg">
                  <span className="material-symbols-outlined text-[13px] text-[#00652c]">
                    folder_shared
                  </span>
                  <span>
                    Path Eloquent Storage:{' '}
                    <code className="text-[#00652c] font-semibold font-mono">
                      storage/app/public/books/cover_
                      {title ? title.slice(0, 10).toLowerCase().replace(/\s+/g, '_') : 'sample'}
                      .webp
                    </code>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Metadata Buku */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#121c2a] mb-1">
                Judul Buku <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Atomic Habits"
                className="w-full h-10 px-3 rounded-xl bg-white border border-[#dee9fc] text-sm text-[#121c2a] focus:outline-none focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#121c2a] mb-1">
                Subjudul / Tagline
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Contoh: The Rainbow Troops"
                className="w-full h-10 px-3 rounded-xl bg-white border border-[#dee9fc] text-sm text-[#121c2a] focus:outline-none focus:border-[#15803d]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#121c2a]">
                  ISBN <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={generateRandomIsbn}
                  className="text-[11px] text-[#00652c] hover:underline font-semibold flex items-center gap-0.5"
                >
                  <span className="material-symbols-outlined text-[13px]">refresh</span>
                  Acak ISBN
                </button>
              </div>
              <input
                type="text"
                required
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="978-602-03-8591-4"
                className="w-full h-10 px-3 rounded-xl bg-white border border-[#dee9fc] text-sm font-mono text-[#121c2a] focus:outline-none focus:border-[#15803d]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#121c2a] mb-1">
                Penulis (Author) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Contoh: Andrea Hirata"
                className="w-full h-10 px-3 rounded-xl bg-white border border-[#dee9fc] text-sm text-[#121c2a] focus:outline-none focus:border-[#15803d]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#121c2a] mb-1">
                Penerbit (Publisher) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                placeholder="Contoh: Gramedia Pustaka Utama"
                className="w-full h-10 px-3 rounded-xl bg-white border border-[#dee9fc] text-sm text-[#121c2a] focus:outline-none focus:border-[#15803d]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#121c2a] mb-1">
                Kategori Koleksi <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-white border border-[#dee9fc] text-sm text-[#121c2a] focus:outline-none focus:border-[#15803d] cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.ddc_code})
                  </option>
                ))}
                <option value="Teknologi">Teknologi</option>
                <option value="Fiksi">Fiksi</option>
                <option value="Fiksi Sastra">Fiksi Sastra</option>
                <option value="Filsafat & Sejarah">Filsafat & Sejarah</option>
                <option value="Referensi">Referensi</option>
              </select>
            </div>
          </div>

          {/* Section 3: Stok Fisik & Lokasi Rak */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#eff4ff] rounded-xl border border-[#dee9fc]">
            <div>
              <label className="block text-xs font-bold text-[#121c2a] mb-1">
                Tahun Terbit
              </label>
              <input
                type="number"
                min="1900"
                max={new Date().getFullYear() + 1}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full h-9 px-3 rounded-lg bg-white border border-[#dee9fc] text-sm text-[#121c2a] focus:outline-none focus:border-[#15803d]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#121c2a] mb-1">
                Stok Fisik Tersedia
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setStock(val);
                  if (val > totalCopies) setTotalCopies(val);
                }}
                className="w-full h-9 px-3 rounded-lg bg-white border border-[#dee9fc] text-sm text-[#121c2a] focus:outline-none focus:border-[#15803d]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#121c2a] mb-1">
                Lokasi Penempatan Rak
              </label>
              <input
                type="text"
                value={shelfLocation}
                onChange={(e) => setShelfLocation(e.target.value)}
                placeholder="Rak A-12, Rak B-08, Rak C-01"
                className="w-full h-9 px-3 rounded-lg bg-white border border-[#dee9fc] text-sm text-[#121c2a] focus:outline-none focus:border-[#15803d]"
              />
            </div>
          </div>

          {/* Section 4: Deskripsi Sinopsis */}
          <div>
            <label className="block text-xs font-bold text-[#121c2a] mb-1">
              Sinopsis & Catatan Pustakawan
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ringkasan isi buku, kondisi fisik, atau catatan sirkulasi khusus..."
              className="w-full p-3 rounded-xl bg-white border border-[#dee9fc] text-sm text-[#121c2a] focus:outline-none focus:border-[#15803d]"
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#eff4ff] border-t border-[#dee9fc] flex items-center justify-between">
          <div className="text-[11px] text-[#6f7a6e] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#00652c]">bolt</span>
            <span>Otomatis diindeks ke tabel MySQL & Eloquent ORM</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white text-[#121c2a] text-xs font-semibold hover:bg-[#e6eeff] transition-colors border border-[#dee9fc]"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 rounded-xl bg-[#15803d] hover:bg-[#00652c] text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>{editingBook ? 'Simpan Perubahan' : 'Tambahkan ke Katalog'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
