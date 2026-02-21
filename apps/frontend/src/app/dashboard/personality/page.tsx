'use client';

import { useState } from 'react';
import { Brain, TrendingUp, ShoppingBag, Sparkles, Target, Shield, Heart, Zap, Trophy, ArrowRight, RefreshCw } from 'lucide-react';

const QUESTIONS = [
  {
    q: "You get a ₹10,000 bonus. What's your first instinct?",
    options: [
      { text: "Save it all for emergencies", type: 'saver', icon: Shield },
      { text: "Invest 70%, spend 30%", type: 'balanced', icon: Target },
      { text: "Buy something I've been wanting", type: 'spender', icon: ShoppingBag },
      { text: "Treat friends to dinner", type: 'giver', icon: Heart },
    ]
  },
  {
    q: "How do you feel about shopping online?",
    options: [
      { text: "I compare prices for hours before buying", type: 'saver', icon: Target },
      { text: "I stick to my shopping list", type: 'balanced', icon: Trophy },
      { text: "I love browsing and often impulse buy", type: 'spender', icon: Sparkles },
      { text: "I gift things to others frequently", type: 'giver', icon: Heart },
    ]
  },
  {
    q: "Your approach to eating out?",
    options: [
      { text: "Rarely - I meal prep at home", type: 'saver', icon: Shield },
      { text: "Once a week as a treat", type: 'balanced', icon: Target },
      { text: "Several times a week - I love trying new places", type: 'spender', icon: TrendingUp },
      { text: "I often pick up the bill for others", type: 'giver', icon: Heart },
    ]
  },
  {
    q: "When you see a sale...",
    options: [
      { text: "I only buy if I already needed it", type: 'saver', icon: Brain },
      { text: "I calculate if it's actually worth it", type: 'balanced', icon: Target },
      { text: "Great deals! I stock up", type: 'spender', icon: ShoppingBag },
      { text: "I buy extras to gift later", type: 'giver', icon: Heart },
    ]
  },
  {
    q: "Your weekend plans usually involve...",
    options: [
      { text: "Free activities - parks, walks, home time", type: 'saver', icon: Shield },
      { text: "One planned outing within budget", type: 'balanced', icon: Target },
      { text: "Movies, restaurants, shopping", type: 'spender', icon: Sparkles },
      { text: "Organizing gatherings for friends", type: 'giver', icon: Heart },
    ]
  },
  {
    q: "You're scrolling social media and see an ad for something cool...",
    options: [
      { text: "Scroll past without a second thought", type: 'saver', icon: Shield },
      { text: "Save it to 'maybe later' list", type: 'balanced', icon: Brain },
      { text: "Click and end up buying", type: 'spender', icon: ShoppingBag },
      { text: "Share it with friends", type: 'giver', icon: Heart },
    ]
  },
  {
    q: "How do you track your expenses?",
    options: [
      { text: "Detailed spreadsheet every day", type: 'saver', icon: Brain },
      { text: "Weekly review in budgeting app", type: 'balanced', icon: Target },
      { text: "Check balance when it feels low", type: 'spender', icon: Sparkles },
      { text: "Focus more on others' needs than mine", type: 'giver', icon: Heart },
    ]
  },
];

const PERSONALITIES = {
  saver: {
    title: 'The Prudent Saver',
    icon: Shield,
    color: 'green',
    desc: 'You prioritize security and future planning over immediate gratification.',
    strengths: ['Strong emergency fund', 'Low debt', 'Excellent at delayed gratification'],
    risks: ['May miss life experiences', 'Could under-invest in growth', 'Risk-averse to opportunities'],
    tips: [
      'Allocate 10% for "guilt-free" spending',
      'Consider growth investments beyond savings',
      'Set aside experience budget for memories',
    ],
  },
  balanced: {
    title: 'The Strategic Balancer',
    icon: Target,
    color: 'blue',
    desc: 'You maintain equilibrium between saving, investing, and enjoying life.',
    strengths: ['Well-diversified approach', 'Disciplined yet flexible', 'Strong long-term planning'],
    risks: ['May overthink small purchases', 'Could miss aggressive investment gains'],
    tips: [
      'Keep up the great balance!',
      'Automate savings to remove decision fatigue',
      'Review annually and adjust allocations',
    ],
  },
  spender: {
    title: 'The Experience Seeker',
    icon: Sparkles,
    color: 'purple',
    desc: 'You value experiences and enjoyment in the present moment.',
    strengths: ['Lives life fully', 'Low regret about missed experiences', 'Confident in earning ability'],
    risks: ['Low savings rate', 'Vulnerable to emergencies', 'Retirement under-funded'],
    tips: [
      'Start with "pay yourself first" - 20% to savings',
      'Use 48-hour rule before buying',
      'Build 3-month emergency fund as priority',
    ],
  },
  giver: {
    title: 'The Generous Heart',
    icon: Heart,
    color: 'pink',
    desc: 'You find joy in giving to others and creating experiences for loved ones.',
    strengths: ['Strong relationships', 'High emotional satisfaction', 'Natural community builder'],
    risks: ['May neglect own financial security', 'Difficult saying no', 'Retirement at risk'],
    tips: [
      'Practice self-care financial planning',
      'Set a giving budget (10-15% max)',
      'Save for your future first, then give',
    ],
  },
};

export default function SpendingPersonality() {
  const [phase, setPhase] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState({ saver: 0, balanced: 0, spender: 0, giver: 0 });
  const [result, setResult] = useState<keyof typeof PERSONALITIES | null>(null);

  const answer = (type: string) => {
    setScores(prev => ({ ...prev, [type]: prev[type as keyof typeof scores] + 1 }));
    if (current < QUESTIONS.length - 1) {
      setCurrent(current + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    const updated = { ...scores };
    const max = Math.max(...Object.values(updated));
    const winner = Object.entries(updated).find(([, v]) => v === max)?.[0] as keyof typeof PERSONALITIES;
    setResult(winner);
    setPhase('result');
  };

  const reset = () => {
    setPhase('intro');
    setCurrent(0);
    setScores({ saver: 0, balanced: 0, spender: 0, giver: 0 });
    setResult(null);
  };

  const progress = ((current + 1) / QUESTIONS.length) * 100;

  if (phase === 'intro') {
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl text-center">
          <Brain className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h1 className="text-3xl font-black mb-3">Spending Personality Quiz</h1>
          <p className="text-violet-200 text-sm mb-6">
            Discover your unique money personality and get personalized tips to optimize your finances
          </p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {Object.entries(PERSONALITIES).map(([key, p]) => {
              const Icon = p.icon;
              return (
                <div key={key} className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <Icon className="w-6 h-6 mx-auto mb-1" />
                  <p className="text-xs font-semibold">{p.title}</p>
                </div>
              );
            })}
          </div>
          <button onClick={() => setPhase('quiz')}
            className="px-8 py-4 bg-white text-violet-700 rounded-xl font-bold text-lg hover:bg-violet-50 transition-colors flex items-center gap-2 mx-auto">
            Start Quiz <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'quiz') {
    const q = QUESTIONS[current];
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold text-gray-700">Question {current + 1} of {QUESTIONS.length}</span>
            <span className="text-gray-500">{progress.toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{q.q}</h2>
          <div className="space-y-3">
            {q.options.map((opt, i) => {
              const Icon = opt.icon;
              return (
                <button key={i} onClick={() => answer(opt.type)}
                  className="w-full p-4 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 hover:border-violet-400 hover:from-violet-50 hover:to-indigo-50 rounded-xl text-left transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-violet-100 rounded-lg group-hover:bg-violet-600 transition-colors">
                      <Icon className="w-5 h-5 text-violet-600 group-hover:text-white" />
                    </div>
                    <span className="font-medium text-gray-900 group-hover:text-violet-700">{opt.text}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'result' && result) {
    const personality = PERSONALITIES[result];
    const Icon = personality.icon;
    const colors: Record<string, any> = {
      green: { bg: 'bg-green-600', light: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
      blue: { bg: 'bg-blue-600', light: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      purple: { bg: 'bg-purple-600', light: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
      pink: { bg: 'bg-pink-600', light: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
    };
    const c = colors[personality.color];

    return (
      <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
        <div className={`${c.bg} rounded-2xl p-8 text-white shadow-xl text-center`}>
          <Icon className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-3xl font-black mb-2">{personality.title}</h1>
          <p className="text-sm opacity-90">{personality.desc}</p>
        </div>

        {/* Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Your Score Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(scores).map(([type, score]) => {
              const p = PERSONALITIES[type as keyof typeof PERSONALITIES];
              const P = p.icon;
              const pct = (score / QUESTIONS.length) * 100;
              return (
                <div key={type}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <P className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">{p.title}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{pct.toFixed(0)}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${c.bg} rounded-full transition-all duration-1000`}
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strengths */}
        <div className={`${c.light} border-2 ${c.border} rounded-2xl p-6`}>
          <h3 className={`font-bold ${c.text} mb-3 flex items-center gap-2`}>
            <Trophy className="w-5 h-5" />Your Strengths
          </h3>
          <ul className="space-y-2">
            {personality.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className={`w-1.5 h-1.5 rounded-full ${c.bg} mt-1.5 shrink-0`} />
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Risks */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6">
          <h3 className="font-bold text-orange-700 mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5" />Watch Out For
          </h3>
          <ul className="space-y-2">
            {personality.risks.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </div>

        {/* Tips */}
        <div className={`${c.light} border-2 ${c.border} rounded-2xl p-6`}>
          <h3 className={`font-bold ${c.text} mb-3 flex items-center gap-2`}>
            <Sparkles className="w-5 h-5" />Personalized Tips
          </h3>
          <ul className="space-y-3">
            {personality.tips.map((tip, i) => (
              <li key={i} className={`p-3 bg-white rounded-xl flex items-start gap-3 border ${c.border}`}>
                <span className={`w-6 h-6 ${c.bg} text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0`}>{i + 1}</span>
                <span className="text-sm text-gray-800">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <button onClick={reset}
          className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold hover:from-violet-700 hover:to-indigo-700 flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5" />Retake Quiz
        </button>
      </div>
    );
  }

  return null;
}