'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import {
  PiggyBank,
  Coins,
  TrendingUp,
  Zap,
  CheckCircle,
  Target,
  Plus,
  X,
} from 'lucide-react';

interface SavingsRule {
  id: string;
  name: string;
  type: 'roundup' | 'daily' | 'weekly';
  amount: number;
  enabled: boolean;
  savedThisMonth: number;
}

export default function MicroSavings() {
  const [rules, setRules] = useState<SavingsRule[]>([
    {
      id: '1',
      name: 'Round-Up Rule',
      type: 'roundup',
      amount: 0,
      enabled: true,
      savedThisMonth: 847,
    },
    {
      id: '2',
      name: 'Daily ₹10',
      type: 'daily',
      amount: 10,
      enabled: true,
      savedThisMonth: 300,
    },
    {
      id: '3',
      name: 'Weekly ₹50',
      type: 'weekly',
      amount: 50,
      enabled: false,
      savedThisMonth: 0,
    },
  ]);

  const [showAddRule, setShowAddRule] = useState(false);

  const [newRule, setNewRule] = useState({
    name: '',
    type: 'daily' as 'roundup' | 'daily' | 'weekly',
    amount: 10,
  });

  const [monthlyGoal, setMonthlyGoal] = useState(1000);

  const totalSaved = rules.reduce((s, r) => s + r.savedThisMonth, 0);

  const activeRules = rules.filter((r) => r.enabled).length;

  const projectedMonthly = rules.reduce((s, r) => {
    if (!r.enabled) return s;
    if (r.type === 'daily') return s + r.amount * 30;
    if (r.type === 'weekly') return s + r.amount * 4;
    if (r.type === 'roundup') return s + 500;
    return s;
  }, 0);

  const toggleRule = (id: string) => {
    setRules(
      rules.map((r) =>
        r.id === id ? { ...r, enabled: !r.enabled } : r
      )
    );
  };

  const addRule = () => {
    if (!newRule.name) return;

    const rule: SavingsRule = {
      id: Date.now().toString(),
      name: newRule.name,
      type: newRule.type,
      amount: newRule.type === 'roundup' ? 0 : newRule.amount,
      enabled: true,
      savedThisMonth: 0,
    };

    setRules([...rules, rule]);
    setShowAddRule(false);

    setNewRule({
      name: '',
      type: 'daily',
      amount: 10,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <PiggyBank className="w-6 h-6 text-green-600" />
          Micro Savings
        </h1>
        <p className="text-sm text-gray-500">
          Save small amounts automatically without noticing
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">

        <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-5 h-5" />
            <p className="text-sm opacity-90">Saved This Month</p>
          </div>
          <p className="text-3xl font-black">
            {formatCurrency(totalSaved)}
          </p>
          <p className="text-xs opacity-80">
            {((totalSaved / monthlyGoal) * 100).toFixed(0)}% of goal
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-gray-600">Projected Monthly</p>
          </div>
          <p className="text-3xl font-black text-gray-900">
            {formatCurrency(projectedMonthly)}
          </p>
          <p className="text-xs text-gray-500">
            {activeRules} active rules
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-purple-600" />
            <p className="text-sm text-gray-600">Monthly Goal</p>
          </div>
          <p className="text-3xl font-black text-gray-900">
            {formatCurrency(monthlyGoal)}
          </p>
        </div>

      </div>

      {/* Rules */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">

        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900">
            Your Savings Rules
          </h3>
          <button
            onClick={() => setShowAddRule(true)}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            Add Rule
          </button>
        </div>

        <div className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`p-4 rounded-xl border-2 ${
                rule.enabled
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex justify-between mb-3">
                <div>
                  <h4 className="font-bold">{rule.name}</h4>
                  <p className="text-xs text-gray-600">
                    {rule.type === 'roundup' &&
                      'Rounds up every transaction'}
                    {rule.type === 'daily' &&
                      `Saves ₹${rule.amount} daily`}
                    {rule.type === 'weekly' &&
                      `Saves ₹${rule.amount} weekly`}
                  </p>
                </div>
                <p className="text-xl font-black text-green-600">
                  {formatCurrency(rule.savedThisMonth)}
                </p>
              </div>

              <button
                onClick={() => toggleRule(rule.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  rule.enabled
                    ? 'bg-gray-200'
                    : 'bg-green-600 text-white'
                }`}
              >
                {rule.enabled ? 'Pause' : 'Activate'}
              </button>
            </div>
          ))}
        </div>

      </div>

      {/* Add Rule Modal */}
      {showAddRule && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">

            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">
                Add Savings Rule
              </h3>
              <button onClick={() => setShowAddRule(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Rule Name"
                value={newRule.name}
                onChange={(e) =>
                  setNewRule({
                    ...newRule,
                    name: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />

              <select
                value={newRule.type}
                onChange={(e) =>
                  setNewRule({
                    ...newRule,
                    type: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="roundup">Round-Up</option>
              </select>

              {newRule.type !== 'roundup' && (
                <input
                  type="number"
                  value={newRule.amount}
                  onChange={(e) =>
                    setNewRule({
                      ...newRule,
                      amount: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              )}

              <button
                onClick={addRule}
                className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700"
              >
                Create Rule
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}