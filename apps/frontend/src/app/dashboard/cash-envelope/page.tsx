'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import {
  Wallet,
  ShoppingBag,
  Utensils,
  Car,
  Home,
  Plus,
  MinusCircle,
  CheckCircle,
} from 'lucide-react';

interface Envelope {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  icon: string;
  color: string;
}

export default function CashEnvelope() {
  const [envelopes, setEnvelopes] = useState<Envelope[]>([
    { id: '1', name: 'Groceries', allocated: 5000, spent: 3200, icon: 'shopping', color: 'blue' },
    { id: '2', name: 'Food', allocated: 3000, spent: 2100, icon: 'food', color: 'green' },
    { id: '3', name: 'Transport', allocated: 2000, spent: 1500, icon: 'car', color: 'purple' },
    { id: '4', name: 'Bills', allocated: 4000, spent: 4000, icon: 'home', color: 'red' },
  ]);

  // 🔥 Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'spend' | 'add'>('spend');
  const [amount, setAmount] = useState('');

  const totalAllocated = envelopes.reduce((s, e) => s + e.allocated, 0);
  const totalSpent = envelopes.reduce((s, e) => s + e.spent, 0);
  const totalRemaining = totalAllocated - totalSpent;

  // ✅ Open Modal
  const openModal = (id: string, type: 'spend' | 'add') => {
    setSelectedId(id);
    setActionType(type);
    setAmount('');
    setShowModal(true);
  };

  // ✅ Confirm Action
  const handleConfirm = () => {
    if (!selectedId) return;

    const value = Number(amount);
    if (!value || value <= 0) return;

    setEnvelopes(prev =>
      prev.map(env => {
        if (env.id !== selectedId) return env;

        if (actionType === 'spend') {
          const remaining = env.allocated - env.spent;
          if (value > remaining) {
            alert('Not enough money in this envelope!');
            return env;
          }
          return { ...env, spent: env.spent + value };
        }

        return { ...env, allocated: env.allocated + value };
      })
    );

    setShowModal(false);
  };

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'shopping': return ShoppingBag;
      case 'food': return Utensils;
      case 'car': return Car;
      case 'home': return Home;
      default: return Wallet;
    }
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, any> = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', bar: 'bg-blue-500' },
      green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', bar: 'bg-green-500' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300', bar: 'bg-purple-500' },
      red: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', bar: 'bg-red-500' },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Wallet className="w-6 h-6 text-green-600" />
          Cash Envelope System
        </h1>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p>Total Budget</p>
            <p className="text-2xl font-black">{formatCurrency(totalAllocated)}</p>
          </div>
          <div>
            <p>Spent</p>
            <p className="text-2xl font-black">{formatCurrency(totalSpent)}</p>
          </div>
          <div>
            <p>Remaining</p>
            <p className="text-2xl font-black">{formatCurrency(totalRemaining)}</p>
          </div>
        </div>
      </div>

      {/* Envelopes */}
      <div className="grid gap-4 md:grid-cols-2">
        {envelopes.map(envelope => {
          const Icon = getIcon(envelope.icon);
          const colors = getColorClasses(envelope.color);
          const remaining = envelope.allocated - envelope.spent;
          const pct = (envelope.spent / envelope.allocated) * 100;
          const isEmpty = remaining <= 0;

          return (
            <div key={envelope.id} className={`bg-white rounded-2xl border-2 ${colors.border} p-6 shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 ${colors.bg} rounded-xl`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <h3 className="font-bold text-lg">{envelope.name}</h3>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Allocated:</span>
                  <span className="font-bold">{formatCurrency(envelope.allocated)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Spent:</span>
                  <span className="font-bold text-red-600">-{formatCurrency(envelope.spent)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Remaining:</span>
                  <span className={isEmpty ? 'text-red-600' : 'text-green-600'}>
                    {formatCurrency(Math.max(0, remaining))}
                  </span>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-4 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className={`${colors.bar} h-full`} style={{ width: `${Math.min(pct, 100)}%` }} />
              </div>

              {/* Buttons */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => openModal(envelope.id, 'spend')}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 rounded-lg text-xs font-bold"
                >
                  <MinusCircle className="w-4 h-4" />
                  Spend
                </button>

                <button
                  onClick={() => openModal(envelope.id, 'add')}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-bold"
                >
                  <Plus className="w-4 h-4" />
                  Add Cash
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔥 Custom Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-xl space-y-4">
            <h2 className="text-lg font-bold">
              {actionType === 'spend' ? 'Spend Money' : 'Add Cash'}
            </h2>

            <input
              type="number"
              placeholder="Enter amount"
              className="w-full border rounded-lg px-3 py-2"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}