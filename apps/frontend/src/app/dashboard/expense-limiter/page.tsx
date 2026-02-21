'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { Shield, AlertTriangle, CheckCircle, TrendingDown, Lock, Zap } from 'lucide-react';

interface DailyLimit {
  id: string;
  category: string;
  dailyLimit: number;
  spentToday: number;
  enabled: boolean;
}

export default function ExpenseLimiter() {
  const [limits, setLimits] = useState<DailyLimit[]>([
    { id: '1', category: 'Food', dailyLimit: 200, spentToday: 145, enabled: true },
    { id: '2', category: 'Shopping', dailyLimit: 100, spentToday: 85, enabled: true },
    { id: '3', category: 'Entertainment', dailyLimit: 150, spentToday: 150, enabled: true },
    { id: '4', category: 'Transport', dailyLimit: 100, spentToday: 60, enabled: false },
  ]);

  const [emergencyMode, setEmergencyMode] = useState(false);

  const toggleLimit = (id: string) => {
    setLimits(limits.map(l => l.id === id ? { ...l, enabled: !l.enabled } : l));
  };

  const totalDailyBudget = limits.filter(l => l.enabled).reduce((s, l) => s + l.dailyLimit, 0);
  const totalSpentToday = limits.reduce((s, l) => s + l.spentToday, 0);
  const limitBreached = limits.some(l => l.enabled && l.spentToday >= l.dailyLimit);

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-600" />Daily Expense Limiter
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Set strict daily spending limits to protect your budget</p>
      </div>

      {/* Emergency Mode Toggle */}
      <div className={`rounded-2xl p-6 shadow-lg transition-all ${emergencyMode ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white' : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {emergencyMode ? <AlertTriangle className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
            <h3 className="font-bold text-lg">{emergencyMode ? '🚨 EMERGENCY MODE ACTIVE' : 'Protection Active'}</h3>
          </div>
          <button
            onClick={() => setEmergencyMode(!emergencyMode)}
            className={`px-4 py-2 rounded-xl font-bold text-sm ${
              emergencyMode 
                ? 'bg-white text-red-600 hover:bg-red-50' 
                : 'bg-white/20 hover:bg-white/30'
            }`}>
            {emergencyMode ? 'Deactivate' : 'Emergency Mode'}
          </button>
        </div>
        <p className="text-sm opacity-90">
          {emergencyMode 
            ? 'All non-essential spending BLOCKED. Only essentials like food & bills allowed.' 
            : 'Daily limits are protecting your budget. All categories monitored.'}
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Today's Budget</p>
          <p className="text-2xl font-black text-gray-900">{formatCurrency(totalDailyBudget)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Spent Today</p>
          <p className={`text-2xl font-black ${totalSpentToday > totalDailyBudget ? 'text-red-600' : 'text-blue-600'}`}>
            {formatCurrency(totalSpentToday)}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Remaining</p>
          <p className={`text-2xl font-black ${totalDailyBudget - totalSpentToday < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {formatCurrency(Math.max(0, totalDailyBudget - totalSpentToday))}
          </p>
        </div>
      </div>

      {/* Category Limits */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Daily Category Limits</h3>
        <div className="space-y-4">
          {limits.map(limit => {
            const pct = (limit.spentToday / limit.dailyLimit) * 100;
            const isOver = limit.spentToday >= limit.dailyLimit;
            const isBlocked = emergencyMode && !['Food', 'Bills'].includes(limit.category);
            
            return (
              <div key={limit.id} className={`p-4 rounded-xl border-2 ${
                isBlocked ? 'border-red-300 bg-red-50' :
                isOver && limit.enabled ? 'border-red-300 bg-red-50' : 
                limit.enabled ? 'border-green-200 bg-green-50' : 
                'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      isBlocked ? 'bg-red-200' :
                      isOver && limit.enabled ? 'bg-red-200' : 
                      limit.enabled ? 'bg-green-200' : 
                      'bg-gray-200'
                    }`}>
                      {isBlocked || (isOver && limit.enabled) ? (
                        <Lock className="w-4 h-4 text-red-700" />
                      ) : (
                        <Shield className="w-4 h-4 text-green-700" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{limit.category}</h4>
                      <p className="text-xs text-gray-600">
                        {isBlocked ? '🚫 BLOCKED in emergency mode' :
                         isOver && limit.enabled ? '⛔ LIMIT REACHED' : 
                         limit.enabled ? '✓ Protected' : 'Not monitored'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-black ${isOver ? 'text-red-600' : 'text-gray-900'}`}>
                      {formatCurrency(limit.spentToday)}
                    </p>
                    <p className="text-xs text-gray-500">of {formatCurrency(limit.dailyLimit)}</p>
                  </div>
                </div>

                <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      pct >= 100 ? 'bg-red-500' : 
                      pct >= 80 ? 'bg-orange-500' : 
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => toggleLimit(limit.id)}
                    disabled={isBlocked}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      isBlocked ? 'bg-gray-200 text-gray-400 cursor-not-allowed' :
                      limit.enabled ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 
                      'bg-blue-600 text-white hover:bg-blue-700'
                    }`}>
                    {limit.enabled ? 'Disable' : 'Enable'}
                  </button>
                  <span className={`text-xs font-bold ${
                    limit.dailyLimit - limit.spentToday < 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {limit.dailyLimit - limit.spentToday >= 0 
                      ? `${formatCurrency(limit.dailyLimit - limit.spentToday)} left` 
                      : `${formatCurrency(Math.abs(limit.dailyLimit - limit.spentToday))} over!`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alert if limit breached */}
      {limitBreached && !emergencyMode && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
            <div>
              <h3 className="font-bold text-red-900 mb-2">⚠️ Daily Limit Exceeded!</h3>
              <p className="text-sm text-red-800 mb-3">
                You've hit your spending limit in {limits.filter(l => l.enabled && l.spentToday >= l.dailyLimit).length} categories. 
                Consider activating Emergency Mode to block non-essential spending.
              </p>
              <button 
                onClick={() => setEmergencyMode(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-sm hover:bg-red-700">
                Activate Emergency Mode
              </button>
            </div>
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4" />💡 How Daily Limits Work
        </h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>• <strong>Set daily limits</strong> for each spending category</p>
          <p>• <strong>Get warnings</strong> when you approach your limit (80%)</p>
          <p>• <strong>Auto-block</strong> transactions when limit is reached</p>
          <p>• <strong>Emergency mode</strong> blocks ALL non-essential spending</p>
          <p>• <strong>Resets daily</strong> at midnight - fresh start every day!</p>
        </div>
      </div>

      {/* Success Story */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-6 text-white shadow-lg">
        <h3 className="font-bold text-lg mb-2">💪 Stay in Control</h3>
        <p className="text-sm opacity-90 mb-3">
          Users who set daily limits save an average of <strong>₹3,000-5,000 per month</strong> by avoiding impulse spending!
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-2xl font-black">₹{((totalDailyBudget * 30) / 1000).toFixed(0)}k</p>
            <p className="text-xs opacity-80">Monthly budget</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-2xl font-black">₹{(((totalDailyBudget - totalSpentToday) * 30) / 1000).toFixed(0)}k</p>
            <p className="text-xs opacity-80">Protected this month</p>
          </div>
        </div>
      </div>
    </div>
  );
}