'use client';

import { useState } from 'react';
import { TrendingUp, Lightbulb, Clock, DollarSign, CheckCircle, Star, Zap, X } from 'lucide-react';

interface IncomeIdea {
  id: string;
  title: string;
  category: 'quick' | 'weekend' | 'monthly';
  timeRequired: string;
  potentialEarning: string;
  difficulty: 'easy' | 'medium' | 'hard';
  skills: string[];
  description: string;
  tried: boolean;
}

export default function IncomeBoostIdeas() {
  const [filter, setFilter] = useState<'all' | 'quick' | 'weekend' | 'monthly'>('all');
  const [showOnlyTried, setShowOnlyTried] = useState(false);
  const [ideas, setIdeas] = useState<IncomeIdea[]>([
    {
      id: '1',
      title: 'Sell Old Items on OLX/Quikr',
      category: 'quick',
      timeRequired: '2-3 hours',
      potentialEarning: '₹500-5,000',
      difficulty: 'easy',
      skills: ['Photography', 'Negotiation'],
      description: 'Clean out your home, take photos, list old clothes/electronics/furniture online',
      tried: false
    },
    {
      id: '2',
      title: 'Food Delivery (Zomato/Swiggy)',
      category: 'weekend',
      timeRequired: '4-6 hours/day',
      potentialEarning: '₹800-1,200/day',
      difficulty: 'medium',
      skills: ['Bike riding', 'Time management'],
      description: 'Weekend delivery partner - flexible hours, instant payments',
      tried: false
    },
    {
      id: '3',
      title: 'Freelance Writing (iWriter/ContentMart)',
      category: 'monthly',
      timeRequired: '10-15 hours/week',
      potentialEarning: '₹5,000-15,000/month',
      difficulty: 'medium',
      skills: ['English writing', 'Research'],
      description: 'Write articles, blogs, product descriptions for Indian clients',
      tried: false
    },
    {
      id: '4',
      title: 'Rent Out Parking Space',
      category: 'monthly',
      timeRequired: '1 hour setup',
      potentialEarning: '₹2,000-5,000/month',
      difficulty: 'easy',
      skills: ['None'],
      description: 'If you have extra parking, rent it out on JustPark or locally',
      tried: false
    },
    {
      id: '5',
      title: 'Online Tutoring (Vedantu/Unacademy)',
      category: 'monthly',
      timeRequired: '5-10 hours/week',
      potentialEarning: '₹8,000-20,000/month',
      difficulty: 'medium',
      skills: ['Subject expertise', 'Teaching'],
      description: 'Teach school/college subjects online from home',
      tried: false
    },
    {
      id: '6',
      title: 'Weekend Handicraft Sales',
      category: 'weekend',
      timeRequired: '2 days/month',
      potentialEarning: '₹3,000-8,000',
      difficulty: 'medium',
      skills: ['Crafting', 'Sales'],
      description: 'Make and sell handicrafts at Sunday markets or online',
      tried: false
    },
    {
      id: '7',
      title: 'Refer Friends to Apps',
      category: 'quick',
      timeRequired: '30 mins',
      potentialEarning: '₹200-1,000',
      difficulty: 'easy',
      skills: ['Social media'],
      description: 'Refer friends to Paytm, PhonePe, GooglePay and earn bonuses',
      tried: false
    },
    {
      id: '8',
      title: 'Data Entry (Freelancer.in)',
      category: 'monthly',
      timeRequired: '10-20 hours/week',
      potentialEarning: '₹4,000-10,000/month',
      difficulty: 'easy',
      skills: ['Typing', 'Excel'],
      description: 'Simple data entry work from home for Indian companies',
      tried: false
    },
  ]);

  const [successMessage, setSuccessMessage] = useState('');

  // Toggle tried status
  const toggleTried = (id: string) => {
    setIdeas(ideas.map(idea => {
      if (idea.id === id) {
        const newTried = !idea.tried;
        setSuccessMessage(newTried ? `✓ Marked "${idea.title}" as tried!` : `Unmarked "${idea.title}"`);
        setTimeout(() => setSuccessMessage(''), 2000);
        return { ...idea, tried: newTried };
      }
      return idea;
    }));
  };

  const filtered = ideas.filter(i => {
    if (showOnlyTried && !i.tried) return false;
    if (filter === 'all') return true;
    return i.category === filter;
  });

  const triedCount = ideas.filter(i => i.tried).length;
  const potentialMonthly = ideas
    .filter(i => i.category === 'monthly')
    .reduce((sum, i) => sum + parseInt(i.potentialEarning.split('-')[0].replace(/[₹,]/g, '')), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span className="font-bold">{successMessage}</span>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-yellow-600" />Income Boost Ideas
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">100% India-specific side income ideas for low-income earners</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5" />
            <p className="text-sm opacity-90">Total Ideas</p>
          </div>
          <p className="text-4xl font-black mb-1">{ideas.length}</p>
          <p className="text-xs opacity-80">Ways to earn extra</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">You've Tried</p>
          </div>
          <p className="text-4xl font-black text-gray-900 mb-1">{triedCount}</p>
          <p className="text-xs text-gray-500">Keep exploring!</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-purple-600" />
            <p className="text-sm text-gray-600">Potential Monthly</p>
          </div>
          <p className="text-4xl font-black text-purple-600 mb-1">₹{(potentialMonthly / 1000).toFixed(0)}k+</p>
          <p className="text-xs text-gray-500">From recurring ideas</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap items-center">
        {[
          { value: 'all', label: 'All Ideas', icon: Star },
          { value: 'quick', label: 'Quick Cash', icon: Zap },
          { value: 'weekend', label: 'Weekend Gigs', icon: Clock },
          { value: 'monthly', label: 'Recurring Income', icon: TrendingUp },
        ].map((f) => {
          const Icon = f.icon;
          return (
            <button
              key={f.value}
              onClick={() => {
                setFilter(f.value as any);
                setShowOnlyTried(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                filter === f.value
                  ? 'bg-yellow-600 text-white shadow-lg'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-yellow-400'
              }`}>
              <Icon className="w-4 h-4" />
              {f.label}
            </button>
          );
        })}

        <button
          onClick={() => setShowOnlyTried(!showOnlyTried)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ml-auto ${
            showOnlyTried
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-white border border-gray-200 text-gray-700 hover:border-green-400'
          }`}>
          <CheckCircle className="w-4 h-4" />
          {showOnlyTried ? 'Showing Tried Only' : 'Show Only Tried'}
        </button>
      </div>

      {/* Ideas Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map(idea => (
          <div key={idea.id} className={`bg-white rounded-2xl border-2 p-5 shadow-sm hover:shadow-md transition-all ${
            idea.tried ? 'border-green-300 bg-green-50' : 'border-gray-200'
          }`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900 text-lg">{idea.title}</h3>
                  {idea.tried && <CheckCircle className="w-5 h-5 text-green-600" />}
                </div>
                <p className="text-xs text-gray-600">{idea.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <Clock className="w-3 h-3 text-blue-600" />
                  <p className="text-xs text-blue-600 font-semibold">Time</p>
                </div>
                <p className="text-sm font-bold text-gray-900">{idea.timeRequired}</p>
              </div>

              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <DollarSign className="w-3 h-3 text-green-600" />
                  <p className="text-xs text-green-600 font-semibold">Earning</p>
                </div>
                <p className="text-sm font-bold text-gray-900">{idea.potentialEarning}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                idea.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                idea.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {idea.difficulty.toUpperCase()}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                idea.category === 'quick' ? 'bg-purple-100 text-purple-700' :
                idea.category === 'weekend' ? 'bg-blue-100 text-blue-700' :
                'bg-orange-100 text-orange-700'
              }`}>
                {idea.category === 'quick' ? 'QUICK CASH' :
                 idea.category === 'weekend' ? 'WEEKEND' :
                 'RECURRING'}
              </span>
            </div>

            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Skills needed:</p>
              <div className="flex flex-wrap gap-1">
                {idea.skills.map((skill, i) => (
                  <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <button 
              onClick={() => toggleTried(idea.id)}
              className={`w-full py-2 rounded-lg font-bold text-sm transition-colors ${
                idea.tried
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-yellow-600 text-white hover:bg-yellow-700'
              }`}>
              {idea.tried ? '✓ Tried This - Click to Unmark' : 'Mark as Tried'}
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <X className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-600">No ideas match your filters</p>
          <button
            onClick={() => {
              setFilter('all');
              setShowOnlyTried(false);
            }}
            className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg font-bold hover:bg-yellow-700">
            Clear Filters
          </button>
        </div>
      )}

      {/* Pro Tips */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <Star className="w-5 h-5" />💡 Pro Tips for Extra Income
        </h3>
        <div className="grid gap-3 md:grid-cols-2 text-sm">
          <div>
            <p className="font-semibold mb-1">✓ Start with "Easy" difficulty</p>
            <p className="opacity-90">Build confidence before tackling harder gigs</p>
          </div>
          <div>
            <p className="font-semibold mb-1">✓ Combine multiple ideas</p>
            <p className="opacity-90">Quick cash + recurring = best results!</p>
          </div>
          <div>
            <p className="font-semibold mb-1">✓ Track your time vs money</p>
            <p className="opacity-90">Focus on ideas with best hourly rate</p>
          </div>
          <div>
            <p className="font-semibold mb-1">✓ Reinvest first ₹1,000</p>
            <p className="opacity-90">Use initial earnings to scale up!</p>
          </div>
        </div>
      </div>
    </div>
  );
}