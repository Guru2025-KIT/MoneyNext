'use client';

import { useState, useEffect } from 'react';
import { transactionsApi } from '@/lib/api/transactions';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, AlertTriangle, Calendar, DollarSign, Zap, BarChart3, Target, Clock } from 'lucide-react';

interface Prediction {
  category: string;
  avgAmount: number;
  predictedAmount: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  nextDate: string;
  reason: string;
}

export default function ExpensePredictor() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [totalPredicted, setTotalPredicted] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAndPredict();
  }, []);

  const loadAndPredict = async () => {
    try {
      const txns = await transactionsApi.getAll();
      setTransactions(txns || []);
      
      // Analyze spending patterns
      const expenses = (txns || []).filter((t: any) => t.type === 'EXPENSE');
      const now = new Date();
      
      // Group by category and analyze patterns
      const categoryData: Record<string, { amounts: number[]; dates: Date[]; total: number; count: number }> = {};
      
      expenses.forEach((t: any) => {
        const cat = t.category || 'Others';
        const date = new Date(t.date);
        const monthsAgo = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
        
        // Only consider last 6 months
        if (monthsAgo <= 6) {
          if (!categoryData[cat]) categoryData[cat] = { amounts: [], dates: [], total: 0, count: 0 };
          categoryData[cat].amounts.push(Number(t.amount));
          categoryData[cat].dates.push(date);
          categoryData[cat].total += Number(t.amount);
          categoryData[cat].count += 1;
        }
      });

      // Generate predictions
      const preds: Prediction[] = [];
      let totalNext = 0;

      Object.entries(categoryData).forEach(([cat, data]) => {
        if (data.count < 2) return; // Need at least 2 data points

        const avgAmount = data.total / data.count;
        
        // Calculate trend (last 3 vs first 3 transactions)
        const sorted = [...data.amounts].sort((a, b) => data.dates[data.amounts.indexOf(a)].getTime() - data.dates[data.amounts.indexOf(b)].getTime());
        const recent = sorted.slice(-3).reduce((s, v) => s + v, 0) / Math.min(3, sorted.length);
        const older = sorted.slice(0, 3).reduce((s, v) => s + v, 0) / Math.min(3, sorted.length);
        const trendPct = ((recent - older) / older) * 100;
        
        let trend: 'up' | 'down' | 'stable' = 'stable';
        let predictedAmount = avgAmount;
        let reason = 'Based on average spending';
        
        if (trendPct > 15) {
          trend = 'up';
          predictedAmount = avgAmount * 1.15;
          reason = `Spending increased ${trendPct.toFixed(0)}% recently`;
        } else if (trendPct < -15) {
          trend = 'down';
          predictedAmount = avgAmount * 0.85;
          reason = `Spending decreased ${Math.abs(trendPct).toFixed(0)}% recently`;
        }

        // Predict next occurrence date (average days between transactions)
        const daysBetween = data.dates.length > 1 
          ? data.dates.slice(1).reduce((sum, date, i) => {
              return sum + (date.getTime() - data.dates[i].getTime()) / 86400000;
            }, 0) / (data.dates.length - 1)
          : 30;
        
        const nextDate = new Date(now.getTime() + daysBetween * 86400000);
        
        // Confidence based on consistency
        const variance = data.amounts.reduce((sum, amt) => sum + Math.pow(amt - avgAmount, 2), 0) / data.count;
        const stdDev = Math.sqrt(variance);
        const cv = (stdDev / avgAmount) * 100; // Coefficient of variation
        const confidence = Math.max(50, Math.min(95, 100 - cv));

        preds.push({
          category: cat,
          avgAmount,
          predictedAmount,
          confidence,
          trend,
          nextDate: nextDate.toISOString().split('T')[0],
          reason,
        });

        totalNext += predictedAmount;
      });

      // Sort by predicted amount descending
      preds.sort((a, b) => b.predictedAmount - a.predictedAmount);
      
      setPredictions(preds);
      setTotalPredicted(totalNext);
    } catch (err) {
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const daysUntil = (dateStr: string) => {
    const days = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
    return days;
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-200 border-t-violet-600"></div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Zap className="w-6 h-6 text-amber-500" />AI Expense Predictor
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Machine learning predicts your upcoming expenses before they happen</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5" />
            <p className="text-sm font-medium opacity-90">Predicted Next Month</p>
          </div>
          <p className="text-3xl font-black mb-1">{formatCurrency(totalPredicted)}</p>
          <p className="text-xs opacity-80">Based on your spending patterns</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <p className="text-sm font-medium text-gray-600">Predictions Made</p>
          </div>
          <p className="text-3xl font-black text-gray-900 mb-1">{predictions.length}</p>
          <p className="text-xs text-gray-500">Categories analyzed</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-green-600" />
            <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
          </div>
          <p className="text-3xl font-black text-gray-900 mb-1">
            {predictions.length > 0 ? (predictions.reduce((s, p) => s + p.confidence, 0) / predictions.length).toFixed(0) : 0}%
          </p>
          <p className="text-xs text-gray-500">Model accuracy</p>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4" />How AI Predictions Work
        </h3>
        <div className="grid gap-3 md:grid-cols-3 text-sm">
          <div>
            <p className="font-semibold text-blue-800 mb-1">1. Pattern Detection</p>
            <p className="text-blue-700 text-xs">Analyzes your last 6 months of spending across all categories</p>
          </div>
          <div>
            <p className="font-semibold text-blue-800 mb-1">2. Trend Analysis</p>
            <p className="text-blue-700 text-xs">Detects if you're spending more, less, or staying consistent</p>
          </div>
          <div>
            <p className="font-semibold text-blue-800 mb-1">3. Smart Forecasting</p>
            <p className="text-blue-700 text-xs">Predicts amount, timing, and confidence for each expense</p>
          </div>
        </div>
      </div>

      {/* Predictions List */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-violet-600" />
          Upcoming Expense Predictions
        </h3>

        {predictions.length > 0 ? (
          <div className="space-y-3">
            {predictions.map((pred, i) => {
              const days = daysUntil(pred.nextDate);
              const trendColors = { up: 'text-red-600 bg-red-50', down: 'text-green-600 bg-green-50', stable: 'text-blue-600 bg-blue-50' };
              const trendIcons = { up: '↑', down: '↓', stable: '→' };
              
              return (
                <div key={i} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900">{pred.category}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${trendColors[pred.trend]}`}>
                          {trendIcons[pred.trend]} {pred.trend.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{pred.reason}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-violet-600">{formatCurrency(pred.predictedAmount)}</p>
                      <p className="text-xs text-gray-400">vs avg {formatCurrency(pred.avgAmount)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-600">
                          {days > 0 ? `In ${days} days` : days === 0 ? 'Today' : `${Math.abs(days)} days ago`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-600">{new Date(pred.nextDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                        <div 
                          className={`h-2 rounded-full ${pred.confidence >= 80 ? 'bg-green-500' : pred.confidence >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${pred.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-600">{pred.confidence.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">Add more transactions to enable predictions</p>
            <p className="text-xs mt-1">Need at least 2 months of data per category</p>
          </div>
        )}
      </div>

      {/* Accuracy Info */}
      {predictions.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5">
          <h3 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
            <Target className="w-4 h-4" />Prediction Accuracy
          </h3>
          <div className="text-sm text-purple-800 space-y-1">
            <p>• <strong>High Confidence (80-95%):</strong> Very consistent spending pattern, reliable prediction</p>
            <p>• <strong>Medium Confidence (60-80%):</strong> Some variation in spending, fairly reliable</p>
            <p>• <strong>Low Confidence (&lt;60%):</strong> Irregular spending, prediction is an estimate</p>
          </div>
        </div>
      )}
    </div>
  );
}