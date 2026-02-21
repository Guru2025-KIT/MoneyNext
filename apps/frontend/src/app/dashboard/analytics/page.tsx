'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { transactionsApi } from '@/lib/api/transactions';
import { accountsApi } from '@/lib/api/accounts';
import { budgetsApi } from '@/lib/api/budgets';
import { goalsApi } from '@/lib/api/goals';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import {
  TrendingUp, TrendingDown, DollarSign, Activity,
  Calendar, PieChart, BarChart3, Target, Wallet,
  ArrowUpRight, RefreshCw, AlertCircle, Award
} from 'lucide-react';

function NoFlickerBarChart({ data }: { data: { label: string; income: number; expense: number }[] }) {
  const [tooltip, setTooltip] = useState({ text: '', visible: false });
  const timer = useRef<any>(null);
  const show = (text: string) => { if (timer.current) clearTimeout(timer.current); setTooltip({ text, visible: true }); };
  const hide = () => { timer.current = setTimeout(() => setTooltip(t => ({ ...t, visible: false })), 100); };
  if (!data.length || data.every(d => d.income === 0 && d.expense === 0))
    return <div className="flex flex-col items-center justify-center h-40 text-gray-400"><Calendar className="w-8 h-8 mb-2 opacity-30" /><p className="text-sm">No data yet</p></div>;
  const maxVal = Math.max(...data.flatMap(d => [d.income, d.expense]), 1);
  const H = 140;
  return (
    <div className="w-full">
      <div className="h-8 flex items-center justify-center mb-1">
        <div className={`px-3 py-1 bg-gray-800 text-white text-xs font-semibold rounded-lg transition-opacity duration-150 ${tooltip.visible ? 'opacity-100' : 'opacity-0'}`}>{tooltip.text}</div>
      </div>
      <div className="flex items-end justify-between gap-1 px-1" style={{ height: H }}>
        {data.map((item, i) => (
          <div key={i} className="flex-1 flex items-end gap-0.5" style={{ height: H }}>
            <div className="flex-1 rounded-t-md bg-gradient-to-t from-green-600 to-green-400 cursor-pointer hover:opacity-80 transition-opacity min-h-1"
              style={{ height: Math.max((item.income / maxVal) * H, 3) }}
              onMouseEnter={() => show(`${item.label} Income: ${formatCurrency(item.income)}`)} onMouseLeave={hide} />
            <div className="flex-1 rounded-t-md bg-gradient-to-t from-red-500 to-red-300 cursor-pointer hover:opacity-80 transition-opacity min-h-1"
              style={{ height: Math.max((item.expense / maxVal) * H, 3) }}
              onMouseEnter={() => show(`${item.label} Expense: ${formatCurrency(item.expense)}`)} onMouseLeave={hide} />
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1 px-1">
        {data.map((item, i) => <div key={i} className="flex-1 text-center"><span className="text-xs text-gray-500">{item.label}</span></div>)}
      </div>
      <div className="flex justify-center gap-4 mt-2">
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-green-500" /><span className="text-xs text-gray-600">Income</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-400" /><span className="text-xs text-gray-600">Expenses</span></div>
      </div>
    </div>
  );
}

function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const [hov, setHov] = useState<number | null>(null);
  if (!data.length || data.every(d => d.value === 0))
    return <div className="flex flex-col items-center justify-center h-40 text-gray-400"><PieChart className="w-8 h-8 mb-2 opacity-30" /><p className="text-sm">No spending data</p></div>;
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = 65; const circ = 2 * Math.PI * r; let off = 0;
  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="200" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r={r} fill="none" stroke="#f3f4f6" strokeWidth="26" />
        {data.map((item, i) => {
          const dash = (item.value / total) * circ; const gap = circ - dash; const cur = off; off += dash;
          return <circle key={i} cx="100" cy="100" r={r} fill="none" stroke={item.color}
            strokeWidth={hov === i ? 32 : 26} strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-cur + circ * 0.25} strokeLinecap="round"
            style={{ transition: 'stroke-width 0.2s', cursor: 'pointer' }}
            onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} />;
        })}
        {hov !== null ? (<>
          <text x="100" y="93" textAnchor="middle" fill="#111827" fontSize="10" fontWeight="700">{data[hov].label}</text>
          <text x="100" y="107" textAnchor="middle" fill={data[hov].color} fontSize="12" fontWeight="700">{formatCurrency(data[hov].value)}</text>
          <text x="100" y="119" textAnchor="middle" fill="#6B7280" fontSize="9">{((data[hov].value / total) * 100).toFixed(1)}%</text>
        </>) : (<>
          <text x="100" y="97" textAnchor="middle" fill="#6B7280" fontSize="10">Total Spent</text>
          <text x="100" y="112" textAnchor="middle" fill="#111827" fontSize="13" fontWeight="700">{formatCurrency(total)}</text>
        </>)}
      </svg>
      <div className="flex flex-wrap gap-2 justify-center mt-1">
        {data.map((item, i) => (
          <div key={i} className={`flex items-center gap-1 px-2 py-0.5 rounded-lg cursor-pointer transition-colors ${hov === i ? 'bg-gray-100' : ''}`}
            onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const loadData = useCallback(async () => {
    try {
      setError('');
      const [txn, acc, bud, gol] = await Promise.all([
        transactionsApi.getAll(), accountsApi.getAll(),
        budgetsApi.getAll(), goalsApi.getAll(),
      ]);
      setTransactions(txn); setAccounts(acc); setBudgets(bud); setGoals(gol);
      setLastUpdated(new Date());
    } catch { setError('Failed to load analytics data'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // All-time stats
  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + Number(t.amount), 0);
  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;
  const totalBalance = accounts.reduce((s, a) => s + Number(a.balance), 0);

  // Current month
  const now = new Date();
  const curMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthTxns = transactions.filter(t => { const d = new Date(t.date); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === curMonth; });
  const monthIncome = monthTxns.filter(t => t.type === 'INCOME').reduce((s, t) => s + Number(t.amount), 0);
  const monthExpense = monthTxns.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + Number(t.amount), 0);

  // Category spending
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899'];
  const spendByCategory = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => {
    const cat = t.category || 'Others'; acc[cat] = (acc[cat] || 0) + Number(t.amount); return acc;
  }, {} as Record<string, number>);
  const donutData = Object.entries(spendByCategory).sort((a, b) => b[1] - a[1])
    .map(([label, value], i) => ({ label, value, color: colors[i % colors.length] }));

  // Monthly trend (last 6 months)
  const last6 = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
    return { key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, label: d.toLocaleDateString('en-US', { month: 'short' }) };
  });
  const trendData = last6.map(({ key, label }) => {
    const m = transactions.filter(t => { const d = new Date(t.date); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === key; });
    return { label, income: m.filter(t => t.type === 'INCOME').reduce((s, t) => s + Number(t.amount), 0), expense: m.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + Number(t.amount), 0) };
  });

  // Top spending categories
  const topCategories = Object.entries(spendByCategory).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxCatVal = Math.max(...topCategories.map(c => c[1]), 1);

  // Goals overview
  const totalGoalsSaved = goals.reduce((s, g) => s + Number(g.currentAmount), 0);
  const totalGoalsTarget = goals.reduce((s, g) => s + Number(g.targetAmount), 0);
  const completedGoals = goals.filter(g => Number(g.currentAmount) >= Number(g.targetAmount)).length;

  if (loading) return (
    <div className="flex justify-center items-center min-h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Insights into your financial health • Updated {lastUpdated.toLocaleTimeString()}</p>
        </div>
        <button onClick={loadData} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm font-medium">
          <RefreshCw className="w-4 h-4" />Refresh
        </button>
      </div>

      {error && <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"><AlertCircle className="w-5 h-5" />{error}</div>}

      {/* All-time Summary */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {[
          { label: 'Total Income', value: formatCurrency(totalIncome), sub: 'All time', icon: TrendingUp, ibg: 'bg-green-100', ic: 'text-green-600', vc: 'text-green-600' },
          { label: 'Total Expenses', value: formatCurrency(totalExpense), sub: 'All time', icon: TrendingDown, ibg: 'bg-red-100', ic: 'text-red-600', vc: 'text-red-600' },
          { label: 'Net Savings', value: formatCurrency(netSavings), sub: `${savingsRate.toFixed(1)}% rate`, icon: DollarSign, ibg: 'bg-blue-100', ic: 'text-blue-600', vc: netSavings >= 0 ? 'text-blue-600' : 'text-red-600' },
          { label: 'Total Balance', value: formatCurrency(totalBalance), sub: `${accounts.length} accounts`, icon: Wallet, ibg: 'bg-purple-100', ic: 'text-purple-600', vc: 'text-purple-600' },
        ].map((card, i) => { const Icon = card.icon; return (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className={`p-2.5 ${card.ibg} rounded-xl w-fit mb-3`}><Icon className={`w-5 h-5 ${card.ic}`} /></div>
            <p className="text-xs text-gray-500 mb-1">{card.label}</p>
            <p className={`text-2xl font-bold ${card.vc}`}>{card.value}</p>
            <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
          </div>
        ); })}
      </div>

      {/* This Month */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-600" />This Month</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 bg-green-50 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Income</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(monthIncome)}</p>
            <p className="text-xs text-gray-500 mt-1">{monthTxns.filter(t => t.type === 'INCOME').length} transactions</p>
          </div>
          <div className="p-4 bg-red-50 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Expenses</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(monthExpense)}</p>
            <p className="text-xs text-gray-500 mt-1">{monthTxns.filter(t => t.type === 'EXPENSE').length} transactions</p>
          </div>
          <div className={`p-4 rounded-xl ${monthIncome - monthExpense >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
            <p className="text-sm text-gray-600 mb-1">Net</p>
            <p className={`text-2xl font-bold ${monthIncome - monthExpense >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>{formatCurrency(monthIncome - monthExpense)}</p>
            <p className="text-xs text-gray-500 mt-1">{monthIncome > 0 ? `${((monthIncome - monthExpense) / monthIncome * 100).toFixed(1)}% savings rate` : 'No income recorded'}</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-900 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-blue-600" />6-Month Trend</h3>
            <span className="text-xs text-gray-400">Hover bars for values</span>
          </div>
          <NoFlickerBarChart data={trendData} />
          <div className="mt-4 space-y-2 border-t border-gray-100 pt-3">
            {trendData.filter(m => m.income > 0 || m.expense > 0).map((m, i) => (
              <div key={i} className="grid grid-cols-4 text-xs gap-2 p-2 bg-gray-50 rounded-lg items-center">
                <span className="font-semibold text-gray-700">{m.label}</span>
                <span className="text-green-600">+{formatCurrency(m.income)}</span>
                <span className="text-red-500">-{formatCurrency(m.expense)}</span>
                <span className={`font-bold text-right ${m.income - m.expense >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{formatCurrency(m.income - m.expense)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-900 flex items-center gap-2"><PieChart className="w-4 h-4 text-purple-600" />All-time Spending by Category</h3>
          </div>
          <DonutChart data={donutData} />
          {donutData.length > 0 && (
            <div className="mt-3 space-y-1.5 border-t border-gray-100 pt-3">
              {donutData.map((item, i) => (
                <div key={i} className="flex justify-between text-xs items-center">
                  <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} /><span className="text-gray-600">{item.label}</span></div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">{((item.value / totalExpense) * 100).toFixed(1)}%</span>
                    <span className="font-semibold text-gray-900 w-24 text-right">{formatCurrency(item.value)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Categories Bar */}
      {topCategories.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-orange-600" />Top Spending Categories</h3>
          <div className="space-y-3">
            {topCategories.map(([cat, val], i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-gray-700">{cat}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-xs">{((val / totalExpense) * 100).toFixed(1)}%</span>
                    <span className="font-bold text-gray-900">{formatCurrency(val)}</span>
                  </div>
                </div>
                <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden group cursor-pointer">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(val / maxCatVal) * 100}%`, backgroundColor: colors[i % colors.length] }} />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-bold text-white drop-shadow">{formatCurrency(val)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Goals + Budgets Summary */}
      <div className="grid gap-6 md:grid-cols-2">
        {goals.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2"><Target className="w-4 h-4 text-green-600" />Goals Summary</h3>
              <Link href="/dashboard/goals"><span className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">Manage<ArrowUpRight className="w-3 h-3" /></span></Link>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-xl"><p className="text-xs text-gray-500">Total</p><p className="font-bold text-blue-600">{goals.length}</p></div>
              <div className="text-center p-3 bg-green-50 rounded-xl"><p className="text-xs text-gray-500">Completed</p><p className="font-bold text-green-600">{completedGoals}</p></div>
              <div className="text-center p-3 bg-orange-50 rounded-xl"><p className="text-xs text-gray-500">In Progress</p><p className="font-bold text-orange-600">{goals.length - completedGoals}</p></div>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Total Saved</span>
                <span className="font-bold text-green-600">{formatCurrency(totalGoalsSaved)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Total Target</span>
                <span className="font-bold text-gray-900">{formatCurrency(totalGoalsTarget)}</span>
              </div>
              <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-green-500 rounded-full transition-all duration-700" style={{ width: `${Math.min((totalGoalsSaved / Math.max(totalGoalsTarget, 1)) * 100, 100)}%` }} />
              </div>
              <p className="text-xs text-gray-500 mt-1 text-right">{((totalGoalsSaved / Math.max(totalGoalsTarget, 1)) * 100).toFixed(1)}% of total target reached</p>
            </div>
          </div>
        )}

        {budgets.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2"><Award className="w-4 h-4 text-orange-600" />Budget Health</h3>
              <Link href="/dashboard/budgets"><span className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">Manage<ArrowUpRight className="w-3 h-3" /></span></Link>
            </div>
            <div className="space-y-3">
              {budgets.map((b: any) => {
                const pct = Math.min((Number(b.spent) / Math.max(Number(b.amount), 1)) * 100, 100);
                return (
                  <div key={b.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{b.name}</span>
                      <span className={`font-bold ${pct >= 90 ? 'text-red-600' : 'text-gray-700'}`}>{pct.toFixed(0)}%</span>
                    </div>
                    <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden group cursor-pointer">
                      <div className={`h-full rounded-full transition-all duration-700 ${pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-orange-500' : 'bg-blue-500'}`} style={{ width: `${pct}%` }} />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs font-bold text-white drop-shadow">{formatCurrency(b.spent)} / {formatCurrency(b.amount)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Account breakdown */}
      {accounts.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2"><Wallet className="w-4 h-4 text-blue-600" />Account Breakdown</h3>
            <Link href="/dashboard/accounts"><span className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">Manage<ArrowUpRight className="w-3 h-3" /></span></Link>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {accounts.map((acc: any) => (
              <div key={acc.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-gray-900 text-sm">{acc.name}</p>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{acc.type}</span>
                </div>
                <p className={`text-xl font-bold ${Number(acc.balance) >= 0 ? 'text-gray-900' : 'text-red-600'}`}>{formatCurrency(acc.balance)}</p>
                <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min((Number(acc.balance) / Math.max(totalBalance, 1)) * 100, 100)}%` }} />
                </div>
                <p className="text-xs text-gray-500 mt-1">{totalBalance > 0 ? ((Number(acc.balance) / totalBalance) * 100).toFixed(1) : 0}% of total</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}