'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { TrendingDown, Calculator, Award, AlertCircle, CheckCircle, DollarSign } from 'lucide-react';

interface Investment {
  id: string;
  name: string;
  invested: number;
  current: number;
  gainLoss: number;
  percentage: number;
  type: 'gain' | 'loss';
}

export default function TaxHarvesting() {
  const [investments] = useState<Investment[]>([
    { id: '1', name: 'HDFC Top 100', invested: 100000, current: 145000, gainLoss: 45000, percentage: 45, type: 'gain' },
    { id: '2', name: 'ICICI Bluechip', invested: 80000, current: 95000, gainLoss: 15000, percentage: 18.75, type: 'gain' },
    { id: '3', name: 'Axis Midcap', invested: 50000, current: 42000, gainLoss: -8000, percentage: -16, type: 'loss' },
    { id: '4', name: 'SBI Small Cap', invested: 60000, current: 51000, gainLoss: -9000, percentage: -15, type: 'loss' },
  ]);

  const [selectedInvestments, setSelectedInvestments] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    if (selectedInvestments.includes(id)) {
      setSelectedInvestments(selectedInvestments.filter(i => i !== id));
    } else {
      setSelectedInvestments([...selectedInvestments, id]);
    }
  };

  const selected = investments.filter(i => selectedInvestments.includes(i.id));
  const totalGains = selected.filter(i => i.type === 'gain').reduce((sum, i) => sum + i.gainLoss, 0);
  const totalLosses = Math.abs(selected.filter(i => i.type === 'loss').reduce((sum, i) => sum + i.gainLoss, 0));
  const netGain = totalGains - totalLosses;
  const taxSaved = Math.min(totalLosses, totalGains) * 0.1; // 10% LTCG tax
  const taxOnNet = Math.max(0, netGain - 100000) * 0.1; // ₹1L exemption

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingDown className="w-6 h-6 text-indigo-600" />Tax Loss Harvesting
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Offset capital gains with losses to reduce tax liability</p>
      </div>

      {/* Strategy Explanation */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <h3 className="text-xl font-bold mb-3">💡 What is Tax Loss Harvesting?</h3>
        <p className="text-sm opacity-90 mb-4">
          Sell investments that are in loss to offset gains from profitable investments, reducing your tax bill. 
          After selling, you can reinvest in similar funds after 30 days to maintain portfolio allocation.
        </p>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white/10 rounded-xl p-3">
            <p className="font-bold mb-1">Step 1</p>
            <p className="opacity-90">Identify profitable investments with gains</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="font-bold mb-1">Step 2</p>
            <p className="opacity-90">Find loss-making investments to sell</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="font-bold mb-1">Step 3</p>
            <p className="opacity-90">Offset gains with losses, save tax</p>
          </div>
        </div>
      </div>

      {/* Tax Savings Summary */}
      {selectedInvestments.length > 0 && (
        <div className="bg-white rounded-2xl border-2 border-green-400 p-6 shadow-lg">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-green-600" />
            Tax Savings Summary
          </h3>
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <p className="text-xs text-gray-600 mb-1">Total Gains</p>
              <p className="text-xl font-black text-green-600">{formatCurrency(totalGains)}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-xl">
              <p className="text-xs text-gray-600 mb-1">Total Losses</p>
              <p className="text-xl font-black text-red-600">{formatCurrency(totalLosses)}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <p className="text-xs text-gray-600 mb-1">Net Gain</p>
              <p className="text-xl font-black text-blue-600">{formatCurrency(netGain)}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <p className="text-xs text-gray-600 mb-1">Tax Saved</p>
              <p className="text-xl font-black text-purple-600">{formatCurrency(taxSaved)}</p>
            </div>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-900 font-semibold">Tax Without Harvesting:</p>
                <p className="text-xs text-amber-700">10% on ₹{((totalGains - 100000) / 1000).toFixed(0)}k gains</p>
              </div>
              <p className="text-2xl font-black text-amber-900">{formatCurrency((totalGains - 100000) * 0.1)}</p>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-amber-200">
              <div>
                <p className="text-sm text-green-900 font-semibold">Tax After Harvesting:</p>
                <p className="text-xs text-green-700">10% on ₹{((netGain - 100000) / 1000).toFixed(0)}k net gains</p>
              </div>
              <p className="text-2xl font-black text-green-900">{formatCurrency(taxOnNet)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Investment List */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Your Investments</h3>
        <div className="space-y-3">
          {investments.map(inv => {
            const isSelected = selectedInvestments.includes(inv.id);
            return (
              <div
                key={inv.id}
                onClick={() => toggleSelection(inv.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-purple-400 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {isSelected && <CheckCircle className="w-5 h-5 text-purple-600" />}
                    <div>
                      <h4 className="font-bold text-gray-900">{inv.name}</h4>
                      <p className="text-xs text-gray-500">
                        Invested: {formatCurrency(inv.invested)} → Current: {formatCurrency(inv.current)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-black ${inv.type === 'gain' ? 'text-green-600' : 'text-red-600'}`}>
                      {inv.gainLoss > 0 ? '+' : ''}{formatCurrency(inv.gainLoss)}
                    </p>
                    <p className={`text-xs font-bold ${inv.type === 'gain' ? 'text-green-600' : 'text-red-600'}`}>
                      {inv.percentage > 0 ? '+' : ''}{inv.percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2 py-1 rounded-full font-bold ${
                    inv.type === 'gain' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {inv.type === 'gain' ? '📈 Profit' : '📉 Loss'}
                  </span>
                  {inv.type === 'loss' && (
                    <span className="text-purple-600 font-semibold">Can offset ₹{Math.abs(inv.gainLoss).toLocaleString()} in gains</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          How Tax Loss Harvesting Works
        </h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p><strong>Example:</strong></p>
          <p>• You have ₹45,000 gains from HDFC Top 100</p>
          <p>• You have ₹8,000 loss from Axis Midcap</p>
          <p>• Sell both → Net gain = ₹37,000 (₹45k - ₹8k)</p>
          <p>• Tax on ₹45,000 = ₹4,500 (10% LTCG)</p>
          <p>• Tax on ₹37,000 = ₹3,700 (10% LTCG)</p>
          <p className="font-bold text-green-700">• Tax Saved = ₹800!</p>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          ⚠️ Important Rules
        </h3>
        <ul className="space-y-2 text-sm text-amber-800">
          <li>• <strong>₹1 lakh exemption:</strong> First ₹1L of LTCG is tax-free every year</li>
          <li>• <strong>30-day wait:</strong> After selling, wait 30 days before buying same fund (wash sale rule)</li>
          <li>• <strong>Year-end timing:</strong> Best done in March (end of financial year)</li>
          <li>• <strong>Only realized losses:</strong> Must actually sell to book the loss</li>
          <li>• <strong>Consult CA:</strong> Tax laws change, always verify with professional</li>
        </ul>
      </div>

      {/* CTA */}
      {selectedInvestments.length === 0 && (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center">
          <DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-600 mb-2">Select investments above to see tax savings</p>
          <p className="text-sm text-gray-500">Click on gain and loss investments to simulate harvesting</p>
        </div>
      )}
    </div>
  );
}