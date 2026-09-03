'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  User,
  Lock,
  Palette,
  Settings as SettingsIcon,
  Save,
  ShieldCheck,
  Globe,
  Users,
  Plus,
  Edit2,
  Trash2,
  X,
} from 'lucide-react';
import { useAuthStore } from '@lamed/shared';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
});

const siteSchema = z.object({
  siteTitle: z.string().min(2, 'Site title is required'),
  siteDescription: z.string().min(10, 'Description must be at least 10 characters'),
  contactEmail: z.string().email('Please enter a valid email'),
  contactPhone: z.string().min(5, 'Phone is required'),
  address: z.string().min(5, 'Address is required'),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ProfileForm = z.infer<typeof profileSchema>;
type SiteForm = z.infer<typeof siteSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

interface AdminUserView {
  id: string;
  email: string;
  name: string;
}

const adminCreateSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm the password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const adminEditSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: z.string().email('Please enter a valid email').optional(),
    password: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
    confirmPassword: z.string().optional().or(z.literal('')),
  })
  .refine(
    (d) => {
      if (!d.password && !d.confirmPassword) return true;
      return d.password === d.confirmPassword;
    },
    { message: 'Passwords do not match', path: ['confirmPassword'] }
  );

type AdminCreateForm = z.infer<typeof adminCreateSchema>;
type AdminEditForm = z.infer<typeof adminEditSchema>;

export default function AdminSettingsPage() {
  const { user } = useAuthStore();
  const [activeSection, setActiveSection] = useState<
    'profile' | 'site' | 'password' | 'admins'
  >('profile');

  const {
    register: regProfile,
    handleSubmit: handleProfile,
    formState: { errors: errorsProfile, isSubmitting: subProfile },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || 'Lamed Admin',
      email: user?.email || 'admin@lamed.com',
    },
  });

  const {
    register: regSite,
    handleSubmit: handleSite,
    formState: { errors: errorsSite, isSubmitting: subSite },
  } = useForm<SiteForm>({
    resolver: zodResolver(siteSchema),
    defaultValues: {
      siteTitle: 'Lamed Construction PLC',
      siteDescription:
        'Premier construction company in Addis Ababa, Ethiopia specializing in residential, commercial, and mixed-use development projects.',
      contactEmail: 'info@lamedconstruction.com',
      contactPhone: '+251 11 123 4567',
      address: 'Bole Subcity, Woreda 3, Addis Ababa, Ethiopia',
    },
  });

  const {
    register: regPassword,
    handleSubmit: handlePassword,
    reset: resetPassword,
    formState: { errors: errorsPassword, isSubmitting: subPassword },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onProfileSubmit = (_data: ProfileForm) => {
    toast.success('Profile updated', {
      description: 'Your admin profile settings have been saved.',
    });
  };

  const onSiteSubmit = (_data: SiteForm) => {
    toast.success('Site settings saved', {
      description: 'Website configuration has been updated.',
    });
  };

  const onPasswordSubmit = (_data: PasswordForm) => {
    toast.success('Password changed', {
      description: 'Your password has been updated successfully.',
    });
    resetPassword();
  };

  const sections = [
    { key: 'profile' as const, label: 'Admin Profile', icon: User },
    { key: 'site' as const, label: 'Site Settings', icon: Globe },
    { key: 'password' as const, label: 'Change Password', icon: Lock },
    { key: 'admins' as const, label: 'Admin Users', icon: Users },
  ];

  // ============ Admin Users Management ============
  const [admins, setAdmins] = useState<AdminUserView[]>([]);
  const [adminsLoading, setAdminsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editing, setEditing] = useState<AdminUserView | null>(null);

  const fetchAdmins = async () => {
    setAdminsLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) setAdmins(data.users || []);
    } finally {
      setAdminsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const createForm = useForm<AdminCreateForm>({
    resolver: zodResolver(adminCreateSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const editForm = useForm<AdminEditForm>({
    resolver: zodResolver(adminEditSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (editing) {
      editForm.reset({
        name: editing.name,
        email: editing.email,
        password: '',
        confirmPassword: '',
      });
    }
  }, [editing, editForm]);

  const onCreateAdmin = async (data: AdminCreateForm) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success('Admin created', { description: `${data.name} can now sign in.` });
        createForm.reset();
        setShowCreateModal(false);
        fetchAdmins();
      } else {
        toast.error('Could not create admin', { description: result.error });
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  const onEditAdmin = async (data: AdminEditForm) => {
    if (!editing) return;
    try {
      const payload: Record<string, string> = { id: editing.id };
      if (data.name) payload.name = data.name;
      if (data.email) payload.email = data.email;
      if (data.password) payload.password = data.password;
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        toast.success('Admin updated', { description: 'Changes saved successfully.' });
        setEditing(null);
        editForm.reset();
        fetchAdmins();
      } else {
        toast.error('Could not update admin', { description: result.error });
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  const onDeleteAdmin = async (adminId: string) => {
    if (adminId === user?.id) {
      toast.error('You cannot delete your own account.');
      return;
    }
    const ok = window.confirm('Delete this admin user? This cannot be undone.');
    if (!ok) return;
    try {
      const res = await fetch(`/api/admin/users?id=${encodeURIComponent(adminId)}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (result.success) {
        toast.success('Admin deleted');
        fetchAdmins();
      } else {
        toast.error('Could not delete admin', { description: result.error });
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-navy-800">Settings</h1>
        <p className="text-navy-500 text-sm">
          Manage admin profile, site configuration, and security settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-card p-2 space-y-1 sticky top-24">
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.key;
              return (
                <button
                  key={sec.key}
                  onClick={() => setActiveSection(sec.key)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/10 to-amber-500/5 text-amber-700 border-l-4 border-amber-500'
                      : 'text-navy-600 hover:bg-navy-50 hover:text-navy-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {sec.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-3">
          {activeSection === 'profile' && (
            <div className="bg-white rounded-xl shadow-card overflow-hidden">
              <div className="px-6 py-5 border-b border-navy-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-navy-800">Admin Profile</h2>
                  <p className="text-xs text-navy-500 mt-0.5">
                    Update your personal information
                  </p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-5 mb-6 p-5 rounded-xl bg-gradient-to-br from-navy-50 to-white border border-navy-100">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-amber-500/20">
                    {user?.name?.charAt(0) || 'L'}
                  </div>
                  <div>
                    <p className="font-semibold text-navy-800 text-lg">{user?.name}</p>
                    <p className="text-sm text-navy-500">{user?.email}</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 text-xs">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Super Admin
                    </div>
                  </div>
                </div>

                <form onSubmit={handleProfile(onProfileSubmit)} className="space-y-5 max-w-lg">
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      {...regProfile('name')}
                      className={`w-full px-4 py-3 rounded-lg border ${errorsProfile.name ? 'border-red-400 bg-red-50' : 'border-navy-200 bg-navy-50/50'} text-navy-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                    />
                    {errorsProfile.name && (
                      <p className="mt-1.5 text-sm text-red-500">{errorsProfile.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      {...regProfile('email')}
                      className={`w-full px-4 py-3 rounded-lg border ${errorsProfile.email ? 'border-red-400 bg-red-50' : 'border-navy-200 bg-navy-50/50'} text-navy-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                    />
                    {errorsProfile.email && (
                      <p className="mt-1.5 text-sm text-red-500">{errorsProfile.email.message}</p>
                    )}
                  </div>
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={subProfile}
                      className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-lg shadow-lg shadow-amber-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {subProfile && (
                        <svg className="animate-spin h-4.5 w-4.5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      )}
                      <Save className="w-4.5 h-4.5" />
                      {subProfile ? 'Saving...' : 'Save Profile'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeSection === 'site' && (
            <div className="bg-white rounded-xl shadow-card overflow-hidden">
              <div className="px-6 py-5 border-b border-navy-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-navy-800">Site Settings</h2>
                  <p className="text-xs text-navy-500 mt-0.5">
                    Configure website title and contact information
                  </p>
                </div>
              </div>
              <div className="p-6">
                <form onSubmit={handleSite(onSiteSubmit)} className="space-y-5 max-w-2xl">
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-2">
                      Site Title
                    </label>
                    <input
                      type="text"
                      {...regSite('siteTitle')}
                      className={`w-full px-4 py-3 rounded-lg border ${errorsSite.siteTitle ? 'border-red-400 bg-red-50' : 'border-navy-200 bg-navy-50/50'} text-navy-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                    />
                    {errorsSite.siteTitle && (
                      <p className="mt-1.5 text-sm text-red-500">{errorsSite.siteTitle.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-2">
                      Site Description
                    </label>
                    <textarea
                      rows={3}
                      {...regSite('siteDescription')}
                      className={`w-full px-4 py-3 rounded-lg border ${errorsSite.siteDescription ? 'border-red-400 bg-red-50' : 'border-navy-200 bg-navy-50/50'} text-navy-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none`}
                    />
                    {errorsSite.siteDescription && (
                      <p className="mt-1.5 text-sm text-red-500">{errorsSite.siteDescription.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        {...regSite('contactEmail')}
                        className={`w-full px-4 py-3 rounded-lg border ${errorsSite.contactEmail ? 'border-red-400 bg-red-50' : 'border-navy-200 bg-navy-50/50'} text-navy-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                      />
                      {errorsSite.contactEmail && (
                        <p className="mt-1.5 text-sm text-red-500">{errorsSite.contactEmail.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        Contact Phone
                      </label>
                      <input
                        type="text"
                        {...regSite('contactPhone')}
                        className={`w-full px-4 py-3 rounded-lg border ${errorsSite.contactPhone ? 'border-red-400 bg-red-50' : 'border-navy-200 bg-navy-50/50'} text-navy-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                      />
                      {errorsSite.contactPhone && (
                        <p className="mt-1.5 text-sm text-red-500">{errorsSite.contactPhone.message}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-2">
                      Office Address
                    </label>
                    <input
                      type="text"
                      {...regSite('address')}
                      className={`w-full px-4 py-3 rounded-lg border ${errorsSite.address ? 'border-red-400 bg-red-50' : 'border-navy-200 bg-navy-50/50'} text-navy-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                    />
                    {errorsSite.address && (
                      <p className="mt-1.5 text-sm text-red-500">{errorsSite.address.message}</p>
                    )}
                  </div>
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={subSite}
                      className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-lg shadow-lg shadow-amber-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {subSite && (
                        <svg className="animate-spin h-4.5 w-4.5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      )}
                      <Save className="w-4.5 h-4.5" />
                      {subSite ? 'Saving...' : 'Save Settings'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeSection === 'password' && (
            <div className="bg-white rounded-xl shadow-card overflow-hidden">
              <div className="px-6 py-5 border-b border-navy-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-navy-800">Change Password</h2>
                  <p className="text-xs text-navy-500 mt-0.5">
                    Update your admin account password for security
                  </p>
                </div>
              </div>
              <div className="p-6">
                <form onSubmit={handlePassword(onPasswordSubmit)} className="space-y-5 max-w-lg">
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      {...regPassword('currentPassword')}
                      className={`w-full px-4 py-3 rounded-lg border ${errorsPassword.currentPassword ? 'border-red-400 bg-red-50' : 'border-navy-200 bg-navy-50/50'} text-navy-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                      placeholder="Enter current password"
                    />
                    {errorsPassword.currentPassword && (
                      <p className="mt-1.5 text-sm text-red-500">{errorsPassword.currentPassword.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      {...regPassword('newPassword')}
                      className={`w-full px-4 py-3 rounded-lg border ${errorsPassword.newPassword ? 'border-red-400 bg-red-50' : 'border-navy-200 bg-navy-50/50'} text-navy-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                      placeholder="At least 8 characters"
                    />
                    {errorsPassword.newPassword && (
                      <p className="mt-1.5 text-sm text-red-500">{errorsPassword.newPassword.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      {...regPassword('confirmPassword')}
                      className={`w-full px-4 py-3 rounded-lg border ${errorsPassword.confirmPassword ? 'border-red-400 bg-red-50' : 'border-navy-200 bg-navy-50/50'} text-navy-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                      placeholder="Re-enter new password"
                    />
                    {errorsPassword.confirmPassword && (
                      <p className="mt-1.5 text-sm text-red-500">{errorsPassword.confirmPassword.message}</p>
                    )}
                  </div>
                  <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
                    <div className="text-xs text-navy-500">
                      <p className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                        Use a strong password with letters, numbers & symbols
                      </p>
                    </div>
                    <button
                      type="submit"
                      disabled={subPassword}
                      className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-lg shadow-lg shadow-amber-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {subPassword && (
                        <svg className="animate-spin h-4.5 w-4.5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      )}
                      <Lock className="w-4.5 h-4.5" />
                      {subPassword ? 'Changing...' : 'Change Password'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeSection === 'admins' && (
            <>
              <div className="bg-white rounded-xl shadow-card overflow-hidden">
                <div className="px-6 py-5 border-b border-navy-100 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-navy-800">Admin Users</h2>
                      <p className="text-xs text-navy-500 mt-0.5">
                        Create and manage accounts with admin access
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      createForm.reset();
                      setShowCreateModal(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-lg shadow-md shadow-amber-500/20 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Add Admin
                  </button>
                </div>
                <div className="p-6">
                  {adminsLoading ? (
                    <div className="py-12 text-center text-navy-500 text-sm">Loading adminsâ€¦</div>
                  ) : admins.length === 0 ? (
                    <div className="py-12 text-center text-navy-500 text-sm">No admin users found.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-navy-500 border-b border-navy-100">
                            <th className="px-3 py-3 font-semibold">Name</th>
                            <th className="px-3 py-3 font-semibold">Email</th>
                            <th className="px-3 py-3 font-semibold">Role</th>
                            <th className="px-3 py-3 font-semibold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {admins.map((a) => {
                            const isSelf = a.id === user?.id;
                            return (
                              <tr
                                key={a.id}
                                className="border-b border-navy-50 last:border-b-0 hover:bg-navy-50/40"
                              >
                                <td className="px-3 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                      {a.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <p className="font-semibold text-navy-800">{a.name}</p>
                                      {isSelf && (
                                        <span className="text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full inline-block mt-0.5">
                                          You
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-3 py-4 text-navy-600">{a.email}</td>
                                <td className="px-3 py-4">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <ShieldCheck className="w-3 h-3" />
                                    Administrator
                                  </span>
                                </td>
                                <td className="px-3 py-4 text-right">
                                  <div className="inline-flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => setEditing(a)}
                                      className="p-2 rounded-lg text-navy-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                                      aria-label={`Edit ${a.name}`}
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => onDeleteAdmin(a.id)}
                                      disabled={isSelf}
                                      className={`p-2 rounded-lg transition-colors ${
                                        isSelf
                                          ? 'text-navy-200 cursor-not-allowed'
                                          : 'text-navy-500 hover:text-red-700 hover:bg-red-50'
                                      }`}
                                      aria-label={`Delete ${a.name}`}
                                      title={isSelf ? "You can't delete your own account" : ''}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Create Admin Modal */}
              {showCreateModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-950/50 backdrop-blur-sm">
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-navy-100 flex items-center justify-between">
                      <h3 className="font-semibold text-navy-800">Create New Admin</h3>
                      <button
                        type="button"
                        onClick={() => setShowCreateModal(false)}
                        className="p-1.5 rounded-lg text-navy-500 hover:bg-navy-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <form
                      onSubmit={createForm.handleSubmit(onCreateAdmin)}
                      className="p-6 space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-1.5">
                          Full Name
                        </label>
                        <input
                          type="text"
                          {...createForm.register('name')}
                          className="w-full px-4 py-2.5 rounded-lg border border-navy-200 bg-navy-50/50 text-navy-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="e.g. Abebe Bekele"
                        />
                        {createForm.formState.errors.name && (
                          <p className="mt-1 text-xs text-red-500">
                            {createForm.formState.errors.name.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-1.5">
                          Email
                        </label>
                        <input
                          type="email"
                          {...createForm.register('email')}
                          className="w-full px-4 py-2.5 rounded-lg border border-navy-200 bg-navy-50/50 text-navy-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="abebe@lamed.com"
                        />
                        {createForm.formState.errors.email && (
                          <p className="mt-1 text-xs text-red-500">
                            {createForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-1.5">
                          Password
                        </label>
                        <input
                          type="password"
                          {...createForm.register('password')}
                          className="w-full px-4 py-2.5 rounded-lg border border-navy-200 bg-navy-50/50 text-navy-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="At least 8 characters"
                        />
                        {createForm.formState.errors.password && (
                          <p className="mt-1 text-xs text-red-500">
                            {createForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-1.5">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          {...createForm.register('confirmPassword')}
                          className="w-full px-4 py-2.5 rounded-lg border border-navy-200 bg-navy-50/50 text-navy-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                        {createForm.formState.errors.confirmPassword && (
                          <p className="mt-1 text-xs text-red-500">
                            {createForm.formState.errors.confirmPassword.message}
                          </p>
                        )}
                      </div>
                      <div className="pt-2 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowCreateModal(false)}
                          className="px-4 py-2.5 rounded-lg text-navy-600 border border-navy-200 hover:bg-navy-50 font-medium transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={createForm.formState.isSubmitting}
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-lg shadow-md disabled:opacity-60"
                        >
                          <Save className="w-4 h-4" />
                          {createForm.formState.isSubmitting ? 'Creatingâ€¦' : 'Create Admin'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Edit Admin Modal */}
              {editing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-950/50 backdrop-blur-sm">
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-navy-100 flex items-center justify-between">
                      <h3 className="font-semibold text-navy-800">Edit Admin</h3>
                      <button
                        type="button"
                        onClick={() => setEditing(null)}
                        className="p-1.5 rounded-lg text-navy-500 hover:bg-navy-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <form
                      onSubmit={editForm.handleSubmit(onEditAdmin)}
                      className="p-6 space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-1.5">
                          Full Name
                        </label>
                        <input
                          type="text"
                          {...editForm.register('name')}
                          className="w-full px-4 py-2.5 rounded-lg border border-navy-200 bg-navy-50/50 text-navy-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                        {editForm.formState.errors.name && (
                          <p className="mt-1 text-xs text-red-500">
                            {editForm.formState.errors.name.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-1.5">
                          Email
                        </label>
                        <input
                          type="email"
                          {...editForm.register('email')}
                          className="w-full px-4 py-2.5 rounded-lg border border-navy-200 bg-navy-50/50 text-navy-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                        {editForm.formState.errors.email && (
                          <p className="mt-1 text-xs text-red-500">
                            {editForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-1.5">
                          New Password <span className="text-navy-400 font-normal">(leave empty to keep)</span>
                        </label>
                        <input
                          type="password"
                          {...editForm.register('password')}
                          className="w-full px-4 py-2.5 rounded-lg border border-navy-200 bg-navy-50/50 text-navy-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="At least 8 characters to change"
                        />
                        {editForm.formState.errors.password && (
                          <p className="mt-1 text-xs text-red-500">
                            {editForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-1.5">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          {...editForm.register('confirmPassword')}
                          className="w-full px-4 py-2.5 rounded-lg border border-navy-200 bg-navy-50/50 text-navy-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                        {editForm.formState.errors.confirmPassword && (
                          <p className="mt-1 text-xs text-red-500">
                            {editForm.formState.errors.confirmPassword.message}
                          </p>
                        )}
                      </div>
                      <div className="pt-2 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditing(null)}
                          className="px-4 py-2.5 rounded-lg text-navy-600 border border-navy-200 hover:bg-navy-50 font-medium transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={editForm.formState.isSubmitting}
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-lg shadow-md disabled:opacity-60"
                        >
                          <Save className="w-4 h-4" />
                          {editForm.formState.isSubmitting ? 'Savingâ€¦' : 'Save Changes'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

