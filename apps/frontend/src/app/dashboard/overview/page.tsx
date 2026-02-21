'use client';

import { useState, useEffect } from 'react';
import { accountsApi } from '@/lib/api/accounts';
import { transactionsApi } from '@/lib/api/transactions';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, Target, Award, Calendar, DollarSign, Percent, Zap, ChevronRight } from 'lucide-react';

export default function NetWorthTracker() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([accountsApi.getAll(), transactionsApi.getAll()])
      .then(([acc, txn]) => { setAccounts(acc); setTransactions(txn); })
      .finally(() => setLoading(false));
  }, []);

  // Calculate historical net worth (last 12 months)
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (11 - i));
    return { key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, label: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }) };
  });

  const history = months.map(({ key, label }) => {
    const upTo = months.slice(0, months.findIndex(m => m.key === key) + 1).map(m => m.key);
    const net = transactions.filter(t => {
      const d = new Date(t.date);
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      return upTo.includes(k);
    }).reduce((s, t) => s + (t.type === 'INCOME' ? Number(t.amount) : -Number(t.amount)), 0);
    return { label, value: Math.max(net, 0) };
  });

  const currentNetWorth = accounts.reduce((s, a) => s + Number(a.balance), 0);
  const startNetWorth = history[0]?.value || 0;
  const growth = startNetWorth > 0 ? ((currentNetWorth - startNetWorth) / startNetWorth * 100) : 0;
  const monthlyGrowth = growth / 12;

  // Projections (compound growth)
  const projections = [
    { years: 1, conservative: 8, moderate: 12, aggressive: 15 },
    { years: 3, conservative: 8, moderate: 12, aggressive: 15 },
    { years: 5, conservative: 8, moderate: 12, aggressive: 15 },
    { years: 10, conservative: 8, moderate: 12, aggressive: 15 },
  ];

  const milestones = [
    { label: '10 Lakh', target: 1000000 },
    { label: '50 Lakh', target: 5000000 },
    { label: '1 Crore', target: 10000000 },
    { label: '5 Crore', target: 50000000 },
    { label: '10 Crore', target: 100000000 },
  ];

  const nextMilestone = milestones.find(m => m.target > currentNetWorth) || milestones[milestones.length - 1];
  const milestonePct = (currentNetWorth / nextMilestone.target) * 100;
  const toGo = nextMilestone.target - currentNetWorth;

  // Area chart points
  const W = 600; const H = 160; const pad = 30;
  const maxVal = Math.max(...history.map(h => h.value), currentNetWorth);
  const pts = history.map((h, i) => ({
    x: pad + (i / (history.length - 1)) * (W - pad * 2),
    y: H - pad - ((h.value / Math.max(maxVal, 1)) * (H - pad * 2)),
    val: h.value,
    label: h.label,
  }));
  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`;

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-200 border-t-violet-600"></div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-violet-600" />Net Worth Tracker
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Track your wealth journey with projections and milestones</p>
      </div>

      {/* Current Net Worth Hero */}
      <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-violet-200 text-sm font-medium mb-1">Current Net Worth</p>
            <p className="text-5xl font-black tracking-tight">{formatCurrency(currentNetWorth)}</p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-300" />
                <span className="text-sm text-violet-200">12-Month Growth</span>
                <span className="font-bold text-green-300">{growth.toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-yellow-300" />
                <span className="text-sm text-violet-200">Avg Monthly</span>
                <span className="font-bold text-yellow-300">{monthlyGrowth.toFixed(1)}%</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-violet-200 text-xs mb-1">Year Started</p>
            <p className="text-2xl font-bold">{formatCurrency(startNetWorth)}</p>
            <p className="text-xs text-violet-300 mt-1">Gain: {formatCurrency(currentNetWorth - startNetWorth)}</p>
          </div>
        </div>
      </div>

      {/* 12-Month History Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />12-Month Net Worth History
        </h3>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 180 }}>
          <defs>
            <linearGradient id="nwGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d={areaD} fill="url(#nwGrad)" />
          <path d={pathD} fill="none" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {pts.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="5" fill="#7C3AED" stroke="white" strokeWidth="3" />
              <text x={p.x} y={H - 8} textAnchor="middle" fill="#9CA3AF" fontSize="10">{p.label}</text>
            </g>
          ))}
        </svg>
      </div>

      {/* Milestone Progress */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-green-600" />Next Milestone: {nextMilestone.label}
        </h3>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Progress to {nextMilestone.label}</span>
            <span className="font-bold text-gray-900">{milestonePct.toFixed(1)}%</span>
          </div>
          <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(milestonePct, 100)}%` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1.5">
            <span>{formatCurrency(currentNetWorth)}</span>
            <span className="font-semibold">{formatCurrency(toGo)} to go</span>
            <span>{formatCurrency(nextMilestone.target)}</span>
          </div>
        </div>

        {/* All milestones */}
        <div className="grid grid-cols-5 gap-2">
          {milestones.map((m, i) => {
            const reached = currentNetWorth >= m.target;
            return (
              <div key={i} className={`p-3 rounded-xl text-center border-2 ${reached ? 'bg-green-50 border-green-200' : currentNetWorth >= m.target * 0.5 ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'}`}>
                {reached && <Award className="w-5 h-5 text-green-600 mx-auto mb-1" />}
                <p className={`text-xs font-bold ${reached ? 'text-green-700' : 'text-gray-600'}`}>{m.label}</p>
                <p className={`text-xs ${reached ? 'text-green-600' : 'text-gray-400'}`}>{reached ? '✓' : `${((currentNetWorth / m.target) * 100).toFixed(0)}%`}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Projections */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-600" />Future Net Worth Projections
        </h3>
        <div className="space-y-3">
          {projections.map((proj, i) => {
            const conservative = currentNetWorth * Math.pow(1 + proj.conservative / 100, proj.years);
            const moderate = currentNetWorth * Math.pow(1 + proj.moderate / 100, proj.years);
            const aggressive = currentNetWorth * Math.pow(1 + proj.aggressive / 100, proj.years);
            
            return (
              <div key={i} className="p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-gray-900">{proj.years} Year{proj.years > 1 ? 's' : ''}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-3 h-3 rounded-full bg-blue-400"></span>Conservative
                    <span className="w-3 h-3 rounded-full bg-violet-500"></span>Moderate
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>Aggressive
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Conservative', value: conservative, color: 'blue', rate: proj.conservative },
                    { label: 'Moderate', value: moderate, color: 'violet', rate: proj.moderate },
                    { label: 'Aggressive', value: aggressive, color: 'amber', rate: proj.aggressive },
                  ].map((scenario, j) => (
                    <div key={j} className={`p-3 rounded-lg bg-${scenario.color}-50`}>
                      <p className={`text-xs text-${scenario.color}-600 mb-1`}>{scenario.rate}% annual</p>
                      <p className={`text-lg font-black text-${scenario.color}-700`}>{formatCurrency(scenario.value)}</p>
                      <p className={`text-xs text-${scenario.color}-600 mt-1`}>+{formatCurrency(scenario.value - currentNetWorth)}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-4 p-3 bg-gray-50 rounded-lg">
          📊 Projections assume compound annual growth rates. Actual results may vary based on market conditions and investment decisions.
        </p>
      </div>

      {/* Asset Breakdown */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-600" />Asset Breakdown
        </h3>
        <div className="space-y-3">
          {accounts.filter(a => Number(a.balance) > 0).sort((a, b) => Number(b.balance) - Number(a.balance)).map((acc: any) => {
            const pct = (Number(acc.balance) / currentNetWorth) * 100;
            const typeColors: Record<string, string> = {
              INVESTMENT: '#7C3AED', SAVINGS: '#10B981', CHECKING: '#3B82F6', CREDIT: '#EF4444', LOAN: '#F59E0B'
            };
            const color = typeColors[acc.type] || '#6B7280';
            
            return (
              <div key={acc.id}>
                <div className="flex justify-between text-sm mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                    <span className="font-medium text-gray-700">{acc.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{acc.type}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{pct.toFixed(1)}%</span>
                    <span className="font-bold text-gray-900">{formatCurrency(acc.balance)}</span>
                  </div>
                </div>
                <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}