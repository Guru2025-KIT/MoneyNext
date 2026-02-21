'use client';

import { useState, useCallback, useEffect } from 'react';
import { transactionsApi } from '@/lib/api/transactions';
import { formatCurrency } from '@/lib/utils';
import { Calculator, TrendingDown, Shield, PiggyBank, FileText, RefreshCw, AlertCircle, CheckCircle, ChevronDown, ChevronUp, Info } from 'lucide-react';

function TaxBreakdownBar({ label, amount, max, color }: { label: string; amount: number; max: number; color: string }) {
  const pct = Math.min((amount / Math.max(max, 1)) * 100, 100);
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-bold text-gray-900">{formatCurrency(amount)}</span>
      </div>
      <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden group cursor-pointer">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs font-bold text-white drop-shadow">{pct.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}

export default function TaxPlanningPage() {
  const [income, setIncome] = useState(800000);
  const [regime, setRegime] = useState<'new' | 'old'>('new');
  const [deductions, setDeductions] = useState({ section80C: 150000, section80D: 25000, hra: 0, homeLoan: 0, nps: 50000, other: 0 });
  const [totalIncome, setTotalIncome] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    transactionsApi.getAll().then(txns => {
      const inc = txns.filter((t: any) => t.type === 'INCOME').reduce((s: number, t: any) => s + Number(t.amount), 0);
      if (inc > 0) { setIncome(inc); setTotalIncome(inc); }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const calcNewRegimeTax = (taxable: number) => {
    let tax = 0;
    if (taxable <= 300000) tax = 0;
    else if (taxable <= 600000) tax = (taxable - 300000) * 0.05;
    else if (taxable <= 900000) tax = 15000 + (taxable - 600000) * 0.10;
    else if (taxable <= 1200000) tax = 45000 + (taxable - 900000) * 0.15;
    else if (taxable <= 1500000) tax = 90000 + (taxable - 1200000) * 0.20;
    else tax = 150000 + (taxable - 1500000) * 0.30;
    // Rebate u/s 87A for income <= 7L
    if (taxable <= 700000) tax = 0;
    return tax * 1.04; // 4% cess
  };

  const calcOldRegimeTax = (taxable: number) => {
    let tax = 0;
    if (taxable <= 250000) tax = 0;
    else if (taxable <= 500000) tax = (taxable - 250000) * 0.05;
    else if (taxable <= 1000000) tax = 12500 + (taxable - 500000) * 0.20;
    else tax = 112500 + (taxable - 1000000) * 0.30;
    // Rebate u/s 87A for income <= 5L
    if (taxable <= 500000) tax = 0;
    return tax * 1.04;
  };

  const newStdDeduction = 75000;
  const oldStdDeduction = 50000;

  const newTaxableIncome = Math.max(0, income - newStdDeduction);
  const newTax = calcNewRegimeTax(newTaxableIncome);

  const totalOldDeductions = Math.min(deductions.section80C, 150000) + Math.min(deductions.section80D, 75000) + deductions.hra + Math.min(deductions.homeLoan, 200000) + Math.min(deductions.nps, 50000) + deductions.other;
  const oldTaxableIncome = Math.max(0, income - oldStdDeduction - totalOldDeductions);
  const oldTax = calcOldRegimeTax(oldTaxableIncome);

  const activeTax = regime === 'new' ? newTax : oldTax;
  const activeTaxable = regime === 'new' ? newTaxableIncome : oldTaxableIncome;
  const effectiveRate = income > 0 ? (activeTax / income) * 100 : 0;
  const betterRegime = newTax <= oldTax ? 'new' : 'old';
  const savings = Math.abs(newTax - oldTax);

  const deductionItems = [
    { key: 'section80C', label: 'Section 80C (PPF, ELSS, LIC, etc.)', max: 150000, icon: PiggyBank, tip: 'Invest in PPF, ELSS mutual funds, or pay LIC premium to claim up to ₹1.5L' },
    { key: 'section80D', label: 'Section 80D (Health Insurance)', max: 75000, icon: Shield, tip: 'Self: up to ₹25K, Parents: up to ₹50K. Senior citizen parents: up to ₹50K each' },
    { key: 'hra', label: 'HRA Exemption', max: income * 0.4, icon: FileText, tip: 'Applicable if you live in rented accommodation. Claim through employer.' },
    { key: 'homeLoan', label: 'Home Loan Interest (Sec 24b)', max: 200000, icon: FileText, tip: 'Deduction on home loan interest up to ₹2L per year' },
    { key: 'nps', label: 'NPS Additional (80CCD(1B))', max: 50000, icon: PiggyBank, tip: 'Additional ₹50K deduction over and above 80C for NPS contribution' },
    { key: 'other', label: 'Other Deductions', max: 100000, icon: FileText, tip: 'Donations (80G), Education loan interest (80E), etc.' },
  ];

  if (loading) return <div className="flex justify-center items-center min-h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tax Planning</h1>
        <p className="text-gray-500 text-sm mt-1">Calculate tax and maximize your savings legally {totalIncome > 0 && `• Auto-loaded from your transactions: ${formatCurrency(totalIncome)}`}</p>
      </div>

      {/* Regime Comparison Banner */}
      <div className={`p-4 rounded-2xl border-2 ${betterRegime === 'new' ? 'bg-green-50 border-green-300' : 'bg-blue-50 border-blue-300'}`}>
        <div className="flex items-start gap-3">
          <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${betterRegime === 'new' ? 'text-green-600' : 'text-blue-600'}`} />
          <div>
            <p className="font-bold text-gray-900">{betterRegime === 'new' ? 'New Tax Regime' : 'Old Tax Regime'} is better for you!</p>
            <p className="text-sm text-gray-600 mt-0.5">You save <span className="font-bold text-green-600">{formatCurrency(savings)}</span> by choosing the {betterRegime} regime. {betterRegime === 'new' ? 'New regime has lower slab rates and is simpler.' : 'Old regime benefits you due to your high deductions.'}</p>
          </div>
        </div>
      </div>

      {/* Income Input */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Your Annual Income</h3>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-600">Gross Annual Income</label>
            <span className="text-sm font-bold text-blue-600">{formatCurrency(income)}</span>
          </div>
          <input type="range" min="100000" max="5000000" step="10000" value={income} onChange={e => setIncome(Number(e.target.value))} className="w-full accent-blue-600 mb-3" suppressHydrationWarning />
          <input type="number" value={income} onChange={e => setIncome(Number(e.target.value))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Enter annual income" suppressHydrationWarning />
        </div>
      </div>

      {/* Regime Toggle + Results */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Old Regime */}
        <div className={`bg-white rounded-2xl border-2 p-6 shadow-sm cursor-pointer transition-all ${regime === 'old' ? 'border-blue-500 shadow-blue-100' : 'border-gray-200'}`} onClick={() => setRegime('old')}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Old Tax Regime</h3>
              <p className="text-xs text-gray-500 mt-0.5">With deductions & exemptions</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${regime === 'old' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
              {regime === 'old' && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </div>
          <div className="space-y-3">
            <TaxBreakdownBar label="Gross Income" amount={income} max={income} color="#6B7280" />
            <TaxBreakdownBar label="Standard Deduction" amount={oldStdDeduction} max={income} color="#3B82F6" />
            <TaxBreakdownBar label="Other Deductions" amount={totalOldDeductions} max={income} color="#10B981" />
            <TaxBreakdownBar label="Taxable Income" amount={oldTaxableIncome} max={income} color="#F59E0B" />
            <div className="p-4 bg-red-50 rounded-xl">
              <p className="text-sm text-gray-600">Tax Payable (with 4% cess)</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(oldTax)}</p>
              <p className="text-xs text-gray-500 mt-1">Effective rate: {income > 0 ? ((oldTax/income)*100).toFixed(2) : 0}%</p>
            </div>
          </div>
        </div>

        {/* New Regime */}
        <div className={`bg-white rounded-2xl border-2 p-6 shadow-sm cursor-pointer transition-all ${regime === 'new' ? 'border-green-500 shadow-green-100' : 'border-gray-200'}`} onClick={() => setRegime('new')}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">New Tax Regime</h3>
              <p className="text-xs text-gray-500 mt-0.5">Lower slabs, no deductions (Default)</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${regime === 'new' ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}>
              {regime === 'new' && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </div>
          <div className="space-y-3">
            <TaxBreakdownBar label="Gross Income" amount={income} max={income} color="#6B7280" />
            <TaxBreakdownBar label="Standard Deduction" amount={newStdDeduction} max={income} color="#3B82F6" />
            <TaxBreakdownBar label="Taxable Income" amount={newTaxableIncome} max={income} color="#F59E0B" />
            <div className="p-4 bg-green-50 rounded-xl mt-4">
              <p className="text-sm text-gray-600">Tax Payable (with 4% cess)</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(newTax)}</p>
              <p className="text-xs text-gray-500 mt-1">Effective rate: {income > 0 ? ((newTax/income)*100).toFixed(2) : 0}%{newTaxableIncome <= 700000 && ' • Zero tax due to 87A rebate!'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Old Regime Deductions (only shown when old regime selected) */}
      {regime === 'old' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Deductions (Old Regime)</h3>
          <div className="space-y-4">
            {deductionItems.map((item) => {
              const isOpen = expandedSection === item.key;
              return (
                <div key={item.key} className="border border-gray-100 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50" onClick={() => setExpandedSection(isOpen ? null : item.key)}>
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-green-600">{formatCurrency(deductions[item.key as keyof typeof deductions])}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </div>
                  </div>
                  {isOpen && (
                    <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                      <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg mb-3">
                        <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-700">{item.tip}</p>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-500">Amount</span>
                        <span className="text-xs font-bold text-gray-700">Max: {formatCurrency(item.max)}</span>
                      </div>
                      <input type="range" min="0" max={item.max} step="1000"
                        value={deductions[item.key as keyof typeof deductions]}
                        onChange={e => setDeductions(d => ({ ...d, [item.key]: Number(e.target.value) }))}
                        className="w-full accent-green-600 mb-2" suppressHydrationWarning />
                      <input type="number" value={deductions[item.key as keyof typeof deductions]}
                        onChange={e => setDeductions(d => ({ ...d, [item.key]: Math.min(Number(e.target.value), item.max) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" suppressHydrationWarning />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-4 bg-green-50 rounded-xl flex justify-between items-center">
            <span className="font-semibold text-gray-700">Total Deductions</span>
            <span className="font-bold text-green-600 text-lg">{formatCurrency(totalOldDeductions + oldStdDeduction)}</span>
          </div>
        </div>
      )}

      {/* Tax Saving Tips */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><TrendingDown className="w-4 h-4 text-green-600" />Smart Tax Saving Tips</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { tip: 'Invest ₹1.5L in ELSS/PPF', saving: 46800, desc: 'Section 80C deduction at 30% slab saves maximum tax' },
            { tip: 'Buy Health Insurance', saving: 7800, desc: '₹25K premium for self under 80D saves ₹7,800 in tax' },
            { tip: 'Invest in NPS (80CCD)', saving: 15600, desc: 'Extra ₹50K in NPS saves additional tax over 80C' },
            { tip: 'Pay Home Loan EMI', saving: 62400, desc: '₹2L interest deduction under Section 24b for home loan' },
            { tip: 'HRA Exemption', saving: 30000, desc: 'Claim HRA if you live in rented house - through employer' },
            { tip: 'Donate to Charity', saving: 10000, desc: '50-100% deduction under 80G for eligible donations' },
          ].map((item, i) => (
            <div key={i} className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">{item.tip}</p>
                <p className="text-xs text-gray-600 mt-0.5">{item.desc}</p>
                <p className="text-xs font-bold text-green-600 mt-1">Potential saving: {formatCurrency(item.saving)}/year</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tax Slabs Reference */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">New Regime Tax Slabs (FY 2024-25)</h3>
          <div className="space-y-2">
            {[
              { range: 'Up to ₹3 Lakh', rate: '0%', color: 'bg-green-500' },
              { range: '₹3L - ₹6L', rate: '5%', color: 'bg-blue-400' },
              { range: '₹6L - ₹9L', rate: '10%', color: 'bg-blue-500' },
              { range: '₹9L - ₹12L', rate: '15%', color: 'bg-yellow-500' },
              { range: '₹12L - ₹15L', rate: '20%', color: 'bg-orange-500' },
              { range: 'Above ₹15L', rate: '30%', color: 'bg-red-500' },
            ].map((slab, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2"><div className={`w-2.5 h-2.5 rounded-full ${slab.color}`} /><span className="text-sm text-gray-700">{slab.range}</span></div>
                <span className="font-bold text-gray-900">{slab.rate}</span>
              </div>
            ))}
            <p className="text-xs text-gray-500 mt-2">* Plus 4% Health & Education Cess. Rebate u/s 87A for income up to ₹7L (zero tax)</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Old Regime Tax Slabs (FY 2024-25)</h3>
          <div className="space-y-2">
            {[
              { range: 'Up to ₹2.5 Lakh', rate: '0%', color: 'bg-green-500' },
              { range: '₹2.5L - ₹5L', rate: '5%', color: 'bg-blue-400' },
              { range: '₹5L - ₹10L', rate: '20%', color: 'bg-orange-500' },
              { range: 'Above ₹10L', rate: '30%', color: 'bg-red-500' },
            ].map((slab, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2"><div className={`w-2.5 h-2.5 rounded-full ${slab.color}`} /><span className="text-sm text-gray-700">{slab.range}</span></div>
                <span className="font-bold text-gray-900">{slab.rate}</span>
              </div>
            ))}
            <p className="text-xs text-gray-500 mt-2">* Plus 4% cess. Allows deductions under 80C, 80D, HRA, etc. Rebate u/s 87A for income up to ₹5L</p>
          </div>
        </div>
      </div>
    </div>
  );
}