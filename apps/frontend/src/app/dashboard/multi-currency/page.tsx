'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { Globe, TrendingUp, TrendingDown, DollarSign, AlertCircle, Award, RefreshCw } from 'lucide-react';

interface ForeignAsset {
  id: string;
  name: string;
  currency: string;
  amount: number;
  type: 'property' | 'stock' | 'bank' | 'crypto';
  country: string;
}

interface ExchangeRate {
  currency: string;
  rate: number;
  change: number;
}

export default function MultiCurrencyTracker() {
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      // Simulate rate changes
      setExchangeRates(prev => prev.map(rate => ({
        ...rate,
        rate: rate.rate * (1 + (Math.random() - 0.5) * 0.02), // ±1% change
        change: (Math.random() - 0.5) * 2 // Random change
      })));
      setLastRefresh(new Date());
      setRefreshing(false);
    }, 1000);
  };

  const [assets] = useState<ForeignAsset[]>([
    { id: '1', name: 'US Stocks Portfolio', currency: 'USD', amount: 50000, type: 'stock', country: 'USA' },
    { id: '2', name: 'Dubai Apartment', currency: 'AED', amount: 500000, type: 'property', country: 'UAE' },
    { id: '3', name: 'Singapore Bank Account', currency: 'SGD', amount: 30000, type: 'bank', country: 'Singapore' },
    { id: '4', name: 'Bitcoin Holdings', currency: 'BTC', amount: 0.5, type: 'crypto', country: 'Global' },
    { id: '5', name: 'UK Property Investment', currency: 'GBP', amount: 100000, type: 'property', country: 'UK' },
  ]);

  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([
    { currency: 'USD', rate: 83.25, change: 0.5 },
    { currency: 'AED', rate: 22.67, change: 0.2 },
    { currency: 'SGD', rate: 62.15, change: -0.3 },
    { currency: 'GBP', rate: 105.50, change: 0.8 },
    { currency: 'EUR', rate: 90.25, change: -0.5 },
    { currency: 'BTC', rate: 3500000, change: 2.5 },
  ]);

  const getAssetValueInINR = (asset: ForeignAsset) => {
    const rate = exchangeRates.find(r => r.currency === asset.currency)?.rate || 1;
    return asset.amount * rate;
  };

  const totalINR = assets.reduce((sum, asset) => sum + getAssetValueInINR(asset), 0);

  const assetsByCurrency = assets.reduce((acc, asset) => {
    if (!acc[asset.currency]) {
      acc[asset.currency] = { total: 0, count: 0 };
    }
    acc[asset.currency].total += getAssetValueInINR(asset);
    acc[asset.currency].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const getCurrencyFlag = (currency: string) => {
    const flags: Record<string, string> = {
      USD: '🇺🇸', AED: '🇦🇪', SGD: '🇸🇬', GBP: '🇬🇧', EUR: '🇪🇺', BTC: '₿'
    };
    return flags[currency] || '🌍';
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'property': return 'blue';
      case 'stock': return 'green';
      case 'bank': return 'purple';
      case 'crypto': return 'orange';
      default: return 'gray';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Globe className="w-6 h-6 text-blue-600" />Multi-Currency Asset Tracker
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Track international investments and foreign holdings in INR</p>
      </div>

      {/* Total Portfolio */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm opacity-90 mb-1">Total Portfolio (INR)</p>
            <p className="text-4xl font-black mb-2">{formatCurrency(totalINR)}</p>
            <p className="text-sm opacity-80">Across {assets.length} assets</p>
          </div>
          <div>
            <p className="text-sm opacity-90 mb-1">Currencies</p>
            <p className="text-4xl font-black mb-2">{Object.keys(assetsByCurrency).length}</p>
            <p className="text-sm opacity-80">Different currencies</p>
          </div>
          <div>
            <p className="text-sm opacity-90 mb-1">Countries</p>
            <p className="text-4xl font-black mb-2">{new Set(assets.map(a => a.country)).size}</p>
            <p className="text-sm opacity-80">Global presence</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-white/10 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">Updated {Math.floor((new Date().getTime() - lastRefresh.getTime()) / 60000)} mins ago</span>
          </div>
          <button 
                onClick={handleRefresh}
                disabled={refreshing}
                className="text-sm font-bold underline hover:no-underline disabled:opacity-50">
                {refreshing ? 'Refreshing...' : 'Refresh Rates'}
              </button>
        </div>
      </div>

      {/* Exchange Rates */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Live Exchange Rates (vs INR)</h3>
        <div className="grid md:grid-cols-3 gap-3">
          {exchangeRates.map(rate => (
            <div key={rate.currency} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getCurrencyFlag(rate.currency)}</span>
                  <span className="font-bold text-gray-900">{rate.currency}</span>
                </div>
                <div className="flex items-center gap-1">
                  {rate.change >= 0 ? <TrendingUp className="w-4 h-4 text-green-600" /> : <TrendingDown className="w-4 h-4 text-red-600" />}
                  <span className={`text-xs font-bold ${rate.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {rate.change >= 0 ? '+' : ''}{rate.change}%
                  </span>
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900">₹{rate.rate.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">1 {rate.currency} = ₹{rate.rate}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Assets by Currency */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Portfolio Distribution by Currency</h3>
        <div className="space-y-3">
          {Object.entries(assetsByCurrency).map(([currency, data]) => {
            const percentage = (data.total / totalINR) * 100;
            return (
              <div key={currency} className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getCurrencyFlag(currency)}</span>
                    <div>
                      <p className="font-bold text-gray-900">{currency}</p>
                      <p className="text-xs text-gray-600">{data.count} assets</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-blue-600">{formatCurrency(data.total)}</p>
                    <p className="text-xs text-gray-600">{percentage.toFixed(1)}% of portfolio</p>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-700"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assets List */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Your Foreign Assets</h3>
        <div className="space-y-3">
          {assets.map(asset => {
            const inrValue = getAssetValueInINR(asset);
            const rate = exchangeRates.find(r => r.currency === asset.currency);
            const color = getTypeColor(asset.type);
            
            return (
              <div key={asset.id} className={`p-5 rounded-xl border-2 border-${color}-200 bg-${color}-50`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{getCurrencyFlag(asset.currency)}</span>
                      <h4 className="font-bold text-gray-900">{asset.name}</h4>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span className="capitalize">{asset.type}</span>
                      <span>•</span>
                      <span>{asset.country}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold bg-${color}-200 text-${color}-800`}>
                    {asset.currency}
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Original Value</p>
                    <p className="text-lg font-black text-gray-900">
                      {asset.currency === 'BTC' ? `${asset.amount} BTC` : `${asset.currency} ${asset.amount.toLocaleString()}`}
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Exchange Rate</p>
                    <p className="text-lg font-black text-gray-900">₹{rate?.rate.toLocaleString()}</p>
                    {rate && (
                      <p className={`text-xs font-bold ${rate.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {rate.change >= 0 ? '+' : ''}{rate.change}%
                      </p>
                    )}
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Value in INR</p>
                    <p className="text-lg font-black text-blue-600">{formatCurrency(inrValue)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Currency Risk */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          ⚠️ Currency Risk Management
        </h3>
        <ul className="space-y-2 text-sm text-amber-800">
          <li>• <strong>Diversification:</strong> Don't hold &gt;40% in any single currency</li>
          <li>• <strong>Hedging:</strong> Consider currency futures if exposure &gt;₹50L</li>
          <li>• <strong>Rebalancing:</strong> Review quarterly, adjust for major forex moves</li>
          <li>• <strong>Tax implications:</strong> LTCG on foreign stocks taxed at 20% with indexation</li>
          <li>• <strong>FEMA compliance:</strong> Report foreign assets in ITR if total &gt;$250k</li>
        </ul>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="font-bold text-blue-900 mb-3">🌍 International Investment Tips</h3>
        <div className="grid md:grid-cols-2 gap-3 text-sm text-blue-800">
          <div>
            <p className="font-semibold mb-1">✓ Advantages:</p>
            <ul className="space-y-1 text-xs">
              <li>• Geographic diversification</li>
              <li>• Access to stronger currencies</li>
              <li>• Global company exposure</li>
              <li>• Hedge against INR depreciation</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-1">⚠️ Risks:</p>
            <ul className="space-y-1 text-xs">
              <li>• Currency fluctuation risk</li>
              <li>• Complex tax reporting (ITR)</li>
              <li>• Higher transaction costs</li>
              <li>• FEMA/RBI compliance needed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}