'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, Briefcase, Target, DollarSign, CheckCircle, Lightbulb, AlertTriangle } from 'lucide-react';

export default function SalaryNegotiationHelper() {
  const [currentSalary, setCurrentSalary] = useState(600000);
  const [yearsExp, setYearsExp] = useState(3);
  const [industry, setIndustry] = useState('IT');
  const [cityTier, setCityTier] = useState(1);

  // Market rates by industry (annual in lakhs)
  const marketRates: Record<string, { min: number; avg: number; max: number }> = {
    IT: { min: 400000, avg: 800000, max: 1500000 },
    Finance: { min: 500000, avg: 900000, max: 1800000 },
    Marketing: { min: 350000, avg: 600000, max: 1200000 },
    Sales: { min: 400000, avg: 750000, max: 1400000 },
    Healthcare: { min: 450000, avg: 800000, max: 1600000 },
    Engineering: { min: 500000, avg: 900000, max: 1800000 },
  };

  const expMultiplier = 1 + (yearsExp * 0.1);
  const cityMultiplier = cityTier === 1 ? 1.2 : cityTier === 2 ? 1.0 : 0.85;
  
  const market = marketRates[industry];
  const expectedSalary = market.avg * expMultiplier * cityMultiplier;
  const minAsk = expectedSalary * 1.15; // Ask 15% above market
  const maxAsk = expectedSalary * 1.25; // Stretch goal
  
  const increase = minAsk - currentSalary;
  const increasePercent = (increase / currentSalary) * 100;

  const yourPosition = currentSalary < market.min * expMultiplier * cityMultiplier ? 'underpaid' :
                       currentSalary > market.max * expMultiplier * cityMultiplier ? 'above-market' : 'fair';

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-green-600" />Salary Negotiation Helper
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Get data-backed salary ranges to confidently negotiate your worth</p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
        <h3 className="font-bold text-gray-900">Your Profile</h3>
        
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Current Annual Salary</label>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-green-600">{formatCurrency(currentSalary)}</span>
          </div>
          <input type="range" min="200000" max="3000000" step="50000" value={currentSalary}
            onChange={e => setCurrentSalary(Number(e.target.value))}
            className="w-full mt-2 accent-green-600" />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Years of Experience</label>
            <input type="number" value={yearsExp} onChange={e => setYearsExp(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Industry</label>
            <select value={industry} onChange={e => setIndustry(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white">
              {Object.keys(marketRates).map(ind => <option key={ind} value={ind}>{ind}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">City Tier</label>
            <select value={cityTier} onChange={e => setCityTier(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white">
              <option value={1}>Tier 1 (Mumbai, Delhi, Bangalore)</option>
              <option value={2}>Tier 2 (Pune, Hyderabad, Chennai)</option>
              <option value={3}>Tier 3 (Other cities)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Analysis */}
      <div className={`rounded-2xl border-2 p-6 shadow-lg ${
        yourPosition === 'underpaid' ? 'bg-red-50 border-red-300' :
        yourPosition === 'above-market' ? 'bg-green-50 border-green-300' :
        'bg-blue-50 border-blue-300'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className={`w-6 h-6 ${
            yourPosition === 'underpaid' ? 'text-red-600' :
            yourPosition === 'above-market' ? 'text-green-600' :
            'text-blue-600'
          }`} />
          <div>
            <h3 className={`font-bold text-lg ${
              yourPosition === 'underpaid' ? 'text-red-900' :
              yourPosition === 'above-market' ? 'text-green-900' :
              'text-blue-900'
            }`}>
              {yourPosition === 'underpaid' ? '⚠️ You are Underpaid' :
               yourPosition === 'above-market' ? '✅ You are Above Market Rate' :
               '✓ You are Fairly Paid'}
            </h3>
            <p className={`text-sm mt-1 ${
              yourPosition === 'underpaid' ? 'text-red-800' :
              yourPosition === 'above-market' ? 'text-green-800' :
              'text-blue-800'
            }`}>
              {yourPosition === 'underpaid' 
                ? `Market average for your profile is ${formatCurrency(expectedSalary)}. You deserve better!`
                : yourPosition === 'above-market'
                ? 'Your salary exceeds market average. Great negotiation!'
                : 'Your salary aligns with market standards.'}
            </p>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-sm opacity-90 mb-1">Ask For (Minimum)</p>
          <p className="text-3xl font-black mb-2">{formatCurrency(minAsk)}</p>
          <p className="text-xs opacity-80">15% above market rate</p>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-sm opacity-90 mb-1">Market Rate</p>
          <p className="text-3xl font-black mb-2">{formatCurrency(expectedSalary)}</p>
          <p className="text-xs opacity-80">Based on your profile</p>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-sm opacity-90 mb-1">Stretch Goal</p>
          <p className="text-3xl font-black mb-2">{formatCurrency(maxAsk)}</p>
          <p className="text-xs opacity-80">25% above market</p>
        </div>
      </div>

      {/* Increase Breakdown */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Potential Increase</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Annual Increase</p>
            <p className="text-2xl font-black text-green-600">{formatCurrency(increase)}</p>
            <p className="text-xs text-gray-500 mt-1">{increasePercent.toFixed(1)}% raise</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Monthly Increase</p>
            <p className="text-2xl font-black text-blue-600">{formatCurrency(increase / 12)}</p>
            <p className="text-xs text-gray-500 mt-1">Extra per month</p>
          </div>
        </div>
      </div>

      {/* Negotiation Script */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />Your Negotiation Script
        </h3>
        <div className="space-y-3 text-sm">
          <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
            <p className="font-semibold mb-2">Opening:</p>
            <p className="italic">"Based on my {yearsExp} years of experience in {industry} and the market rates in this region, I believe a salary of {formatCurrency(minAsk)} would be appropriate."</p>
          </div>
          <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
            <p className="font-semibold mb-2">Justification:</p>
            <p className="italic">"Industry data shows that professionals with my experience typically earn between {formatCurrency(market.min * expMultiplier * cityMultiplier)} and {formatCurrency(market.max * expMultiplier * cityMultiplier)}. Given my track record, I'm targeting the higher end."</p>
          </div>
          <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
            <p className="font-semibold mb-2">If They Counter:</p>
            <p className="italic">"I'm flexible on the exact number, but I'd like to stay competitive with market rates. Could we meet somewhere between {formatCurrency(expectedSalary)} and {formatCurrency(minAsk)}?"</p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
          <Target className="w-5 h-5" />💼 Negotiation Tips
        </h3>
        <ul className="space-y-2 text-sm text-amber-800">
          <li><CheckCircle className="w-4 h-4 inline mr-2" /><strong>Research first:</strong> Use Glassdoor, AmbitionBox, Payscale for validation</li>
          <li><CheckCircle className="w-4 h-4 inline mr-2" /><strong>Time it right:</strong> Annual reviews or after major achievements</li>
          <li><CheckCircle className="w-4 h-4 inline mr-2" /><strong>Have alternatives:</strong> Competing offers strengthen your position</li>
          <li><CheckCircle className="w-4 h-4 inline mr-2" /><strong>Be confident:</strong> State your number clearly without apologizing</li>
          <li><CheckCircle className="w-4 h-4 inline mr-2" /><strong>Document everything:</strong> Keep records of achievements and contributions</li>
        </ul>
      </div>
    </div>
  );
}