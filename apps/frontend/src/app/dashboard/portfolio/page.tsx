'use client';

import { useState, useEffect } from 'react';
import { accountsApi } from '@/lib/api/accounts';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown, BarChart3, Target, AlertCircle, CheckCircle, ArrowRight, RefreshCw, Zap, DollarSign } from 'lucide-react';

interface Asset { id: string; name: string; type: string; currentValue: number; currentAlloc: number; targetAlloc: number; }

const ASSET_CLASSES = [
  { name: 'Equity (Stocks/MF)', color: '#7C3AED', risk: 'High', returns: '12-18%', recommended: 60 },
  { name: 'Debt (Bonds/FD/NPS)', color: '#0EA5E9', risk: 'Low', returns: '6-9%', recommended: 25 },
  { name: 'Gold / Real Estate', color: '#F59E0B', risk: 'Medium', returns: '8-12%', recommended: 10 },
  { name: 'Cash & Equivalents', color: '#10B981', risk: 'Very Low', returns: '3-5%', recommended: 5 },
];

export default function PortfolioRebalancer() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<Asset[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [targets, setTargets] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [rebalanceAmount, setRebalanceAmount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const acc = await accountsApi.getAll();
      setAccounts(acc);
      
      // Group by asset type
      const grouped: Record<string, number> = {
        'Equity (Stocks/MF)': 0,
        'Debt (Bonds/FD/NPS)': 0,
        'Gold / Real Estate': 0,
        'Cash & Equivalents': 0,
      };
      
      acc.forEach((a: any) => {
        const val = Number(a.balance);
        if (a.type === 'INVESTMENT') grouped['Equity (Stocks/MF)'] += val;
        else if (a.type === 'SAVINGS') grouped['Debt (Bonds/FD/NPS)'] += val;
        else if (a.type === 'CHECKING') grouped['Cash & Equivalents'] += val;
        else grouped['Gold / Real Estate'] += val * 0.1; // assume 10% in gold/RE
      });

      const total = Object.values(grouped).reduce((s, v) => s + v, 0);
      setTotalValue(total);

      const assets: Asset[] = Object.entries(grouped).map(([name, val], i) => ({
        id: `a${i}`,
        name,
        type: name,
        currentValue: val,
        currentAlloc: total > 0 ? (val / total) * 100 : 0,
        targetAlloc: ASSET_CLASSES[i].recommended,
      }));

      setPortfolio(assets);
      
      const tgt: Record<string, number> = {};
      assets.forEach(a => { tgt[a.name] = a.targetAlloc; });
      setTargets(tgt);
    } catch {}
    finally { setLoading(false); }
  };

  const updateTarget = (name: string, val: number) => {
    setTargets(prev => {
      const newTargets = { ...prev, [name]: val };
      // Ensure sum = 100
      const sum = Object.values(newTargets).reduce((s, v) => s + v, 0);
      if (Math.abs(sum - 100) < 0.1) return newTargets;
      return prev; // reject if sum != 100
    });
  };

  // Calculate rebalancing actions
  const actions: { asset: string; action: 'BUY' | 'SELL'; amount: number; newValue: number }[] = [];
  const updatedPortfolio = portfolio.map(asset => {
    const target = targets[asset.name] || asset.targetAlloc;
    const targetValue = (totalValue * target) / 100;
    const diff = targetValue - asset.currentValue;
    
    if (Math.abs(diff) > totalValue * 0.01) { // only if > 1% of portfolio
      actions.push({
        asset: asset.name,
        action: diff > 0 ? 'BUY' : 'SELL',
        amount: Math.abs(diff),
        newValue: targetValue,
      });
    }
    
    return { ...asset, targetAlloc: target, targetValue, diff };
  });

  const deviation = updatedPortfolio.reduce((s, a) => s + Math.abs(a.diff), 0);
  const isBalanced = deviation < totalValue * 0.02; // within 2%

  const maxDev = Math.max(...updatedPortfolio.map(a => Math.abs(a.currentAlloc - a.targetAlloc)));

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-200 border-t-violet-600"></div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="w-6 h-6 text-violet-600" />Portfolio Rebalancer
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Optimize your asset allocation for better risk-adjusted returns</p>
        </div>
        <button onClick={loadData} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm font-medium">
          <RefreshCw className="w-4 h-4" />Refresh
        </button>
      </div>

      {/* Health Score */}
      <div className={`rounded-2xl p-6 border-2 ${isBalanced ? 'bg-green-50 border-green-200' : maxDev > 15 ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'}`}>
        <div className="flex items-start gap-4">
          {isBalanced ? <CheckCircle className="w-6 h-6 text-green-600 shrink-0" /> : <AlertCircle className="w-6 h-6 text-orange-600 shrink-0" />}
          <div className="flex-1">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
              <h3 className="font-bold text-gray-900 text-lg">
                {isBalanced ? 'Portfolio Well Balanced' : maxDev > 15 ? 'Needs Rebalancing' : 'Minor Adjustments Needed'}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Max Deviation:</span>
                <span className={`text-xl font-black ${maxDev > 15 ? 'text-red-600' : maxDev > 5 ? 'text-orange-600' : 'text-green-600'}`}>
                  {maxDev.toFixed(1)}%
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {isBalanced 
                ? 'Your portfolio is well-aligned with target allocations. Review quarterly.'
                : `Total adjustments needed: ${formatCurrency(Math.abs(deviation))}. ${actions.length} asset class${actions.length > 1 ? 'es' : ''} to rebalance.`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Portfolio Value */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-violet-100 rounded-xl">
              <DollarSign className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Portfolio Value</p>
              <p className="text-2xl font-black text-gray-900">{formatCurrency(totalValue)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-blue-100 rounded-xl">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Asset Classes</p>
              <p className="text-2xl font-black text-gray-900">{portfolio.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-green-100 rounded-xl">
              <Zap className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Actions Needed</p>
              <p className="text-2xl font-black text-gray-900">{actions.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Current vs Target */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Allocation */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Current Allocation</h3>
          <div className="space-y-4">
            {updatedPortfolio.map((asset, i) => (
              <div key={asset.id}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-gray-700">{asset.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{formatCurrency(asset.currentValue)}</span>
                    <span className="font-bold text-gray-900 w-12 text-right">{asset.currentAlloc.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${asset.currentAlloc}%`, backgroundColor: ASSET_CLASSES[i].color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Target Allocation */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Target Allocation (Adjust)</h3>
          <div className="space-y-4">
            {updatedPortfolio.map((asset, i) => (
              <div key={asset.id}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700 text-sm">{asset.name}</span>
                  <div className="flex items-center gap-2">
                    <input type="number" min="0" max="100" step="1"
                      value={targets[asset.name] || asset.targetAlloc}
                      onChange={e => updateTarget(asset.name, Number(e.target.value))}
                      className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-sm font-bold text-center focus:ring-2 focus:ring-violet-400"
                      suppressHydrationWarning
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>
                <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${targets[asset.name] || asset.targetAlloc}%`, backgroundColor: ASSET_CLASSES[i].color }} />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{ASSET_CLASSES[i].risk} Risk</span>
                  <span>{ASSET_CLASSES[i].returns}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4 p-2 bg-gray-50 rounded-lg">
            Total must equal 100%. Adjust sliders to your risk tolerance.
          </p>
        </div>
      </div>

      {/* Rebalancing Actions */}
      {actions.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-violet-600" />
            Recommended Actions
          </h3>
          <div className="space-y-3">
            {actions.map((action, i) => (
              <div key={i} className={`flex items-center justify-between p-4 rounded-xl border-2 ${action.action === 'BUY' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${action.action === 'BUY' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {action.action === 'BUY' ? <TrendingUp className="w-5 h-5 text-white" /> : <TrendingDown className="w-5 h-5 text-white" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{action.action} {action.asset}</p>
                    <p className="text-xs text-gray-500">Move to target allocation of {(action.newValue / totalValue * 100).toFixed(1)}%</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-black ${action.action === 'BUY' ? 'text-green-700' : 'text-red-700'}`}>
                    {formatCurrency(action.amount)}
                  </p>
                  <p className="text-xs text-gray-500">{((action.amount / totalValue) * 100).toFixed(1)}% of portfolio</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-violet-50 border border-violet-100 rounded-xl">
            <p className="text-sm text-violet-900 font-semibold mb-1">💡 How to Execute</p>
            <ul className="text-xs text-violet-700 space-y-1">
              <li>• Sell overweight assets and buy underweight ones</li>
              <li>• Or redirect new investments to underweight asset classes</li>
              <li>• Rebalance annually or when deviation exceeds 5%</li>
            </ul>
          </div>
        </div>
      )}

      {/* Risk-Return Matrix */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Asset Class Characteristics</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {ASSET_CLASSES.map((ac, i) => (
            <div key={i} className="p-4 border-2 rounded-xl" style={{ borderColor: ac.color + '40', backgroundColor: ac.color + '08' }}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-gray-900 text-sm">{ac.name}</p>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ac.color }} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-gray-500">Risk Level</p>
                  <p className="font-semibold text-gray-900">{ac.risk}</p>
                </div>
                <div>
                  <p className="text-gray-500">Expected Returns</p>
                  <p className="font-semibold text-gray-900">{ac.returns}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}