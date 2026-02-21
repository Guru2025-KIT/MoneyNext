'use client';

import { useState } from 'react';
import { Users, UserPlus, TrendingUp, Mail } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function FamilyPage() {
  const [showInvite, setShowInvite] = useState(false);
  const [email, setEmail] = useState('');
  const [members] = useState([
    { id: 1, name: 'You', email: 'you@example.com', spent: 15000, contributed: 20000, role: 'Admin' },
    { id: 2, name: 'Spouse', email: 'spouse@example.com', spent: 12000, contributed: 15000, role: 'Member' },
    { id: 3, name: 'Parent', email: 'parent@example.com', spent: 8000, contributed: 10000, role: 'Viewer' },
  ]);

  const totalSpent = members.reduce((sum, m) => sum + m.spent, 0);
  const totalContributed = members.reduce((sum, m) => sum + m.contributed, 0);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Invitation sent to ${email}!`);
    setEmail('');
    setShowInvite(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Family Finance</h1>
          <p className="text-gray-600 mt-1">Manage shared expenses with your family</p>
        </div>
        <button 
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <UserPlus className="w-5 h-5" />
          Invite Member
        </button>
      </div>

      {showInvite && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">Invite Family Member</h3>
          <form onSubmit={handleInvite} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="family@example.com"
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowInvite(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Send Invitation
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Family Members</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{members.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Spent</span>
            <TrendingUp className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Contributed</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalContributed)}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b">
          <h3 className="font-bold text-gray-900">Family Members</h3>
        </div>
        <div className="divide-y">
          {members.map((member) => (
            <div key={member.id} className="p-6 hover:bg-gray-50 transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                    {member.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{member.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Mail className="w-3 h-3" />
                      {member.email}
                    </div>
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded mt-1 inline-block">
                      {member.role}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    Spent: <span className="font-bold text-red-600">{formatCurrency(member.spent)}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Contributed: <span className="font-bold text-green-600">{formatCurrency(member.contributed)}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
