export interface Book {
  id: number;
  title: string;
  subtitle?: string;
  isbn: string;
  author: string;
  publisher: string;
  category: string;
  year: number;
  stock: number;
  total_copies: number;
  shelf_location: string;
  status: 'Tersedia' | 'Stok Kritis' | 'Habis';
  cover_image: string; // URL or base64 data URI
  image_storage_path?: string; // Simulated Laravel Storage path e.g. books/laskar_pelangi.jpg
  file_size_kb?: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  ddc_code: string;
  count: number;
  color: string;
  description: string;
}

export type ActiveTab = 'dashboard' | 'manajemen-buku' | 'kategori' | 'laporan-inventaris' | 'pengaturan' | 'laravel-studio';
