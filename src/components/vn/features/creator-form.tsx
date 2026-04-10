"use client";
// @ts-nocheck

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, DollarSign, Plus, Trash2, Calendar, History, PauseCircle, Pencil, X, Link, Copy, Check, Loader2 } from 'lucide-react';
import { Input } from '@/components/vn/ui/input';
import { Select } from '@/components/vn/ui/select';
import { Button } from '@/components/vn/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/vn/ui/card';
import { Creator, CreateCreatorInput, CreatorStatus, ContractVariation, PausePeriod } from '@/types/virality-nexus';
import { getInitials } from '@/lib/vn-utils';
import { BaselineCalculator } from '@/components/vn/features/baseline-calculator';

interface CreatorFormProps {
  creator?: Creator;
  onSuccess?: () => void;
  onDelete?: () => void;
}

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'inactive', label: 'Inactive' },
];

// Mock data for variations and pause periods (replaced hooks)
const mockVariations: ContractVariation[] = [];
const mockPausePeriods: PausePeriod[] = [];

export function CreatorForm({ creator, onSuccess, onDelete }: CreatorFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [variations] = useState<ContractVariation[]>(mockVariations);
  const [pausePeriods] = useState<PausePeriod[]>(mockPausePeriods);

  // New variation form state
  const [showVariationForm, setShowVariationForm] = useState(false);
  const [editingVariationId, setEditingVariationId] = useState<string | null>(null);
  const [newVariation, setNewVariation] = useState({
    effective_date: '',
    retainer_amount: 0,
    cpm_rate: 0,
    cpm_cap: null as number | null,
    notes: '',
  });

  // New pause period form state
  const [showPauseForm, setShowPauseForm] = useState(false);
  const [newPausePeriod, setNewPausePeriod] = useState({
    start_date: '',
    end_date: '',
    reason: '',
  });

  // Referral code state
  const [referralCode, setReferralCode] = useState<string | null>(creator?.referral_code || null);
  const [generatingReferral, setGeneratingReferral] = useState(false);
  const [referralError, setReferralError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState<CreateCreatorInput>({
    name: creator?.name || '',
    email: creator?.email || '',
    phone_number: creator?.phone_number || '',
    avatar_url: creator?.avatar_url || '',
    instagram_handle: creator?.instagram_handle || '',
    tiktok_handle: creator?.tiktok_handle || '',
    status: creator?.status || 'active',
    avg_views_instagram: creator?.avg_views_instagram || 0,
    avg_views_tiktok: creator?.avg_views_tiktok || 0,
    notes: creator?.notes || '',
    // Financial fields
    retainer_amount: creator?.retainer_amount || 0,
    cpm_rate: creator?.cpm_rate || 0,
    cpm_cap: creator?.cpm_cap ?? null,
    contract_start_date: creator?.contract_start_date || '',
  });

  const [previewImage, setPreviewImage] = useState<string | null>(creator?.avatar_url || null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const generateReferralCode = async () => {
    if (!creator?.id || !formData.email) {
      setReferralError('Save the creator with an email first');
      return;
    }

    setGeneratingReferral(true);
    setReferralError(null);

    try {
      // Mock referral code generation
      await new Promise(resolve => setTimeout(resolve, 500));
      const code = `REF-${creator.id.slice(0, 6).toUpperCase()}`;
      setReferralCode(code);
    } catch (err) {
      setReferralError(err instanceof Error ? err.message : 'Failed to generate referral code');
    } finally {
      setGeneratingReferral(false);
    }
  };

  const copyReferralLink = () => {
    if (referralCode) {
      navigator.clipboard.writeText(`https://contentrewards.cc?ref=${referralCode}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleChange = (field: keyof CreateCreatorInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, avatar: 'Image must be less than 2MB' }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreviewImage(base64);
        setFormData(prev => ({ ...prev, avatar_url: base64 }));
        setErrors(prev => ({ ...prev, avatar: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // Mock save
      await new Promise(resolve => setTimeout(resolve, 500));
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(creator ? '/settings/creators' : '/creators');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!creator) return;
    setDeleting(true);
    try {
      // Mock delete
      await new Promise(resolve => setTimeout(resolve, 500));
      if (onDelete) {
        onDelete();
      } else {
        router.push('/creators');
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{creator ? 'Edit Creator' : 'Add New Creator'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture Upload */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-3">
              Profile Picture
            </label>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center overflow-hidden">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold text-white">
                      {formData.name ? getInitials(formData.name) : '?'}
                    </span>
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center cursor-pointer hover:bg-zinc-700 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-zinc-400" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <div>
                <label
                  htmlFor="avatar-upload"
                  className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium bg-zinc-800 text-zinc-100 hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  Upload Photo
                </label>
                <p className="text-xs text-zinc-500 mt-2">
                  JPG, PNG or GIF. Max 2MB.
                </p>
                {errors.avatar && (
                  <p className="text-xs text-red-400 mt-1">{errors.avatar}</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Name"
              placeholder="Enter creator name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={errors.name}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="creator@example.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
            />
          </div>

          <Input
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={formData.phone_number}
            onChange={(e) => handleChange('phone_number', e.target.value)}
            error={errors.phone_number}
          />

          {/* Referral Code Section - Only show when editing */}
          {creator && (
            <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-800/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Link className="w-4 h-4 text-orange-400" />
                  <label className="text-sm font-medium text-zinc-300">Referral Code</label>
                </div>
                {!referralCode && formData.email && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={generateReferralCode}
                    disabled={generatingReferral}
                  >
                    {generatingReferral ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate Referral Code'
                    )}
                  </Button>
                )}
              </div>
              {referralCode ? (
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-zinc-500 text-xs">Code: </span>
                        <span className="text-orange-400 font-mono font-medium">{referralCode}</span>
                      </div>
                      <div className="text-zinc-500 text-xs">
                        contentrewards.cc?ref={referralCode}
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={copyReferralLink}
                    className="shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-green-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy Link
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-zinc-500">
                  {formData.email
                    ? 'Click "Generate Referral Code" to create a referral link for this creator.'
                    : 'Add an email address to generate a referral code.'}
                </p>
              )}
              {referralError && (
                <p className="text-sm text-red-400 mt-2">{referralError}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Instagram Profile URL"
              placeholder="https://instagram.com/username"
              value={formData.instagram_handle ? `https://instagram.com/${formData.instagram_handle}` : ''}
              onChange={(e) => {
                const url = e.target.value;
                // Extract handle from URL or use as-is if just a username
                const match = url.match(/instagram\.com\/([^/?]+)/);
                const handle = match ? match[1] : url.replace(/^@/, '').replace(/https?:\/\/(www\.)?instagram\.com\/?/, '');
                handleChange('instagram_handle', handle);
              }}
              error={errors.instagram_handle}
            />
            <Input
              label="TikTok Profile URL"
              placeholder="https://tiktok.com/@username"
              value={formData.tiktok_handle ? `https://tiktok.com/@${formData.tiktok_handle}` : ''}
              onChange={(e) => {
                const url = e.target.value;
                // Extract handle from URL or use as-is if just a username
                const match = url.match(/tiktok\.com\/@?([^/?]+)/);
                const handle = match ? match[1] : url.replace(/^@/, '').replace(/https?:\/\/(www\.)?tiktok\.com\/?@?/, '');
                handleChange('tiktok_handle', handle);
              }}
              error={errors.tiktok_handle}
            />
          </div>

          {/* Average Views for Outlier Calculation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BaselineCalculator
              platform="instagram"
              currentValue={formData.avg_views_instagram || 0}
              onSave={(value) => setFormData(prev => ({ ...prev, avg_views_instagram: value }))}
            />
            <BaselineCalculator
              platform="tiktok"
              currentValue={formData.avg_views_tiktok || 0}
              onSave={(value) => setFormData(prev => ({ ...prev, avg_views_tiktok: value }))}
            />
          </div>

          <Select
            label="Status"
            options={statusOptions}
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value as CreatorStatus)}
          />

          {/* Financials Section */}
          <div className="border-t border-zinc-800 pt-6 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-semibold text-zinc-100">Financials</h3>
            </div>
            <p className="text-sm text-zinc-500 mb-4">
              Set payment terms for ROI calculations. Leave at 0 if not applicable.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Monthly Retainer ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.retainer_amount || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, retainer_amount: parseFloat(e.target.value) || 0 }))}
                    className="w-full pl-8 pr-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  CPM Rate ($/1000 views)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.cpm_rate || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, cpm_rate: parseFloat(e.target.value) || 0 }))}
                    className="w-full pl-8 pr-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  CPM Cap ($/clip max)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="No cap"
                    value={formData.cpm_cap ?? ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      cpm_cap: e.target.value === '' ? null : parseFloat(e.target.value) || 0
                    }))}
                    className="w-full pl-8 pr-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200"
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-1">Leave empty for no cap</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Contract Start Date
                </label>
                <input
                  type="date"
                  value={formData.contract_start_date || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, contract_start_date: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Contract Variations Section - Only show when editing */}
          {creator && (
            <div className="border-t border-zinc-800 pt-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-zinc-100">Contract Variations</h3>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setShowVariationForm(!showVariationForm);
                    setEditingVariationId(null);
                    setNewVariation({ effective_date: '', retainer_amount: 0, cpm_rate: 0, cpm_cap: null, notes: '' });
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Variation
                </Button>
              </div>
              <p className="text-sm text-zinc-500 mb-4">
                Track changes to retainer, CPM rates, or caps over time. Each variation applies from its effective date forward.
              </p>

              {/* New/Edit Variation Form */}
              {showVariationForm && (
                <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-medium text-zinc-300 mb-3">
                    {editingVariationId ? 'Edit Contract Variation' : 'New Contract Variation'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">Effective Date *</label>
                      <input
                        type="date"
                        required
                        value={newVariation.effective_date}
                        min={formData.contract_start_date || undefined}
                        onChange={(e) => setNewVariation(prev => ({ ...prev, effective_date: e.target.value }))}
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">Retainer ($)</label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">$</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={newVariation.retainer_amount || ''}
                          onChange={(e) => setNewVariation(prev => ({ ...prev, retainer_amount: parseFloat(e.target.value) || 0 }))}
                          className="w-full pl-7 pr-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">CPM Rate ($)</label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">$</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={newVariation.cpm_rate || ''}
                          onChange={(e) => setNewVariation(prev => ({ ...prev, cpm_rate: parseFloat(e.target.value) || 0 }))}
                          className="w-full pl-7 pr-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">CPM Cap ($)</label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">$</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="No cap"
                          value={newVariation.cpm_cap ?? ''}
                          onChange={(e) => setNewVariation(prev => ({
                            ...prev,
                            cpm_cap: e.target.value === '' ? null : parseFloat(e.target.value) || 0
                          }))}
                          className="w-full pl-7 pr-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-zinc-100 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">Notes</label>
                      <input
                        type="text"
                        placeholder="e.g., Rate increase"
                        value={newVariation.notes}
                        onChange={(e) => setNewVariation(prev => ({ ...prev, notes: e.target.value }))}
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-zinc-100 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowVariationForm(false);
                        setEditingVariationId(null);
                        setNewVariation({ effective_date: '', retainer_amount: 0, cpm_rate: 0, cpm_cap: null, notes: '' });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      disabled={!newVariation.effective_date}
                      onClick={async () => {
                        // Mock save variation
                        setShowVariationForm(false);
                        setEditingVariationId(null);
                        setNewVariation({ effective_date: '', retainer_amount: 0, cpm_rate: 0, cpm_cap: null, notes: '' });
                      }}
                    >
                      {editingVariationId ? 'Update Variation' : 'Save Variation'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Variations List */}
              {variations.length > 0 ? (
                <div className="space-y-2">
                  {variations.map((variation) => (
                    <div
                      key={variation.id}
                      className="flex items-center justify-between bg-zinc-800/30 border border-zinc-800 rounded-lg px-4 py-3"
                    >
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-zinc-500" />
                          <span className="text-zinc-300">
                            {new Date(variation.effective_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm flex-wrap">
                          <span className="text-zinc-400">
                            Retainer: <span className="text-zinc-100">${variation.retainer_amount}</span>
                          </span>
                          <span className="text-zinc-400">
                            CPM: <span className="text-zinc-100">${variation.cpm_rate}/1k</span>
                          </span>
                          <span className="text-zinc-400">
                            Cap: <span className="text-zinc-100">{variation.cpm_cap ? `$${variation.cpm_cap}` : 'None'}</span>
                          </span>
                          {variation.notes && (
                            <span className="text-zinc-500 italic">{variation.notes}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingVariationId(variation.id);
                            setNewVariation({
                              effective_date: variation.effective_date,
                              retainer_amount: variation.retainer_amount,
                              cpm_rate: variation.cpm_rate,
                              cpm_cap: variation.cpm_cap,
                              notes: variation.notes || '',
                            });
                            setShowVariationForm(true);
                          }}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-purple-400 hover:bg-zinc-700 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {/* mock delete */}}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-zinc-500 text-sm">
                  No contract variations yet. Add one to track rate changes over time.
                </div>
              )}
            </div>
          )}

          {/* Pause Periods Section - Only show when editing */}
          {creator && (
            <div className="border-t border-zinc-800 pt-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <PauseCircle className="w-5 h-5 text-red-400" />
                  <h3 className="text-lg font-semibold text-zinc-100">Pause Periods</h3>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowPauseForm(!showPauseForm)}
                >
                  <Plus className="w-4 h-4" />
                  Add Pause
                </Button>
              </div>
              <p className="text-sm text-zinc-500 mb-4">
                Pause contract payments for a specific date range. No retainer or CPM will be charged during pause periods.
              </p>

              {/* New Pause Period Form */}
              {showPauseForm && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-medium text-red-300 mb-3">New Pause Period</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">Start Date *</label>
                      <input
                        type="date"
                        required
                        value={newPausePeriod.start_date}
                        min={formData.contract_start_date || undefined}
                        onChange={(e) => setNewPausePeriod(prev => ({ ...prev, start_date: e.target.value }))}
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">End Date (optional)</label>
                      <input
                        type="date"
                        value={newPausePeriod.end_date}
                        min={newPausePeriod.start_date || formData.contract_start_date || undefined}
                        onChange={(e) => setNewPausePeriod(prev => ({ ...prev, end_date: e.target.value }))}
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
                      />
                      <p className="text-[10px] text-zinc-500 mt-1">Leave empty for ongoing pause</p>
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">Reason</label>
                      <input
                        type="text"
                        placeholder="e.g., Holiday break"
                        value={newPausePeriod.reason}
                        onChange={(e) => setNewPausePeriod(prev => ({ ...prev, reason: e.target.value }))}
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-zinc-100 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowPauseForm(false);
                        setNewPausePeriod({ start_date: '', end_date: '', reason: '' });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      disabled={!newPausePeriod.start_date}
                      className="bg-red-500 hover:bg-red-600"
                      onClick={async () => {
                        // Mock save pause period
                        setShowPauseForm(false);
                        setNewPausePeriod({ start_date: '', end_date: '', reason: '' });
                      }}
                    >
                      Save Pause Period
                    </Button>
                  </div>
                </div>
              )}

              {/* Pause Periods List */}
              {pausePeriods.length > 0 ? (
                <div className="space-y-2">
                  {pausePeriods.map((period) => (
                    <div
                      key={period.id}
                      className="flex items-center justify-between bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <PauseCircle className="w-4 h-4 text-red-400" />
                          <span className="text-red-300">
                            {new Date(period.start_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                            {' -> '}
                            {period.end_date ? (
                              new Date(period.end_date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            ) : (
                              <span className="text-red-400 font-medium">Ongoing</span>
                            )}
                          </span>
                        </div>
                        {period.reason && (
                          <span className="text-zinc-500 italic text-sm">{period.reason}</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {/* mock delete */}}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-zinc-500 text-sm">
                  No pause periods. Add one to pause payments for a date range.
                </div>
              )}
            </div>
          )}

          <div className="w-full">
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Notes
            </label>
            <textarea
              className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 min-h-[100px] resize-none"
              placeholder="Add any notes about this creator..."
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          </div>

          {/* Danger Zone - Delete Creator (only when editing) */}
          {creator && (
            <div className="border-t border-zinc-800 pt-6 mt-6">
              <div className="border border-red-500/30 rounded-lg p-4 bg-red-500/5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-red-400">Danger Zone</h3>
                    <p className="text-sm text-zinc-500 mt-1">
                      Permanently delete this creator and all associated data.
                    </p>
                  </div>
                  {!showDeleteConfirm ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4 mr-1.5" />
                      Delete Creator
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-red-400">Are you sure?</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="text-zinc-400 hover:text-zinc-300"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleDelete}
                        loading={deleting}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        <Trash2 className="w-4 h-4 mr-1.5" />
                        Confirm Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="w-full sm:w-auto">
            {creator ? 'Save Changes' : 'Add Creator'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
