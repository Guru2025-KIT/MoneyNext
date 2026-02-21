'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { accountsApi } from '@/lib/api/accounts';
import { transactionsApi } from '@/lib/api/transactions';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import {
  TrendingUp, PieChart, Shield, Building2, DollarSign,
  BarChart3, Calculator, RefreshCw, AlertCircle, ArrowUpRight,
  ChevronDown, ChevronUp, Wallet, Target, Star, Info
} from 'lucide-react';

// No-flicker bar chart
function ProjectionChart({ data }: { data: { year: number; invested: number; value: number }[] }) {
  const [tooltip, setTooltip] = useState({ text: '', visible: false });
  const timer = useRef<any>(null);
  const show = (text: string) => { if (timer.current) clearTimeout(timer.current); setTooltip({ text, visible: true }); };
  const hide = () => { timer.current = setTimeout(() => setTooltip(t => ({ ...t, visible: false })), 100); };
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const H = 140;
  return (
    <div className="w-full">
      <div className="h-8 flex items-center justify-center mb-1">
        <div className={`px-3 py-1 bg-gray-800 text-white text-xs font-semibold rounded-lg transition-opacity duration-150 ${tooltip.visible ? 'opacity-100' : 'opacity-0'}`}>{tooltip.text}</div>
      </div>
      <div className="flex items-end gap-1 px-1" style={{ height: H }}>
        {data.map((item, i) => (
          <div key={i} className="flex-1 flex items-end gap-0.5" style={{ height: H }}>
            <div className="flex-1 rounded-t-md bg-gradient-to-t from-blue-200 to-blue-100 min-h-1"
              style={{ height: Math.max((item.invested / maxVal) * H, 3) }} />
            <div className="flex-1 rounded-t-md bg-gradient-to-t from-green-600 to-green-400 cursor-pointer hover:opacity-80 transition-opacity min-h-1"
              style={{ height: Math.max((item.value / maxVal) * H, 3) }}
              onMouseEnter={() => show(`Year ${item.year}: Invested ${formatCurrency(item.invested)} → Value ${formatCurrency(item.value)}`)}
              onMouseLeave={hide} />
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1 px-1">
        {data.map((item, i) => <div key={i} className="flex-1 text-center"><span className="text-xs text-gray-500">Yr {item.year}</span></div>)}
      </div>
      <div className="flex justify-center gap-4 mt-2">
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-200" /><span className="text-xs text-gray-600">Invested</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-green-500" /><span className="text-xs text-gray-600">Maturity Value</span></div>
      </div>
    </div>
  );
}

// Portfolio donut
function PortfolioDonut({ accounts }: { accounts: any[] }) {
  const [hov, setHov] = useState<number | null>(null);
  const data = accounts.filter(a => Number(a.balance) > 0).map((a, i) => ({
    label: a.name, value: Number(a.balance),
    color: ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6','#06B6D4'][i % 6]
  }));
  if (!data.length) return <div className="flex flex-col items-center justify-center h-40 text-gray-400"><PieChart className="w-8 h-8 mb-2 opacity-30" /><p className="text-sm">No accounts yet</p></div>;
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = 60; const circ = 2 * Math.PI * r; let off = 0;
  return (
    <div className="flex flex-col items-center">
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle cx="90" cy="90" r={r} fill="none" stroke="#f3f4f6" strokeWidth="24" />
        {data.map((item, i) => {
          const dash = (item.value / total) * circ; const gap = circ - dash; const cur = off; off += dash;
          return <circle key={i} cx="90" cy="90" r={r} fill="none" stroke={item.color}
            strokeWidth={hov === i ? 30 : 24} strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-cur + circ * 0.25} strokeLinecap="round"
            style={{ transition: 'stroke-width 0.2s', cursor: 'pointer' }}
            onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} />;
        })}
        {hov !== null ? (<>
          <text x="90" y="84" textAnchor="middle" fill="#111827" fontSize="9" fontWeight="700">{data[hov].label}</text>
          <text x="90" y="97" textAnchor="middle" fill={data[hov].color} fontSize="10" fontWeight="700">{formatCurrency(data[hov].value)}</text>
          <text x="90" y="109" textAnchor="middle" fill="#6B7280" fontSize="8">{((data[hov].value/total)*100).toFixed(1)}%</text>
        </>) : (<>
          <text x="90" y="87" textAnchor="middle" fill="#6B7280" fontSize="9">Total</text>
          <text x="90" y="100" textAnchor="middle" fill="#111827" fontSize="11" fontWeight="700">{formatCurrency(total)}</text>
        </>)}
      </svg>
      <div className="flex flex-wrap gap-1.5 justify-center mt-2">
        {data.map((item, i) => (
          <div key={i} className={`flex items-center gap-1 px-2 py-0.5 rounded-lg cursor-pointer transition-colors ${hov===i?'bg-gray-100':''}`}
            onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const investmentOptions = [
  { name: 'Mutual Funds (SIP)', returns: '12-15%', risk: 'Medium', minInvest: 500, icon: PieChart, color: 'blue', recommended: true, description: 'Diversified portfolio managed by professionals. Best for long-term wealth creation.', features: ['Tax benefits under 80C (ELSS)', 'Long-term wealth creation', 'Professional management', 'Start with just ₹500/month'], link: 'https://www.amfiindia.com' },
  { name: 'Fixed Deposits', returns: '6-7%', risk: 'Low', minInvest: 10000, icon: Shield, color: 'green', description: 'Safe and guaranteed returns. Ideal for short-term goals and emergency funds.', features: ['No market risk', 'Guaranteed returns', 'Loan against FD available', 'Premature withdrawal option'], link: 'https://www.bankbazaar.com/fixed-deposit.html' },
  { name: 'National Pension Scheme', returns: '9-12%', risk: 'Low-Medium', minInvest: 500, icon: Building2, color: 'purple', description: 'Government-backed retirement scheme with excellent tax benefits.', features: ['Tax benefits up to ₹2L (80CCD)', 'Retirement corpus building', 'Government backed', 'Low cost fund management'], link: 'https://npscra.nsdl.co.in' },
  { name: 'Public Provident Fund', returns: '7.1%', risk: 'Low', minInvest: 500, icon: DollarSign, color: 'yellow', description: 'Best long-term tax-free savings with government guarantee.', features: ['15-year lock-in', 'Tax-free returns', 'Government guaranteed', 'Partial withdrawal after 7 years'], link: 'https://www.indiapost.gov.in' },
  { name: 'Equity Stocks', returns: '15-20%', risk: 'High', minInvest: 100, icon: TrendingUp, color: 'red', description: 'Direct stock market investment for experienced investors.', features: ['High growth potential', 'Dividend income', 'Requires market knowledge', 'High risk - can lose money'], link: 'https://www.nseindia.com' },
  { name: 'Gold ETF', returns: '8-10%', risk: 'Low-Medium', minInvest: 1000, icon: Star, color: 'orange', description: 'Digital gold investment. Hedge against inflation and currency risk.', features: ['No storage risk', 'Highly liquid', 'Inflation hedge', 'Linked to gold price'], link: 'https://www.goldhub.com' },
];

export default function InvestmentsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [sipMonthly, setSipMonthly] = useState(5000);
  const [sipYears, setSipYears] = useState(10);
  const [sipRate, setSipRate] = useState(12);

  const loadData = useCallback(async () => {
    try {
      const [acc, txn] = await Promise.all([accountsApi.getAll(), transactionsApi.getAll()]);
      setAccounts(acc); setTransactions(txn);
    } catch { setError('Failed to load portfolio data'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const totalBalance = accounts.reduce((s, a) => s + Number(a.balance), 0);
  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + Number(t.amount), 0);
  const investable = Math.max(0, totalIncome - totalExpense) * 0.2;

  // SIP projection data
  const sipProjection = Array.from({ length: Math.min(sipYears, 10) }, (_, i) => {
    const yr = Math.floor((i + 1) * sipYears / 10);
    const months = yr * 12; const r = sipRate / 100 / 12;
    return { year: yr, invested: sipMonthly * months, value: sipMonthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r) };
  });
  const finalValue = sipProjection[sipProjection.length - 1]?.value || 0;
  const totalInvested = sipMonthly * sipYears * 12;
  const totalGains = finalValue - totalInvested;

  const riskColor = (risk: string) => risk === 'Low' ? 'text-green-600 bg-green-50' : risk === 'Medium' ? 'text-orange-600 bg-orange-50' : risk === 'High' ? 'text-red-600 bg-red-50' : 'text-yellow-600 bg-yellow-50';
  const optColors: Record<string, string> = { blue: 'bg-blue-100 text-blue-600', green: 'bg-green-100 text-green-600', purple: 'bg-purple-100 text-purple-600', yellow: 'bg-yellow-100 text-yellow-700', red: 'bg-red-100 text-red-600', orange: 'bg-orange-100 text-orange-600' };

  if (loading) return <div className="flex justify-center items-center min-h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div><h1 className="text-3xl font-bold text-gray-900">Investments</h1><p className="text-gray-500 text-sm mt-1">Grow your wealth with smart investments</p></div>
        <button onClick={loadData} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm font-medium"><RefreshCw className="w-4 h-4" />Refresh</button>
      </div>

      {error && <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"><AlertCircle className="w-5 h-5" />{error}</div>}

      {/* Portfolio Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Portfolio', value: formatCurrency(totalBalance), sub: `${accounts.length} accounts`, ibg: 'bg-blue-100', ic: 'text-blue-600', Icon: Wallet },
          { label: 'Total Income', value: formatCurrency(totalIncome), sub: 'All time', ibg: 'bg-green-100', ic: 'text-green-600', Icon: TrendingUp, vc: 'text-green-600' },
          { label: 'Total Expenses', value: formatCurrency(totalExpense), sub: 'All time', ibg: 'bg-red-100', ic: 'text-red-600', Icon: BarChart3, vc: 'text-red-600' },
          { label: 'Investable Surplus', value: formatCurrency(investable), sub: '20% of net savings', ibg: 'bg-purple-100', ic: 'text-purple-600', Icon: Target, vc: 'text-purple-600' },
        ].map((card, i) => { const Icon = card.Icon; return (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className={`p-2.5 ${card.ibg} rounded-xl w-fit mb-3`}><Icon className={`w-5 h-5 ${card.ic}`} /></div>
            <p className="text-xs text-gray-500 mb-1">{card.label}</p>
            <p className={`text-xl font-bold ${card.vc || 'text-gray-900'}`}>{card.value}</p>
            <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
          </div>
        ); })}
      </div>

      {/* Portfolio Donut + SIP Calculator */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4"><PieChart className="w-4 h-4 text-blue-600" />Portfolio Allocation</h3>
          <PortfolioDonut accounts={accounts} />
          {accounts.length > 0 && (
            <div className="mt-4 space-y-2 border-t border-gray-100 pt-3">
              {accounts.filter(a => Number(a.balance) > 0).map((acc: any, i: number) => (
                <div key={acc.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{acc.name} <span className="text-xs text-gray-400">({acc.type})</span></span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-xs">{totalBalance > 0 ? ((Number(acc.balance)/totalBalance)*100).toFixed(1) : 0}%</span>
                    <span className="font-bold text-gray-900">{formatCurrency(acc.balance)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4"><Calculator className="w-4 h-4 text-green-600" />SIP Growth Projection</h3>
          <div className="space-y-3 mb-4">
            <div><div className="flex justify-between mb-1"><label className="text-xs font-medium text-gray-600">Monthly Investment</label><span className="text-xs font-bold text-blue-600">{formatCurrency(sipMonthly)}</span></div><input type="range" min="500" max="50000" step="500" value={sipMonthly} onChange={e => setSipMonthly(Number(e.target.value))} className="w-full accent-blue-600" suppressHydrationWarning /></div>
            <div><div className="flex justify-between mb-1"><label className="text-xs font-medium text-gray-600">Duration</label><span className="text-xs font-bold text-blue-600">{sipYears} years</span></div><input type="range" min="1" max="30" value={sipYears} onChange={e => setSipYears(Number(e.target.value))} className="w-full accent-blue-600" suppressHydrationWarning /></div>
            <div><div className="flex justify-between mb-1"><label className="text-xs font-medium text-gray-600">Expected Return</label><span className="text-xs font-bold text-blue-600">{sipRate}% p.a.</span></div><input type="range" min="6" max="20" value={sipRate} onChange={e => setSipRate(Number(e.target.value))} className="w-full accent-blue-600" suppressHydrationWarning /></div>
          </div>
          <ProjectionChart data={sipProjection} />
          <div className="grid grid-cols-3 gap-2 mt-3 border-t border-gray-100 pt-3">
            <div className="text-center p-2 bg-blue-50 rounded-xl"><p className="text-xs text-gray-500">Invested</p><p className="text-xs font-bold text-blue-600">{formatCurrency(totalInvested)}</p></div>
            <div className="text-center p-2 bg-green-50 rounded-xl"><p className="text-xs text-gray-500">Gains</p><p className="text-xs font-bold text-green-600">{formatCurrency(totalGains)}</p></div>
            <div className="text-center p-2 bg-purple-50 rounded-xl"><p className="text-xs text-gray-500">Maturity</p><p className="text-xs font-bold text-purple-600">{formatCurrency(finalValue)}</p></div>
          </div>
        </div>
      </div>

      {/* Investment Options */}
      <div>
        <h3 className="font-bold text-gray-900 text-lg mb-4">Investment Options</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {investmentOptions.map((opt, i) => {
            const Icon = opt.icon;
            const isExpanded = expandedId === i;
            return (
              <div key={i} className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden ${opt.recommended ? 'border-blue-300' : 'border-gray-200'}`}>
                {opt.recommended && <div className="bg-blue-600 text-white text-xs font-bold text-center py-1.5">⭐ RECOMMENDED FOR BEGINNERS</div>}
                <div className="p-5">
                  <div className="flex items-start gap-4 mb-3">
                    <div className={`p-3 rounded-xl ${optColors[opt.color]}`}><Icon className="w-6 h-6" /></div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{opt.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Returns: {opt.returns}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${riskColor(opt.risk)}`}>Risk: {opt.risk}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Min. Investment</p>
                      <p className="font-bold text-gray-900">{formatCurrency(opt.minInvest)}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{opt.description}</p>
                  {isExpanded && (
                    <div className="mb-4 space-y-1.5">
                      {opt.features.map((f, j) => (
                        <div key={j} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />{f}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button onClick={() => setExpandedId(isExpanded ? null : i)} className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition text-sm font-medium flex items-center justify-center gap-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      {isExpanded ? 'Less Info' : 'Learn More'}
                    </button>
                    <a href={opt.link} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm font-semibold flex items-center justify-center gap-1">
                      <ArrowUpRight className="w-4 h-4" />Invest Now
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}