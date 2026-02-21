'use client';

import DisclaimerModal from '@/components/DisclaimerModal';
import { useEffect, useState, useCallback } from 'react';
import { transactionsApi } from '@/lib/api/transactions';
import { accountsApi } from '@/lib/api/accounts';
import { budgetsApi } from '@/lib/api/budgets';
import { goalsApi } from '@/lib/api/goals';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import {
  TrendingUp, TrendingDown, Wallet, PiggyBank, Target, BarChart3, RefreshCw, Plus,
  AlertCircle, DollarSign, Briefcase, Calculator, Zap, Repeat, CreditCard, ArrowRight,
  Shield, Building, Award
} from 'lucide-react';


// Bar Chart Component
function SimpleBarChart({ data }: { data: { label: string; income: number; expense: number }[] }) {
  if (!data.length || data.every(d => d.income === 0 && d.expense === 0)) {
    return <div className="text-center py-8 text-gray-400 text-sm">Add transactions to see trends</div>;
  }
  
  const maxVal = Math.max(...data.flatMap(d => [d.income, d.expense]), 1);
  const H = 120;
  
  return (
    <div>
      <div className="flex items-end gap-2" style={{ height: H }}>
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex items-end gap-1" style={{ height: H }}>
            <div 
              className="flex-1 rounded-t-md bg-emerald-500 hover:bg-emerald-600 transition-colors cursor-pointer" 
              style={{ height: Math.max((d.income / maxVal) * H, 2), minHeight: '2px' }}
              title={`${d.label} Income: ${formatCurrency(d.income)}`}
            />
            <div 
              className="flex-1 rounded-t-md bg-rose-500 hover:bg-rose-600 transition-colors cursor-pointer" 
              style={{ height: Math.max((d.expense / maxVal) * H, 2), minHeight: '2px' }}
              title={`${d.label} Expense: ${formatCurrency(d.expense)}`}
            />
          </div>
        ))}
      </div>
      <div className="flex mt-2">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center text-xs text-gray-400">{d.label}</div>
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-emerald-500" />
          <span className="text-xs text-gray-600">Income</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-rose-500" />
          <span className="text-xs text-gray-600">Expense</span>
        </div>
      </div>
    </div>
  );
}

export default function MiddleIncomeDashboard() {
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
      setError(err?.response?.status === 401 ? 'Please login' : 'Failed to load data');
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

  // Calculate 6-month trend
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return {
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString('en-US', { month: 'short' })
    };
  });

  const trendData = last6Months.map(({ key, label }) => {
    const monthTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === key;
    });
    return {
      label,
      income: monthTransactions.filter(t => t.type === 'INCOME').reduce((s, t) => s + Number(t.amount), 0),
      expense: monthTransactions.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + Number(t.amount), 0)
    };
  });

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50">
      <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-blue-600"></div>
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
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold">Middle Income Dashboard</h1>
                  <span className="px-2 py-0.5 bg-blue-400/25 border border-blue-300/40 text-blue-100 text-xs font-bold rounded-full">STANDARD</span>
                </div>
                <p className="text-blue-200 text-xs mt-0.5">
                  Balance: <span className="font-bold text-white">{formatCurrency(totalBalance)}</span>
                  <span className="mx-2">•</span>
                  Savings: <span className="font-bold text-white">{savingsRate.toFixed(1)}%</span>
                  <span className="mx-2">•</span>
                  Updated {lastUpdated.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={loadData} className="flex items-center gap-1.5 px-3 py-2 bg-white/15 hover:bg-white/25 rounded-xl text-white text-sm font-medium transition-colors">
                <RefreshCw className="w-3.5 h-3.5" />Refresh
              </button>
              <Link href="/dashboard/transactions">
                <button className="flex items-center gap-1.5 px-4 py-2 bg-white text-blue-700 rounded-xl hover:bg-blue-50 text-sm font-bold transition-colors">
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
            { label: 'Net Savings', value: formatCurrency(monthlyIncome - monthlyExpenses), sub: `${savingsRate.toFixed(1)}% rate`, icon: PiggyBank, ibg: 'bg-blue-100', ic: 'text-blue-600', vc: (monthlyIncome - monthlyExpenses) >= 0 ? 'text-blue-700' : 'text-rose-700' },
            { label: 'Total Balance', value: formatCurrency(totalBalance), sub: `${accounts.length} accounts`, icon: Wallet, ibg: 'bg-purple-100', ic: 'text-purple-600', vc: 'text-purple-700' },
          ].map((c, i) => { const Icon = c.icon; return (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className={`p-2.5 ${c.ibg} rounded-xl w-fit mb-3`}><Icon className={`w-5 h-5 ${c.ic}`} /></div>
              <p className="text-xs text-gray-500 mb-1">{c.label}</p>
              <p className={`text-xl font-bold ${c.vc}`}>{c.value}</p>
              <p className="text-xs text-gray-400 mt-1">{c.sub}</p>
            </div>
          ); })}
        </div>

        {/* 6-Month Trend Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              Income vs Expense (Last 6 Months)
            </h3>
            <Link href="/dashboard/analytics">
              <span className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
                View Details<ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          </div>
          <SimpleBarChart data={trendData} />
        </div>

        {/* Middle-Tier Exclusive Features */}
        <div>
          <h3 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2"><DollarSign className="w-4 h-4 text-blue-500" />Middle Income Exclusive Tools</h3>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {[
              { href: '/dashboard/side-hustle', icon: Briefcase, title: 'Side Hustle', desc: 'Track multiple incomes', badge: 'EARN', ib: 'bg-blue-100', ic: 'text-blue-600', bc: 'bg-blue-50 text-blue-700' },
              { href: '/dashboard/emi-calculator', icon: Calculator, title: 'EMI Calculator', desc: 'Compare loan offers', badge: 'SAVE', ib: 'bg-green-100', ic: 'text-green-600', bc: 'bg-green-50 text-green-700' },
              { href: '/dashboard/expense-predictor', icon: Zap, title: 'Expense Predictor', desc: 'AI forecasting', badge: 'PREDICT', ib: 'bg-amber-100', ic: 'text-amber-600', bc: 'bg-amber-50 text-amber-700' },
              { href: '/dashboard/subscriptions', icon: Repeat, title: 'Subscriptions', desc: 'Track recurring', badge: 'TRACK', ib: 'bg-purple-100', ic: 'text-purple-600', bc: 'bg-purple-50 text-purple-700' },
              { href: '/dashboard/debt-payoff', icon: TrendingDown, title: 'Debt Payoff', desc: 'Freedom planner', badge: 'FREEDOM', ib: 'bg-red-100', ic: 'text-red-600', bc: 'bg-red-50 text-red-700' },
              { href: '/dashboard/salary-negotiator', icon: DollarSign, title: 'Salary Helper', desc: 'Market worth', badge: 'GROW', ib: 'bg-emerald-100', ic: 'text-emerald-600', bc: 'bg-emerald-50 text-emerald-700' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <Link key={i} href={item.href}>
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <div className={`p-2 ${item.ib} rounded-lg group-hover:scale-110 transition-transform`}><Icon className={`w-4 h-4 ${item.ic}`} /></div>
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${item.bc}`}>{item.badge}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 text-xs mb-1">{item.title}</h4>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Budgets & Goals */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2"><PiggyBank className="w-4 h-4 text-blue-600" />Budget Progress</h3>
              <Link href="/dashboard/budgets"><span className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">Manage<ArrowRight className="w-3 h-3" /></span></Link>
            </div>
            {budgets.length > 0 ? (
              <div className="space-y-3">
                {budgets.slice(0, 3).map((b: any) => {
                  const pct = Math.min((Number(b.spent) / Math.max(Number(b.amount), 1)) * 100, 100);
                  const color = pct >= 90 ? '#EF4444' : pct >= 70 ? '#F59E0B' : '#10B981';
                  return (
                    <div key={b.id}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-semibold text-gray-800">{b.name}</span>
                        <span className="text-xs font-bold" style={{ color }}>{pct.toFixed(0)}%</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  );
                })}
                <Link href="/dashboard/budgets">
                  <button className="w-full mt-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors">
                    View All Budgets
                  </button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <PiggyBank className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p className="text-gray-500 text-sm mb-3">No budgets yet</p>
                <Link href="/dashboard/budgets">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2 mx-auto">
                    <Plus className="w-4 h-4" />Create Budget
                  </button>
                </Link>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2"><Target className="w-4 h-4 text-emerald-600" />Savings Goals</h3>
              <Link href="/dashboard/goals"><span className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">Manage<ArrowRight className="w-3 h-3" /></span></Link>
            </div>
            {goals.length > 0 ? (
              <div className="space-y-3">
                {goals.slice(0, 3).map((g: any) => {
                  const pct = Math.min((Number(g.currentAmount) / Math.max(Number(g.targetAmount), 1)) * 100, 100);
                  const color = pct >= 100 ? '#10B981' : pct >= 60 ? '#3B82F6' : '#F59E0B';
                  return (
                    <div key={g.id}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-semibold text-gray-800">{g.name}</span>
                        <span className="text-xs font-bold" style={{ color }}>{pct.toFixed(0)}%</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  );
                })}
                <Link href="/dashboard/goals">
                  <button className="w-full mt-3 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-semibold hover:bg-emerald-100 transition-colors">
                    View All Goals
                  </button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <Target className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p className="text-gray-500 text-sm mb-3">No goals yet</p>
                <Link href="/dashboard/goals">
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 flex items-center gap-2 mx-auto">
                    <Plus className="w-4 h-4" />Create Goal
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2"><CreditCard className="w-4 h-4 text-blue-600" />Recent Transactions</h3>
            <Link href="/dashboard/transactions"><span className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">View All<ArrowRight className="w-3 h-3" /></span></Link>
          </div>
          {transactions.length > 0 ? (
            <div className="space-y-2">
              {transactions.slice(0, 5).map((t: any) => (
                <div key={t.id} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${t.type === 'INCOME' ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                      {t.type === 'INCOME' ? <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> : <TrendingDown className="w-3.5 h-3.5 text-rose-600" />}
                    </div>
                    <div><p className="font-semibold text-gray-900 text-sm">{t.description}</p><p className="text-xs text-gray-400">{new Date(t.date).toLocaleDateString()}</p></div>
                  </div>
                  <span className={`font-bold text-sm ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>{t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">No transactions yet</div>
          )}
        </div>

        {/* Quick Access */}
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
            { href: '/dashboard/investments', icon: Building, label: 'Investments' },
            { href: '/dashboard/insurance', icon: Shield, label: 'Insurance' },
            { href: '/dashboard/tax', icon: Calculator, label: 'Tax Planning' },
          ].map((link, i) => {
            const Icon = link.icon;
            return (
              <Link key={i} href={link.href}>
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer group">
                  <Icon className="w-6 h-6 text-slate-600 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-bold text-gray-900 text-sm">{link.label}</p>
                  <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">View <ArrowRight className="w-3 h-3" /></span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}