'use client';

import { useEffect, useState } from 'react';
import { budgetsApi } from '@/lib/api/budgets';
import { transactionsApi } from '@/lib/api/transactions';
import { formatCurrency } from '@/lib/utils';
import { Plus, Target, TrendingUp, AlertCircle, CheckCircle, Trash2, Edit2, X, PlusCircle } from 'lucide-react';

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [contributeModal, setContributeModal] = useState<any>(null);
  const [contributeAmount, setContributeAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '', amount: '', period: 'MONTHLY', category: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [buds, txns] = await Promise.all([
        budgetsApi.getAll(),
        transactionsApi.getAll(),
      ]);
      setBudgets(buds);
      setTransactions(txns);
    } catch (err) {
      console.error('Failed to load budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await budgetsApi.create({
        name: formData.name,
        amount: Number(formData.amount),
        period: formData.period,
        category: formData.category || null,
        spent: 0,
      });
      setShowForm(false);
      setFormData({ name: '', amount: '', period: 'MONTHLY', category: '' });
      setSuccess('Budget created successfully!');
      setTimeout(() => setSuccess(''), 3000);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create budget');
    }
  };

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const amount = Number(contributeAmount);
      if (!amount || amount <= 0) {
        setError('Please enter a valid amount');
        return;
      }
      const newSpent = Number(contributeModal.spent) + amount;
      await budgetsApi.update(contributeModal.id, {
        ...contributeModal,
        spent: newSpent,
      });
      setContributeModal(null);
      setContributeAmount('');
      setSuccess('Spending recorded successfully!');
      setTimeout(() => setSuccess(''), 3000);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update budget');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this budget?')) return;
    try {
      await budgetsApi.delete(id);
      await loadData();
    } catch (err) {
      setError('Failed to delete budget');
    }
  };

  const handleReset = async (budget: any) => {
    if (!confirm('Reset spending to 0 for this budget?')) return;
    try {
      await budgetsApi.update(budget.id, { ...budget, spent: 0 });
      setSuccess('Budget reset!');
      setTimeout(() => setSuccess(''), 3000);
      await loadData();
    } catch (err) {
      setError('Failed to reset budget');
    }
  };

  const totalBudgeted = budgets.reduce((sum, b) => sum + Number(b.amount), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + Number(b.spent), 0);
  const totalRemaining = totalBudgeted - totalSpent;
  const overallPct = totalBudgeted > 0 ? Math.min((totalSpent / totalBudgeted) * 100, 100) : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Contribute Modal */}
      {contributeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Record Spending</h3>
              <button onClick={() => { setContributeModal(null); setContributeAmount(''); setError(''); }}>
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl mb-4">
              <p className="text-sm text-gray-600 mb-1">Budget: <span className="font-bold text-gray-900">{contributeModal.name}</span></p>
              <p className="text-sm text-gray-600">
                Spent: <span className="font-bold text-red-600">{formatCurrency(contributeModal.spent)}</span>
                {' '}of <span className="font-bold text-gray-900">{formatCurrency(contributeModal.amount)}</span>
              </p>
              <p className="text-sm text-gray-600">
                Remaining: <span className="font-bold text-green-600">
                  {formatCurrency(Math.max(0, Number(contributeModal.amount) - Number(contributeModal.spent)))}
                </span>
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-4 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <form onSubmit={handleContribute} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount Spent (INR)</label>
                <input
                  type="number"
                  value={contributeAmount}
                  onChange={(e) => setContributeAmount(e.target.value)}
                  placeholder="Enter amount spent"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  min="1"
                  suppressHydrationWarning
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setContributeModal(null); setContributeAmount(''); setError(''); }}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Record Spending
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
          <p className="text-gray-600 mt-1">Track and manage your spending limits</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold shadow-sm"
        >
          <Plus className="w-5 h-5" />
          New Budget
        </button>
      </div>

      {success && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">
          <CheckCircle className="w-5 h-5" />
          {success}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Budgeted</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBudgeted)}</p>
          <p className="text-xs text-gray-400 mt-1">{budgets.length} active budgets</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Spent</p>
          <p className={`text-2xl font-bold ${overallPct > 90 ? 'text-red-600' : 'text-orange-600'}`}>
            {formatCurrency(totalSpent)}
          </p>
          <div className="mt-2 h-1.5 bg-gray-100 rounded-full">
            <div
              className={`h-full rounded-full transition-all ${overallPct > 90 ? 'bg-red-500' : 'bg-orange-500'}`}
              style={{ width: `${overallPct}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">{overallPct.toFixed(0)}% of budget used</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Remaining</p>
          <p className={`text-2xl font-bold ${totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(Math.abs(totalRemaining))}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {totalRemaining >= 0 ? 'Available to spend' : 'Over budget!'}
          </p>
        </div>
      </div>

      {/* Create Budget Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Create New Budget</h3>
            <button onClick={() => setShowForm(false)}>
              <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-4 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleCreate} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Budget Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Monthly Groceries"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                suppressHydrationWarning
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Budget Amount (INR)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="e.g. 5000"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                suppressHydrationWarning
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Period</label>
              <select
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category (Optional)</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills">Bills</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Create Budget
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Budgets List */}
      {budgets.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium mb-4">No budgets yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Create Your First Budget
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {budgets.map((budget: any) => {
            const spent = Number(budget.spent) || 0;
            const limit = Number(budget.amount) || 1;
            const pct = Math.min((spent / limit) * 100, 100);
            const remaining = limit - spent;
            const isOver = pct >= 100;
            const isWarning = pct >= 80 && pct < 100;

            return (
              <div key={budget.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{budget.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {budget.category && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{budget.category}</span>
                      )}
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{budget.period}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isOver && <AlertCircle className="w-5 h-5 text-red-500" />}
                    {!isOver && pct >= 80 && <AlertCircle className="w-5 h-5 text-orange-500" />}
                    <button
                      onClick={() => handleDelete(budget.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar with hover tooltip */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-600">Spent: <span className="font-bold text-gray-900">{formatCurrency(spent)}</span></span>
                    <span className="text-gray-600">Limit: <span className="font-bold text-gray-900">{formatCurrency(limit)}</span></span>
                  </div>
                  <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden group">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOver ? 'bg-red-500' : isWarning ? 'bg-orange-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                    {/* Hover tooltip */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs font-bold text-white drop-shadow">{pct.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className={`font-semibold ${isOver ? 'text-red-600' : isWarning ? 'text-orange-600' : 'text-blue-600'}`}>
                      {pct.toFixed(0)}% used
                    </span>
                    <span className={`font-semibold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {remaining >= 0 ? `${formatCurrency(remaining)} left` : `${formatCurrency(Math.abs(remaining))} over!`}
                    </span>
                  </div>
                </div>

                {isOver && (
                  <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg mb-3 text-xs text-red-700">
                    <AlertCircle className="w-4 h-4" />
                    Budget exceeded! Consider reducing spending.
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => { setContributeModal(budget); setContributeAmount(''); setError(''); }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Record Spending
                  </button>
                  <button
                    onClick={() => handleReset(budget)}
                    className="px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                  >
                    Reset
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}