'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { FileText, Users, Building, Shield, AlertCircle, CheckCircle, Award, TrendingUp } from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  type: 'property' | 'investment' | 'business' | 'insurance' | 'bank';
  value: number;
  nominees: string[];
}

interface Nominee {
  id: string;
  name: string;
  relation: string;
  percentage: number;
}

export default function EstatePlanning() {
  const [assets] = useState<Asset[]>([
    { id: '1', name: 'Mumbai Apartment', type: 'property', value: 25000000, nominees: ['spouse', 'child1'] },
    { id: '2', name: 'Equity Portfolio', type: 'investment', value: 15000000, nominees: ['spouse'] },
    { id: '3', name: 'Business Stake', type: 'business', value: 30000000, nominees: ['child1', 'child2'] },
    { id: '4', name: 'Term Insurance', type: 'insurance', value: 50000000, nominees: ['spouse'] },
    { id: '5', name: 'Bank Accounts', type: 'bank', value: 5000000, nominees: ['spouse'] },
  ]);

  const [nominees] = useState<Nominee[]>([
    { id: 'spouse', name: 'Spouse', relation: 'Wife/Husband', percentage: 50 },
    { id: 'child1', name: 'Child 1', relation: 'Son/Daughter', percentage: 25 },
    { id: 'child2', name: 'Child 2', relation: 'Son/Daughter', percentage: 25 },
  ]);

  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  const totalEstate = assets.reduce((sum, a) => sum + a.value, 0);
  const assetsWithNominees = assets.filter(a => a.nominees.length > 0).length;
  const completionPercentage = (assetsWithNominees / assets.length) * 100;

  const assetsByType = assets.reduce((acc, asset) => {
    acc[asset.type] = (acc[asset.type] || 0) + asset.value;
    return acc;
  }, {} as Record<string, number>);

  const getAssetIcon = (type: string) => {
    switch(type) {
      case 'property': return Building;
      case 'investment': return TrendingUp;
      case 'business': return Award;
      case 'insurance': return Shield;
      case 'bank': return FileText;
      default: return FileText;
    }
  };

  const getAssetColor = (type: string) => {
    switch(type) {
      case 'property': return 'blue';
      case 'investment': return 'green';
      case 'business': return 'purple';
      case 'insurance': return 'orange';
      case 'bank': return 'cyan';
      default: return 'gray';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-indigo-600" />Estate Planning Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Organize succession planning and nominee allocation</p>
      </div>

      {/* Estate Summary */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm opacity-90 mb-1">Total Estate Value</p>
            <p className="text-4xl font-black mb-2">{formatCurrency(totalEstate)}</p>
            <p className="text-sm opacity-80">{assets.length} assets tracked</p>
          </div>
          <div>
            <p className="text-sm opacity-90 mb-1">Nominee Coverage</p>
            <p className="text-4xl font-black mb-2">{assetsWithNominees}/{assets.length}</p>
            <p className="text-sm opacity-80">{completionPercentage.toFixed(0)}% complete</p>
          </div>
          <div>
            <p className="text-sm opacity-90 mb-1">Beneficiaries</p>
            <p className="text-4xl font-black mb-2">{nominees.length}</p>
            <p className="text-sm opacity-80">Family members</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-white/10 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Estate Planning Progress</span>
            <span className="text-sm">{completionPercentage.toFixed(0)}%</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-700"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Asset Breakdown */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Asset Distribution by Type</h3>
        <div className="grid md:grid-cols-5 gap-3">
          {Object.entries(assetsByType).map(([type, value]) => {
            const percentage = (value / totalEstate) * 100;
            const color = getAssetColor(type);
            return (
              <div key={type} className={`p-4 rounded-xl bg-${color}-50 border border-${color}-200`}>
                <p className="text-xs text-gray-600 mb-1 capitalize">{type}</p>
                <p className="text-xl font-black text-gray-900">{formatCurrency(value)}</p>
                <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% of estate</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assets List */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Assets & Nominees</h3>
        <div className="space-y-3">
          {assets.map(asset => {
            const Icon = getAssetIcon(asset.type);
            const color = getAssetColor(asset.type);
            const isExpanded = selectedAsset === asset.id;
            
            return (
              <div key={asset.id} className="border-2 border-gray-200 rounded-xl p-4 hover:border-indigo-300 transition-all">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setSelectedAsset(isExpanded ? null : asset.id)}>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 bg-${color}-100 rounded-xl`}>
                      <Icon className={`w-5 h-5 text-${color}-600`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{asset.name}</h4>
                      <p className="text-xs text-gray-500 capitalize">{asset.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-gray-900">{formatCurrency(asset.value)}</p>
                    <p className="text-xs text-gray-500">
                      {asset.nominees.length > 0 ? (
                        <span className="text-green-600 font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          {asset.nominees.length} nominees
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          No nominees
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {isExpanded && asset.nominees.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Nominated Beneficiaries:</p>
                    <div className="grid md:grid-cols-3 gap-2">
                      {asset.nominees.map(nomineeId => {
                        const nominee = nominees.find(n => n.id === nomineeId);
                        if (!nominee) return null;
                        return (
                          <div key={nomineeId} className="p-3 bg-indigo-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Users className="w-4 h-4 text-indigo-600" />
                              <p className="font-semibold text-gray-900 text-sm">{nominee.name}</p>
                            </div>
                            <p className="text-xs text-gray-600">{nominee.relation}</p>
                            <p className="text-xs text-indigo-600 font-bold mt-1">{nominee.percentage}% share</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Beneficiaries Summary */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Beneficiary Allocation</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {nominees.map(nominee => {
            const nomineeAssets = assets.filter(a => a.nominees.includes(nominee.id));
            const totalValue = nomineeAssets.reduce((sum, a) => sum + a.value, 0);
            
            return (
              <div key={nominee.id} className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-purple-600" />
                  <div>
                    <h4 className="font-bold text-gray-900">{nominee.name}</h4>
                    <p className="text-xs text-gray-600">{nominee.relation}</p>
                  </div>
                </div>
                <p className="text-2xl font-black text-purple-600 mb-1">{formatCurrency(totalValue)}</p>
                <p className="text-xs text-gray-600 mb-2">From {nomineeAssets.length} assets</p>
                <p className="text-xs font-bold text-purple-700">{nominee.percentage}% of estate</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          ⚠️ Estate Planning Action Items
        </h3>
        <ul className="space-y-2 text-sm text-amber-800">
          <li>• <strong>Make a Will:</strong> Legal document required to enforce nominations</li>
          <li>• <strong>Update nominees:</strong> Review every 3-5 years or after major life events</li>
          <li>• <strong>Joint accounts:</strong> Add joint holders for easier transition</li>
          <li>• <strong>Locker access:</strong> Provide bank locker details to nominees</li>
          <li>• <strong>Digital assets:</strong> Create password list for emails, crypto, online accounts</li>
          <li>• <strong>Executor appointment:</strong> Name someone to execute your will</li>
        </ul>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="font-bold text-blue-900 mb-3">📋 Estate Planning Checklist</h3>
        <div className="grid md:grid-cols-2 gap-3 text-sm text-blue-800">
          <div>
            <p className="font-semibold mb-1">✓ Documents Needed:</p>
            <ul className="space-y-1 text-xs">
              <li>• Will (drafted by lawyer)</li>
              <li>• Nominee forms for all investments</li>
              <li>• Property papers with succession clause</li>
              <li>• Life insurance policy documents</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-1">✓ Regular Reviews:</p>
            <ul className="space-y-1 text-xs">
              <li>• After marriage/divorce</li>
              <li>• After birth of child</li>
              <li>• After major asset purchase</li>
              <li>• Every 5 years minimum</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}