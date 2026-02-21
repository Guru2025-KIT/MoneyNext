'use client';

import { useEffect, useState } from 'react';
import { accountsApi } from '@/lib/api/accounts';
import { formatCurrency } from '@/lib/utils';
import { Plus, Wallet, TrendingUp, Building2, CreditCard, Pencil, Trash2 } from 'lucide-react';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'SAVINGS',
    balance: '',
    currency: 'INR',
  });

  const accountTypes = [
    { value: 'SAVINGS', label: 'Savings Account', icon: Wallet, color: 'blue' },
    { value: 'CHECKING', label: 'Checking Account', icon: CreditCard, color: 'green' },
    { value: 'INVESTMENT', label: 'Investment', icon: TrendingUp, color: 'purple' },
    { value: 'CREDIT', label: 'Credit Card', icon: CreditCard, color: 'red' },
    { value: 'CASH', label: 'Cash', icon: Wallet, color: 'orange' },
  ];

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const data = await accountsApi.getAll();
      setAccounts(data);
    } catch (error) {
      console.error('Failed to load accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const accountData = {
        ...formData,
        balance: parseFloat(formData.balance),
      };

      if (editingId) {
        await accountsApi.update(editingId, accountData);
      } else {
        await accountsApi.create(accountData);
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', type: 'SAVINGS', balance: '', currency: 'INR' });
      loadAccounts();
    } catch (error) {
      console.error('Failed to save account:', error);
      alert('Failed to save account. Please try again.');
    }
  };

  const handleEdit = (account: any) => {
    setFormData({
      name: account.name,
      type: account.type,
      balance: account.balance.toString(),
      currency: account.currency,
    });
    setEditingId(account.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this account?')) return;
    try {
      await accountsApi.delete(id);
      loadAccounts();
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  const getTypeData = (type: string) => accountTypes.find(t => t.value === type) || accountTypes[0];

  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance || 0), 0);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
          <p className="text-gray-600 mt-1">Manage your bank accounts and balances</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ name: '', type: 'SAVINGS', balance: '', currency: 'INR' });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          Add Account
        </button>
      </div>

      {/* Total Balance Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
        <p className="text-sm opacity-90 mb-2">Total Balance</p>
        <p className="text-4xl font-bold mb-4">{formatCurrency(totalBalance)}</p>
        <div className="flex items-center gap-4 text-sm opacity-90">
          <span>{accounts.length} accounts</span>
          <span>•</span>
          <span>Updated now</span>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {editingId ? 'Edit Account' : 'Add New Account'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Account Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., HDFC Savings"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Account Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {accountTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Balance</label>
                <input
                  type="number"
                  value={formData.balance}
                  onChange={(e) => setFormData({...formData, balance: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ name: '', type: 'SAVINGS', balance: '', currency: 'INR' });
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {editingId ? 'Update Account' : 'Add Account'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Accounts Grid */}
      {accounts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => {
            const typeData = getTypeData(account.type);
            const Icon = typeData.icon;
            const isNegative = Number(account.balance) < 0;

            return (
              <div
                key={account.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-${typeData.color}-100 rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${typeData.color}-600`} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(account)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 text-lg mb-1">{account.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{typeData.label}</p>

                <div className={`text-3xl font-bold ${isNegative ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatCurrency(account.balance)}
                </div>
              </div>
            );
          })}
        </div>
      ) : !showForm && (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No accounts yet</h3>
          <p className="text-gray-600 mb-6">Add your first account to start tracking your finances</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Add Your First Account
          </button>
        </div>
      )}
    </div>
  );
}
