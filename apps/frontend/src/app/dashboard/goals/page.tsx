'use client';

import { useEffect, useState } from 'react';
import { goalsApi } from '@/lib/api/goals';
import { formatCurrency } from '@/lib/utils';
import {
  Plus, Target, CheckCircle, Trash2, X,
  AlertCircle, PlusCircle, Calendar, RefreshCw, Award, TrendingUp
} from 'lucide-react';

function RadialProgress({ percentage, size = 110, color = '#3B82F6' }: {
  percentage: number; size?: number; color?: string;
}) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (Math.min(percentage, 100) / 100) * circumference;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#f3f4f6" strokeWidth="12"/>
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth="12"
        strokeDasharray={`${filled} ${circumference - filled}`}
        strokeDashoffset={circumference * 0.25} strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.8s ease' }}
      />
      <text x={size/2} y={size/2 - 4} textAnchor="middle" fill="#111827" fontSize="15" fontWeight="700">
        {Math.round(Math.min(percentage,100))}%
      </text>
      <text x={size/2} y={size/2 + 12} textAnchor="middle" fill="#6B7280" fontSize="9">complete</text>
    </svg>
  );
}

function MiniBarChart({ current, target }: { current: number; target: number }) {
  const pct = Math.min(current / Math.max(target, 1), 1);
  const bars = 8;
  const filled = Math.round(pct * bars);
  return (
    <div className="flex gap-0.5 items-end h-6 mt-1">
      {Array.from({ length: bars }).map((_, i) => (
        <div key={i} className={`flex-1 rounded-sm ${i < filled ? 'bg-blue-500' : 'bg-gray-100'}`}
          style={{ height: `${50 + i * 7}%` }} />
      ))}
    </div>
  );
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [contributeModal, setContributeModal] = useState<any>(null);
  const [contributeAmount, setContributeAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '', targetAmount: '', currentAmount: '0', deadline: '', category: '',
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setGoals(await goalsApi.getAll());
    } catch { setError('Failed to load goals'); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    try {
      await goalsApi.create({
        name: formData.name,
        targetAmount: Number(formData.targetAmount),
        currentAmount: Number(formData.currentAmount) || 0,
        deadline: new Date(formData.deadline).toISOString(),
        category: formData.category || null,
      });
      setShowForm(false);
      setFormData({ name: '', targetAmount: '', currentAmount: '0', deadline: '', category: '' });
      setSuccess('Goal created!'); setTimeout(() => setSuccess(''), 3000);
      await loadData();
    } catch (err: any) { setError(err.response?.data?.message || 'Failed to create goal'); }
  };

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    const amount = Number(contributeAmount);
    if (!amount || amount <= 0) { setError('Enter a valid amount'); return; }
    try {
      await goalsApi.update(contributeModal.id, {
        ...contributeModal,
        currentAmount: Number(contributeModal.currentAmount) + amount,
      });
      setContributeModal(null); setContributeAmount('');
      setSuccess('Contribution added!'); setTimeout(() => setSuccess(''), 3000);
      await loadData();
    } catch (err: any) { setError(err.response?.data?.message || 'Failed to contribute'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this goal?')) return;
    try { await goalsApi.delete(id); await loadData(); }
    catch { setError('Failed to delete'); }
  };

  const totalSaved = goals.reduce((s, g) => s + Number(g.currentAmount), 0);
  const totalTarget = goals.reduce((s, g) => s + Number(g.targetAmount), 0);
  const completedGoals = goals.filter(g => Number(g.currentAmount) >= Number(g.targetAmount)).length;
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  const getColor = (pct: number) => pct >= 100 ? '#10B981' : pct >= 60 ? '#3B82F6' : pct >= 30 ? '#F59E0B' : '#EF4444';

  if (loading) return (
    <div className="flex justify-center items-center min-h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Contribute Modal */}
      {contributeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Add Contribution</h3>
              <button onClick={() => { setContributeModal(null); setContributeAmount(''); setError(''); }}>
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl mb-4">
              <p className="font-bold text-gray-900 mb-2">{contributeModal.name}</p>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Saved so far</span>
                <span className="font-bold text-blue-600">{formatCurrency(contributeModal.currentAmount)}</span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-gray-600">Target</span>
                <span className="font-bold text-gray-900">{formatCurrency(contributeModal.targetAmount)}</span>
              </div>
              <div className="h-2 bg-white rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${Math.min((Number(contributeModal.currentAmount)/Number(contributeModal.targetAmount))*100,100)}%` }} />
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                {formatCurrency(Math.max(0, Number(contributeModal.targetAmount) - Number(contributeModal.currentAmount)))} still needed
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-4 text-sm">
                <AlertCircle className="w-4 h-4" />{error}
              </div>
            )}

            <form onSubmit={handleContribute} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount to Add (INR)</label>
                <input type="number" value={contributeAmount}
                  onChange={(e) => setContributeAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required min="1" suppressHydrationWarning />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => { setContributeModal(null); setContributeAmount(''); setError(''); }}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                  Add Contribution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Goals</h1>
          <p className="text-gray-600 mt-1">Track and achieve your savings goals</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold shadow-sm">
          <Plus className="w-5 h-5" /> New Goal
        </button>
      </div>

      {success && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">
          <CheckCircle className="w-5 h-5" />{success}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex justify-between items-start mb-3">
            <p className="text-sm opacity-80">Total Goals</p>
            <Target className="w-5 h-5 opacity-60" />
          </div>
          <p className="text-3xl font-bold">{goals.length}</p>
          <p className="text-xs opacity-70 mt-1">{completedGoals} completed</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex justify-between items-start mb-3">
            <p className="text-sm opacity-80">Total Saved</p>
            <TrendingUp className="w-5 h-5 opacity-60" />
          </div>
          <p className="text-3xl font-bold">{formatCurrency(totalSaved)}</p>
          <p className="text-xs opacity-70 mt-1">Across all goals</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex justify-between items-start mb-3">
            <p className="text-sm opacity-80">Total Target</p>
            <Award className="w-5 h-5 opacity-60" />
          </div>
          <p className="text-3xl font-bold">{formatCurrency(totalTarget)}</p>
          <p className="text-xs opacity-70 mt-1">To achieve</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex justify-between items-start mb-3">
            <p className="text-sm opacity-80">Overall Progress</p>
            <CheckCircle className="w-5 h-5 opacity-60" />
          </div>
          <p className="text-3xl font-bold">{overallProgress.toFixed(0)}%</p>
          <p className="text-xs opacity-70 mt-1">Keep going!</p>
        </div>
      </div>

      {/* Overall Progress Chart */}
      {goals.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            Goals Overview
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => {
              const pct = Math.min((Number(goal.currentAmount) / Math.max(Number(goal.targetAmount), 1)) * 100, 100);
              const color = getColor(pct);
              const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / 86400000);
              return (
                <div key={goal.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <RadialProgress percentage={pct} size={80} color={color} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{goal.name}</p>
                    <p className="text-xs text-gray-500">{formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}</p>
                    <p className={`text-xs mt-1 font-medium ${daysLeft > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
                    </p>
                    <MiniBarChart current={Number(goal.currentAmount)} target={Number(goal.targetAmount)} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Goal Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-xl font-bold text-gray-900">Create New Goal</h3>
            <button onClick={() => setShowForm(false)}><X className="w-6 h-6 text-gray-400 hover:text-gray-600" /></button>
          </div>
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-4 text-sm">
              <AlertCircle className="w-4 h-4" />{error}
            </div>
          )}
          <form onSubmit={handleCreate} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Goal Name</label>
              <input type="text" value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Emergency Fund, New Laptop"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required suppressHydrationWarning />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Target Amount (INR)</label>
              <input type="number" value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                placeholder="e.g. 50000"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required suppressHydrationWarning />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Already Saved (INR)</label>
              <input type="number" value={formData.currentAmount}
                onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                placeholder="0"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                suppressHydrationWarning />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Target Date</label>
              <input type="date" value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required suppressHydrationWarning />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Select Category</option>
                <option value="Emergency Fund">Emergency Fund</option>
                <option value="Vehicle">Vehicle</option>
                <option value="Education">Education</option>
                <option value="Travel">Travel</option>
                <option value="Home">Home</option>
                <option value="Retirement">Retirement</option>
                <option value="Gadget">Gadget</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="button" onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
              <button type="submit"
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">Create Goal</button>
            </div>
          </form>
        </div>
      )}

      {/* Goals List */}
      {goals.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium mb-4">No goals yet. Start saving towards something!</p>
          <button onClick={() => setShowForm(true)}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700">
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {goals.map((goal: any) => {
            const current = Number(goal.currentAmount);
            const target = Number(goal.targetAmount);
            const pct = Math.min((current / Math.max(target, 1)) * 100, 100);
            const remaining = target - current;
            const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / 86400000);
            const monthlyNeeded = daysLeft > 0 ? (remaining / (daysLeft / 30)) : 0;
            const color = getColor(pct);
            const isComplete = pct >= 100;

            return (
              <div key={goal.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden">
                {isComplete && (
                  <div className="bg-green-500 text-white text-xs font-bold text-center py-1.5 flex items-center justify-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> GOAL ACHIEVED!
                  </div>
                )}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">{goal.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {goal.category && (
                          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{goal.category}</span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          daysLeft > 30 ? 'bg-green-50 text-green-600' :
                          daysLeft > 0 ? 'bg-orange-50 text-orange-600' :
                          'bg-red-50 text-red-600'
                        }`}>
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadialProgress percentage={pct} size={70} color={color} />
                      <button onClick={() => handleDelete(goal.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-gray-500">Saved</span>
                      <span className="font-bold text-gray-900">{formatCurrency(current)}</span>
                    </div>
                    <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden group">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: color }} />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <span className="text-xs font-bold text-white drop-shadow">{pct.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs mt-1.5">
                      <span className="text-gray-500">Target: <span className="font-semibold text-gray-700">{formatCurrency(target)}</span></span>
                      <span style={{ color }} className="font-semibold">
                        {remaining > 0 ? `${formatCurrency(remaining)} to go` : 'Completed!'}
                      </span>
                    </div>
                  </div>

                  {/* Mini Chart */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">Progress visualization</p>
                    <MiniBarChart current={current} target={target} />
                  </div>

                  {/* Stats Row */}
                  {!isComplete && daysLeft > 0 && (
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 bg-gray-50 rounded-xl text-center">
                        <p className="text-xs text-gray-500 mb-1">Days Left</p>
                        <p className="font-bold text-gray-900">{daysLeft}</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-xl text-center">
                        <p className="text-xs text-gray-500 mb-1">Monthly Needed</p>
                        <p className="font-bold text-blue-600">{formatCurrency(Math.max(0, monthlyNeeded))}</p>
                      </div>
                    </div>
                  )}

                  {/* Contribute Button */}
                  {!isComplete && (
                    <button
                      onClick={() => { setContributeModal(goal); setContributeAmount(''); setError(''); }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold">
                      <PlusCircle className="w-5 h-5" />
                      Add Contribution
                    </button>
                  )}
                  {isComplete && (
                    <div className="flex items-center justify-center gap-2 py-2.5 bg-green-50 text-green-700 rounded-xl font-semibold">
                      <CheckCircle className="w-5 h-5" /> Goal Achieved!
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}