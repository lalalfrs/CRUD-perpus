import { Book, Category } from '../types/book';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 1, name: 'Self Improvement', ddc_code: '158.1', count: 284, color: '#15803d', description: 'Pengembangan diri, kebiasaan, dan motivasi' },
  { id: 2, name: 'Filsafat', ddc_code: '100', count: 195, color: '#1f6c3a', description: 'Filsafat klasik, stoikisme, dan etika' },
  { id: 3, name: 'Teknologi & Komputer', ddc_code: '005.1', count: 430, color: '#00652c', description: 'Software architecture, rekayasa perangkat lunak' },
  { id: 4, name: 'Fiksi & Sastra', ddc_code: '813', count: 312, color: '#24703e', description: 'Novel sastra Indonesia & dunia' },
  { id: 5, name: 'Referensi & Umum', ddc_code: '020', count: 199, color: '#4b5563', description: 'Buku ajar, ensiklopedia, dan sistem informasi' },
];

export const INITIAL_BOOKS: Book[] = [
  {
    id: 1,
    title: 'Atomic Habits',
    subtitle: 'Perubahan Kecil yang Memberikan Hasil Luar Biasa',
    isbn: '978-602-03-8591-4',
    author: 'James Clear',
    publisher: 'Gramedia Pustaka Utama',
    category: 'Self Improvement',
    year: 2021,
    stock: 24,
    total_copies: 24,
    shelf_location: 'Rak A-12',
    status: 'Tersedia',
    cover_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFDBQosu4lBnJao3h9KL0iR0jVaOFwYEmC4mppJPQHCrc5yxG05H0N7sBros66J5zBYOC-FiqmFuzRsw0w0mtn2VkWbZbEzFMLPJqHBGgNgCUJ8sHcrPTh71b1iv37mr64OKd5KGkoIVI63ULdQWgogSYG58Pt8rrD_rv0X4uj4VBWHzKZ0Da4AOerXjRHXWZ0qV01zEMeEj4s7PyqeEv0Jy9l7tLWfFAycKUtsRZjmVA2mV5czPu1',
    image_storage_path: 'books/atomic_habits_cover.webp',
    file_size_kb: 48,
    description: 'Panduan definitif untuk menghentikan kebiasaan buruk dan membangun kebiasaan baik melalui sistem perbaikan 1% setiap hari.',
    created_at: '2024-10-23 16:40:00',
    updated_at: '2024-10-24 08:30:00',
  },
  {
    id: 2,
    title: 'Filosofi Teras',
    subtitle: 'Panduan Hidup Tenang - Menjalani Hidup Stoic di Dunia Modern',
    isbn: '978-602-41-2518-9',
    author: 'Henry Manampiring',
    publisher: 'Penerbit Buku Kompas',
    category: 'Filsafat',
    year: 2019,
    stock: 2,
    total_copies: 12,
    shelf_location: 'Rak C-04',
    status: 'Stok Kritis',
    cover_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAylDzhS69C6c_wFZDHdgwm1Ypy31UFEHMxhTitS9DFZODJtje34dJmVbrMw7HQ53upC5KYfWXtzGBmv3uIQ7Kz51DKUA6sd6VnZ3LRN3e5C0gE44u-iMNjF5Z60NzFgg_9aMqZpZdpiz3fenEhI02YN71v2W-7CRI3lOKWL08iA_Zs2mM41ecOs7oKRwq9ftnFZF7yDF2zpidL9TtiRcioUFMJqQVs257UHMoQr1fe5nkgLziOjVCd',
    image_storage_path: 'books/filosofi_teras_cover.webp',
    file_size_kb: 52,
    description: 'Penerapan praktis filsafat Stoisisme kuno untuk mengatasi emosi negatif, kekhawatiran masa depan, dan mencapai ketenangan batin.',
    created_at: '2024-10-24 09:15:00',
    updated_at: '2024-10-24 09:15:00',
  },
  {
    id: 3,
    title: 'Clean Architecture',
    subtitle: 'A Craftsman\'s Guide to Software Structure and Design',
    isbn: '978-013-44-9416-6',
    author: 'Robert C. Martin',
    publisher: 'Prentice Hall',
    category: 'Teknologi',
    year: 2018,
    stock: 12,
    total_copies: 15,
    shelf_location: 'Rak T-01',
    status: 'Tersedia',
    cover_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFGNT3XheiIYPlqxxSefMAz_14hOzFOGeEvZmIwpfN4tZ9H6dkBFmKMPqAwTEYpm97YTdnoV9FJ7ZVP4hpUfwH8zqJh6C2NXm6x08q0H-3ur5-NQO8BzexbmgTo_aABfX3ijppIgO_GoWZd_HCZszRMlGCyTtXw8h704MJHq6OX0r4djSjSj0lBmgwQBD9xhct1bdW0_95kJOv9h9YF3dkME8kjK0dxTSGiZoeokYQIdb_xMV0lNls',
    image_storage_path: 'books/clean_architecture_cover.webp',
    file_size_kb: 64,
    description: 'Pedoman arsitektur perangkat lunak modular, pemisahan dependensi (SOLID), dan perancangan sistem berbasis domain independen framework.',
    created_at: '2024-10-24 07:00:00',
    updated_at: '2024-10-24 07:00:00',
  },
  {
    id: 4,
    title: 'Laskar Pelangi',
    subtitle: 'The Rainbow Troops - An Inspirational Novel',
    isbn: '978-979-30-6279-2',
    author: 'Andrea Hirata',
    publisher: 'Bentang Pustaka',
    category: 'Fiksi',
    year: 2005,
    stock: 15,
    total_copies: 20,
    shelf_location: 'Rak B-08',
    status: 'Tersedia',
    cover_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBithebMUdUulLyhN5WrNVtvuyJ9pU7uDrz_Sdu0qeZvV4eFB-SRng3nMsx04M82pJz-rCXuAvwRc5lKaKIDjqHxWBOVWxbCk38sEo9Y6BSp6VBOXP7FtO26yIxzW1mqNwNYFQTEYPgDey2lQ7Vp4zCKmU-IgUBIm5Ctlh0j61D1_83bhZl3wS0TFiqa8pqhBJPj5HFG_i3BTQEsUyE7DJtWSa1oHyV0O4kMPtX8TrcINU2AMf98WLv',
    image_storage_path: 'books/laskar_pelangi_cover.webp',
    file_size_kb: 76,
    description: 'Kisah perjuangan sepuluh anak di Belitung Timur menuntut ilmu di tengah keterbatasan fasilitas sekolah Muhammadiyah yang nyaris ditutup.',
    created_at: '2024-10-24 10:00:00',
    updated_at: '2024-10-24 10:00:00',
  },
  {
    id: 5,
    title: 'Bumi Manusia',
    subtitle: 'Tetralogi Buru Buku Kesatu',
    isbn: '978-979-97-3123-4',
    author: 'Pramoedya Ananta Toer',
    publisher: 'Lentera Dipantara',
    category: 'Fiksi Sastra',
    year: 2010,
    stock: 5,
    total_copies: 8,
    shelf_location: 'Rak B-02',
    status: 'Tersedia',
    cover_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZqqlKVL33hNY6rFRjetjfYG1qs5lE-dCmLHkGL2ZXyQFniqQlIWdW5PPFQUluQso6lrPu6ZAhg-zw31qsk9XzXo09wUpas8TLbIJ5vYGphNmHzNNz6DCeGOmMYerMQRXYlPpk5KNU_FpW1T8OG0YVrcnaSZ2m2vPuTM9YH9RgX_JL6QNEc_hUWY1sZL9sUg406IkCKE_tnIU1E6ZP_5upRnBwti4aswu8xVZuGAA_W_HIZQmUE2Cg',
    image_storage_path: 'books/bumi_manusia_cover.webp',
    file_size_kb: 55,
    description: 'Kisah Minke di era Hindia Belanda awal abad ke-20 dan pergulatan hak asasi serta cinta bersama Annelies di hadapan hukum kolonial.',
    created_at: '2024-10-22 14:20:00',
    updated_at: '2024-10-22 14:20:00',
  },
  {
    id: 6,
    title: 'Pengantar Sistem Informasi',
    subtitle: 'Kerangka Konseptual dan Aplikasi Bisnis Modern',
    isbn: '978-979-01-5231-1',
    author: 'Gordon B. Davis',
    publisher: 'Penerbit Erlangga',
    category: 'Referensi',
    year: 2020,
    stock: 1,
    total_copies: 5,
    shelf_location: 'Rak D-15',
    status: 'Stok Kritis',
    cover_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxr25631MOraMM8EMu_28k2aE-tBREKbSeKlIUQ_eyQCKe2DTdZ-W2ArJ6C88Cb0hpxz83NVHq8F_ZC2yTxH0xp_5R3B7UH_Eoo5pH33k4zOyYUlNt-pmtwnMiI7sA7GJD8amOOvcnSV7KjewEx-wxvjnMFlnu4BabdZvksKY0rJ4E9JmwDjH7VgDENOUscnRpxVPaIsmnTjWsEGlhsX29kO9TErb2ZFdS4dtOW3wtfq7nhkc4VL-9',
    image_storage_path: 'books/sistem_informasi_cover.webp',
    file_size_kb: 61,
    description: 'Buku teks standar universitas mengenai struktur pengolahan data, manajemen basis data relasional, dan integrasi enterprise information system.',
    created_at: '2024-10-24 06:45:00',
    updated_at: '2024-10-24 08:00:00',
  },
  {
    id: 7,
    title: 'Madilog',
    subtitle: 'Materialisme, Dialektika, dan Logika',
    isbn: '978-602-16-0329-1',
    author: 'Tan Malaka',
    publisher: 'Narasi Pustaka',
    category: 'Filsafat & Sejarah',
    year: 2014,
    stock: 0,
    total_copies: 6,
    shelf_location: 'Rak C-01',
    status: 'Habis',
    cover_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoOouWuo0xDp-J5kjSvEDPcThEmXZp9bBc_uJ6UEWcleF7oK4bKVZq7LFVH7eYZZleJLZ2h4-s5Et248CLV1z8OQdJFm53AyoovZAgD7ta5Bz2dS_Ky42eBuD54r23bBrIZo0GzjZvCn7LiLcyUj2Ahmzis3SyG_h2bwo3ezfPvo9liqsmtfmjTOzwvWlwLtrIGBCXp3ctHdy7mz35eGsa5hUogofs34DcVcAIHKLxcdaJjmBNSxpH',
    image_storage_path: 'books/madilog_cover.webp',
    file_size_kb: 49,
    description: 'Mahakarya pemikiran Tan Malaka mengenai cara berpikir ilmiah bangsa Indonesia guna membebaskan diri dari logika mistika.',
    created_at: '2024-10-21 11:10:00',
    updated_at: '2024-10-21 11:10:00',
  },
];

const STORAGE_KEY = 'athenaeum_library_books_v1';

export class BookRepository {
  private static getStoredBooks(): Book[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }
    return INITIAL_BOOKS;
  }

  private static saveBooks(books: Book[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    } catch {
      // quota or private mode
    }
  }

  public static getAll(): Book[] {
    return this.getStoredBooks();
  }

  public static getById(id: number): Book | undefined {
    return this.getStoredBooks().find((b) => b.id === id);
  }

  public static create(payload: Omit<Book, 'id' | 'created_at' | 'updated_at' | 'status'> & { status?: Book['status'] }): { book: Book; sql: string } {
    const books = this.getStoredBooks();
    const newId = books.length > 0 ? Math.max(...books.map((b) => b.id)) + 1 : 1;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const calculatedStatus: Book['status'] = payload.stock === 0 ? 'Habis' : payload.stock <= 3 ? 'Stok Kritis' : 'Tersedia';

    const newBook: Book = {
      id: newId,
      title: payload.title,
      subtitle: payload.subtitle || '',
      isbn: payload.isbn,
      author: payload.author,
      publisher: payload.publisher,
      category: payload.category,
      year: Number(payload.year),
      stock: Number(payload.stock),
      total_copies: Number(payload.total_copies || payload.stock),
      shelf_location: payload.shelf_location,
      status: payload.status || calculatedStatus,
      cover_image: payload.cover_image,
      image_storage_path: payload.image_storage_path || `books/cover_${Date.now()}.webp`,
      file_size_kb: payload.file_size_kb || 50,
      description: payload.description || '',
      created_at: now,
      updated_at: now,
    };

    books.unshift(newBook);
    this.saveBooks(books);

    const sql = `INSERT INTO \`books\` (\`title\`, \`isbn\`, \`author\`, \`publisher\`, \`category\`, \`year\`, \`stock\`, \`total_copies\`, \`shelf_location\`, \`status\`, \`cover_image\`, \`created_at\`, \`updated_at\`) VALUES ('${newBook.title.replace(/'/g, "''")}', '${newBook.isbn}', '${newBook.author.replace(/'/g, "''")}', '${newBook.publisher.replace(/'/g, "''")}', '${newBook.category}', ${newBook.year}, ${newBook.stock}, ${newBook.total_copies}, '${newBook.shelf_location}', '${newBook.status}', '${newBook.image_storage_path}', NOW(), NOW());`;

    return { book: newBook, sql };
  }

  public static update(id: number, payload: Partial<Book>): { book: Book; sql: string } {
    const books = this.getStoredBooks();
    const index = books.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new Error(`Book #${id} not found.`);
    }

    const current = books[index];
    const newStock = payload.stock !== undefined ? Number(payload.stock) : current.stock;
    const status: Book['status'] = newStock === 0 ? 'Habis' : newStock <= 3 ? 'Stok Kritis' : 'Tersedia';

    const updatedBook: Book = {
      ...current,
      ...payload,
      stock: newStock,
      status: payload.status || status,
      updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    books[index] = updatedBook;
    this.saveBooks(books);

    const sql = `UPDATE \`books\` SET \`title\` = '${updatedBook.title.replace(/'/g, "''")}', \`stock\` = ${updatedBook.stock}, \`shelf_location\` = '${updatedBook.shelf_location}', \`status\` = '${updatedBook.status}', \`updated_at\` = NOW() WHERE \`id\` = ${id};`;

    return { book: updatedBook, sql };
  }

  public static delete(id: number): { sql: string } {
    const books = this.getStoredBooks();
    const filtered = books.filter((b) => b.id !== id);
    this.saveBooks(filtered);

    const sql = `DELETE FROM \`books\` WHERE \`id\` = ${id};`;
    return { sql };
  }

  public static resetToDefault(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  public static exportSqlDump(): string {
    const books = this.getStoredBooks();
    let sql = `-- Athenaeum Library System Database Dump\n`;
    sql += `-- Generated on ${new Date().toISOString()}\n`;
    sql += `-- Laravel Eloquent Database Migration & Seeder Export\n\n`;
    sql += `SET FOREIGN_KEY_CHECKS=0;\nDROP TABLE IF EXISTS \`books\`;\n\n`;
    sql += `CREATE TABLE \`books\` (\n`;
    sql += `  \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,\n`;
    sql += `  \`title\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,\n`;
    sql += `  \`subtitle\` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n`;
    sql += `  \`isbn\` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,\n`;
    sql += `  \`author\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,\n`;
    sql += `  \`publisher\` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,\n`;
    sql += `  \`category\` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,\n`;
    sql += `  \`year\` smallint unsigned NOT NULL,\n`;
    sql += `  \`stock\` int unsigned NOT NULL DEFAULT 0,\n`;
    sql += `  \`total_copies\` int unsigned NOT NULL DEFAULT 1,\n`;
    sql += `  \`shelf_location\` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,\n`;
    sql += `  \`status\` enum('Tersedia','Stok Kritis','Habis') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Tersedia',\n`;
    sql += `  \`cover_image\` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n`;
    sql += `  \`description\` text COLLATE utf8mb4_unicode_ci,\n`;
    sql += `  \`created_at\` timestamp NULL DEFAULT NULL,\n`;
    sql += `  \`updated_at\` timestamp NULL DEFAULT NULL,\n`;
    sql += `  PRIMARY KEY (\`id\`),\n`;
    sql += `  KEY \`books_category_index\` (\`category\`),\n`;
    sql += `  KEY \`books_status_index\` (\`status\`)\n`;
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

    sql += `INSERT INTO \`books\` (\`id\`, \`title\`, \`isbn\`, \`author\`, \`publisher\`, \`category\`, \`year\`, \`stock\`, \`total_copies\`, \`shelf_location\`, \`status\`, \`cover_image\`, \`created_at\`, \`updated_at\`) VALUES\n`;
    const rows = books.map((b) => {
      return `(${b.id}, '${b.title.replace(/'/g, "''")}', '${b.isbn}', '${b.author.replace(/'/g, "''")}', '${b.publisher.replace(/'/g, "''")}', '${b.category}', ${b.year}, ${b.stock}, ${b.total_copies}, '${b.shelf_location}', '${b.status}', '${b.image_storage_path}', '${b.created_at}', '${b.updated_at}')`;
    });
    sql += rows.join(',\n') + ';\n';
    return sql;
  }

  public static exportCsv(): string {
    const books = this.getStoredBooks();
    const headers = ['ID', 'Judul Buku', 'ISBN', 'Penulis', 'Penerbit', 'Kategori', 'Tahun', 'Stok', 'Total Eksemplar', 'Lokasi Rak', 'Status', 'File Gambar'];
    const rows = books.map((b) => [
      b.id,
      `"${b.title.replace(/"/g, '""')}"`,
      `"${b.isbn}"`,
      `"${b.author.replace(/"/g, '""')}"`,
      `"${b.publisher.replace(/"/g, '""')}"`,
      `"${b.category}"`,
      b.year,
      b.stock,
      b.total_copies,
      `"${b.shelf_location}"`,
      `"${b.status}"`,
      `"${b.image_storage_path}"`,
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}
