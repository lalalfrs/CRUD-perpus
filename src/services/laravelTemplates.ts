export interface LaravelFile {
  path: string;
  name: string;
  language: 'php' | 'blade' | 'sql';
  description: string;
  content: string;
}

export const LARAVEL_PROJECT_FILES: LaravelFile[] = [
  {
    path: 'app/Models/Book.php',
    name: 'Book.php (Eloquent Model)',
    language: 'php',
    description: 'Model Eloquent untuk entitas Buku dengan accessor gambar, relasi kategori, dan query scopes.',
    content: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Casts\\Attribute;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Illuminate\\Support\\Facades\\Storage;

class Book extends Model
{
    use HasFactory;

    /**
     * Nama tabel MySQL terkait.
     */
    protected $table = 'books';

    /**
     * Atribut yang dapat diisi secara massal (Mass Assignment).
     */
    protected $fillable = [
        'title',
        'subtitle',
        'isbn',
        'author',
        'publisher',
        'category_id',
        'category',
        'year',
        'stock',
        'total_copies',
        'shelf_location',
        'status',
        'cover_image',
        'file_size_kb',
        'description',
    ];

    /**
     * Konversi tipe data otomatis (Casting).
     */
    protected $casts = [
        'year' => 'integer',
        'stock' => 'integer',
        'total_copies' => 'integer',
        'file_size_kb' => 'integer',
    ];

    /**
     * Accessor untuk mendapatkan URL penuh file cover gambar secara dinamis.
     * Mengakses storage symlink (/storage/books/xxx.webp) atau fallback jika URL eksternal.
     */
    protected function coverImageUrl(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (empty($this->cover_image)) {
                    return asset('images/default-book-cover.png');
                }

                // Jika sudah berupa URL eksternal CDN / Cloud Storage
                if (str_starts_with($this->cover_image, 'http')) {
                    return $this->cover_image;
                }

                // Path relatif pada storage public Laravel (storage/app/public/books/...)
                return Storage::disk('public')->url($this->cover_image);
            }
        );
    }

    /**
     * Mutator & observer hook untuk membersihkan file fisik saat buku dihapus.
     */
    protected static function booted()
    {
        static::deleting(function (Book $book) {
            if ($book->cover_image && !str_starts_with($book->cover_image, 'http')) {
                Storage::disk('public')->delete($book->cover_image);
            }
        });
    }

    /**
     * Relasi Eloquent Many-to-One dengan Kategori.
     */
    public function categoryRelation(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    /**
     * Local Scope: Filter buku dengan stok kritis (< 3 eksemplar).
     */
    public function scopeCriticalStock($query)
    {
        return $query->where('stock', '>', 0)->where('stock', '<=', 3);
    }

    /**
     * Local Scope: Filter buku yang habis.
     */
    public function scopeOutOfStock($query)
    {
        return $query->where('stock', '<=', 0);
    }

    /**
     * Local Scope: Pencarian dinamis berdasarkan judul, penulis, atau ISBN.
     */
    public function scopeSearch($query, ?string $term)
    {
        if (empty($term)) {
            return $query;
        }

        return $query->where(function ($q) use ($term) {
            $q->where('title', 'like', "%{$term}%")
              ->orWhere('author', 'like', "%{$term}%")
              ->orWhere('isbn', 'like', "%{$term}%")
              ->orWhere('shelf_location', 'like', "%{$term}%");
        });
    }
}
`,
  },
  {
    path: 'app/Http/Controllers/BookController.php',
    name: 'BookController.php (CRUD & Upload)',
    language: 'php',
    description: 'Controller Laravel menangani listing katalog, pencarian, validasi upload file cover buku, dan Eloquent CRUD.',
    content: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Book;
use App\\Models\\Category;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Storage;
use Illuminate\\Support\\Str;

class BookController extends Controller
{
    /**
     * Menampilkan katalog dan manajemen buku dengan paginasi & filter.
     */
    public function index(Request $request)
    {
        $query = Book::query();

        // 1. Pencarian teks
        if ($search = $request->input('search')) {
            $query->search($search);
        }

        // 2. Filter Kategori
        if ($category = $request->input('category')) {
            if ($category !== 'Semua Kategori') {
                $query->where('category', $category);
            }
        }

        // 3. Filter Status Stok
        if ($status = $request->input('status')) {
            if ($status === 'Tersedia') {
                $query->where('stock', '>', 3);
            } elseif ($status === 'Stok Kritis') {
                $query->scopeCriticalStock();
            } elseif ($status === 'Habis / Kosong' || $status === 'Habis') {
                $query->scopeOutOfStock();
            }
        }

        // 4. Pengurutan
        $sort = $request->input('sort', 'latest');
        switch ($sort) {
            case 'title_asc':
                $query->orderBy('title', 'asc');
                break;
            case 'title_desc':
                $query->orderBy('title', 'desc');
                break;
            case 'stock_desc':
                $query->orderBy('stock', 'desc');
                break;
            case 'year_desc':
                $query->orderBy('year', 'desc');
                break;
            default:
                $query->orderBy('updated_at', 'desc');
                break;
        }

        // Paginasi Eloquent (7 buku per halaman sesuai mockup)
        $books = $query->paginate(7)->withQueryString();

        // Data statistik agregasi untuk cards
        $stats = [
            'total_titles' => Book::count(),
            'total_stock'  => Book::sum('stock'),
            'critical'     => Book::criticalStock()->count(),
            'categories'   => Category::count(),
        ];

        return view('books.index', compact('books', 'stats'));
    }

    /**
     * Menyimpan data buku baru beserta file cover gambar ke MySQL & Storage disk.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'subtitle'       => 'nullable|string|max:255',
            'isbn'           => 'required|string|unique:books,isbn|max:50',
            'author'         => 'required|string|max:255',
            'publisher'      => 'required|string|max:255',
            'category'       => 'required|string|max:100',
            'year'           => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'stock'          => 'required|integer|min:0',
            'shelf_location' => 'required|string|max:50',
            'description'    => 'nullable|string',
            'cover_image'    => 'nullable|image|mimes:jpeg,png,webp,jpg|max:5120', // Maksimal 5MB
        ]);

        // Upload dan simpan file gambar cover ke public disk Laravel
        if ($request->hasFile('cover_image')) {
            $file = $request->file('cover_image');
            $filename = 'cover_' . Str::slug($validated['title']) . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('books', $filename, 'public');
            $validated['cover_image'] = $path;
            $validated['file_size_kb'] = round($file->getSize() / 1024);
        }

        // Set status stok otomatis
        $validated['total_copies'] = $validated['stock'];
        $validated['status'] = $validated['stock'] == 0 ? 'Habis' : ($validated['stock'] <= 3 ? 'Stok Kritis' : 'Tersedia');

        // Simpan via Eloquent ORM
        $book = Book::create($validated);

        return redirect()->route('books.index')
            ->with('success', "Buku “{$book->title}” berhasil disimpan ke dalam basis data katalog.");
    }

    /**
     * Memperbarui data buku dan mengganti gambar cover jika diunggah baru.
     */
    public function update(Request $request, Book $book)
    {
        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'isbn'           => 'required|string|max:50|unique:books,isbn,' . $book->id,
            'author'         => 'required|string|max:255',
            'publisher'      => 'required|string|max:255',
            'category'       => 'required|string|max:100',
            'year'           => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'stock'          => 'required|integer|min:0',
            'shelf_location' => 'required|string|max:50',
            'cover_image'    => 'nullable|image|mimes:jpeg,png,webp,jpg|max:5120',
        ]);

        if ($request->hasFile('cover_image')) {
            // Hapus file lama jika ada dan bukan link CDN
            if ($book->cover_image && !str_starts_with($book->cover_image, 'http')) {
                Storage::disk('public')->delete($book->cover_image);
            }

            $file = $request->file('cover_image');
            $filename = 'cover_' . Str::slug($validated['title']) . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('books', $filename, 'public');
            $validated['cover_image'] = $path;
            $validated['file_size_kb'] = round($file->getSize() / 1024);
        }

        $validated['status'] = $validated['stock'] == 0 ? 'Habis' : ($validated['stock'] <= 3 ? 'Stok Kritis' : 'Tersedia');

        $book->update($validated);

        return redirect()->route('books.index')
            ->with('success', "Buku “{$book->title}” berhasil diperbarui dalam basis data katalog.");
    }

    /**
     * Menghapus buku dan asset gambar cover terkait dari server.
     */
    public function destroy(Book $book)
    {
        $title = $book->title;
        $book->delete(); // File gambar otomatis dibersihkan lewat Model booted deleting hook

        return redirect()->route('books.index')
            ->with('success', "Buku “{$title}” dan seluruh relasi arsip telah berhasil dihapus.");
    }
}
`,
  },
  {
    path: 'database/migrations/2024_10_24_create_books_table.php',
    name: '2024_10_24_create_books_table.php',
    language: 'php',
    description: 'Migrasi database MySQL untuk tabel books dengan indexed foreign keys dan tipe enum.',
    content: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    /**
     * Jalankan migrasi schema tabel ke MySQL.
     */
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->string('isbn', 50)->unique();
            $table->string('author');
            $table->string('publisher');
            $table->string('category', 100)->index();
            $table->unsignedSmallInteger('year');
            $table->unsignedInteger('stock')->default(0);
            $table->unsignedInteger('total_copies')->default(1);
            $table->string('shelf_location', 50);
            $table->enum('status', ['Tersedia', 'Stok Kritis', 'Habis'])->default('Tersedia')->index();
            $table->string('cover_image', 500)->nullable();
            $table->unsignedInteger('file_size_kb')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();

            // Indeks gabungan untuk optimasi pencarian katalog berkecepatan tinggi
            $table->index(['title', 'author', 'isbn']);
        });
    }

    /**
     * Batalkan migrasi (Rollback).
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
`,
  },
  {
    path: 'resources/views/books/index.blade.php',
    name: 'index.blade.php (Katalog & Manajemen)',
    language: 'blade',
    description: 'Tampilan Blade untuk Katalog & Manajemen Buku lengkap dengan tabel data, filter, dan modal hapus.',
    content: `@extends('layouts.app')

@section('title', 'Katalog & Manajemen Buku - Athenaeum')

@section('content')
<div class="flex flex-col w-full">
    {{-- Toast Notifikasi Sukses --}}
    @if(session('success'))
    <div class="w-full mb-space-md bg-secondary-container/40 rounded-xl p-space-sm flex items-center justify-between shadow-sm" id="toast-banner">
        <div class="flex items-center gap-space-sm">
            <div class="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-on-primary">
                <span class="material-symbols-outlined text-[18px]">check</span>
            </div>
            <div class="flex items-center gap-space-xs">
                <span class="font-headline-sm text-headline-sm text-on-surface">Pembaruan Sukses:</span>
                <span class="font-body-md text-body-md text-on-surface-variant">{{ session('success') }}</span>
            </div>
        </div>
        <button class="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container transition-colors" onclick="document.getElementById('toast-banner').remove()" type="button">
            <span class="material-symbols-outlined text-[18px]">close</span>
        </button>
    </div>
    @endif

    {{-- Header Halaman & Tombol Aksi --}}
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md mb-space-lg">
        <div class="flex flex-col gap-1">
            <div class="flex items-center gap-space-xs text-outline font-label-sm text-label-sm uppercase tracking-wider">
                <span>Perpustakaan</span>
                <span class="material-symbols-outlined text-[14px]">chevron_right</span>
                <span class="text-primary font-bold">Manajemen Buku</span>
            </div>
            <div class="flex items-center gap-space-sm flex-wrap">
                <h1 class="font-headline-xl text-headline-xl text-on-surface tracking-tight">Katalog & Manajemen Buku</h1>
                <span class="inline-flex items-center px-2.5 py-1 rounded-full bg-surface-container-high text-primary font-label-md text-label-md">
                    Total {{ number_format($books->total()) }} Buku
                </span>
            </div>
            <p class="font-body-sm text-body-sm text-outline">Kelola metadata sirkulasi, ketersediaan fisik di rak, dan inventaris pustaka pusat.</p>
        </div>
        <div class="flex items-center gap-space-sm">
            <a href="{{ route('books.export.csv') }}" class="inline-flex items-center gap-space-xs px-3.5 py-2 rounded-xl bg-surface-container-lowest text-on-surface font-label-md text-label-md shadow-sm hover:bg-surface-container-low transition-colors">
                <span class="material-symbols-outlined text-[18px] text-outline">file_download</span>
                <span>Export CSV/Excel</span>
            </a>
            <button onclick="openCreateModal()" class="inline-flex items-center gap-space-xs px-4 py-2 rounded-xl bg-primary-container text-on-primary font-headline-sm text-headline-sm shadow-md hover:bg-primary transition-all">
                <span class="material-symbols-outlined text-[20px]">add</span>
                <span>+ Tambah Buku Baru</span>
            </button>
        </div>
    </div>

    {{-- Widget Statistik --}}
    <div class="grid grid-cols-1 md:grid-cols-4 gap-space-md mb-space-lg">
        <div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-center justify-between">
            <div class="flex flex-col">
                <span class="font-label-sm text-label-sm text-outline uppercase tracking-wider">Koleksi Terpasang</span>
                <span class="font-headline-lg text-headline-lg text-on-surface mt-1">{{ number_format($stats['total_titles']) }}</span>
                <span class="font-body-sm text-body-sm text-primary flex items-center gap-0.5 mt-0.5">
                    <span class="material-symbols-outlined text-[14px]">trending_up</span> +14 pekan ini
                </span>
            </div>
            <div class="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                <span class="material-symbols-outlined text-[22px]">auto_stories</span>
            </div>
        </div>
        {{-- ... stat cards ... --}}
    </div>

    {{-- Tabel Katalog Buku --}}
    <div class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden mb-space-md">
        <div class="overflow-x-auto">
            <table class="w-full text-left">
                <thead>
                    <tr class="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider">
                        <th class="py-3 px-space-md w-12 text-center"><input type="checkbox" class="w-4 h-4 rounded text-primary-container"></th>
                        <th class="py-3 px-space-sm">Buku & Pengidentifikasi</th>
                        <th class="py-3 px-space-sm">Penulis & Penerbit</th>
                        <th class="py-3 px-space-sm">Kategori</th>
                        <th class="py-3 px-space-sm">Tahun</th>
                        <th class="py-3 px-space-sm">Stok & Status</th>
                        <th class="py-3 px-space-sm">Lokasi Rak</th>
                        <th class="py-3 px-space-md text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-none font-table-data text-table-data">
                    @forelse($books as $book)
                    <tr class="hover:bg-surface-container-low/70 transition-colors group">
                        <td class="py-3.5 px-space-md text-center"><input type="checkbox" value="{{ $book->id }}" class="w-4 h-4 rounded"></td>
                        <td class="py-3.5 px-space-sm">
                            <div class="flex items-center gap-space-sm">
                                <img src="{{ $book->cover_image_url }}" alt="{{ $book->title }}" class="w-10 h-14 object-cover rounded-lg shadow-sm flex-shrink-0" />
                                <div class="flex flex-col min-w-0">
                                    <span class="font-headline-sm text-headline-sm text-on-surface truncate group-hover:text-primary transition-colors">{{ $book->title }}</span>
                                    <span class="font-body-sm text-body-sm text-outline truncate">ISBN {{ $book->isbn }}</span>
                                </div>
                            </div>
                        </td>
                        <td class="py-3.5 px-space-sm">
                            <div class="flex flex-col">
                                <span class="text-on-surface font-medium">{{ $book->author }}</span>
                                <span class="text-outline text-body-sm">{{ $book->publisher }}</span>
                            </div>
                        </td>
                        <td class="py-3.5 px-space-sm">
                            <span class="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-container/60 text-on-secondary-container font-label-sm text-label-sm">{{ $book->category }}</span>
                        </td>
                        <td class="py-3.5 px-space-sm text-on-surface">{{ $book->year }}</td>
                        <td class="py-3.5 px-space-sm">
                            <div class="flex items-center gap-space-xs">
                                <span class="font-medium {{ $book->stock <= 3 ? 'text-error' : 'text-on-surface' }}">{{ $book->stock }} Eks</span>
                                <span class="inline-flex items-center px-2 py-0.5 rounded-full {{ $book->stock == 0 ? 'bg-surface-container text-outline' : ($book->stock <= 3 ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container') }} font-label-sm text-label-sm">{{ $book->status }}</span>
                            </div>
                        </td>
                        <td class="py-3.5 px-space-sm">
                            <span class="inline-flex items-center gap-1 font-label-md text-label-md text-on-surface px-2 py-1 rounded bg-surface-container">
                                <span class="material-symbols-outlined text-[14px] text-outline">shelves</span> {{ $book->shelf_location }}
                            </span>
                        </td>
                        <td class="py-3.5 px-space-md text-right">
                            <div class="inline-flex items-center gap-1">
                                <button onclick="openEditModal({{ $book->id }})" class="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-primary hover:bg-surface-container transition-colors" title="Edit Data Buku"><span class="material-symbols-outlined text-[18px]">edit</span></button>
                                <button onclick="openDeleteModal('{{ addslashes($book->title) }}', {{ $book->id }})" class="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-error hover:bg-error-container transition-colors" title="Hapus Buku"><span class="material-symbols-outlined text-[18px]">delete</span></button>
                            </div>
                        </td>
                    </tr>
                    @empty
                    <tr><td colspan="8" class="text-center py-8 text-outline">Tidak ada buku yang ditemukan.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        {{-- Paginasi Blade Links --}}
        <div class="p-space-md bg-surface-container-low/50 flex flex-col sm:flex-row items-center justify-between gap-space-md">
            <div class="font-body-sm text-body-sm text-outline">
                Menampilkan <span class="font-headline-sm text-on-surface">{{ $books->firstItem() }} - {{ $books->lastItem() }}</span> dari <span class="font-headline-sm text-on-surface">{{ number_format($books->total()) }}</span> buku terdaftar
            </div>
            {{ $books->links('pagination::tailwind') }}
        </div>
    </div>
</div>
@endsection
`,
  },
  {
    path: 'routes/web.php',
    name: 'web.php (Routing & Storage Link)',
    language: 'php',
    description: 'Definisi rute web RESTful untuk resource Buku dan endpoint ekspor data.',
    content: `<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\BookController;
use App\\Http\\Controllers\\DashboardController;

Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

// Resource Routes untuk Manajemen Buku (CRUD)
Route::resource('books', BookController::class);

// Rute Ekspor Data Katalog
Route::get('/books/export/csv', [BookController::class, 'exportCsv'])->name('books.export.csv');
Route::get('/books/export/sql', [BookController::class, 'exportSql'])->name('books.export.sql');

// Storage Asset Access (Menghubungkan php artisan storage:link)
// File gambar disimpan di storage/app/public/books/ dan diakses publik via /storage/books/
`,
  },
];
