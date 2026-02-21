'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { Target, TrendingUp, Award, Calendar, CheckCircle, Lock, Flame, Star, Plus, X, AlertTriangle } from 'lucide-react';

interface Challenge {
  id: string;
  name: string;
  days: number;
  category: string;
  savedPerDay: number;
  currentStreak: number;
  status: 'active' | 'completed' | 'failed';
  startDate: string;
}

export default function NoSpendChallenge() {
  const [challenges, setChallenges] = useState<Challenge[]>([
    { id: '1', name: 'No Coffee Shop Week', days: 7, category: 'Food', savedPerDay: 150, currentStreak: 4, status: 'active', startDate: '2024-02-18' },
    { id: '2', name: 'Zero Shopping Month', days: 30, category: 'Shopping', savedPerDay: 300, currentStreak: 12, status: 'active', startDate: '2024-02-10' },
    { id: '3', name: 'Walk to Work Challenge', days: 14, category: 'Transport', savedPerDay: 80, currentStreak: 14, status: 'completed', startDate: '2024-02-05' },
  ]);

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successText, setSuccessText] = useState('');
  const [showFailModal, setShowFailModal] = useState(false);
  const [failChallengeId, setFailChallengeId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteChallengeId, setDeleteChallengeId] = useState<string | null>(null);

  const activeChallenge = challenges.find(c => c.status === 'active');
  const totalSaved = challenges.reduce((sum, c) => sum + (c.currentStreak * c.savedPerDay), 0);
  const longestStreak = Math.max(...challenges.map(c => c.currentStreak));

  const templates = [
    { name: 'No Eating Out Week', days: 7, category: 'Food', savedPerDay: 200 },
    { name: 'Zero Shopping Month', days: 30, category: 'Shopping', savedPerDay: 300 },
    { name: 'No Auto-Rickshaw', days: 14, category: 'Transport', savedPerDay: 100 },
    { name: 'No Snacks/Chai', days: 7, category: 'Food', savedPerDay: 50 },
    { name: 'Entertainment-Free Weekend', days: 2, category: 'Entertainment', savedPerDay: 500 },
  ];

  const showSuccess = (text: string) => {
    setSuccessText(text);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const startChallenge = (template: typeof templates[0]) => {
    const newChallenge: Challenge = {
      id: Date.now().toString(),
      name: template.name,
      days: template.days,
      category: template.category,
      savedPerDay: template.savedPerDay,
      currentStreak: 0,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
    };
    setChallenges([...challenges, newChallenge]);
    showSuccess(`🎯 Started "${template.name}"! Track your progress daily.`);
  };

  const markDayComplete = (id: string) => {
    setChallenges(challenges.map(c => {
      if (c.id === id && c.status === 'active') {
        const newStreak = c.currentStreak + 1;
        const newStatus = newStreak >= c.days ? 'completed' : 'active';
        showSuccess(`🔥 Day ${newStreak} complete! Saved ${formatCurrency(c.savedPerDay)}`);
        return { ...c, currentStreak: newStreak, status: newStatus };
      }
      return c;
    }));
  };

  const openFailModal = (id: string) => {
    setFailChallengeId(id);
    setShowFailModal(true);
  };

  const confirmFail = () => {
    if (failChallengeId) {
      setChallenges(challenges.map(c => 
        c.id === failChallengeId ? { ...c, status: 'failed' } : c
      ));
      showSuccess('❌ Challenge failed. Start a new one when ready!');
    }
    setShowFailModal(false);
    setFailChallengeId(null);
  };

  const openDeleteModal = (id: string) => {
    setDeleteChallengeId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteChallengeId) {
      setChallenges(challenges.filter(c => c.id !== deleteChallengeId));
      showSuccess('🗑️ Challenge deleted');
    }
    setShowDeleteModal(false);
    setDeleteChallengeId(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 md:p-6">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg animate-slideIn">
          <p className="font-bold">{successText}</p>
        </div>
      )}

      {/* Fail Confirmation Modal */}
      {showFailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scaleIn">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Break Streak?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to mark this challenge as failed? Your progress will be saved but the challenge will end.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setShowFailModal(false);
                  setFailChallengeId(null);
                }}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button
                onClick={confirmFail}
                className="px-4 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors">
                Yes, Break Streak
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scaleIn">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Delete Challenge?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              This will permanently delete this challenge and its history. This action cannot be undone.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteChallengeId(null);
                }}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-colors">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Target className="w-6 h-6 text-orange-600" />No-Spend Challenge
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Challenge yourself to not spend in specific categories</p>
      </div>

      {/* Current Challenge Banner */}
      {activeChallenge && (
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-6 h-6 animate-pulse" />
                <h3 className="text-xl font-bold">{activeChallenge.name}</h3>
              </div>
              <p className="text-sm opacity-90">{activeChallenge.category} • {activeChallenge.days} days challenge</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black">{activeChallenge.currentStreak}</p>
              <p className="text-xs opacity-80">day streak 🔥</p>
            </div>
          </div>
          
          <div className="relative h-3 bg-white/20 rounded-full overflow-hidden mb-3">
            <div 
              className="h-full bg-white rounded-full transition-all duration-700"
              style={{ width: `${(activeChallenge.currentStreak / activeChallenge.days) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-3 text-center mb-4">
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-2xl font-black">{formatCurrency(activeChallenge.currentStreak * activeChallenge.savedPerDay)}</p>
              <p className="text-xs opacity-80">Saved so far</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-2xl font-black">{activeChallenge.days - activeChallenge.currentStreak}</p>
              <p className="text-xs opacity-80">Days remaining</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-2xl font-black">{formatCurrency(activeChallenge.savedPerDay)}</p>
              <p className="text-xs opacity-80">Saved per day</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => markDayComplete(activeChallenge.id)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-colors">
              <CheckCircle className="w-5 h-5" />
              ✓ Mark Today Complete
            </button>
            <button
              onClick={() => openFailModal(activeChallenge.id)}
              className="px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold transition-colors">
              ✗ Break Streak
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Total Saved</p>
          </div>
          <p className="text-3xl font-black text-green-600">{formatCurrency(totalSaved)}</p>
          <p className="text-xs text-gray-500 mt-1">From all challenges</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-orange-600" />
            <p className="text-sm text-gray-600">Longest Streak</p>
          </div>
          <p className="text-3xl font-black text-orange-600">{longestStreak} days</p>
          <p className="text-xs text-gray-500 mt-1">Personal best</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-purple-600" />
            <p className="text-sm text-gray-600">Completed</p>
          </div>
          <p className="text-3xl font-black text-purple-600">{challenges.filter(c => c.status === 'completed').length}</p>
          <p className="text-xs text-gray-500 mt-1">Challenges won</p>
        </div>
      </div>

      {/* Challenge Templates */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">🎯 Start New Challenge</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {templates.map((template, i) => (
            <div 
              key={i} 
              onClick={() => startChallenge(template)}
              className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-900 group-hover:text-orange-600">{template.name}</h4>
                <span className="text-xs px-2 py-1 bg-gray-100 group-hover:bg-orange-200 text-gray-700 rounded-full font-semibold">
                  {template.days} days
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-2">{template.category}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Save {formatCurrency(template.savedPerDay)}/day</span>
                <span className="text-sm font-bold text-green-600">= {formatCurrency(template.savedPerDay * template.days)} total!</span>
              </div>
              <button className="w-full mt-3 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />Start Challenge
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Your Challenges */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Your Challenges</h3>
        <div className="space-y-3">
          {challenges.map(challenge => {
            const progress = (challenge.currentStreak / challenge.days) * 100;
            return (
              <div key={challenge.id} className={`p-4 rounded-xl border-2 ${
                challenge.status === 'completed' ? 'border-green-300 bg-green-50' :
                challenge.status === 'active' ? 'border-orange-300 bg-orange-50' :
                'border-red-300 bg-red-50'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {challenge.status === 'completed' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                     challenge.status === 'active' ? <Flame className="w-5 h-5 text-orange-600" /> :
                     <Lock className="w-5 h-5 text-red-600" />}
                    <div>
                      <h4 className="font-bold text-gray-900">{challenge.name}</h4>
                      <p className="text-xs text-gray-600">{challenge.category} • Started {new Date(challenge.startDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-orange-600">{challenge.currentStreak}/{challenge.days}</p>
                    <p className="text-xs text-gray-500">days</p>
                  </div>
                </div>

                <div className="relative h-2.5 bg-gray-200 rounded-full overflow-hidden mb-3">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${
                      challenge.status === 'completed' ? 'bg-green-500' :
                      challenge.status === 'active' ? 'bg-orange-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>

                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-gray-600">
                    {challenge.status === 'completed' ? '✅ Challenge completed!' :
                     challenge.status === 'active' ? `🔥 ${challenge.days - challenge.currentStreak} days to go!` :
                     '❌ Challenge failed'}
                  </span>
                  <span className="text-xs font-bold text-green-600">
                    Saved: {formatCurrency(challenge.currentStreak * challenge.savedPerDay)}
                  </span>
                </div>

                {challenge.status === 'active' && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => markDayComplete(challenge.id)}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors">
                      ✓ Day Complete
                    </button>
                    <button
                      onClick={() => openFailModal(challenge.id)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors">
                      ✗ Failed Today
                    </button>
                  </div>
                )}

                {challenge.status !== 'active' && (
                  <button
                    onClick={() => openDeleteModal(challenge.id)}
                    className="w-full px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-300 transition-colors">
                    Delete
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />💡 Challenge Success Tips
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• <strong>Start small:</strong> Begin with 3-7 day challenges</li>
          <li>• <strong>Tell friends:</strong> Public commitment increases success</li>
          <li>• <strong>Plan ahead:</strong> Prepare alternatives before challenge</li>
          <li>• <strong>Track daily:</strong> Mark each successful day immediately</li>
          <li>• <strong>Reward yourself:</strong> Use 10% of savings as treat!</li>
        </ul>
      </div>
    </div>
  );
}