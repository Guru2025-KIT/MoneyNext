'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/store/auth';
import { CheckCircle, TrendingUp, Target, Sparkles } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    incomeTier: 'MIDDLE',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authApi.signup(formData);
      setUser(result.user);
      
      // Redirect based on income tier
      if (result.user.incomeTier === 'LOW') {
        router.push('/dashboard/low');
      } else if (result.user.incomeTier === 'MIDDLE') {
        router.push('/dashboard/middle');
      } else {
        router.push('/dashboard/high');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Signup failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center min-h-[calc(100vh-4rem)]">
            
            <div className="order-2 md:order-1">
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  Start your financial<br />journey today
                </h1>
                <p className="text-lg text-gray-600">
                  Join thousands managing their money smarter
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Track every penny</h3>
                    <p className="text-gray-600 text-xs">Easy expense tracking and budgeting</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Smart budgets and goals</h3>
                    <p className="text-gray-600 text-xs">Set targets with intelligent alerts</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Reach goals faster</h3>
                    <p className="text-gray-600 text-xs">Save more with smart insights</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white">
                <p className="font-semibold mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Free to get started
                </p>
                <p className="text-sm opacity-90">No credit card required. Start in 2 minutes.</p>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
                <div className="mb-6">
                  <div className="w-16 h-16 mb-4 rounded-full overflow-hidden bg-white shadow-md">
                    <Image
                      src="/logo.png"
                      alt="MoneyNext"
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
                  <p className="text-gray-600 mt-1">Get started with MoneyNext today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3" suppressHydrationWarning>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">First name</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="John"
                        required
                        autoComplete="given-name"
                        suppressHydrationWarning
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Last name</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Doe"
                        required
                        autoComplete="family-name"
                        suppressHydrationWarning
                      />
                    </div>
                  </div>

                  <div suppressHydrationWarning>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                      suppressHydrationWarning
                    />
                  </div>

                  <div suppressHydrationWarning>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="At least 6 characters"
                      required
                      minLength={6}
                      autoComplete="new-password"
                      suppressHydrationWarning
                    />
                  </div>

                  <div suppressHydrationWarning>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone (optional)</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+91 98765 43210"
                      autoComplete="tel"
                      suppressHydrationWarning
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your income level</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        {value: 'LOW', label: 'Basic', range: '< 25K'},
                        {value: 'MIDDLE', label: 'Standard', range: '25K-1L'},
                        {value: 'HIGH', label: 'Premium', range: '> 1L'},
                      ].map((plan) => (
                        <label
                          key={plan.value}
                          className={`cursor-pointer border-2 rounded-lg p-3 text-center transition ${
                            formData.incomeTier === plan.value
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="tier"
                            value={plan.value}
                            checked={formData.incomeTier === plan.value}
                            onChange={(e) => setFormData({...formData, incomeTier: e.target.value})}
                            className="sr-only"
                          />
                          <div className="font-semibold text-sm text-gray-900">{plan.label}</div>
                          <div className="text-xs text-gray-600 mt-0.5">{plan.range}</div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating account...' : 'Create account'}
                  </button>

                  <p className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                      Sign in
                    </Link>
                  </p>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
