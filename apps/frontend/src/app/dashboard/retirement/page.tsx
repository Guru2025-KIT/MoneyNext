'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, Target, Calendar, DollarSign, AlertCircle, Award, PiggyBank } from 'lucide-react';

export default function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [monthlyExpense, setMonthlyExpense] = useState(50000);
  const [currentSavings, setCurrentSavings] = useState(500000);
  const [monthlySIP, setMonthlySIP] = useState(10000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [inflation, setInflation] = useState(6);

  const yearsToRetirement = retirementAge - currentAge;
  const yearsInRetirement = 85 - retirementAge; // Assume living till 85

  // Calculate future value of current savings
  const futureValueCurrentSavings = currentSavings * Math.pow(1 + expectedReturn / 100, yearsToRetirement);

  // Calculate future value of monthly SIP
  const monthlyRate = expectedReturn / 100 / 12;
  const months = yearsToRetirement * 12;
  const futureValueSIP = monthlySIP * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);

  const totalCorpus = futureValueCurrentSavings + futureValueSIP;

  // Calculate required corpus
  const futureMonthlyExpense = monthlyExpense * Math.pow(1 + inflation / 100, yearsToRetirement);
  const realReturnRate = ((1 + expectedReturn / 100) / (1 + inflation / 100)) - 1;
  const requiredCorpus = (futureMonthlyExpense * 12 * yearsInRetirement) / realReturnRate;

  const shortfall = requiredCorpus - totalCorpus;
  const isOnTrack = totalCorpus >= requiredCorpus;

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <PiggyBank className="w-6 h-6 text-green-600" />Retirement Planner
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Calculate if you're on track for a comfortable retirement</p>
      </div>

      {/* Result Card */}
      <div className={`rounded-2xl p-6 text-white shadow-lg ${
        isOnTrack 
          ? 'bg-gradient-to-r from-green-600 to-emerald-700' 
          : 'bg-gradient-to-r from-red-600 to-orange-600'
      }`}>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm opacity-90 mb-1">Projected Retirement Corpus</p>
            <p className="text-4xl font-black mb-2">{formatCurrency(totalCorpus)}</p>
            <p className="text-sm opacity-80">At age {retirementAge}</p>
          </div>
          <div>
            <p className="text-sm opacity-90 mb-1">Required Corpus</p>
            <p className="text-4xl font-black mb-2">{formatCurrency(requiredCorpus)}</p>
            <p className="text-sm opacity-80">To maintain lifestyle till 85</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-white/10 rounded-xl">
          {isOnTrack ? (
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6" />
              <div>
                <p className="font-bold">✓ You're on track!</p>
                <p className="text-sm opacity-90">Surplus: {formatCurrency(Math.abs(shortfall))}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              <div>
                <p className="font-bold">⚠️ Need to save more</p>
                <p className="text-sm opacity-90">Shortfall: {formatCurrency(Math.abs(shortfall))}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Form */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Personal Details
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 block mb-2">Current Age</label>
              <input
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-2">Retirement Age</label>
              <input
                type="number"
                value={retirementAge}
                onChange={(e) => setRetirementAge(Number(e.target.value))}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">{yearsToRetirement} years to retirement</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-2">Current Monthly Expense</label>
              <input
                type="number"
                value={monthlyExpense}
                onChange={(e) => setMonthlyExpense(Number(e.target.value))}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                At retirement: {formatCurrency(futureMonthlyExpense)}/month
              </p>
            </div>
          </div>
        </div>

        {/* Financial Details */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Financial Details
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 block mb-2">Current Savings</label>
              <input
                type="number"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(Number(e.target.value))}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-2">Monthly SIP</label>
              <input
                type="number"
                value={monthlySIP}
                onChange={(e) => setMonthlySIP(Number(e.target.value))}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Total investment: {formatCurrency(monthlySIP * months)}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-2">Expected Return (%)</label>
              <input
                type="number"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Typical equity: 12%, debt: 7%</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-2">Inflation (%)</label>
              <input
                type="number"
                value={inflation}
                onChange={(e) => setInflation(Number(e.target.value))}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Retirement Corpus Breakdown</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
            <span className="text-gray-700">Current Savings Growth</span>
            <span className="text-xl font-bold text-blue-600">{formatCurrency(futureValueCurrentSavings)}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
            <span className="text-gray-700">Monthly SIP Growth</span>
            <span className="text-xl font-bold text-green-600">{formatCurrency(futureValueSIP)}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border-2 border-purple-300">
            <span className="font-bold text-gray-900">Total Corpus</span>
            <span className="text-2xl font-black text-purple-600">{formatCurrency(totalCorpus)}</span>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {!isOnTrack && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="font-bold text-amber-900 mb-3">💡 How to Close the Gap</h3>
          <div className="space-y-2 text-sm text-amber-800">
            <p>• <strong>Increase monthly SIP to:</strong> {formatCurrency(monthlySIP + Math.ceil(shortfall / (months * 1.5)))} (+{formatCurrency(Math.ceil(shortfall / (months * 1.5)))})</p>
            <p>• <strong>OR delay retirement to:</strong> {retirementAge + Math.ceil(shortfall / (monthlySIP * 12 * 2))} years</p>
            <p>• <strong>OR reduce retirement expenses by:</strong> {((shortfall / requiredCorpus) * 100).toFixed(0)}%</p>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="font-bold text-blue-900 mb-3">📊 Retirement Planning Tips</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• <strong>Start early:</strong> 25-year-old needs ₹5k/month vs 35-year-old needs ₹15k/month for same corpus</li>
          <li>• <strong>Equity allocation:</strong> (100 - your age)% in equity, rest in debt</li>
          <li>• <strong>Review annually:</strong> Adjust for salary hikes, lifestyle changes</li>
          <li>• <strong>Multiple sources:</strong> EPF + NPS + Mutual Funds + PPF</li>
          <li>• <strong>Health insurance:</strong> Critical for retirement, buy before 50</li>
        </ul>
      </div>
    </div>
  );
}