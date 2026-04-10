"use client";
// @ts-nocheck

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Link2,
  Plus,
  Copy,
  Check,
  Pencil,
  Trash2,
  ExternalLink,
  Loader2,
  X,
  BarChart3,
  RefreshCw,
  ChevronDown,
  Users,
  Calendar,
  Settings,
} from 'lucide-react';

// ── Inline Types ───────────────────────────────────────────────────
interface UTMTerm {
  id: string;
  term_type: 'source' | 'medium' | 'campaign';
  code: string;
  label: string;
}

type UTMTermType = 'source' | 'medium' | 'campaign';

interface UTMLink {
  id: string;
  name: string;
  base_url: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content?: string;
  utm_term?: string;
  full_url: string;
  creator_id?: string;
}

interface UTMTermsData {
  sources: UTMTerm[];
  mediums: UTMTerm[];
  campaigns: UTMTerm[];
}

interface UTMLinkWithStats extends UTMLink {
  total_clicks: number;
  unique_visitors: number;
  short_code?: string;
  click_count?: number;
}

interface Creator {
  id: string;
  name: string;
}

// ── Mock Data ──────────────────────────────────────────────────────
const MOCK_UTM_TERMS: UTMTermsData = {
  sources: [
    { id: '1', term_type: 'source', code: 'ig', label: 'Instagram' },
    { id: '2', term_type: 'source', code: 'tw', label: 'Twitter' },
    { id: '3', term_type: 'source', code: 'tt', label: 'TikTok' },
    { id: '4', term_type: 'source', code: 'yt', label: 'YouTube' },
  ],
  mediums: [
    { id: '5', term_type: 'medium', code: 'o', label: 'Organic' },
    { id: '6', term_type: 'medium', code: 'p', label: 'Paid' },
    { id: '7', term_type: 'medium', code: 'r', label: 'Referral' },
  ],
  campaigns: [
    { id: '8', term_type: 'campaign', code: 'sm', label: 'Social Media' },
    { id: '9', term_type: 'campaign', code: 'launch', label: 'Launch' },
    { id: '10', term_type: 'campaign', code: 'promo', label: 'Promotion' },
  ],
};

const MOCK_LINKS: UTMLinkWithStats[] = [
  {
    id: 'l1',
    name: 'Daniel IG Bio',
    base_url: 'https://www.contentrewards.cc/',
    utm_source: 'ig',
    utm_medium: 'o',
    utm_campaign: 'sm',
    full_url: 'https://www.contentrewards.cc/?utm_source=ig&utm_medium=o&utm_campaign=sm',
    total_clicks: 1284,
    unique_visitors: 876,
  },
  {
    id: 'l2',
    name: 'Twitter Promo',
    base_url: 'https://www.contentrewards.cc/',
    utm_source: 'tw',
    utm_medium: 'o',
    utm_campaign: 'promo',
    full_url: 'https://www.contentrewards.cc/?utm_source=tw&utm_medium=o&utm_campaign=promo',
    total_clicks: 987,
    unique_visitors: 654,
  },
  {
    id: 'l3',
    name: 'TikTok Launch',
    base_url: 'https://www.contentrewards.cc/',
    utm_source: 'tt',
    utm_medium: 'o',
    utm_campaign: 'launch',
    full_url: 'https://www.contentrewards.cc/?utm_source=tt&utm_medium=o&utm_campaign=launch',
    total_clicks: 2341,
    unique_visitors: 1543,
  },
  {
    id: 'l4',
    name: 'YouTube Paid',
    base_url: 'https://www.contentrewards.cc/',
    utm_source: 'yt',
    utm_medium: 'p',
    utm_campaign: 'sm',
    full_url: 'https://www.contentrewards.cc/?utm_source=yt&utm_medium=p&utm_campaign=sm',
    total_clicks: 543,
    unique_visitors: 321,
  },
];

const MOCK_CREATORS: Creator[] = [
  { id: 'c1', name: 'Daniel Martinez' },
  { id: 'c2', name: 'Sarah Chen' },
  { id: 'c3', name: 'Alex Rivera' },
];

// Date range options
const DATE_RANGE_OPTIONS = [
  { label: 'Today', days: 1 },
  { label: '7 Days', days: 7 },
  { label: '30 Days', days: 30 },
  { label: '90 Days', days: 90 },
  { label: 'Custom', days: -1 },
];

export default function UTMLinksPage() {
  const [links] = useState<UTMLinkWithStats[]>(MOCK_LINKS);
  const [creators] = useState<Creator[]>(MOCK_CREATORS);
  const loading = false;
  const [showModal, setShowModal] = useState(false);
  const [editingLink, setEditingLink] = useState<UTMLinkWithStats | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saving] = useState(false);

  // UTM Terms state
  const [utmTerms] = useState<UTMTermsData>(MOCK_UTM_TERMS);
  const [showTermModal, setShowTermModal] = useState(false);
  const [termModalType, setTermModalType] = useState<UTMTermType>('source');
  const [editingTerm, setEditingTerm] = useState<UTMTerm | null>(null);
  const [termCode, setTermCode] = useState('');
  const [termLabel, setTermLabel] = useState('');
  const [savingTerm] = useState(false);

  // Date range state
  const [selectedDays, setSelectedDays] = useState(30);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [customDays, setCustomDays] = useState<number | null>(null);
  const dateDropdownRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    base_url: 'https://www.contentrewards.cc/',
    utm_source: '',
    utm_medium: '',
    utm_campaign: 'sm',
    utm_content: '',
    utm_term: '',
    creator_id: '',
  });

  function handleDateRangeSelect(days: number) {
    if (days === -1) {
      setShowCustomDateModal(true);
      setShowDateDropdown(false);
    } else {
      setSelectedDays(days);
      setCustomDays(null);
      setShowDateDropdown(false);
    }
  }

  function handleCustomDateSubmit() {
    if (customStartDate && customEndDate) {
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setCustomDays(diffDays);
      setSelectedDays(-1);
      setShowCustomDateModal(false);
    }
  }

  function getDateRangeLabel() {
    if (customDays) return `${customDays} Days`;
    const option = DATE_RANGE_OPTIONS.find(o => o.days === selectedDays);
    return option?.label || '90 Days';
  }

  function openCreateModal() {
    setEditingLink(null);
    setFormData({
      name: '',
      base_url: 'https://www.contentrewards.cc/',
      utm_source: '',
      utm_medium: '',
      utm_campaign: 'sm',
      utm_content: '',
      utm_term: '',
      creator_id: '',
    });
    setShowModal(true);
  }

  function openEditModal(link: UTMLinkWithStats) {
    setEditingLink(link);
    setFormData({
      name: link.name,
      base_url: link.base_url,
      utm_source: link.utm_source,
      utm_medium: link.utm_medium,
      utm_campaign: link.utm_campaign,
      utm_content: link.utm_content || '',
      utm_term: link.utm_term || '',
      creator_id: link.creator_id || '',
    });
    setShowModal(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowModal(false);
  }

  function handleDelete(id: string) {
    // no-op
  }

  function copyToClipboard(url: string, id: string) {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function openAddTermModal(type: UTMTermType) {
    setTermModalType(type);
    setEditingTerm(null);
    setTermCode('');
    setTermLabel('');
    setShowTermModal(true);
  }

  function openEditTermModal(term: UTMTerm) {
    setTermModalType(term.term_type);
    setEditingTerm(term);
    setTermCode(term.code);
    setTermLabel(term.label);
    setShowTermModal(true);
  }

  function handleSaveTerm(e: React.FormEvent) {
    e.preventDefault();
    setShowTermModal(false);
  }

  function handleDeleteTerm(id: string) {
    // no-op
  }

  function getSourceLabel(code: string): string {
    const term = utmTerms.sources.find(t => t.code === code);
    return term?.label || code;
  }

  function getMediumLabel(code: string): string {
    const term = utmTerms.mediums.find(t => t.code === code);
    return term?.label || code;
  }

  function getCampaignLabel(code: string): string {
    const term = utmTerms.campaigns.find(t => t.code === code);
    return term?.label || code;
  }

  function getPreviewUrl(): string {
    const params = new URLSearchParams();
    if (formData.utm_source) params.set('utm_source', formData.utm_source);
    if (formData.utm_medium) params.set('utm_medium', formData.utm_medium);
    if (formData.utm_campaign) params.set('utm_campaign', formData.utm_campaign);
    if (formData.utm_content) params.set('utm_content', formData.utm_content);
    if (formData.utm_term) params.set('utm_term', formData.utm_term);
    const query = params.toString();
    return formData.base_url + (query ? '?' + query : '');
  }

  const totalClicks = links.reduce((sum, link) => sum + (link.total_clicks || 0), 0);
  const totalVisitors = links.reduce((sum, link) => sum + (link.unique_visitors || 0), 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">UTM Links</h1>
            <p className="text-zinc-400 mt-1 hidden sm:block">
              Create and manage tracking links for campaigns
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative" ref={dateDropdownRef}>
              <button
                onClick={() => setShowDateDropdown(!showDateDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm font-medium text-zinc-100 hover:bg-zinc-700 transition-colors"
              >
                <Calendar className="w-4 h-4 text-zinc-400" />
                {getDateRangeLabel()}
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${showDateDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showDateDropdown && (
                <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-40 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 overflow-hidden">
                  {DATE_RANGE_OPTIONS.map(option => (
                    <button
                      key={option.days}
                      onClick={() => handleDateRangeSelect(option.days)}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        (option.days === selectedDays && !customDays) || (option.days === -1 && customDays)
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700 transition-colors">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create UTM Link
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 sm:p-5">
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 text-center sm:text-left">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                <Link2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-zinc-100">{links.length}</p>
                <p className="text-xs sm:text-sm text-zinc-500">Total Links</p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 sm:p-5">
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 text-center sm:text-left">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-zinc-100">{totalClicks.toLocaleString()}</p>
                <p className="text-xs sm:text-sm text-zinc-500">Total Clicks</p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 sm:p-5">
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 text-center sm:text-left">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-zinc-100">{totalVisitors.toLocaleString()}</p>
                <p className="text-xs sm:text-sm text-zinc-500">Unique Visitors</p>
              </div>
            </div>
          </div>
        </div>

        {/* UTM Links Table */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link2 className="w-5 h-5 text-orange-400" />
              <h3 className="font-semibold text-zinc-100">UTM Links</h3>
              <span className="text-sm text-zinc-500">({links.length} links)</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-zinc-800 text-left text-sm text-zinc-400">
                  <th className="px-5 py-4 font-medium">Name</th>
                  <th className="px-5 py-4 font-medium">Source</th>
                  <th className="px-5 py-4 font-medium">Medium</th>
                  <th className="px-5 py-4 font-medium">Campaign</th>
                  <th className="px-5 py-4 font-medium text-right">Clicks</th>
                  <th className="px-5 py-4 font-medium text-right">Visitors</th>
                  <th className="px-5 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {links.map(link => (
                  <tr key={link.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-zinc-100 font-medium">{link.name}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium">
                        {getSourceLabel(link.utm_source)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-zinc-300">
                      {getMediumLabel(link.utm_medium)}
                    </td>
                    <td className="px-5 py-4 text-zinc-300">
                      {getCampaignLabel(link.utm_campaign)}
                    </td>
                    <td className="px-5 py-4 text-right text-zinc-100 font-medium">
                      {(link.total_clicks || 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-right text-zinc-100 font-medium">
                      {(link.unique_visitors || 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/vn/utm-links/${link.id}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 transition-colors"
                          title="View analytics"
                        >
                          <BarChart3 className="w-4 h-4 text-purple-400" />
                          <span className="text-sm font-medium text-purple-400">Analytics</span>
                        </Link>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => copyToClipboard(link.full_url, link.id)}
                            className="p-2 rounded-lg hover:bg-zinc-700 transition-colors"
                            title="Copy URL"
                          >
                            {copiedId === link.id ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-zinc-400" />
                            )}
                          </button>
                          <a
                            href={link.full_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg hover:bg-zinc-700 transition-colors"
                            title="Open URL"
                          >
                            <ExternalLink className="w-4 h-4 text-zinc-400" />
                          </a>
                          <button
                            onClick={() => openEditModal(link)}
                            className="p-2 rounded-lg hover:bg-zinc-700 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4 text-zinc-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(link.id)}
                            className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-zinc-400 hover:text-red-400" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-300">Quick Reference</h3>
            <p className="text-xs text-zinc-500">Click + to add new terms</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            {/* Sources */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-zinc-500 font-medium">Sources</p>
                <button
                  onClick={() => openAddTermModal('source')}
                  className="p-1 text-zinc-500 hover:text-orange-400 hover:bg-zinc-800 rounded transition-colors"
                  title="Add source"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1 text-zinc-400">
                {utmTerms.sources.map(term => (
                  <div key={term.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-orange-400">{term.code}</span>
                      <span>{term.label}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditTermModal(term)}
                        className="p-1 text-zinc-500 hover:text-zinc-300 rounded"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteTerm(term.id)}
                        className="p-1 text-zinc-500 hover:text-red-400 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mediums */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-zinc-500 font-medium">Mediums</p>
                <button
                  onClick={() => openAddTermModal('medium')}
                  className="p-1 text-zinc-500 hover:text-orange-400 hover:bg-zinc-800 rounded transition-colors"
                  title="Add medium"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1 text-zinc-400">
                {utmTerms.mediums.map(term => (
                  <div key={term.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-orange-400">{term.code}</span>
                      <span>{term.label}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditTermModal(term)}
                        className="p-1 text-zinc-500 hover:text-zinc-300 rounded"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteTerm(term.id)}
                        className="p-1 text-zinc-500 hover:text-red-400 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaigns */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-zinc-500 font-medium">Campaigns</p>
                <button
                  onClick={() => openAddTermModal('campaign')}
                  className="p-1 text-zinc-500 hover:text-orange-400 hover:bg-zinc-800 rounded transition-colors"
                  title="Add campaign"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1 text-zinc-400">
                {utmTerms.campaigns.map(term => (
                  <div key={term.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-orange-400">{term.code}</span>
                      <span>{term.label}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditTermModal(term)}
                        className="p-1 text-zinc-500 hover:text-zinc-300 rounded"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteTerm(term.id)}
                        className="p-1 text-zinc-500 hover:text-red-400 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Date Range Modal */}
      <AnimatePresence>
        {showCustomDateModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setShowCustomDateModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
                <h2 className="text-lg font-semibold text-zinc-100">Custom Date Range</h2>
                <button
                  onClick={() => setShowCustomDateModal(false)}
                  className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">Start Date</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={e => setCustomStartDate(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">End Date</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={e => setCustomEndDate(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCustomDateModal(false)}
                    className="flex-1 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCustomDateSubmit}
                    disabled={!customStartDate || !customEndDate}
                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl z-50 overflow-y-auto max-h-[calc(100vh-2rem)]"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
                <h2 className="text-lg font-semibold text-zinc-100">
                  {editingLink ? 'Edit UTM Link' : 'Create UTM Link'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Daniel IG Bio"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">Base URL</label>
                  <input
                    type="url"
                    value={formData.base_url}
                    onChange={e => setFormData({ ...formData, base_url: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1.5">Source</label>
                    <select
                      value={formData.utm_source}
                      onChange={e => setFormData({ ...formData, utm_source: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                      required
                    >
                      <option value="">Select source...</option>
                      {utmTerms.sources.map(term => (
                        <option key={term.id} value={term.code}>{term.label} ({term.code})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1.5">Medium</label>
                    <select
                      value={formData.utm_medium}
                      onChange={e => setFormData({ ...formData, utm_medium: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                      required
                    >
                      <option value="">Select medium...</option>
                      {utmTerms.mediums.map(term => (
                        <option key={term.id} value={term.code}>{term.label} ({term.code})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">Campaign</label>
                  <select
                    value={formData.utm_campaign}
                    onChange={e => setFormData({ ...formData, utm_campaign: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    required
                  >
                    <option value="">Select campaign...</option>
                    {utmTerms.campaigns.map(term => (
                      <option key={term.id} value={term.code}>{term.label} ({term.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">Content (optional)</label>
                  <input
                    type="text"
                    value={formData.utm_content}
                    onChange={e => setFormData({ ...formData, utm_content: e.target.value })}
                    placeholder="e.g. bio-link, post-1"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">Assign to Creator (optional)</label>
                  <select
                    value={formData.creator_id}
                    onChange={e => setFormData({ ...formData, creator_id: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  >
                    <option value="">None</option>
                    {creators.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="bg-zinc-800 rounded-lg p-4">
                  <p className="text-xs text-zinc-500 mb-1">Preview URL</p>
                  <p className="text-sm text-orange-400 break-all font-mono">{getPreviewUrl()}</p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50">
                    {editingLink ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* UTM Term Modal */}
      <AnimatePresence>
        {showTermModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setShowTermModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
                <h2 className="text-lg font-semibold text-zinc-100">
                  {editingTerm ? 'Edit' : 'Add'} {termModalType.charAt(0).toUpperCase() + termModalType.slice(1)}
                </h2>
                <button
                  onClick={() => setShowTermModal(false)}
                  className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>

              <form onSubmit={handleSaveTerm} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">Code (short)</label>
                  <input
                    type="text"
                    value={termCode}
                    onChange={e => setTermCode(e.target.value.toLowerCase())}
                    placeholder="e.g. ig, tw, o, p"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">Label (display name)</label>
                  <input
                    type="text"
                    value={termLabel}
                    onChange={e => setTermLabel(e.target.value)}
                    placeholder="e.g. Instagram, Twitter, Organic"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowTermModal(false)}
                    className="flex-1 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={savingTerm} className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50">
                    {editingTerm ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
