"use client";
// @ts-nocheck

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Plus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Check,
  X,
  Trash2,
  Edit3,
  Link2,
  User,
} from 'lucide-react';
import { PageContainer } from '@/components/vn/layout/page-container';

// --- Inline types ---
interface PaymentItem {
  id: string;
  editor_name: string;
  description: string;
  links?: string[];
  amount: number | null;
  date_of_completion: string | null;
  date_payment_sent: string | null;
  is_paid: boolean;
  paid_by: string | null;
  notes?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatCurrency(amount: number | null): string {
  if (amount === null || amount === undefined) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

// --- MOCK DATA ---
const MOCK_ITEMS: PaymentItem[] = [
  { id: 'pay1', editor_name: 'TomVFX', description: 'Dashboard Explainer Video', links: ['https://youtube.com/watch?v=abc'], amount: 750, date_of_completion: '2026-04-02', date_payment_sent: '2026-04-05', is_paid: true, paid_by: 'Dan', notes: 'Great work' },
  { id: 'pay2', editor_name: 'SarahEdits', description: 'Product Launch Reel', links: ['https://instagram.com/reel/xyz'], amount: 500, date_of_completion: '2026-04-05', date_payment_sent: null, is_paid: false, paid_by: null },
  { id: 'pay3', editor_name: 'TomVFX', description: 'Onboarding Tutorial Series (3 parts)', links: ['https://youtube.com/watch?v=def', 'https://youtube.com/watch?v=ghi'], amount: 1200, date_of_completion: '2026-04-07', date_payment_sent: null, is_paid: false, paid_by: null },
  { id: 'pay4', editor_name: 'PixelPro', description: 'Social Media Thumbnails (10x)', amount: 300, date_of_completion: '2026-04-01', date_payment_sent: '2026-04-03', is_paid: true, paid_by: 'Dan' },
  { id: 'pay5', editor_name: 'SarahEdits', description: 'Creator Spotlight Interview', links: ['https://youtube.com/watch?v=jkl'], amount: 600, date_of_completion: '2026-04-08', date_payment_sent: null, is_paid: false, paid_by: null },
];

export default function PaymentsPage() {
  const [items, setItems] = useState<PaymentItem[]>(MOCK_ITEMS);
  const loading = false;
  const error: string | null = null;

  // Current month/year for filtering
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [filterPaid, setFilterPaid] = useState<'all' | 'paid' | 'unpaid'>('all');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PaymentItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Filter items by paid status
  const filteredItems = useMemo(() => {
    if (filterPaid === 'all') return items;
    if (filterPaid === 'paid') return items.filter(i => i.is_paid);
    return items.filter(i => !i.is_paid);
  }, [items, filterPaid]);

  // Calculate totals
  const totals = useMemo(() => {
    const all = items.reduce((sum, i) => sum + (i.amount || 0), 0);
    const paid = items.filter(i => i.is_paid).reduce((sum, i) => sum + (i.amount || 0), 0);
    const unpaid = items.filter(i => !i.is_paid).reduce((sum, i) => sum + (i.amount || 0), 0);
    return { all, paid, unpaid, count: items.length, paidCount: items.filter(i => i.is_paid).length };
  }, [items]);

  // Navigate months
  const prevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(y => y - 1);
    } else {
      setSelectedMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(y => y + 1);
    } else {
      setSelectedMonth(m => m + 1);
    }
  };

  // Handle create/edit - no-op
  const handleSave = async (data: any) => {
    setModalOpen(false);
    setEditingItem(null);
  };

  // Handle delete - no-op
  const handleDelete = async (id: string) => {
    // no-op
  };

  // Quick toggle paid status
  const togglePaid = async (item: PaymentItem) => {
    setItems(prev => prev.map(i =>
      i.id === item.id
        ? { ...i, is_paid: !i.is_paid, date_payment_sent: !i.is_paid ? new Date().toISOString().split('T')[0] : null }
        : i
    ));
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
            <DollarSign className="w-7 h-7 text-emerald-400" />
            Payment Tracker
          </h1>
          <p className="text-zinc-400 mt-1 hidden sm:block">
            Track invoices and payment status
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Month Navigation */}
          <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-2">
            <button
              onClick={prevMonth}
              className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-zinc-100 min-w-[120px] text-center">
              {MONTHS[selectedMonth - 1]} {selectedYear}
            </span>
            <button
              onClick={nextMonth}
              className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Filter */}
          <div className="flex gap-1 bg-zinc-800 border border-zinc-700 rounded-lg p-1">
            {(['all', 'unpaid', 'paid'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilterPaid(f)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                  filterPaid === f
                    ? f === 'paid' ? 'bg-emerald-500 text-white' : f === 'unpaid' ? 'bg-orange-500 text-white' : 'bg-zinc-700 text-zinc-100'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Refresh */}
          <button
            disabled={loading}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Create */}
          <button
            onClick={() => {
              setEditingItem(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Payment
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Total Items</p>
          <p className="text-2xl font-bold text-zinc-100 mt-1">{totals.count}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Total Amount</p>
          <p className="text-2xl font-bold text-zinc-100 mt-1">{formatCurrency(totals.all)}</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
          <p className="text-xs text-emerald-400 uppercase tracking-wider">Paid ({totals.paidCount})</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{formatCurrency(totals.paid)}</p>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
          <p className="text-xs text-orange-400 uppercase tracking-wider">Unpaid ({totals.count - totals.paidCount})</p>
          <p className="text-2xl font-bold text-orange-400 mt-1">{formatCurrency(totals.unpaid)}</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-8">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-800/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider w-10">
                  Paid
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Editor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Completed
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Payment Sent
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Paid By
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider w-20">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-zinc-500">
                    No payment items for {MONTHS[selectedMonth - 1]} {selectedYear}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className={`border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors ${
                      item.is_paid ? 'bg-emerald-500/5' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <button
                        onClick={() => togglePaid(item)}
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                          item.is_paid
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-zinc-600 hover:border-zinc-400'
                        }`}
                      >
                        {item.is_paid && <Check className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-500/20 text-blue-400 text-sm font-medium">
                        <User className="w-3 h-3" />
                        {item.editor_name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-zinc-200">{item.description}</div>
                      {item.links && item.links.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.links.map((link, i) => (
                            <a
                              key={i}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300"
                            >
                              <Link2 className="w-3 h-3" />
                              Link {i + 1}
                            </a>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-lg font-bold text-zinc-100">
                        {formatCurrency(item.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-400">
                      {formatDate(item.date_of_completion)}
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-400">
                      {formatDate(item.date_payment_sent)}
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-400">
                      {item.paid_by || '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setModalOpen(true);
                          }}
                          className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 rounded transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-700 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
            {filteredItems.length > 0 && (
              <tfoot>
                <tr className="border-t-2 border-zinc-700 bg-zinc-800/50">
                  <td colSpan={3} className="px-4 py-3 text-right text-sm font-medium text-zinc-400">
                    Total:
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-lg font-bold text-emerald-400">
                      {formatCurrency(filteredItems.reduce((sum, i) => sum + (i.amount || 0), 0))}
                    </span>
                  </td>
                  <td colSpan={4}></td>
                </tr>
              </tfoot>
            )}
          </table>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <PaymentModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSave}
        onDelete={editingItem ? () => handleDelete(editingItem.id) : undefined}
        item={editingItem}
        saving={saving}
        deleting={deleting}
        defaultMonth={selectedMonth}
        defaultYear={selectedYear}
      />
    </PageContainer>
  );
}

// Payment Modal Component
function PaymentModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  item,
  saving,
  deleting,
  defaultMonth,
  defaultYear,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onDelete?: () => void;
  item: PaymentItem | null;
  saving: boolean;
  deleting: boolean;
  defaultMonth: number;
  defaultYear: number;
}) {
  const [editorName, setEditorName] = useState(item?.editor_name || '');
  const [description, setDescription] = useState(item?.description || '');
  const [links, setLinks] = useState<string[]>(item?.links && item.links.length > 0 ? item.links : ['']);
  const [amount, setAmount] = useState(item?.amount?.toString() || '');
  const [dateCompletion, setDateCompletion] = useState(item?.date_of_completion || '');
  const [datePaymentSent, setDatePaymentSent] = useState(item?.date_payment_sent || '');
  const [isPaid, setIsPaid] = useState(item?.is_paid || false);
  const [paidBy, setPaidBy] = useState(item?.paid_by || '');
  const [notes, setNotes] = useState(item?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({});
  };

  const addLink = () => setLinks([...links, '']);
  const removeLink = (idx: number) => setLinks(links.filter((_, i) => i !== idx));
  const updateLink = (idx: number, value: string) => {
    const newLinks = [...links];
    newLinks[idx] = value;
    setLinks(newLinks);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b border-zinc-800">
            <h3 className="text-lg font-semibold text-zinc-100">
              {item ? 'Edit Payment' : 'Add Payment'}
            </h3>
            <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Editor Name */}
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">
                Editor Name *
              </label>
              <input
                type="text"
                value={editorName}
                onChange={e => setEditorName(e.target.value)}
                placeholder="TomVFX"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">
                Description *
              </label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="New Dashboard Explainer Video"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                required
              />
            </div>

            {/* Links */}
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">
                Links
              </label>
              {links.map((link, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={link}
                    onChange={e => updateLink(idx, e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm"
                  />
                  {links.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLink(idx)}
                      className="p-2 text-zinc-400 hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addLink}
                className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Link
              </button>
            </div>

            {/* Amount & Dates Row */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">
                  Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="750"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">
                  Completed
                </label>
                <input
                  type="date"
                  value={dateCompletion}
                  onChange={e => setDateCompletion(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">
                  Payment Sent
                </label>
                <input
                  type="date"
                  value={datePaymentSent}
                  onChange={e => setDatePaymentSent(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            {/* Paid Status & Paid By */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">
                  Paid Status
                </label>
                <button
                  type="button"
                  onClick={() => setIsPaid(!isPaid)}
                  className={`w-full px-3 py-2 rounded-lg border-2 font-medium transition-colors flex items-center justify-center gap-2 ${
                    isPaid
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  {isPaid ? <Check className="w-4 h-4" /> : null}
                  {isPaid ? 'Paid' : 'Unpaid'}
                </button>
              </div>
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">
                  Paid By
                </label>
                <input
                  type="text"
                  value={paidBy}
                  onChange={e => setPaidBy(e.target.value)}
                  placeholder="Dan"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Additional notes..."
                rows={2}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              {item && onDelete ? (
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={deleting}
                  className="px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-sm flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              ) : (
                <div />
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <RefreshCw className="w-4 h-4 animate-spin" />}
                  {item ? 'Save Changes' : 'Add Payment'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
}
