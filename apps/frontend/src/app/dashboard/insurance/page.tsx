'use client';

import { useState } from 'react';
import { Shield, Heart, Home, Car, Users, Briefcase, CheckCircle, AlertCircle, ExternalLink, ChevronDown, ChevronUp, Calculator, X } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const policies = [
  {
    type: 'Term Life Insurance', icon: Shield, color: 'blue',
    coverage: '₹1 Crore', annualPremium: 6000, monthlyPremium: 500,
    urgency: 'Critical', urgencyColor: 'red',
    why: 'If you have dependents, this is the most important insurance. It pays your family if something happens to you.',
    benefits: ['Death benefit to nominee', 'Tax benefit under 80C', 'Financial security for family', 'Covers loans and liabilities'],
    features: ['No maturity benefit - pure protection', 'Cover 10-15x annual income', 'Buy early for lower premiums'],
    link: 'https://www.policybazaar.com/life-insurance/term-insurance/',
    calculator: { label: 'Recommended Cover', formula: (income: number) => income * 12, description: 'Ideal: 10x your annual income' }
  },
  {
    type: 'Health Insurance', icon: Heart, color: 'red',
    coverage: '₹5 Lakh', annualPremium: 9600, monthlyPremium: 800,
    urgency: 'Critical', urgencyColor: 'red',
    why: 'Medical emergencies can wipe out years of savings. Health insurance is a must-have for every individual.',
    benefits: ['Cashless hospitalization', 'Pre & post hospitalization cover', 'Tax benefit under 80D', 'Day care procedures'],
    features: ['Cover entire family in one policy', 'Check network hospitals near you', 'No-claim bonus up to 50%'],
    link: 'https://www.policybazaar.com/health-insurance/',
    calculator: { label: 'Min. Cover Needed', formula: () => 500000, description: 'Minimum ₹5L, preferably ₹10L+' }
  },
  {
    type: 'Home Insurance', icon: Home, color: 'green',
    coverage: '₹50 Lakh', annualPremium: 3600, monthlyPremium: 300,
    urgency: 'Recommended', urgencyColor: 'orange',
    why: 'Protect your biggest asset from fire, floods, theft and natural disasters.',
    benefits: ['Property damage cover', 'Theft protection', 'Natural disaster cover', 'Temporary accommodation if needed'],
    features: ['Covers structure and contents', 'Surprisingly affordable premiums', 'Mandatory for home loans'],
    link: 'https://www.policybazaar.com/home-insurance/',
    calculator: { label: 'Cover Needed', formula: () => 5000000, description: 'Based on property reconstruction cost' }
  },
  {
    type: 'Vehicle Insurance', icon: Car, color: 'purple',
    coverage: '₹10 Lakh', annualPremium: 4800, monthlyPremium: 400,
    urgency: 'Mandatory', urgencyColor: 'red',
    why: 'Legally required for all vehicles in India. Comprehensive cover also protects your own vehicle.',
    benefits: ['Third party liability (mandatory)', 'Own damage cover', 'Personal accident cover', 'Cashless garage repairs'],
    features: ['Third party is legally mandatory', 'Zero depreciation add-on recommended', 'Roadside assistance available'],
    link: 'https://www.policybazaar.com/motor-insurance/',
    calculator: { label: 'Estimated Premium', formula: () => 12000, description: 'Depends on vehicle value and age' }
  },
  {
    type: 'Personal Accident', icon: Users, color: 'cyan',
    coverage: '₹25 Lakh', annualPremium: 1200, monthlyPremium: 100,
    urgency: 'Recommended', urgencyColor: 'orange',
    why: 'Covers disability and income loss due to accidents. Very affordable and often overlooked.',
    benefits: ['Accidental death cover', 'Permanent disability cover', 'Temporary disability income', 'Very affordable premium'],
    features: ['No medical test required', 'Worldwide coverage', 'Covers adventure sports options'],
    link: 'https://www.policybazaar.com/personal-accident-insurance/',
    calculator: { label: 'Recommended Cover', formula: (income: number) => income * 12 * 5, description: 'Ideal: 5x annual income' }
  },
  {
    type: 'Critical Illness', icon: Briefcase, color: 'pink',
    coverage: '₹25 Lakh', annualPremium: 6000, monthlyPremium: 500,
    urgency: 'Important', urgencyColor: 'yellow',
    why: 'Pays lump sum on diagnosis of serious diseases like cancer, heart attack, stroke. Covers income loss during recovery.',
    benefits: ['Lump sum on diagnosis', 'Covers 30+ critical illnesses', 'Income replacement during treatment', 'Tax benefit under 80D'],
    features: ['Different from health insurance', 'Money paid directly to you', 'Can be used for anything'],
    link: 'https://www.policybazaar.com/health-insurance/critical-illness-insurance/',
    calculator: { label: 'Recommended Cover', formula: () => 2500000, description: 'Minimum ₹25L for meaningful cover' }
  },
];

export default function InsurancePage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [calcModal, setCalcModal] = useState<any>(null);
  const [monthlyIncome, setMonthlyIncome] = useState(50000);

  const urgencyColors: Record<string, string> = {
    red: 'bg-red-100 text-red-700 border-red-200',
    orange: 'bg-orange-100 text-orange-700 border-orange-200',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  };

  const iconColors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600', red: 'bg-red-100 text-red-600',
    green: 'bg-green-100 text-green-600', purple: 'bg-purple-100 text-purple-600',
    cyan: 'bg-cyan-100 text-cyan-600', pink: 'bg-pink-100 text-pink-600',
  };

  const totalMonthlyPremium = policies.reduce((s, p) => s + p.monthlyPremium, 0);
  const totalAnnualPremium = policies.reduce((s, p) => s + p.annualPremium, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Premium Calculator Modal */}
      {calcModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">{calcModal.type} - Needs Calculator</h3>
              <button onClick={() => setCalcModal(null)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            <div className="mb-4">
              <div className="flex justify-between mb-1"><label className="text-sm font-medium text-gray-700">Your Monthly Income</label><span className="text-sm font-bold text-blue-600">{formatCurrency(monthlyIncome)}</span></div>
              <input type="range" min="10000" max="500000" step="5000" value={monthlyIncome} onChange={e => setMonthlyIncome(Number(e.target.value))} className="w-full accent-blue-600" suppressHydrationWarning />
            </div>
            <div className="p-4 bg-blue-50 rounded-xl mb-4">
              <p className="text-sm text-gray-600 mb-1">{calcModal.calculator.label}</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(calcModal.calculator.formula(monthlyIncome))}</p>
              <p className="text-xs text-gray-500 mt-1">{calcModal.calculator.description}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl mb-4">
              <p className="text-sm text-gray-600 mb-1">Estimated Monthly Premium</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(calcModal.monthlyPremium)}</p>
              <p className="text-xs text-gray-500 mt-1">Annual: {formatCurrency(calcModal.annualPremium)} • {((calcModal.annualPremium / (monthlyIncome * 12)) * 100).toFixed(1)}% of income</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setCalcModal(null)} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium">Close</button>
              <a href={calcModal.link} target="_blank" rel="noopener noreferrer" className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-center flex items-center justify-center gap-1">
                <ExternalLink className="w-4 h-4" />Get Quote
              </a>
            </div>
          </div>
        </div>
      )}

      <div><h1 className="text-3xl font-bold text-gray-900">Insurance Planning</h1><p className="text-gray-500 text-sm mt-1">Protect yourself and your family from financial risks</p></div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
        <h3 className="font-bold text-lg mb-4">Complete Protection Overview</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white/10 rounded-xl">
            <p className="text-xs opacity-80 mb-1">Policies Available</p>
            <p className="text-2xl font-bold">{policies.length}</p>
          </div>
          <div className="text-center p-3 bg-white/10 rounded-xl">
            <p className="text-xs opacity-80 mb-1">Total Monthly Premium</p>
            <p className="text-2xl font-bold">{formatCurrency(totalMonthlyPremium)}</p>
          </div>
          <div className="text-center p-3 bg-white/10 rounded-xl">
            <p className="text-xs opacity-80 mb-1">Annual Premium</p>
            <p className="text-2xl font-bold">{formatCurrency(totalAnnualPremium)}</p>
          </div>
        </div>
        <p className="text-xs text-blue-200 mt-3">💡 Tip: Start with Term Life and Health Insurance first. These are the most critical.</p>
      </div>

      {/* Insurance Cards */}
      <div className="grid gap-5 md:grid-cols-2">
        {policies.map((policy, i) => {
          const Icon = policy.icon;
          const isExpanded = expandedId === i;
          return (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${iconColors[policy.color]}`}><Icon className="w-6 h-6" /></div>
                    <div>
                      <h3 className="font-bold text-gray-900">{policy.type}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${urgencyColors[policy.urgencyColor]}`}>{policy.urgency}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{policy.monthlyPremium > 0 ? `₹${policy.monthlyPremium}/mo` : 'Free'}</p>
                    <p className="text-xs text-gray-500">Cover: {policy.coverage}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3 p-3 bg-blue-50 rounded-lg"><span className="font-semibold">Why you need it: </span>{policy.why}</p>

                {isExpanded && (
                  <div className="space-y-3 mb-3">
                    <div>
                      <p className="text-xs font-bold text-gray-700 mb-2">KEY BENEFITS</p>
                      <div className="space-y-1">
                        {policy.benefits.map((b, j) => (
                          <div key={j} className="flex items-start gap-2 text-xs text-gray-600">
                            <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />{b}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-xs font-bold text-gray-700 mb-1">IMPORTANT TO KNOW</p>
                      {policy.features.map((f, j) => (
                        <div key={j} className="flex items-start gap-2 text-xs text-gray-600 mt-1">
                          <AlertCircle className="w-3.5 h-3.5 text-orange-500 flex-shrink-0 mt-0.5" />{f}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button onClick={() => setExpandedId(isExpanded ? null : i)} className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 text-sm font-medium flex items-center justify-center gap-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    {isExpanded ? 'Less Info' : 'Learn More'}
                  </button>
                  <button onClick={() => setCalcModal(policy)} className="px-3 py-2.5 border border-blue-200 text-blue-600 rounded-xl hover:bg-blue-50 text-sm font-medium flex items-center gap-1">
                    <Calculator className="w-4 h-4" />Calc
                  </button>
                  <a href={policy.link} target="_blank" rel="noopener noreferrer" className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-semibold flex items-center justify-center gap-1">
                    <ExternalLink className="w-4 h-4" />Get Quote
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Priority Guide */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Insurance Priority Guide</h3>
        <div className="space-y-3">
          {[
            { step: 1, title: 'Term Life Insurance', desc: 'Buy immediately if you have dependents. 10x annual income cover.', color: 'red' },
            { step: 2, title: 'Health Insurance', desc: 'Essential for everyone. Min ₹5L cover, ₹10L+ preferred.', color: 'red' },
            { step: 3, title: 'Vehicle Insurance', desc: 'Legally mandatory. Upgrade to comprehensive cover.', color: 'orange' },
            { step: 4, title: 'Personal Accident', desc: 'Very affordable. Covers income loss due to accidents.', color: 'yellow' },
            { step: 5, title: 'Home Insurance', desc: 'If you own property. Mandatory for home loans.', color: 'green' },
            { step: 6, title: 'Critical Illness', desc: 'Buy after covering basics. Lump sum on serious illness.', color: 'blue' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 p-3 bg-gray-50 rounded-xl">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${item.color === 'red' ? 'bg-red-100 text-red-600' : item.color === 'orange' ? 'bg-orange-100 text-orange-600' : item.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' : item.color === 'green' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>{item.step}</div>
              <div><p className="font-semibold text-gray-900 text-sm">{item.title}</p><p className="text-xs text-gray-500 mt-0.5">{item.desc}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}