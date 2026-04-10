"use client";
// @ts-nocheck

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, UserPlus, Shield, Trash2, Edit, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { PageContainer } from '@/components/vn/layout/page-container';
import { Header } from '@/components/vn/layout/header';
import { Card, CardContent } from '@/components/vn/ui/card';
import { Button } from '@/components/vn/ui/button';
import { Badge } from '@/components/vn/ui/badge';
import { Avatar } from '@/components/vn/ui/avatar';
import { Input } from '@/components/vn/ui/input';
import { Select } from '@/components/vn/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/vn/ui/table';

// --- Inline types ---
type Role = 'admin' | 'viewer';

interface TeamMember {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  status: 'active' | 'pending' | 'inactive';
  created_at: string;
  avatar_url: string | null;
  creator_access: 'all' | string[];
  section_access: 'all' | string[];
}

// Role definitions
const roles = {
  admin: {
    label: 'Admin',
    description: 'Full access including settings, user management, and creator management',
    color: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  },
  viewer: {
    label: 'Viewer',
    description: 'View-only access to dashboard, creators, videos, and analytics',
    color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  },
};

const statusColors: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  inactive: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
};

const roleOptions = [
  { value: 'admin', label: 'Admin - Full access' },
  { value: 'viewer', label: 'Viewer - View only' },
];

const SIDEBAR_SECTIONS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'creators', label: 'Creators' },
  { key: 'videos', label: 'Videos' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'signups', label: 'Signups' },
  { key: 'contracts', label: 'Contracts' },
  { key: 'payments', label: 'Payments' },
  { key: 'calendar', label: 'Calendar' },
];

// --- MOCK DATA ---
const MOCK_USERS: TeamMember[] = [
  { id: 'tm1', name: 'Dan Admin', email: 'dan@example.com', role: 'admin', status: 'active', created_at: '2026-01-15T10:00:00Z', avatar_url: null, creator_access: 'all', section_access: 'all' },
  { id: 'tm2', name: 'Sarah Viewer', email: 'sarah@example.com', role: 'viewer', status: 'active', created_at: '2026-02-20T14:00:00Z', avatar_url: null, creator_access: 'all', section_access: ['dashboard', 'creators', 'videos'] },
  { id: 'tm3', name: 'Mike Editor', email: 'mike@example.com', role: 'viewer', status: 'pending', created_at: '2026-03-10T09:00:00Z', avatar_url: null, creator_access: ['cr1', 'cr2'], section_access: ['dashboard', 'analytics'] },
];

const MOCK_CREATORS = [
  { id: 'cr1', name: 'Alice Johnson' },
  { id: 'cr2', name: 'Bob Smith' },
  { id: 'cr3', name: 'Grace Kim' },
  { id: 'cr4', name: 'Eve Martinez' },
  { id: 'cr5', name: 'Carol Davis' },
];

// Add/Edit Team Member Modal
function MemberModal({
  mode,
  member,
  creators,
  onClose,
  onSave,
  saving,
  error,
}: {
  mode: 'add' | 'edit';
  member?: TeamMember;
  creators: { id: string; name: string }[];
  onClose: () => void;
  onSave: (member: { name?: string; email?: string; password?: string; role: Role; creatorAccess: 'all' | string[]; sectionAccess: 'all' | string[] }) => void;
  saving?: boolean;
  error?: string | null;
}) {
  const [formData, setFormData] = useState({
    name: member?.name || '',
    email: member?.email || '',
    password: '',
    role: (member?.role || 'viewer') as Role,
    creatorAccess: member?.creator_access || ('all' as 'all' | string[]),
    sectionAccess: member?.section_access || ('all' as 'all' | string[]),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const toggleCreatorAccess = (creatorId: string) => {
    if (formData.creatorAccess === 'all') return;
    const current = formData.creatorAccess as string[];
    if (current.includes(creatorId)) {
      setFormData(prev => ({
        ...prev,
        creatorAccess: current.filter(id => id !== creatorId),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        creatorAccess: [...current, creatorId],
      }));
    }
  };

  const toggleSectionAccess = (sectionKey: string) => {
    if (formData.sectionAccess === 'all') return;
    const current = formData.sectionAccess as string[];
    if (current.includes(sectionKey)) {
      setFormData(prev => ({
        ...prev,
        sectionAccess: current.filter(key => key !== sectionKey),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        sectionAccess: [...current, sectionKey],
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-full bg-orange-500/10">
            <UserPlus className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-100">
              {mode === 'add' ? 'Add Team Member' : 'Edit Team Member'}
            </h3>
            <p className="text-sm text-zinc-400">
              {mode === 'add' ? 'Invite a new user to your workspace' : 'Update user permissions'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'add' && (
            <>
              <Input
                label="Name"
                placeholder="Enter name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="Set a password (min 6 characters)"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
                minLength={6}
              />
            </>
          )}

          <Select
            label="Role"
            options={roleOptions}
            value={formData.role}
            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as Role }))}
          />

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Creator Access
            </label>
            <div className="space-y-2 mb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="creatorAccess"
                  checked={formData.creatorAccess === 'all'}
                  onChange={() => setFormData(prev => ({ ...prev, creatorAccess: 'all' }))}
                  className="text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm text-zinc-300">All creators</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="creatorAccess"
                  checked={formData.creatorAccess !== 'all'}
                  onChange={() => setFormData(prev => ({ ...prev, creatorAccess: [] }))}
                  className="text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm text-zinc-300">Select specific creators</span>
              </label>
            </div>

            {/* Creator checkboxes */}
            {formData.creatorAccess !== 'all' && (
              <div className="bg-zinc-800/50 rounded-lg p-3 max-h-48 overflow-y-auto">
                <p className="text-xs text-zinc-500 mb-2">Select which creators this user can access:</p>
                <div className="space-y-2">
                  {creators.map((creator) => {
                    const isSelected = (formData.creatorAccess as string[]).includes(creator.id);
                    return (
                      <label
                        key={creator.id}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                          isSelected ? 'bg-orange-500/10 border border-orange-500/30' : 'hover:bg-zinc-700/50'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-orange-500 border-orange-500'
                            : 'border-zinc-600 bg-zinc-800'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleCreatorAccess(creator.id)}
                          className="hidden"
                        />
                        <span className="text-sm text-zinc-300">{creator.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Section Access - Only show for non-admin users */}
          {formData.role !== 'admin' && (
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Sidebar Sections
              </label>
              <div className="space-y-2 mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sectionAccess"
                    checked={formData.sectionAccess === 'all'}
                    onChange={() => setFormData(prev => ({ ...prev, sectionAccess: 'all' }))}
                    className="text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-sm text-zinc-300">All sections</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sectionAccess"
                    checked={formData.sectionAccess !== 'all'}
                    onChange={() => setFormData(prev => ({ ...prev, sectionAccess: [] }))}
                    className="text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-sm text-zinc-300">Select specific sections</span>
                </label>
              </div>

              {/* Section checkboxes */}
              {formData.sectionAccess !== 'all' && (
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <p className="text-xs text-zinc-500 mb-2">Select which sections this user can see:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {SIDEBAR_SECTIONS.map((section) => {
                      const isSelected = (formData.sectionAccess as string[]).includes(section.key);
                      return (
                        <label
                          key={section.key}
                          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                            isSelected ? 'bg-orange-500/10 border border-orange-500/30' : 'hover:bg-zinc-700/50 border border-transparent'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-orange-500 border-orange-500'
                              : 'border-zinc-600 bg-zinc-800'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSectionAccess(section.key)}
                            className="hidden"
                          />
                          <span className="text-xs text-zinc-300">{section.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="bg-zinc-800/50 rounded-lg p-3 mt-4">
            <p className="text-xs text-zinc-400">
              <span className="text-zinc-300 font-medium">Role permissions:</span>
              <br />
              {roles[formData.role].description}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1" disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {mode === 'add' ? 'Adding...' : 'Saving...'}
                </>
              ) : mode === 'add' ? (
                <>
                  <Plus className="w-4 h-4" />
                  Add Member
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// Delete confirmation modal
function DeleteModal({
  user,
  onClose,
  onConfirm,
  deleting,
}: {
  user: TeamMember;
  onClose: () => void;
  onConfirm: () => void;
  deleting?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-red-500/10">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-100">Remove Team Member</h3>
            <p className="text-sm text-zinc-400">This action cannot be undone</p>
          </div>
        </div>

        <p className="text-zinc-300 mb-6">
          Are you sure you want to remove <span className="font-semibold text-zinc-100">{user.name || user.email}</span>?
          They will lose access to this workspace.
        </p>

        <div className="flex gap-3">
          <Button variant="ghost" onClick={onClose} className="flex-1" disabled={deleting}>
            Cancel
          </Button>
          <Button
            variant="ghost"
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300"
          >
            {deleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Removing...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Remove User
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default function UserManagementPage() {
  const creatorList = MOCK_CREATORS;
  const isAdmin = true;
  const [users, setUsers] = useState<TeamMember[]>(MOCK_USERS);
  const loading = false;
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<TeamMember | null>(null);
  const [deletingUser, setDeletingUser] = useState<TeamMember | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const handleAddMember = async (member: any) => {
    setShowAddModal(false);
  };

  const handleEditMember = async (member: any) => {
    setEditingUser(null);
  };

  const handleDeleteMember = async () => {
    if (deletingUser) {
      setUsers(prev => prev.filter(u => u.id !== deletingUser.id));
      setDeletingUser(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getCreatorAccessDisplay = (access: 'all' | string[]) => {
    if (access === 'all') return 'All creators';
    if (!Array.isArray(access) || access.length === 0) return 'No access';
    return `${access.length} creator${access.length > 1 ? 's' : ''}`;
  };

  const getSectionAccessDisplay = (access: 'all' | string[], role: Role) => {
    if (role === 'admin') return 'Full access';
    if (access === 'all') return 'All sections';
    if (!Array.isArray(access) || access.length === 0) return 'No access';
    return `${access.length} section${access.length > 1 ? 's' : ''}`;
  };

  return (
    <PageContainer>
      {/* Back Button */}
      <Link
        href="/vn/settings"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Settings
      </Link>

      <Header
        title="User Management"
        description="Manage team members and their access"
      />

      {/* Add Button */}
      <div className="flex justify-end mb-4">
        <Button onClick={() => { setShowAddModal(true); setModalError(null); }}>
          <Plus className="w-4 h-4" />
          Add Team Member
        </Button>
      </div>

      {/* Role Legend */}
      <div className="mb-6 p-4 bg-zinc-800/30 rounded-lg border border-zinc-800">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-zinc-400" />
          <span className="text-sm font-medium text-zinc-300">Role Permissions</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {Object.entries(roles).map(([key, role]) => (
            <div key={key} className="flex items-start gap-2">
              <Badge className={role.color}>{role.label}</Badge>
              <span className="text-zinc-500 text-xs">{role.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Creator Access</TableHead>
                  <TableHead>Sidebar Access</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={user.avatar_url}
                          name={user.name || user.email}
                          size="sm"
                        />
                        <span className="font-medium text-zinc-100">{user.name || 'Unnamed'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-400">{user.email}</TableCell>
                    <TableCell>
                      <Badge className={roles[user.role].color}>
                        {roles[user.role].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-400 text-sm">
                      {getCreatorAccessDisplay(user.creator_access)}
                    </TableCell>
                    <TableCell className="text-zinc-400 text-sm">
                      {getSectionAccessDisplay(user.section_access, user.role)}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[user.status]}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setEditingUser(user); setModalError(null); }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {user.role !== 'admin' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingUser(user)}
                            className="text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-zinc-500">
                      No team members found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Member Modal */}
      {showAddModal && (
        <MemberModal
          mode="add"
          creators={creatorList}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddMember}
          saving={saving}
          error={modalError}
        />
      )}

      {/* Edit Member Modal */}
      {editingUser && (
        <MemberModal
          mode="edit"
          member={editingUser}
          creators={creatorList}
          onClose={() => setEditingUser(null)}
          onSave={handleEditMember}
          saving={saving}
          error={modalError}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingUser && (
        <DeleteModal
          user={deletingUser}
          onClose={() => setDeletingUser(null)}
          onConfirm={handleDeleteMember}
          deleting={deleting}
        />
      )}
    </PageContainer>
  );
}
