'use client';

import DisclaimerModal from '@/components/DisclaimerModal';
import { useEffect, useState, useCallback, useRef } from 'react';
import { transactionsApi } from '@/lib/api/transactions';
import { accountsApi } from '@/lib/api/accounts';
import { budgetsApi } from '@/lib/api/budgets';
import { goalsApi } from '@/lib/api/goals';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import {
  TrendingUp, TrendingDown, Crown, BarChart3,
  ArrowRight, RefreshCw, Plus, CreditCard, AlertCircle,
  PieChart, DollarSign, Briefcase, Shield, Calculator,
  Target, Activity, ChevronRight, Brain, Sparkles,
  Zap, Receipt, Bell, Mic
} from 'lucide-react';

// ── No-flicker bar chart ────────────────────────────────────────────────────
function BarChart({ data }: { data: { label: string; income: number; expense: number }[] }) {
  const [tooltip, setTooltip] = useState({ text: '', visible: false });
  const timer = useRef<any>(null);
  const show = (t: string) => { if (timer.current) clearTimeout(timer.current); setTooltip({ text: t, visible: true }); };
  const hide = () => { timer.current = setTimeout(() => setTooltip(p => ({ ...p, visible: false })), 100); };
  if (!data.length || data.every(d => d.income === 0 && d.expense === 0))
    return <div className="flex items-center justify-center h-36 text-gray-400 text-sm">Add transactions to see trend</div>;
  const maxVal = Math.max(...data.flatMap(d => [d.income, d.expense]), 1);
  const H = 130;
  return (
    <div>
      <div className="h-7 flex items-center justify-center mb-1">
        <div className={`px-3 py-1 bg-gray-900 text-white text-xs font-medium rounded-lg transition-opacity duration-100 ${tooltip.visible ? 'opacity-100' : 'opacity-0'}`}>{tooltip.text}</div>
      </div>
      <div className="flex items-end gap-1.5" style={{ height: H }}>
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex items-end gap-0.5" style={{ height: H }}>
            <div className="flex-1 rounded-t-md bg-gradient-to-t from-violet-600 to-violet-400 cursor-pointer hover:opacity-75 transition-opacity min-h-0.5"
              style={{ height: Math.max((d.income / maxVal) * H, 2) }}
              onMouseEnter={() => show(`${d.label} Income: ${formatCurrency(d.income)}`)} onMouseLeave={hide} />
            <div className="flex-1 rounded-t-md bg-gradient-to-t from-rose-500 to-rose-300 cursor-pointer hover:opacity-75 transition-opacity min-h-0.5"
              style={{ height: Math.max((d.expense / maxVal) * H, 2) }}
              onMouseEnter={() => show(`${d.label} Expense: ${formatCurrency(d.expense)}`)} onMouseLeave={hide} />
          </div>
        ))}
      </div>
      <div className="flex mt-1">
        {data.map((d, i) => <div key={i} className="flex-1 text-center"><span className="text-xs text-gray-400">{d.label}</span></div>)}
      </div>
      <div className="flex justify-center gap-5 mt-2">
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-violet-500" /><span className="text-xs text-gray-500">Income</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-400" /><span className="text-xs text-gray-500">Expense</span></div>
      </div>
    </div>
  );
}

// ── Portfolio Donut ─────────────────────────────────────────────────────────
function PortfolioDonut({ accounts }: { accounts: any[] }) {
  const [hov, setHov] = useState<number | null>(null);
  const palette = ['#7C3AED','#0EA5E9','#10B981','#F59E0B','#EF4444','#EC4899'];
  const data = accounts.filter(a => Number(a.balance) > 0).map((a, i) => ({ label: a.name, value: Number(a.balance), color: palette[i % palette.length] }));
  if (!data.length) return <div className="flex items-center justify-center h-44 text-gray-400 text-sm">No accounts added yet</div>;
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = 72; const circ = 2 * Math.PI * r; let off = 0;
  return (
    <div className="flex flex-col items-center">
      <svg width="220" height="220" viewBox="0 0 220 220">
        <circle cx="110" cy="110" r={r} fill="none" stroke="#f1f5f9" strokeWidth="30" />
        {data.map((item, i) => {
          const dash = (item.value / total) * circ; const gap = circ - dash; const cur = off; off += dash;
          return <circle key={i} cx="110" cy="110" r={r} fill="none" stroke={item.color}
            strokeWidth={hov === i ? 38 : 30} strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-cur + circ * 0.25} strokeLinecap="round"
            style={{ transition: 'stroke-width 0.15s ease', cursor: 'pointer' }}
            onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} />;
        })}
        {hov !== null ? (<>
          <text x="110" y="102" textAnchor="middle" fill="#374151" fontSize="10" fontWeight="600">{data[hov].label}</text>
          <text x="110" y="117" textAnchor="middle" fill={data[hov].color} fontSize="14" fontWeight="800">{formatCurrency(data[hov].value)}</text>
          <text x="110" y="131" textAnchor="middle" fill="#9CA3AF" fontSize="9">{((data[hov].value / total) * 100).toFixed(1)}%</text>
        </>) : (<>
          <text x="110" y="106" textAnchor="middle" fill="#6B7280" fontSize="10">Portfolio</text>
          <text x="110" y="122" textAnchor="middle" fill="#111827" fontSize="15" fontWeight="800">{formatCurrency(total)}</text>
        </>)}
      </svg>
      <div className="flex flex-wrap gap-2 justify-center -mt-1">
        {data.map((item, i) => (
          <div key={i} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs cursor-pointer transition-colors ${hov === i ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
            onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-gray-600">{item.label}</span>
            <span className="font-semibold text-gray-800">{((item.value / total) * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Wealth Area Chart ───────────────────────────────────────────────────────
function WealthAreaChart({ data }: { data: { label: string; net: number }[] }) {
  const [hov, setHov] = useState<number | null>(null);
  if (!data.length || data.every(d => d.net === 0))
    return <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Insufficient data</div>;
  const W = 500; const H = 110; const pad = 24;
  const minVal = Math.min(...data.map(d => d.net));
  const maxVal = Math.max(...data.map(d => d.net), 1);
  const range = maxVal - minVal || 1;
  const pts = data.map((d, i) => ({
    x: pad + (i / Math.max(data.length - 1, 1)) * (W - pad * 2),
    y: H - pad - ((d.net - minVal) / range) * (H - pad * 2),
    val: d.net, label: d.label,
  }));
  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${pts[pts.length-1].x} ${H} L ${pts[0].x} ${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 120 }}>
      <defs>
        <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#wg)" />
      <path d={pathD} fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={hov === i ? 7 : 4} fill="#7C3AED" stroke="white" strokeWidth="2.5"
            style={{ cursor: 'pointer', transition: 'r 0.12s' }}
            onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} />
          {hov === i && (
            <g>
              <rect x={Math.min(p.x - 55, W - 120)} y={p.y - 30} width="120" height="22" rx="5" fill="#1E293B" />
              <text x={Math.min(p.x - 55, W - 120) + 60} y={p.y - 15} textAnchor="middle" fill="white" fontSize="10" fontWeight="600">{p.label}: {formatCurrency(p.val)}</text>
            </g>
          )}
          <text x={p.x} y={H - 4} textAnchor="middle" fill="#94A3B8" fontSize="9">{p.label}</text>
        </g>
      ))}
    </svg>
  );
}

export default function HighIncomeDashboard() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const loadData = useCallback(async () => {
    try {
      setError('');
      const [acc, txn, bud, gol] = await Promise.all([
        accountsApi.getAll(), transactionsApi.getAll(),
        budgetsApi.getAll(), goalsApi.getAll(),
      ]);
      setAccounts(acc || []);
      setTransactions(txn || []);
      setBudgets(bud || []);
      setGoals(gol || []);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Load error:', err);
      setError(err?.response?.status === 401 ? 'Please login to view dashboard' : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const i = setInterval(loadData, 30000);
    return () => clearInterval(i);
  }, [loadData]);

  const now = new Date();
  const curMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthTxns = transactions.filter(t => {
    const d = new Date(t.date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === curMonth;
  });

  const totalBalance = accounts.reduce((s, a) => s + Number(a.balance), 0);
  const monthlyIncome = monthTxns.filter(t => t.type === 'INCOME').reduce((s, t) => s + Number(t.amount), 0);
  const monthlyExpenses = monthTxns.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + Number(t.amount), 0);
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome * 100) : 0;
  const investedTotal = accounts.filter(a => ['INVESTMENT', 'SAVINGS'].includes(a.type)).reduce((s, a) => s + Number(a.balance), 0);

  const last6 = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
    return { key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, label: d.toLocaleDateString('en-US', { month: 'short' }) };
  });
  const trendData = last6.map(({ key, label }) => {
    const m = transactions.filter(t => { const d = new Date(t.date); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === key; });
    return { label, income: m.filter(t => t.type === 'INCOME').reduce((s, t) => s + Number(t.amount), 0), expense: m.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + Number(t.amount), 0) };
  });
  const wealthData = last6.map(({ key, label }, i) => {
    const upTo = last6.slice(0, i + 1).map(m => m.key);
    const net = transactions.filter(t => { const d = new Date(t.date); return upTo.includes(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`); })
      .reduce((s, t) => s + (t.type === 'INCOME' ? Number(t.amount) : -Number(t.amount)), 0);
    return { label, net: Math.max(net, 0) };
  });

  const spendByCat = monthTxns.filter(t => t.type === 'EXPENSE').reduce((acc, t) => {
    const c = t.category || 'Others'; acc[c] = (acc[c] || 0) + Number(t.amount); return acc;
  }, {} as Record<string, number>);
  const topExp = Object.entries(spendByCat).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxExp = Math.max(...topExp.map(e => e[1]), 1);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50">
      <div className="animate-spin rounded-full h-14 w-14 border-4 border-violet-200 border-t-violet-600"></div>
    </div>
  );

  return (
    <>
      <DisclaimerModal />
      <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6">
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <AlertCircle className="w-5 h-5" />{error}
            {error.includes('login') ? (
              <Link href="/login" className="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700">Login</Link>
            ) : (
              <button onClick={loadData} className="ml-auto underline font-semibold">Retry</button>
            )}
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shadow-inner">
                  <Crown className="w-6 h-6 text-amber-300" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold">Wealth Dashboard</h1>
                  <span className="px-2 py-0.5 bg-amber-400/25 border border-amber-300/40 text-amber-200 text-xs font-bold rounded-full">PREMIUM</span>
                </div>
                <p className="text-violet-200 text-xs mt-0.5">
                  Net Worth: <span className="font-bold text-white">{formatCurrency(totalBalance)}</span>
                  <span className="mx-2">•</span>
                  Savings Rate: <span className={`font-bold ${savingsRate >= 40 ? 'text-amber-300' : 'text-white'}`}>{savingsRate.toFixed(1)}%</span>
                  <span className="mx-2">•</span>
                  Updated {lastUpdated.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={loadData} className="flex items-center gap-1.5 px-3 py-2 bg-white/15 hover:bg-white/25 rounded-xl text-white text-sm font-medium transition-colors border border-white/10">
                <RefreshCw className="w-3.5 h-3.5" />Refresh
              </button>
              <Link href="/dashboard/transactions">
                <button className="flex items-center gap-1.5 px-4 py-2 bg-white text-violet-700 rounded-xl hover:bg-violet-50 text-sm font-bold transition-colors">
                  <Plus className="w-4 h-4" />Add Transaction
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {[
            { label: 'This Month Income', value: formatCurrency(monthlyIncome), sub: `${monthTxns.filter(t => t.type === 'INCOME').length} txns`, icon: TrendingUp, ibg: 'bg-emerald-100', ic: 'text-emerald-600', vc: 'text-emerald-700' },
            { label: 'This Month Expenses', value: formatCurrency(monthlyExpenses), sub: `${monthTxns.filter(t => t.type === 'EXPENSE').length} txns`, icon: TrendingDown, ibg: 'bg-rose-100', ic: 'text-rose-600', vc: 'text-rose-700' },
            { label: 'Invested Assets', value: formatCurrency(investedTotal), sub: `${accounts.filter(a => ['INVESTMENT','SAVINGS'].includes(a.type)).length} vehicles`, icon: Briefcase, ibg: 'bg-violet-100', ic: 'text-violet-600', vc: 'text-violet-700' },
            { label: 'Monthly Surplus', value: formatCurrency(monthlyIncome - monthlyExpenses), sub: `${savingsRate.toFixed(1)}% savings rate`, icon: DollarSign, ibg: 'bg-amber-100', ic: 'text-amber-600', vc: (monthlyIncome - monthlyExpenses) >= 0 ? 'text-amber-700' : 'text-rose-700' },
          ].map((c, i) => { const Icon = c.icon; return (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className={`p-2.5 ${c.ibg} rounded-xl w-fit mb-3`}><Icon className={`w-5 h-5 ${c.ic}`} /></div>
              <p className="text-xs text-gray-500 mb-1">{c.label}</p>
              <p className={`text-xl font-bold ${c.vc}`}>{c.value}</p>
              <p className="text-xs text-gray-400 mt-1">{c.sub}</p>
            </div>
          ); })}
        </div>

        {/* Portfolio + Wealth Growth */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2"><div className="p-1.5 bg-violet-100 rounded-lg"><PieChart className="w-4 h-4 text-violet-600" /></div>Portfolio Allocation</h3>
              <Link href="/dashboard/portfolio"><span className="text-xs text-violet-600 font-semibold hover:underline flex items-center gap-1">Rebalance<ArrowRight className="w-3 h-3" /></span></Link>
            </div>
            <PortfolioDonut accounts={accounts} />
            {accounts.length > 0 && (
              <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
                {accounts.filter(a => Number(a.balance) > 0).map((a: any) => (
                  <div key={a.id} className="flex justify-between text-xs">
                    <span className="text-gray-600">{a.name} <span className="text-gray-400">({a.type})</span></span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">{totalBalance > 0 ? ((Number(a.balance)/totalBalance)*100).toFixed(1) : 0}%</span>
                      <span className="font-bold text-gray-900">{formatCurrency(a.balance)}</span>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t border-slate-100 text-sm font-bold">
                  <span className="text-gray-600">Total Portfolio</span>
                  <span className="text-violet-600">{formatCurrency(totalBalance)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-gray-900 flex items-center gap-2"><div className="p-1.5 bg-purple-100 rounded-lg"><Activity className="w-4 h-4 text-purple-600" /></div>Wealth Growth (6M)</h3>
              <Link href="/dashboard/overview"><span className="text-xs text-violet-600 font-semibold hover:underline flex items-center gap-1">Track<ArrowRight className="w-3 h-3" /></span></Link>
            </div>
            <WealthAreaChart data={wealthData} />
          </div>
        </div>

        {/* 6-Month Trend */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-900 flex items-center gap-2"><div className="p-1.5 bg-blue-100 rounded-lg"><BarChart3 className="w-4 h-4 text-blue-600" /></div>6-Month Cash Flow</h3>
            <Link href="/dashboard/analytics"><span className="text-xs text-violet-600 font-semibold hover:underline flex items-center gap-1">Deep Dive<ArrowRight className="w-3 h-3" /></span></Link>
          </div>
          <BarChart data={trendData} />
        </div>

        {/* Top Expenses + Goals */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2"><div className="p-1.5 bg-red-100 rounded-lg"><DollarSign className="w-4 h-4 text-red-600" /></div>Top Expenses</h3>
              <Link href="/dashboard/analytics"><span className="text-xs text-violet-600 font-semibold hover:underline flex items-center gap-1">Analyze<ArrowRight className="w-3 h-3" /></span></Link>
            </div>
            {topExp.length > 0 ? (
              <div className="space-y-3">
                {topExp.map(([cat, val], i) => {
                  const cols = ['#7C3AED','#EF4444','#F59E0B','#10B981','#0EA5E9'];
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{cat}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">{monthlyExpenses > 0 ? ((val / monthlyExpenses) * 100).toFixed(0) : 0}%</span>
                          <span className="font-bold text-gray-900">{formatCurrency(val)}</span>
                        </div>
                      </div>
                      <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(val / maxExp) * 100}%`, backgroundColor: cols[i] }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm">No expenses this month</div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2"><div className="p-1.5 bg-emerald-100 rounded-lg"><Target className="w-4 h-4 text-emerald-600" /></div>Wealth Goals</h3>
              <Link href="/dashboard/goals"><span className="text-xs text-violet-600 font-semibold hover:underline flex items-center gap-1">Manage<ArrowRight className="w-3 h-3" /></span></Link>
            </div>
            {goals.length > 0 ? (
              <div className="space-y-4">
                {goals.slice(0, 4).map((g: any) => {
                  const pct = Math.min((Number(g.currentAmount) / Math.max(Number(g.targetAmount), 1)) * 100, 100);
                  const color = pct >= 100 ? '#10B981' : pct >= 60 ? '#7C3AED' : pct >= 30 ? '#F59E0B' : '#EF4444';
                  const days = Math.ceil((new Date(g.deadline).getTime() - Date.now()) / 86400000);
                  return (
                    <div key={g.id}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-semibold text-gray-800">{g.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">{days > 0 ? `${days}d` : 'Due'}</span>
                          <span className="font-bold text-xs" style={{ color }}>{pct.toFixed(0)}%</span>
                        </div>
                      </div>
                      <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  );
                })}
                <div className="flex justify-between pt-2 border-t border-slate-100 text-sm font-bold">
                  <span className="text-gray-600">Total Saved</span>
                  <span className="text-emerald-600">{formatCurrency(goals.reduce((s, g) => s + Number(g.currentAmount), 0))}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400"><Target className="w-10 h-10 mx-auto mb-2 opacity-20" /><p className="text-sm mb-3">No goals yet</p><Link href="/dashboard/goals"><button className="px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-bold">Set Goal</button></Link></div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2"><div className="p-1.5 bg-blue-100 rounded-lg"><CreditCard className="w-4 h-4 text-blue-600" /></div>Recent Transactions</h3>
            <Link href="/dashboard/transactions"><span className="text-xs text-violet-600 font-semibold hover:underline flex items-center gap-1">View All<ArrowRight className="w-3 h-3" /></span></Link>
          </div>
          {transactions.length > 0 ? (
            <div className="space-y-2">
              {transactions.slice(0, 5).map((t: any) => (
                <div key={t.id} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${t.type === 'INCOME' ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                      {t.type === 'INCOME' ? <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> : <TrendingDown className="w-3.5 h-3.5 text-rose-600" />}
                    </div>
                    <div><p className="font-semibold text-gray-900 text-sm">{t.description}</p><p className="text-xs text-gray-400">{t.category || 'Uncategorized'} · {new Date(t.date).toLocaleDateString()}</p></div>
                  </div>
                  <span className={`font-bold text-sm ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>{t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">No transactions yet</div>
          )}
        </div>

        {/* Premium Tools */}
        <div>
          <h3 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2"><Crown className="w-4 h-4 text-amber-500" />Premium Tools & Features</h3>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { href: '/dashboard/ai', icon: Brain, title: 'AI Coach', desc: 'Personalized insights & recommendations', badge: 'SMART', ib: 'bg-violet-100', ic: 'text-violet-600', bc: 'bg-violet-50 text-violet-700' },
              { href: '/dashboard/portfolio', icon: Target, title: 'Portfolio Rebalancer', desc: 'Asset allocation optimizer', badge: 'BALANCE', ib: 'bg-blue-100', ic: 'text-blue-600', bc: 'bg-blue-50 text-blue-700' },
              { href: '/dashboard/overview', icon: TrendingUp, title: 'Net Worth Tracker', desc: 'Growth projections & milestones', badge: 'TRACK', ib: 'bg-emerald-100', ic: 'text-emerald-600', bc: 'bg-emerald-50 text-emerald-700' },
              { href: '/dashboard/personality', icon: Sparkles, title: 'Spending Personality', desc: 'Discover your money type', badge: 'QUIZ', ib: 'bg-pink-100', ic: 'text-pink-600', bc: 'bg-pink-50 text-pink-700' },
              { href: '/dashboard/tax', icon: Calculator, title: 'Tax Optimizer', desc: 'Regime comparison & deductions', badge: 'SAVE', ib: 'bg-amber-100', ic: 'text-amber-600', bc: 'bg-amber-50 text-amber-700' },
              { href: '/dashboard/insurance', icon: Shield, title: 'Insurance Hub', desc: 'Coverage calculator & quotes', badge: 'PROTECT', ib: 'bg-red-100', ic: 'text-red-600', bc: 'bg-red-50 text-red-700' },
              { href: '/dashboard/receipt-scan', icon: Receipt, title: 'Receipt Scanner', desc: 'OCR-powered expense logging', badge: 'SCAN', ib: 'bg-indigo-100', ic: 'text-indigo-600', bc: 'bg-indigo-50 text-indigo-700' },
              { href: '/dashboard/voice-expense', icon: Mic, title: 'Voice Logger', desc: 'Say expenses out loud', badge: 'VOICE', ib: 'bg-rose-100', ic: 'text-rose-600', bc: 'bg-rose-50 text-rose-700' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <Link key={i} href={item.href}>
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-violet-200 transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-3">
                      <div className={`p-2.5 ${item.ib} rounded-xl group-hover:scale-110 transition-transform`}><Icon className={`w-5 h-5 ${item.ic}`} /></div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.bc}`}>{item.badge}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-gray-500 mb-3">{item.desc}</p>
                    <span className="text-xs font-semibold text-violet-600 flex items-center gap-1">Open <ChevronRight className="w-3 h-3" /></span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}