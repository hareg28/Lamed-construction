'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuthStore } from '@lamed/shared';
import { useEffect } from 'react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    const result = await login(data);
    if (result.success) {
      toast.success('Login successful', {
        description: 'Welcome back to Lamed Admin Dashboard',
      });
      router.push('/');
      router.refresh();
    } else {
      toast.error('Login failed', {
        description: result.error || 'Invalid email or password',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden grain-texture"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      }}
    >
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(217, 119, 6, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)`,
        }}
      />
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-navy-100/20">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 mb-4 shadow-lg shadow-amber-500/20">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-navy-800 font-serif-display mb-1">
                Lamed Construction
              </h1>
              <p className="text-sm text-navy-500">Admin Dashboard</p>
            </div>

            <h2 className="text-xl font-semibold text-navy-800 mb-6 text-center">
              Sign In
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-400 bg-red-50' : 'border-navy-200 bg-navy-50/50'} text-navy-800 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                  placeholder="admin@lamed.com"
                />
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  {...register('password')}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-400 bg-red-50' : 'border-navy-200 bg-navy-50/50'} text-navy-800 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-lg shadow-lg shadow-amber-500/25 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed transform hover:shadow-xl"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-navy-100">
              <div className="bg-navy-50 rounded-lg p-3 text-center">
                <p className="text-xs text-navy-500">
                  <span className="font-medium text-navy-600">Demo Account:</span>
                </p>
                <p className="text-xs text-navy-600 mt-1 font-mono">
                  admin@lamed.com / admin123
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-navy-400 text-xs mt-6">
          &copy; {new Date().getFullYear()} Lamed Construction PLC. All rights reserved.
        </p>
      </div>
    </div>
  );
}

