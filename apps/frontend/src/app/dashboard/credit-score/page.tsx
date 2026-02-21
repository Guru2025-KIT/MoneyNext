'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown, CreditCard, AlertCircle, Award, Zap, CheckCircle } from 'lucide-react';

interface Action {
  id: string;
  name: string;
  impact: number;
  time: string;
  category: 'positive' | 'negative';
  description: string;
}

export default function CreditScoreSimulator() {
  const [currentScore, setCurrentScore] = useState(720);
  const [selectedActions, setSelectedActions] = useState<Action[]>([]);

  const actions: Action[] = [
    { id: '1', name: 'Pay off Credit Card Balance', impact: +45, time: '3 months', category: 'positive', description: 'Clear ₹50,000 credit card debt' },
    { id: '2', name: 'Get New Credit Card', impact: -15, time: '1 month', category: 'negative', description: 'Hard inquiry on credit report' },
    { id: '3', name: 'Close Old Credit Card', impact: -25, time: '6 months', category: 'negative', description: 'Reduces credit history length' },
    { id: '4', name: 'Increase Credit Limit', impact: +20, time: '2 months', category: 'positive', description: 'Request ₹1L limit increase' },
    { id: '5', name: 'Pay EMI on Time (6 months)', impact: +30, time: '6 months', category: 'positive', description: 'Perfect payment history' },
    { id: '6', name: 'Miss Payment', impact: -80, time: 'Immediate', category: 'negative', description: '30+ days late payment' },
    { id: '7', name: 'Settle Loan Early', impact: +15, time: '3 months', category: 'positive', description: 'Close personal loan ahead of time' },
    { id: '8', name: 'Max Out Credit Card', impact: -40, time: '1 month', category: 'negative', description: 'Use >90% of credit limit' },
  ];

  const toggleAction = (action: Action) => {
    if (selectedActions.find(a => a.id === action.id)) {
      setSelectedActions(selectedActions.filter(a => a.id !== action.id));
    } else {
      setSelectedActions([...selectedActions, action]);
    }
  };

  const projectedScore = currentScore + selectedActions.reduce((sum, a) => sum + a.impact, 0);
  const totalImpact = selectedActions.reduce((sum, a) => sum + a.impact, 0);

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 650) return 'text-blue-600';
    if (score >= 550) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 750) return 'Excellent';
    if (score >= 650) return 'Good';
    if (score >= 550) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-purple-600" />Credit Score Simulator
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">See how financial actions affect your CIBIL score</p>
      </div>

      {/* Score Display */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm opacity-90 mb-1">Current Score</p>
            <p className="text-5xl font-black mb-2">{currentScore}</p>
            <p className="text-sm opacity-80">{getScoreLabel(currentScore)}</p>
          </div>
          <div>
            <p className="text-sm opacity-90 mb-1">Projected Score</p>
            <div className="flex items-center gap-3">
              <p className={`text-5xl font-black ${totalImpact >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                {projectedScore}
              </p>
              {totalImpact !== 0 && (
                <div className="flex items-center gap-1">
                  {totalImpact > 0 ? <TrendingUp className="w-6 h-6 text-green-300" /> : <TrendingDown className="w-6 h-6 text-red-300" />}
                  <span className="text-2xl font-bold">{totalImpact > 0 ? '+' : ''}{totalImpact}</span>
                </div>
              )}
            </div>
            <p className="text-sm opacity-80">{getScoreLabel(projectedScore)}</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-white/10 rounded-xl">
          <p className="text-sm">
            💡 <strong>Tip:</strong> Select actions below to see real-time impact on your credit score
          </p>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Score Factors (How CIBIL is Calculated)</h3>
        <div className="space-y-3">
          {[
            { factor: 'Payment History', weight: '35%', tip: 'Never miss EMI/credit card payments' },
            { factor: 'Credit Utilization', weight: '30%', tip: 'Keep below 30% of credit limit' },
            { factor: 'Credit History Length', weight: '15%', tip: 'Don\'t close old credit cards' },
            { factor: 'Credit Mix', weight: '10%', tip: 'Mix of secured & unsecured loans' },
            { factor: 'New Credit', weight: '10%', tip: 'Avoid too many applications' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="font-semibold text-gray-900">{item.factor}</p>
                <p className="text-xs text-gray-600">{item.tip}</p>
              </div>
              <span className="text-lg font-black text-purple-600">{item.weight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Select Actions to Simulate</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {actions.map(action => {
            const isSelected = selectedActions.find(a => a.id === action.id);
            return (
              <div
                key={action.id}
                onClick={() => toggleAction(action)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? action.category === 'positive'
                      ? 'border-green-400 bg-green-50'
                      : 'border-red-400 bg-red-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {isSelected && <CheckCircle className="w-5 h-5 text-purple-600" />}
                    <h4 className="font-bold text-gray-900">{action.name}</h4>
                  </div>
                  <span className={`text-2xl font-black ${action.impact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {action.impact > 0 ? '+' : ''}{action.impact}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{action.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Impact time: {action.time}</span>
                  <span className={`px-2 py-1 rounded-full font-bold ${
                    action.category === 'positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {action.category === 'positive' ? '↑ Positive' : '↓ Negative'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Actions Summary */}
      {selectedActions.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <h3 className="font-bold text-lg mb-3">Your Action Plan</h3>
          <div className="space-y-2 mb-4">
            {selectedActions.map((action, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                <span className="text-sm">{action.name}</span>
                <span className={`font-bold ${action.impact > 0 ? 'text-green-300' : 'text-red-300'}`}>
                  {action.impact > 0 ? '+' : ''}{action.impact} pts
                </span>
              </div>
            ))}
          </div>
          <div className="p-4 bg-white/20 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total Impact:</span>
              <span className={`text-3xl font-black ${totalImpact > 0 ? 'text-green-300' : 'text-red-300'}`}>
                {totalImpact > 0 ? '+' : ''}{totalImpact} points
              </span>
            </div>
            <p className="text-xs mt-2 opacity-90">
              Expected timeframe: {Math.max(...selectedActions.map(a => parseInt(a.time)))} months
            </p>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
          <Zap className="w-5 h-5" />💡 Quick Score Improvement Tips
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• <strong>Pay on time:</strong> Single biggest factor (35% of score)</li>
          <li>• <strong>Keep utilization low:</strong> Use &lt;30% of credit limit</li>
          <li>• <strong>Don't close old cards:</strong> Hurts credit history length</li>
          <li>• <strong>Limit new applications:</strong> Each inquiry drops score temporarily</li>
          <li>• <strong>Check report annually:</strong> Dispute errors on CIBIL website</li>
        </ul>
      </div>

      {/* Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />⚠️ Disclaimer
        </h3>
        <p className="text-sm text-amber-800">
          This is a <strong>simulation tool</strong> for educational purposes. Actual credit score changes depend on many factors and vary by individual. Always check your actual CIBIL score and consult financial advisors for personalized guidance.
        </p>
      </div>
    </div>
  );
}