import React, { useState } from 'react';
import { LARAVEL_PROJECT_FILES, LaravelFile } from '../services/laravelTemplates';
import { Book } from '../types/book';

interface LaravelStudioViewProps {
  books: Book[];
  onExportSql: () => void;
}

export const LaravelStudioView: React.FC<LaravelStudioViewProps> = ({ books, onExportSql }) => {
  const [selectedFile, setSelectedFile] = useState<LaravelFile>(LARAVEL_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState('critical_stock');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [generatedSql, setGeneratedSql] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([selectedFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.path.split('/').pop() || 'laravel_file.php';
    link.click();
    URL.revokeObjectURL(url);
  };

  const executeEloquentQuery = (queryType: string) => {
    setSelectedQuery(queryType);
    if (queryType === 'critical_stock') {
      const res = books.filter((b) => b.stock <= 3 && b.stock > 0);
      setGeneratedSql("SELECT * FROM `books` WHERE `stock` > 0 AND `stock` <= 3 ORDER BY `id` DESC;");
      setQueryResult(res.map((b) => ({ id: b.id, title: b.title, stock: b.stock, cover: b.image_storage_path })));
    } else if (queryType === 'latest_paginate') {
      const res = books.slice(0, 5);
      setGeneratedSql("SELECT * FROM `books` ORDER BY `updated_at` DESC LIMIT 5 OFFSET 0;");
      setQueryResult({
        current_page: 1,
        per_page: 5,
        total: books.length,
        data: res.map((b) => ({ id: b.id, title: b.title, author: b.author, category: b.category, stock: b.stock })),
      });
    } else if (queryType === 'category_group') {
      const summary: Record<string, number> = {};
      books.forEach((b) => {
        summary[b.category] = (summary[b.category] || 0) + b.stock;
      });
      setGeneratedSql("SELECT `category`, SUM(`stock`) as `total_stock` FROM `books` GROUP BY `category`;");
      setQueryResult(summary);
    } else if (queryType === 'image_storage') {
      setGeneratedSql("SELECT `id`, `title`, `cover_image`, `file_size_kb` FROM `books` WHERE `cover_image` IS NOT NULL;");
      setQueryResult(books.map((b) => ({
        id: b.id,
        title: b.title,
        storage_path: b.image_storage_path,
        full_url: b.cover_image.startsWith('http') ? b.cover_image : `/storage/${b.image_storage_path}`,
        size_kb: b.file_size_kb || 50,
      })));
    }
  };

  // Run initial query
  React.useEffect(() => {
    executeEloquentQuery('critical_stock');
  }, [books]);

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6 bg-gradient-to-r from-[#121c2a] to-[#1f2937] rounded-2xl text-white shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#15803d] text-white text-[11px] font-bold uppercase tracking-wider">
              Laravel 11 + Blade + Eloquent ORM
            </span>
            <span className="text-xs text-[#dee9fc]/70 font-mono">MySQL 8.0 Engine</span>
          </div>
          <h1 className="font-headline text-2xl font-bold tracking-tight">
            Arsitektur Kode & Pengelolaan Aset Gambar Dinamis
          </h1>
          <p className="text-xs text-[#dee9fc]/80 mt-1 max-w-2xl leading-relaxed">
            Implementasi model Eloquent dengan Accessor, Mutator, storage symlink (<code className="text-[#a4f1b2]">php artisan storage:link</code>), dan template view Blade 1-ke-1 sesuai desain tampilan aplikasi Athenaeum.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onExportSql}
            className="px-4 py-2 bg-[#15803d] hover:bg-[#00652c] text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">database</span>
            <span>Download SQL Dump</span>
          </button>
          <button
            onClick={handleDownloadFile}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Unduh File Ini</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Code File Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: File Navigator */}
        <div className="lg:col-span-4 bg-white rounded-xl p-4 shadow-xs border border-[#e6eeff]">
          <span className="text-xs font-bold text-[#6f7a6e] uppercase tracking-wider block mb-3 px-1">
            Struktur Berkas Proyek Laravel
          </span>
          <div className="space-y-1.5">
            {LARAVEL_PROJECT_FILES.map((file) => {
              const isActive = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  type="button"
                  onClick={() => setSelectedFile(file)}
                  className={`w-full p-2.5 rounded-xl text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                    isActive
                      ? 'bg-[#15803d] text-white shadow-xs font-semibold'
                      : 'hover:bg-[#eff4ff] text-[#121c2a] border border-transparent hover:border-[#dee9fc]'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] mt-0.5 ${
                      isActive ? 'text-white' : 'text-[#00652c]'
                    }`}
                  >
                    {file.language === 'blade'
                      ? 'html'
                      : file.language === 'php'
                      ? 'php'
                      : 'database'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs truncate">{file.name}</div>
                    <div
                      className={`text-[10px] truncate ${
                        isActive ? 'text-white/80' : 'text-[#6f7a6e]'
                      }`}
                    >
                      {file.path}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Eloquent Image Asset Architecture Card */}
          <div className="mt-6 p-4 rounded-xl bg-[#eff4ff] border border-[#dee9fc]">
            <h4 className="font-headline font-bold text-xs text-[#00652c] flex items-center gap-1.5 mb-2">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              Penerapan Eloquent pada Gambar
            </h4>
            <ul className="text-[11px] text-[#3f493f] space-y-2 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-[#00652c] font-bold">•</span>
                <span>
                  <strong>Dynamic Accessor:</strong> Method <code className="bg-white px-1 rounded text-[#00652c]">coverImageUrl()</code> otomatis meresolusi storage URL lokal atau CDN.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#00652c] font-bold">•</span>
                <span>
                  <strong>Model Deleting Hook:</strong> Menghapus file fisik di <code className="bg-white px-1 rounded text-[#00652c]">storage/app/public/books</code> saat record dihapus.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#00652c] font-bold">•</span>
                <span>
                  <strong>Optimasi MySQL:</strong> Hanya menyimpan relative path string &lt; 500 karakter di database.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Code Viewer & Query Sandbox */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Code Viewer */}
          <div className="bg-[#121c2a] rounded-xl shadow-md overflow-hidden border border-[#27313f]">
            {/* Viewer Header */}
            <div className="px-4 py-3 bg-[#1e293b] border-b border-[#334155] flex items-center justify-between">
              <div className="flex items-center gap-2 text-white text-xs">
                <span className="font-mono text-[#a4f1b2] font-semibold">{selectedFile.path}</span>
                <span className="text-white/40">|</span>
                <span className="text-white/70 text-[11px]">{selectedFile.description}</span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
                <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
              </button>
            </div>

            {/* Code Content */}
            <div className="p-4 overflow-x-auto max-h-[460px] text-xs font-mono leading-relaxed text-[#f8f9ff]">
              <pre>{selectedFile.content}</pre>
            </div>
          </div>

          {/* Interactive Eloquent Query Sandbox */}
          <div className="bg-white rounded-xl p-6 shadow-xs border border-[#e6eeff]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#eff4ff]">
              <div>
                <h3 className="font-headline text-lg font-bold text-[#121c2a]">
                  Uji Coba Eloquent ORM & Output Query MySQL
                </h3>
                <p className="text-xs text-[#6f7a6e]">
                  Jalankan kueri model Eloquent secara langsung terhadap data buku yang ada di memori.
                </p>
              </div>
            </div>

            {/* Query buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                type="button"
                onClick={() => executeEloquentQuery('critical_stock')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                  selectedQuery === 'critical_stock'
                    ? 'bg-[#15803d] text-white shadow-xs'
                    : 'bg-[#eff4ff] text-[#121c2a] hover:bg-[#dee9fc]'
                }`}
              >
                Book::criticalStock()-&gt;get()
              </button>
              <button
                type="button"
                onClick={() => executeEloquentQuery('latest_paginate')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                  selectedQuery === 'latest_paginate'
                    ? 'bg-[#15803d] text-white shadow-xs'
                    : 'bg-[#eff4ff] text-[#121c2a] hover:bg-[#dee9fc]'
                }`}
              >
                Book::latest()-&gt;paginate(5)
              </button>
              <button
                type="button"
                onClick={() => executeEloquentQuery('category_group')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                  selectedQuery === 'category_group'
                    ? 'bg-[#15803d] text-white shadow-xs'
                    : 'bg-[#eff4ff] text-[#121c2a] hover:bg-[#dee9fc]'
                }`}
              >
                Book::groupBy('category')
              </button>
              <button
                type="button"
                onClick={() => executeEloquentQuery('image_storage')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                  selectedQuery === 'image_storage'
                    ? 'bg-[#15803d] text-white shadow-xs'
                    : 'bg-[#eff4ff] text-[#121c2a] hover:bg-[#dee9fc]'
                }`}
              >
                Aset Gambar &amp; Storage Disk
              </button>
            </div>

            {/* Generated SQL */}
            <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#dee9fc] mb-3 font-mono text-xs text-[#00652c]">
              <div className="text-[10px] text-[#6f7a6e] uppercase tracking-wider font-bold mb-0.5">
                Raw MySQL Query Dihasilkan:
              </div>
              <div className="font-semibold">{generatedSql}</div>
            </div>

            {/* JSON Output */}
            <div className="bg-[#121c2a] text-[#d3ffd5] p-4 rounded-xl text-xs font-mono max-h-56 overflow-y-auto">
              <pre>{JSON.stringify(queryResult, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
