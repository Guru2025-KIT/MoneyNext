'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { Heart, TrendingUp, Award, FileText, CheckCircle, DollarSign, Calendar, AlertCircle, X } from 'lucide-react';

interface Donation {
  id: string;
  ngo: string;
  amount: number;
  date: string;
  category: 'education' | 'health' | 'environment' | 'poverty' | 'animal';
  section80G: boolean;
  receiptNumber: string;
}

interface NGO {
  id: string;
  name: string;
  category: string;
  section80G: boolean;
  rating: number;
}

export default function CharitableGiving() {
  const [donations] = useState<Donation[]>([
    { id: '1', ngo: 'Akshaya Patra Foundation', amount: 50000, date: '2024-01-15', category: 'poverty', section80G: true, receiptNumber: 'AP2024001' },
    { id: '2', ngo: 'CRY (Child Rights)', amount: 30000, date: '2024-02-20', category: 'education', section80G: true, receiptNumber: 'CRY2024002' },
    { id: '3', ngo: 'Wildlife SOS', amount: 25000, date: '2024-03-10', category: 'animal', section80G: true, receiptNumber: 'WS2024003' },
  ]);

  const [ngos] = useState<NGO[]>([
    { id: '1', name: 'GiveIndia', category: 'Multi-cause', section80G: true, rating: 4.8 },
    { id: '2', name: 'Teach For India', category: 'Education', section80G: true, rating: 4.7 },
    { id: '3', name: 'Sewa International', category: 'Poverty', section80G: true, rating: 4.6 },
    { id: '4', name: 'Pratham Education', category: 'Education', section80G: true, rating: 4.9 },
  ]);

  const [showDonateModal, setShowDonateModal] = useState(false);
  const [selectedNGO, setSelectedNGO] = useState<NGO | null>(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDonate = (ngo: NGO) => {
    setSelectedNGO(ngo);
    setShowDonateModal(true);
  };

  const confirmDonate = () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    setShowDonateModal(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setDonationAmount('');
  };

  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);
  const eligible80G = donations.filter(d => d.section80G).reduce((sum, d) => sum + d.amount, 0);
  const taxSaved = eligible80G * 0.5 * 0.3;

  const donationsByCategory = donations.reduce((acc, d) => {
    acc[d.category] = (acc[d.category] || 0) + d.amount;
    return acc;
  }, {} as Record<string, number>);

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      education: '🎓',
      health: '🏥',
      environment: '🌿',
      poverty: '🤝',
      animal: '🐾'
    };
    return icons[category] || '❤️';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      education: 'blue',
      health: 'red',
      environment: 'green',
      poverty: 'orange',
      animal: 'purple'
    };
    return colors[category] || 'gray';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg">
          <p className="font-bold">✓ Donation Recorded!</p>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Heart className="w-6 h-6 text-pink-600" /> Charitable Giving & Tax Planning
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Track donations and maximize Section 80G tax benefits</p>
      </div>

      <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm opacity-90 mb-1">Total Donated (FY 2024)</p>
            <p className="text-4xl font-black mb-2">{formatCurrency(totalDonated)}</p>
            <p className="text-sm opacity-80">To {donations.length} organizations</p>
          </div>
          <div>
            <p className="text-sm opacity-90 mb-1">80G Eligible Amount</p>
            <p className="text-4xl font-black mb-2">{formatCurrency(eligible80G)}</p>
            <p className="text-sm opacity-80">50% tax deduction</p>
          </div>
          <div>
            <p className="text-sm opacity-90 mb-1">Tax Saved</p>
            <p className="text-4xl font-black mb-2">{formatCurrency(taxSaved)}</p>
            <p className="text-sm opacity-80">At 30% tax rate</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Donations by Cause</h3>
        <div className="space-y-3">
          {Object.entries(donationsByCategory).map(([category, amount]) => {
            const percentage = (amount / totalDonated) * 100;
            return (
              <div key={category} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getCategoryIcon(category)}</span>
                    <p className="font-bold text-gray-900 capitalize">{category}</p>
                  </div>
                  <p className="text-2xl font-black text-gray-900">{formatCurrency(amount)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Donation History</h3>
        <div className="space-y-3">
          {donations.map(donation => (
            <div key={donation.id} className="p-5 rounded-xl border border-gray-100 bg-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getCategoryIcon(donation.category)}</span>
                  <div>
                    <h4 className="font-bold text-gray-900">{donation.ngo}</h4>
                    <p className="text-xs text-gray-600">{donation.date}</p>
                  </div>
                </div>
                <p className="text-lg font-bold">{formatCurrency(donation.amount)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended NGOs Section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Recommended NGOs</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {ngos.map(ngo => (
            <div key={ngo.id} className="p-4 border rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold">{ngo.name}</p>
                <p className="text-xs text-gray-500">{ngo.category}</p>
              </div>
              <button 
                onClick={() => handleDonate(ngo)}
                className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-bold"
              >
                Donate
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Donation Modal */}
      {showDonateModal && selectedNGO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Donate to {selectedNGO.name}</h2>
              <button onClick={() => setShowDonateModal(false)}><X /></button>
            </div>
            <input 
              type="number" 
              placeholder="Amount (₹)" 
              className="w-full p-3 border rounded-xl mb-4"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
            />
            <button 
              onClick={confirmDonate}
              className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold"
            >
              Confirm Donation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
