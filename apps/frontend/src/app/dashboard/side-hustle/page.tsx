'use client';

import { useState, useEffect } from 'react';
import { transactionsApi } from '@/lib/api/transactions';
import { formatCurrency } from '@/lib/utils';
import { Briefcase, TrendingUp, Clock, DollarSign, Plus, X, CheckCircle, AlertCircle, Target, Zap, BarChart3 } from 'lucide-react';

interface SideHustle {
  id: string;
  name: string;
  type: 'freelance' | 'gig' | 'passive' | 'part-time' | 'business';
  hourlyRate?: number;
  totalEarned: number;
  hoursTracked: number;
  startDate: string;
  status: 'active' | 'paused' | 'completed';
  goal: number;
}

interface TimeEntry {
  id: string;
  hustleId: string;
  date: string;
  hours: number;
  earned: number;
  description: string;
}

const HUSTLE_TYPES = ['freelance', 'gig', 'passive', 'part-time', 'business'] as const;
const TYPE_LABELS = { freelance: 'Freelancing', gig: 'Gig Work', passive: 'Passive Income', 'part-time': 'Part-Time Job', business: 'Small Business' };

export default function SideHustleTracker() {
  const [hustles, setHustles] = useState<SideHustle[]>([]);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTimeEntry, setShowTimeEntry] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [newHustle, setNewHustle] = useState({
    name: '', type: 'freelance' as const, hourlyRate: '', goal: '', startDate: new Date().toISOString().split('T')[0]
  });
  
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0], hours: '', earned: '', description: ''
  });

  const addHustle = () => {
    if (!newHustle.name || !newHustle.goal) return;
    
    const hustle: SideHustle = {
      id: `hustle-${Date.now()}`,
      name: newHustle.name,
      type: newHustle.type,
      hourlyRate: newHustle.hourlyRate ? Number(newHustle.hourlyRate) : undefined,
      totalEarned: 0,
      hoursTracked: 0,
      startDate: newHustle.startDate,
      status: 'active',
      goal: Number(newHustle.goal),
    };
    
    setHustles([...hustles, hustle]);
    setNewHustle({ name: '', type: 'freelance', hourlyRate: '', goal: '', startDate: new Date().toISOString().split('T')[0] });
    setShowAddForm(false);
  };

  const addTimeEntry = (hustleId: string) => {
    if (!newEntry.earned && !newEntry.hours) return;
    
    const entry: TimeEntry = {
      id: `entry-${Date.now()}`,
      hustleId,
      date: newEntry.date,
      hours: Number(newEntry.hours) || 0,
      earned: Number(newEntry.earned) || 0,
      description: newEntry.description,
    };
    
    setEntries([...entries, entry]);
    
    // Update hustle totals
    setHustles(hustles.map(h => {
      if (h.id === hustleId) {
        return {
          ...h,
          totalEarned: h.totalEarned + entry.earned,
          hoursTracked: h.hoursTracked + entry.hours,
        };
      }
      return h;
    }));
    
    setNewEntry({ date: new Date().toISOString().split('T')[0], hours: '', earned: '', description: '' });
    setShowTimeEntry(null);
  };

  const deleteHustle = (id: string) => {
    setHustles(hustles.filter(h => h.id !== id));
    setEntries(entries.filter(e => e.hustleId !== id));
  };

  const totalEarned = hustles.reduce((s, h) => s + h.totalEarned, 0);
  const totalHours = hustles.reduce((s, h) => s + h.hoursTracked, 0);
  const avgHourly = totalHours > 0 ? totalEarned / totalHours : 0;
  const activeHustles = hustles.filter(h => h.status === 'active').length;

  // Calculate this month's earnings
  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthEntries = entries.filter(e => e.date.startsWith(thisMonth));
  const monthEarnings = monthEntries.reduce((s, e) => s + e.earned, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-600" />Side Hustle Tracker
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Track multiple income streams & optimize your time</p>
        </div>
        <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">
          <Plus className="w-4 h-4" />Add Hustle
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5" />
            <p className="text-sm font-medium opacity-90">Total Earned</p>
          </div>
          <p className="text-3xl font-black mb-1">{formatCurrency(totalEarned)}</p>
          <p className="text-xs opacity-80">All time</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <p className="text-sm font-medium text-gray-600">This Month</p>
          </div>
          <p className="text-3xl font-black text-gray-900 mb-1">{formatCurrency(monthEarnings)}</p>
          <p className="text-xs text-gray-500">{monthEntries.length} entries</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <p className="text-sm font-medium text-gray-600">Hours Tracked</p>
          </div>
          <p className="text-3xl font-black text-gray-900 mb-1">{totalHours.toFixed(1)}</p>
          <p className="text-xs text-gray-500">Across all hustles</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-amber-600" />
            <p className="text-sm font-medium text-gray-600">Avg Hourly</p>
          </div>
          <p className="text-3xl font-black text-gray-900 mb-1">{formatCurrency(avgHourly)}</p>
          <p className="text-xs text-gray-500">per hour</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-900 font-semibold mb-1">💡 Why Track Side Hustles?</p>
        <p className="text-xs text-blue-700">Know which income streams are worth your time. Optimize high-earning activities. Track progress toward financial goals. Make data-driven decisions about where to invest your hours.</p>
      </div>

      {/* Add Hustle Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl border-2 border-blue-200 p-5 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900">Add New Side Hustle</h3>
            <button onClick={() => setShowAddForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Name *</label>
                <input value={newHustle.name} onChange={e => setNewHustle({...newHustle, name: e.target.value})} placeholder="e.g. Freelance Writing" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Type</label>
                <select value={newHustle.type} onChange={e => setNewHustle({...newHustle, type: e.target.value as any})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                  {HUSTLE_TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Hourly Rate (optional)</label>
                <input type="number" value={newHustle.hourlyRate} onChange={e => setNewHustle({...newHustle, hourlyRate: e.target.value})} placeholder="₹0" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Monthly Goal (₹) *</label>
                <input type="number" value={newHustle.goal} onChange={e => setNewHustle({...newHustle, goal: e.target.value})} placeholder="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Start Date</label>
                <input type="date" value={newHustle.startDate} onChange={e => setNewHustle({...newHustle, startDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
            </div>
            <button onClick={addHustle} disabled={!newHustle.name || !newHustle.goal} className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50">
              Add Side Hustle
            </button>
          </div>
        </div>
      )}

      {/* Hustles List */}
      <div className="space-y-4">
        {hustles.length > 0 ? (
          hustles.map(hustle => {
            const progress = (hustle.totalEarned / hustle.goal) * 100;
            const hustleEntries = entries.filter(e => e.hustleId === hustle.id);
            const effectiveRate = hustle.hoursTracked > 0 ? hustle.totalEarned / hustle.hoursTracked : hustle.hourlyRate || 0;
            
            return (
              <div key={hustle.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 text-lg">{hustle.name}</h3>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">{TYPE_LABELS[hustle.type]}</span>
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${hustle.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {hustle.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Started {new Date(hustle.startDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setShowTimeEntry(hustle.id)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700">
                      + Log Time
                    </button>
                    <button onClick={() => deleteHustle(hustle.id)} className="text-gray-400 hover:text-red-500">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Total Earned</p>
                    <p className="text-lg font-bold text-green-600">{formatCurrency(hustle.totalEarned)}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Hours</p>
                    <p className="text-lg font-bold text-gray-900">{hustle.hoursTracked.toFixed(1)}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Hourly Rate</p>
                    <p className="text-lg font-bold text-purple-600">{formatCurrency(effectiveRate)}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Sessions</p>
                    <p className="text-lg font-bold text-gray-900">{hustleEntries.length}</p>
                  </div>
                </div>

                {/* Goal Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Monthly Goal Progress</span>
                    <span className="font-bold text-gray-900">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${progress >= 100 ? 'bg-green-500' : progress >= 70 ? 'bg-blue-500' : 'bg-amber-500'}`}
                      style={{ width: `${Math.min(progress, 100)}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{formatCurrency(hustle.totalEarned)}</span>
                    <span>{formatCurrency(hustle.goal - hustle.totalEarned)} to goal</span>
                    <span>{formatCurrency(hustle.goal)}</span>
                  </div>
                </div>

                {/* Time Entry Form */}
                {showTimeEntry === hustle.id && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <h4 className="font-bold text-gray-900 mb-3 text-sm">Log Work Session</h4>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">Date</label>
                        <input type="date" value={newEntry.date} onChange={e => setNewEntry({...newEntry, date: e.target.value})} className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">Hours</label>
                        <input type="number" step="0.5" value={newEntry.hours} onChange={e => setNewEntry({...newEntry, hours: e.target.value})} placeholder="0" className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm" />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="text-xs font-semibold text-gray-600 block mb-1">Amount Earned (₹)</label>
                      <input type="number" value={newEntry.earned} onChange={e => setNewEntry({...newEntry, earned: e.target.value})} placeholder="0" className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm" />
                    </div>
                    <div className="mb-3">
                      <label className="text-xs font-semibold text-gray-600 block mb-1">Description (optional)</label>
                      <input value={newEntry.description} onChange={e => setNewEntry({...newEntry, description: e.target.value})} placeholder="What did you work on?" className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setShowTimeEntry(null)} className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium">Cancel</button>
                      <button onClick={() => addTimeEntry(hustle.id)} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">Log Entry</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-600 font-medium">No side hustles yet</p>
            <p className="text-xs text-gray-400 mt-1">Add your first income stream to start tracking</p>
          </div>
        )}
      </div>

      {/* Insights */}
      {hustles.length > 1 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="font-semibold text-green-900 text-sm mb-2 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />📊 Performance Insight
          </p>
          <p className="text-xs text-green-800">
            {hustles.sort((a, b) => (b.totalEarned / Math.max(b.hoursTracked, 1)) - (a.totalEarned / Math.max(a.hoursTracked, 1)))[0].name} is your most profitable hustle at {formatCurrency(hustles.sort((a, b) => (b.totalEarned / Math.max(b.hoursTracked, 1)) - (a.totalEarned / Math.max(a.hoursTracked, 1)))[0].totalEarned / Math.max(hustles[0].hoursTracked, 1))}/hour. Focus more time here to maximize earnings!
          </p>
        </div>
      )}
    </div>
  );
}