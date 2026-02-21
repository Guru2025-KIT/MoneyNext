'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { Calculator, TrendingDown, PieChart, Calendar, DollarSign, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';

interface EMIResult {
  emi: number;
  totalPayment: number;
  totalInterest: number;
  schedule: { month: number; principal: number; interest: number; balance: number }[];
}

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(10.5);
  const [tenure, setTenure] = useState(60); // months
  const [result, setResult] = useState<EMIResult | null>(null);
  const [mode, setMode] = useState<'calculate' | 'compare'>('calculate');

  // Comparison mode
  const [compareLoans, setCompareLoans] = useState([
    { name: 'Bank A', rate: 10.5, tenure: 60 },
    { name: 'Bank B', rate: 11.0, tenure: 60 },
    { name: 'Bank C', rate: 9.8, tenure: 60 },
  ]);

  const calculateEMI = (principal: number, rate: number, months: number): EMIResult => {
    const monthlyRate = rate / 12 / 100;
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    
    const schedule: { month: number; principal: number; interest: number; balance: number }[] = [];
    let balance = principal;

    for (let month = 1; month <= months; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = emi - interestPayment;
      balance -= principalPayment;

      schedule.push({
        month,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(balance, 0),
      });
    }

    return {
      emi,
      totalPayment: emi * months,
      totalInterest: (emi * months) - principal,
      schedule,
    };
  };

  const handleCalculate = () => {
    const res = calculateEMI(loanAmount, interestRate, tenure);
    setResult(res);
  };

  const compareResults = compareLoans.map(loan => {
    const res = calculateEMI(loanAmount, loan.rate, loan.tenure);
    return { ...loan, ...res };
  });

  const yearsFromMonths = Math.floor(tenure / 12);
  const remainingMonths = tenure % 12;

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Calculator className="w-6 h-6 text-green-600" />EMI Calculator & Loan Optimizer
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Calculate loan EMIs and compare offers to save thousands</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        {(['calculate', 'compare'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors capitalize ${mode === m ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {m === 'calculate' ? 'Calculate EMI' : 'Compare Loans'}
          </button>
        ))}
      </div>

      {mode === 'calculate' ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
            <h3 className="font-bold text-gray-900 mb-4">Loan Details</h3>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">Loan Amount</label>
                <span className="text-lg font-bold text-green-600">{formatCurrency(loanAmount)}</span>
              </div>
              <input type="range" min="50000" max="10000000" step="50000" value={loanAmount}
                onChange={e => setLoanAmount(Number(e.target.value))}
                className="w-full accent-green-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>₹50K</span>
                <span>₹1Cr</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">Interest Rate (Annual)</label>
                <span className="text-lg font-bold text-blue-600">{interestRate.toFixed(1)}%</span>
              </div>
              <input type="range" min="6" max="20" step="0.1" value={interestRate}
                onChange={e => setInterestRate(Number(e.target.value))}
                className="w-full accent-blue-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>6%</span>
                <span>20%</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">Loan Tenure</label>
                <span className="text-lg font-bold text-purple-600">{yearsFromMonths}y {remainingMonths}m</span>
              </div>
              <input type="range" min="6" max="360" step="6" value={tenure}
                onChange={e => setTenure(Number(e.target.value))}
                className="w-full accent-purple-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>6 months</span>
                <span>30 years</span>
              </div>
            </div>

            <button onClick={handleCalculate} className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 flex items-center justify-center gap-2">
              <Calculator className="w-5 h-5" />Calculate EMI
            </button>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            {result ? (
              <>
                {/* EMI Card */}
                <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 text-white shadow-lg">
                  <p className="text-sm opacity-90 mb-1">Monthly EMI</p>
                  <p className="text-4xl font-black mb-3">{formatCurrency(result.emi)}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="opacity-80">Total Payment</p>
                      <p className="font-bold text-lg">{formatCurrency(result.totalPayment)}</p>
                    </div>
                    <div>
                      <p className="opacity-80">Total Interest</p>
                      <p className="font-bold text-lg">{formatCurrency(result.totalInterest)}</p>
                    </div>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-blue-600" />Payment Breakdown
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-gray-600">Principal Amount</span>
                        <span className="font-bold text-gray-900">{formatCurrency(loanAmount)}</span>
                      </div>
                      <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(loanAmount / result.totalPayment) * 100}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-gray-600">Interest Amount</span>
                        <span className="font-bold text-gray-900">{formatCurrency(result.totalInterest)}</span>
                      </div>
                      <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: `${(result.totalInterest / result.totalPayment) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">Interest vs Principal</span>
                      <span className="font-bold text-red-600">{((result.totalInterest / loanAmount) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* Smart Tips */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="font-semibold text-amber-900 text-sm mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />💰 Money-Saving Tips
                  </p>
                  <ul className="text-xs text-amber-800 space-y-1">
                    <li>• Increasing tenure by {Math.min(12, tenure)} months reduces EMI by ₹{(result.emi - calculateEMI(loanAmount, interestRate, tenure + Math.min(12, tenure)).emi).toFixed(0)}/month</li>
                    <li>• Reducing interest by 0.5% saves you ₹{(calculateEMI(loanAmount, interestRate, tenure).totalInterest - calculateEMI(loanAmount, interestRate - 0.5, tenure).totalInterest).toFixed(0)} in interest</li>
                    <li>• Prepaying ₹50,000 annually can save ₹{(result.totalInterest * 0.15).toFixed(0)} in interest</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
                <Calculator className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Adjust loan parameters and click Calculate</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Compare Mode */
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="font-semibold text-blue-900 text-sm mb-1">🏦 Loan Comparison Tool</p>
            <p className="text-xs text-blue-700">Compare offers from different banks to find the best deal. Even 0.5% difference in interest rate can save you lakhs!</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Compare Loan Offers</h3>
            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-700 block mb-2">Loan Amount</label>
              <input type="number" value={loanAmount} onChange={e => setLoanAmount(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {compareResults.map((loan, i) => {
              const cheapest = Math.min(...compareResults.map(l => l.totalPayment));
              const isCheapest = loan.totalPayment === cheapest;
              const savings = loan.totalPayment - cheapest;

              return (
                <div key={i} className={`bg-white rounded-2xl border-2 p-5 shadow-sm ${isCheapest ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}>
                  {isCheapest && (
                    <div className="flex items-center gap-1 mb-2 text-green-700 font-bold text-xs">
                      <CheckCircle className="w-4 h-4" />BEST DEAL
                    </div>
                  )}
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{loan.name}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Interest Rate</span>
                      <span className="font-bold">{loan.rate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tenure</span>
                      <span className="font-bold">{Math.floor(loan.tenure / 12)}y {loan.tenure % 12}m</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-600">Monthly EMI</span>
                        <span className="font-black text-gray-900">{formatCurrency(loan.emi)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Payment</span>
                        <span className="font-bold text-blue-600">{formatCurrency(loan.totalPayment)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Interest</span>
                        <span className="font-bold text-red-600">{formatCurrency(loan.totalInterest)}</span>
                      </div>
                    </div>
                    {!isCheapest && savings > 0 && (
                      <div className="mt-2 pt-2 border-t border-red-100">
                        <p className="text-xs text-red-600 font-semibold">
                          ₹{savings.toFixed(0)} more than best option
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="font-semibold text-green-900 text-sm mb-1">💡 Winner: {compareResults.find(l => l.totalPayment === Math.min(...compareResults.map(r => r.totalPayment)))?.name}</p>
            <p className="text-xs text-green-800">
              Choosing the best offer saves you ₹{(Math.max(...compareResults.map(l => l.totalPayment)) - Math.min(...compareResults.map(l => l.totalPayment))).toFixed(0)} over the loan tenure!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}