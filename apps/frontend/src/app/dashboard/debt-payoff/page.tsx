'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { TrendingDown, Target, Zap, AlertCircle, CheckCircle, Flame, Snowflake } from 'lucide-react';

interface Debt {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minPayment: number;
}

export default function DebtPayoffPlanner() {
  const [debts, setDebts] = useState<Debt[]>([
    { id: '1', name: 'Credit Card', balance: 50000, interestRate: 18, minPayment: 2500 },
    { id: '2', name: 'Personal Loan', balance: 200000, interestRate: 12, minPayment: 8000 },
    { id: '3', name: 'Car Loan', balance: 150000, interestRate: 10, minPayment: 6000 },
  ]);
  const [extraPayment, setExtraPayment] = useState(5000);
  const [strategy, setStrategy] = useState<'avalanche' | 'snowball'>('avalanche');

  const calculatePayoff = (strat: 'avalanche' | 'snowball') => {
    const sorted = strat === 'avalanche' 
      ? [...debts].sort((a, b) => b.interestRate - a.interestRate)
      : [...debts].sort((a, b) => a.balance - b.balance);

    let month = 0;
    let remaining = sorted.map(d => ({ ...d, balance: d.balance }));
    let totalInterest = 0;

    while (remaining.some(d => d.balance > 0) && month < 360) {
      month++;
      let extra = extraPayment;
      
      remaining.forEach((debt, i) => {
        if (debt.balance <= 0) return;
        
        const monthlyRate = debt.interestRate / 100 / 12;
        const interest = debt.balance * monthlyRate;
        totalInterest += interest;
        
        let payment = debt.minPayment;
        if (i === 0 && extra > 0) {
          payment += extra;
          extra = 0;
        }
        
        debt.balance = Math.max(0, debt.balance + interest - payment);
      });
      
      remaining = remaining.filter(d => d.balance > 0);
    }

    return { months: month, totalInterest, sortedDebts: sorted };
  };

  const avalancheResult = calculatePayoff('avalanche');
  const snowballResult = calculatePayoff('snowball');
  const currentResult = strategy === 'avalanche' ? avalancheResult : snowballResult;

  const totalDebt = debts.reduce((s, d) => s + d.balance, 0);
  const totalMin = debts.reduce((s, d) => s + d.minPayment, 0);
  const savings = Math.abs(avalancheResult.totalInterest - snowballResult.totalInterest);

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingDown className="w-6 h-6 text-red-600" />Debt Payoff Planner
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Compare strategies and become debt-free faster</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <button onClick={() => setStrategy('avalanche')}
          className={`p-6 rounded-2xl text-left transition-all border-2 ${
            strategy === 'avalanche' 
              ? 'bg-gradient-to-br from-red-600 to-rose-700 text-white border-red-400' 
              : 'bg-white border-gray-200 hover:border-red-300'
          }`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${strategy === 'avalanche' ? 'bg-white/20' : 'bg-red-100'}`}>
                <Flame className={`w-5 h-5 ${strategy === 'avalanche' ? 'text-white' : 'text-red-600'}`} />
              </div>
              <span className="font-bold text-lg">Debt Avalanche</span>
            </div>
            {strategy === 'avalanche' && <CheckCircle className="w-6 h-6" />}
          </div>
          <p className={`text-sm mb-4 ${strategy === 'avalanche' ? 'text-white/90' : 'text-gray-600'}`}>
            Attack highest interest first. Math-optimized to save maximum money.
          </p>
          <div className={`grid grid-cols-2 gap-3 ${strategy === 'avalanche' ? 'text-white' : 'text-gray-900'}`}>
            <div>
              <p className="text-xs opacity-75">Payoff Time</p>
              <p className="text-xl font-black">{avalancheResult.months}mo</p>
            </div>
            <div>
              <p className="text-xs opacity-75">Total Interest</p>
              <p className="text-xl font-black">{formatCurrency(avalancheResult.totalInterest)}</p>
            </div>
          </div>
          {avalancheResult.totalInterest < snowballResult.totalInterest && (
            <div className={`mt-3 px-3 py-2 rounded-lg ${strategy === 'avalanche' ? 'bg-white/20' : 'bg-green-50'}`}>
              <p className={`text-xs font-bold ${strategy === 'avalanche' ? 'text-white' : 'text-green-700'}`}>
                Saves {formatCurrency(savings)} vs Snowball
              </p>
            </div>
          )}
        </button>

        <button onClick={() => setStrategy('snowball')}
          className={`p-6 rounded-2xl text-left transition-all border-2 ${
            strategy === 'snowball' 
              ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white border-blue-400' 
              : 'bg-white border-gray-200 hover:border-blue-300'
          }`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${strategy === 'snowball' ? 'bg-white/20' : 'bg-blue-100'}`}>
                <Snowflake className={`w-5 h-5 ${strategy === 'snowball' ? 'text-white' : 'text-blue-600'}`} />
              </div>
              <span className="font-bold text-lg">Debt Snowball</span>
            </div>
            {strategy === 'snowball' && <CheckCircle className="w-6 h-6" />}
          </div>
          <p className={`text-sm mb-4 ${strategy === 'snowball' ? 'text-white/90' : 'text-gray-600'}`}>
            Eliminate smallest balance first. Psychology-optimized for quick wins.
          </p>
          <div className={`grid grid-cols-2 gap-3 ${strategy === 'snowball' ? 'text-white' : 'text-gray-900'}`}>
            <div>
              <p className="text-xs opacity-75">Payoff Time</p>
              <p className="text-xl font-black">{snowballResult.months}mo</p>
            </div>
            <div>
              <p className="text-xs opacity-75">Total Interest</p>
              <p className="text-xl font-black">{formatCurrency(snowballResult.totalInterest)}</p>
            </div>
          </div>
          {snowballResult.totalInterest < avalancheResult.totalInterest && (
            <div className={`mt-3 px-3 py-2 rounded-lg ${strategy === 'snowball' ? 'bg-white/20' : 'bg-green-50'}`}>
              <p className={`text-xs font-bold ${strategy === 'snowball' ? 'text-white' : 'text-green-700'}`}>
                Saves {formatCurrency(savings)} vs Avalanche
              </p>
            </div>
          )}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Total Debt</p>
          <p className="text-2xl font-black text-red-600">{formatCurrency(totalDebt)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Debt-Free In</p>
          <p className="text-2xl font-black text-gray-900">{currentResult.months} months</p>
          <p className="text-xs text-gray-400 mt-1">{(currentResult.months / 12).toFixed(1)} years</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Interest Paid</p>
          <p className="text-2xl font-black text-orange-600">{formatCurrency(currentResult.totalInterest)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Monthly Payment</p>
          <p className="text-2xl font-black text-blue-600">{formatCurrency(totalMin + extraPayment)}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex justify-between mb-3">
          <label className="font-bold text-gray-900">Extra Monthly Payment</label>
          <span className="text-2xl font-black text-green-600">{formatCurrency(extraPayment)}</span>
        </div>
        <input type="range" min="0" max="20000" step="500" value={extraPayment}
          onChange={e => setExtraPayment(Number(e.target.value))}
          className="w-full accent-green-600" />
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>0</span>
          <span>20,000</span>
        </div>
        <div className="mt-4 p-3 bg-green-50 rounded-xl">
          <p className="text-sm text-green-800">
            <strong>Impact:</strong> Paying extra {extraPayment.toLocaleString()} gets you debt-free in <strong>{currentResult.months} months</strong>!
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900">
            {strategy === 'avalanche' ? 'Attack Order (Highest Rate First)' : 'Attack Order (Smallest Balance First)'}
          </h3>
          <span className="text-xs text-gray-500">Pay in this order</span>
        </div>
        <div className="space-y-3">
          {currentResult.sortedDebts.map((debt, i) => (
            <div key={debt.id} className={`p-4 rounded-xl border-2 ${
              i === 0 ? 'border-green-400 bg-green-50' : 
              i === 1 ? 'border-blue-300 bg-blue-50' : 
              'border-gray-200'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-white ${
                  i === 0 ? 'bg-green-500' : 
                  i === 1 ? 'bg-blue-500' : 
                  'bg-gray-400'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{debt.name}</h4>
                  <p className="text-xs text-gray-500">
                    {strategy === 'avalanche' 
                      ? `${debt.interestRate}% interest` 
                      : `${formatCurrency(debt.balance)} balance`
                    }
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-red-600">{formatCurrency(debt.balance)}</p>
                  <p className="text-xs text-gray-500">Min: {formatCurrency(debt.minPayment)}/mo</p>
                </div>
              </div>
              {i === 0 && (
                <div className="flex items-center gap-2 text-green-700 font-bold text-xs pt-2 border-t border-green-200">
                  <Target className="w-4 h-4" />
                  FOCUS HERE - Put all extra payments toward this debt first!
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />Tips for Success
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• <strong>Stop adding debt:</strong> Cut up credit cards or freeze them</li>
          <li>• <strong>Emergency fund:</strong> Save 10,000-20,000 to avoid new debt</li>
          <li>• <strong>Side income:</strong> Use our Side Hustle Tracker to earn extra</li>
          <li>• <strong>Negotiate rates:</strong> Call lenders - they often reduce rates</li>
          <li>• <strong>Automate payments:</strong> Never miss a due date</li>
        </ul>
      </div>
    </div>
  );
}