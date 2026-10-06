import { useState, useEffect } from 'react';
import { ActiveTab, Book } from './types/book';
import { BookRepository, INITIAL_CATEGORIES } from './services/bookRepository';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { BookManagementView } from './components/BookManagementView';
import { BookFormModal } from './components/BookFormModal';
import { DeleteModal } from './components/DeleteModal';
import { BookDetailModal } from './components/BookDetailModal';
import { LaravelStudioView } from './components/LaravelStudioView';
import { CategoriesView } from './components/CategoriesView';
import { SettingsView } from './components/SettingsView';
import { InventoryView } from './components/InventoryView';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [books, setBooks] = useState<Book[]>([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);
  const [detailBook, setDetailBook] = useState<Book | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(
    'Buku “Sistem Informasi Manajemen” berhasil diperbarui dalam basis data katalog.'
  );

  // Load books
  const loadBooks = () => {
    setBooks(BookRepository.getAll());
  };

  useEffect(() => {
    loadBooks();
  }, []);

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setActiveTab('manajemen-buku');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleOpenCreateModal = () => {
    setEditingBook(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (book: Book) => {
    setEditingBook(book);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (data: Omit<Book, 'id' | 'created_at' | 'updated_at' | 'status'> & { status?: Book['status'] }) => {
    if (editingBook) {
      const { book } = BookRepository.update(editingBook.id, data);
      setToastMessage(`Buku “${book.title}” berhasil diperbarui dalam basis data katalog.`);
    } else {
      const { book } = BookRepository.create(data);
      setToastMessage(`Buku “${book.title}” berhasil disimpan ke dalam basis data katalog.`);
    }
    loadBooks();
    setIsFormModalOpen(false);
    setEditingBook(null);
  };

  const handleConfirmDelete = () => {
    if (deletingBook) {
      BookRepository.delete(deletingBook.id);
      setToastMessage(`Buku “${deletingBook.title}” telah berhasil dihapus dari sistem katalog.`);
      setDeletingBook(null);
      loadBooks();
    }
  };

  const handleStockChange = (bookId: number, delta: number) => {
    const target = books.find((b) => b.id === bookId);
    if (target) {
      const nextStock = Math.max(0, target.stock + delta);
      BookRepository.update(bookId, { stock: nextStock });
      loadBooks();
      setDetailBook((prev) => (prev ? { ...prev, stock: nextStock } : null));
    }
  };

  const handleExportCsv = () => {
    const csvContent = BookRepository.exportCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `athenaeum_katalog_buku_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportSql = () => {
    const sqlContent = BookRepository.exportSqlDump();
    const blob = new Blob([sqlContent], { type: 'application/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `athenaeum_library_mysql_${new Date().toISOString().slice(0, 10)}.sql`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#121c2a]">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        booksCount={books.length}
      />

      {/* Main Content Area */}
      <div className="pl-64 flex flex-col min-h-screen">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenCreateModal={handleOpenCreateModal}
          onExportSql={handleExportSql}
          onExportCsv={handleExportCsv}
          onSearchClick={() => setActiveTab('manajemen-buku')}
        />

        <main className="w-full pt-20 px-8 pb-12 bg-[#f8f9ff] flex-1">
          {activeTab === 'dashboard' && (
            <DashboardView
              books={books}
              onOpenCreateModal={handleOpenCreateModal}
              onOpenBookDetail={(b) => setDetailBook(b)}
              onNavigateToBooks={() => setActiveTab('manajemen-buku')}
              onExportCsv={handleExportCsv}
            />
          )}

          {activeTab === 'manajemen-buku' && (
            <BookManagementView
              books={books}
              onOpenCreateModal={handleOpenCreateModal}
              onOpenEditModal={handleOpenEditModal}
              onOpenDeleteModal={(b) => setDeletingBook(b)}
              onOpenDetailModal={(b) => setDetailBook(b)}
              onExportCsv={handleExportCsv}
              successMessage={toastMessage}
              onDismissSuccessMessage={() => setToastMessage(null)}
            />
          )}

          {activeTab === 'kategori' && (
            <CategoriesView
              categories={INITIAL_CATEGORIES}
              books={books}
              onSelectCategory={() => {
                setActiveTab('manajemen-buku');
              }}
            />
          )}

          {activeTab === 'laporan-inventaris' && (
            <InventoryView
              books={books}
              onOpenBookDetail={(b) => setDetailBook(b)}
            />
          )}

          {activeTab === 'laravel-studio' && (
            <LaravelStudioView
              books={books}
              onExportSql={handleExportSql}
            />
          )}

          {activeTab === 'pengaturan' && (
            <SettingsView
              onResetDatabase={loadBooks}
              onExportSql={handleExportSql}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <BookFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        editingBook={editingBook}
        categories={INITIAL_CATEGORIES}
      />

      <DeleteModal
        isOpen={!!deletingBook}
        book={deletingBook}
        onClose={() => setDeletingBook(null)}
        onConfirm={handleConfirmDelete}
      />

      <BookDetailModal
        book={detailBook}
        onClose={() => setDetailBook(null)}
        onEdit={(b) => {
          setDetailBook(null);
          handleOpenEditModal(b);
        }}
        onStockChange={handleStockChange}
      />
    </div>
  );
}
