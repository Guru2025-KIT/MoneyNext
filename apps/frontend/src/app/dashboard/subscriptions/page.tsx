'use client';

import { useState, useEffect } from 'react';
import { transactionsApi } from '@/lib/api/transactions';
import { formatCurrency } from '@/lib/utils';
import { Repeat, AlertTriangle, CheckCircle, X, Plus, Calendar, DollarSign, TrendingUp, Zap, CreditCard } from 'lucide-react';

interface Subscription {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'yearly' | 'weekly';
  nextBilling: string;
  category: string;
  autoDetected: boolean;
  status: 'active' | 'warning' | 'expiring';
}

const SUBSCRIPTION_KEYWORDS = ['netflix', 'spotify', 'amazon prime', 'youtube', 'apple', 'microsoft', 'adobe', 'gym', 'fitness', 'subscription', 'membership', 'plan', 'premium', 'pro'];

export default function SubscriptionTracker() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newSub, setNewSub] = useState({ name: '', amount: '', frequency: 'monthly' as const, nextBilling: '', category: 'Entertainment' });

  useEffect(() => {
    loadAndDetect();
  }, []);

  const loadAndDetect = async () => {
    try {
      const txns = await transactionsApi.getAll();
      setTransactions(txns || []);
      
      // Auto-detect subscriptions from recurring transactions
      const detected = autoDetectSubscriptions(txns || []);
      setSubscriptions(detected);
    } catch (err) {
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const autoDetectSubscriptions = (txns: any[]): Subscription[] => {
    const subs: Subscription[] = [];
    const grouped: Record<string, { amounts: number[]; dates: string[]; count: number }> = {};

    // Group similar transactions
    txns.filter((t: any) => t.type === 'EXPENSE').forEach((t: any) => {
      const name = t.description.toLowerCase();
      const isSubKeyword = SUBSCRIPTION_KEYWORDS.some(kw => name.includes(kw));
      
      if (isSubKeyword) {
        const key = t.description;
        if (!grouped[key]) grouped[key] = { amounts: [], dates: [], count: 0 };
        grouped[key].amounts.push(Number(t.amount));
        grouped[key].dates.push(t.date);
        grouped[key].count += 1;
      }
    });

    // Analyze patterns
    Object.entries(grouped).forEach(([name, data], idx) => {
      if (data.count < 2) return;

      // Check if amounts are consistent (recurring)
      const avgAmount = data.amounts.reduce((s, v) => s + v, 0) / data.count;
      const variance = data.amounts.reduce((sum, amt) => sum + Math.pow(amt - avgAmount, 2), 0) / data.count;
      const isConsistent = Math.sqrt(variance) < avgAmount * 0.1; // Within 10% variation

      if (isConsistent) {
        // Estimate frequency
        const sortedDates = data.dates.sort();
        const daysBetween = sortedDates.slice(1).reduce((sum, date, i) => {
          return sum + (new Date(date).getTime() - new Date(sortedDates[i]).getTime()) / 86400000;
        }, 0) / (sortedDates.length - 1);

        let frequency: 'monthly' | 'yearly' | 'weekly' = 'monthly';
        if (daysBetween < 10) frequency = 'weekly';
        else if (daysBetween > 300) frequency = 'yearly';

        const lastDate = new Date(sortedDates[sortedDates.length - 1]);
        let nextBilling = new Date(lastDate);
        if (frequency === 'weekly') nextBilling.setDate(lastDate.getDate() + 7);
        else if (frequency === 'monthly') nextBilling.setMonth(lastDate.getMonth() + 1);
        else nextBilling.setFullYear(lastDate.getFullYear() + 1);

        const daysUntil = Math.ceil((nextBilling.getTime() - Date.now()) / 86400000);
        let status: 'active' | 'warning' | 'expiring' = 'active';
        if (daysUntil < 7) status = 'expiring';
        else if (daysUntil < 0) status = 'warning';

        subs.push({
          id: `auto-${idx}`,
          name,
          amount: avgAmount,
          frequency,
          nextBilling: nextBilling.toISOString().split('T')[0],
          category: 'Entertainment',
          autoDetected: true,
          status,
        });
      }
    });

    return subs;
  };

  const addManualSubscription = () => {
    if (!newSub.name || !newSub.amount || !newSub.nextBilling) return;
    
    const sub: Subscription = {
      id: `manual-${Date.now()}`,
      name: newSub.name,
      amount: Number(newSub.amount),
      frequency: newSub.frequency,
      nextBilling: newSub.nextBilling,
      category: newSub.category,
      autoDetected: false,
      status: 'active',
    };

    setSubscriptions([...subscriptions, sub]);
    setNewSub({ name: '', amount: '', frequency: 'monthly', nextBilling: '', category: 'Entertainment' });
    setShowAddForm(false);
  };

  const removeSub = (id: string) => {
    setSubscriptions(subscriptions.filter(s => s.id !== id));
  };

  const totalMonthly = subscriptions.reduce((sum, sub) => {
    if (sub.frequency === 'monthly') return sum + sub.amount;
    if (sub.frequency === 'yearly') return sum + (sub.amount / 12);
    if (sub.frequency === 'weekly') return sum + (sub.amount * 4.33);
    return sum;
  }, 0);

  const totalYearly = totalMonthly * 12;

  const daysUntil = (dateStr: string) => Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-200 border-t-violet-600"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Repeat className="w-6 h-6 text-purple-600" />Subscription Tracker
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Auto-detect and manage all your recurring expenses</p>
        </div>
        <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700">
          <Plus className="w-4 h-4" />Add Manual
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5" />
            <p className="text-sm font-medium opacity-90">Monthly Total</p>
          </div>
          <p className="text-3xl font-black mb-1">{formatCurrency(totalMonthly)}</p>
          <p className="text-xs opacity-80">{formatCurrency(totalYearly)}/year</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Repeat className="w-5 h-5 text-blue-600" />
            <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
          </div>
          <p className="text-3xl font-black text-gray-900 mb-1">{subscriptions.length}</p>
          <p className="text-xs text-gray-500">{subscriptions.filter(s => s.autoDetected).length} auto-detected</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <p className="text-sm font-medium text-gray-600">Due Soon</p>
          </div>
          <p className="text-3xl font-black text-gray-900 mb-1">
            {subscriptions.filter(s => daysUntil(s.nextBilling) <= 7).length}
          </p>
          <p className="text-xs text-gray-500">Billing in next 7 days</p>
        </div>
      </div>

      {/* Auto-Detection Info */}
      {subscriptions.some(s => s.autoDetected) && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <Zap className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-900 text-sm">AI Auto-Detection Enabled</p>
            <p className="text-xs text-green-700 mt-0.5">
              Found {subscriptions.filter(s => s.autoDetected).length} recurring subscriptions by analyzing your transaction patterns
            </p>
          </div>
        </div>
      )}

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl border-2 border-purple-200 p-5 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900">Add Subscription Manually</h3>
            <button onClick={() => setShowAddForm(false)}><X className="w-5 h-5 text-gray-400 hover:text-gray-600" /></button>
          </div>
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Name *</label>
                <input value={newSub.name} onChange={e => setNewSub({...newSub, name: e.target.value})} placeholder="e.g. Netflix" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Amount (₹) *</label>
                <input type="number" value={newSub.amount} onChange={e => setNewSub({...newSub, amount: e.target.value})} placeholder="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Frequency</label>
                <select value={newSub.frequency} onChange={e => setNewSub({...newSub, frequency: e.target.value as any})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Next Billing *</label>
                <input type="date" value={newSub.nextBilling} onChange={e => setNewSub({...newSub, nextBilling: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <button onClick={addManualSubscription} className="w-full py-2.5 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700">
              Add Subscription
            </button>
          </div>
        </div>
      )}

      {/* Subscriptions List */}
      <div className="space-y-3">
        {subscriptions.length > 0 ? (
          subscriptions.map(sub => {
            const days = daysUntil(sub.nextBilling);
            const statusColors = { active: 'border-green-200 bg-green-50', warning: 'border-red-200 bg-red-50', expiring: 'border-orange-200 bg-orange-50' };
            
            return (
              <div key={sub.id} className={`bg-white rounded-2xl border-2 ${statusColors[sub.status]} p-5 shadow-sm`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 text-lg">{sub.name}</h3>
                      {sub.autoDetected && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">AUTO</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{sub.category} • {sub.frequency}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-2xl font-black text-purple-600">{formatCurrency(sub.amount)}</p>
                      <p className="text-xs text-gray-400">per {sub.frequency === 'monthly' ? 'month' : sub.frequency === 'yearly' ? 'year' : 'week'}</p>
                    </div>
                    <button onClick={() => removeSub(sub.id)} className="text-gray-400 hover:text-red-500">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Next billing: <span className="font-semibold text-gray-900">{new Date(sub.nextBilling).toLocaleDateString()}</span>
                    </span>
                  </div>
                  {days <= 7 && days >= 0 && (
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                      Due in {days} day{days !== 1 ? 's' : ''}
                    </span>
                  )}
                  {days < 0 && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                      OVERDUE
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <Repeat className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-600 font-medium">No subscriptions detected</p>
            <p className="text-xs text-gray-400 mt-1">Add transactions or manually add subscriptions</p>
          </div>
        )}
      </div>

      {/* Savings Tip */}
      {subscriptions.length > 3 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="font-semibold text-amber-900 text-sm mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />💡 Money-Saving Tip
          </p>
          <p className="text-xs text-amber-800">
            You're spending {formatCurrency(totalMonthly)}/month on subscriptions. 
            Review unused services — canceling just 2-3 could save you {formatCurrency(totalMonthly * 0.3)}/month!
          </p>
        </div>
      )}
    </div>
  );
}