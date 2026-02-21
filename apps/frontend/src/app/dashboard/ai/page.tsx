'use client';

import { useState, useEffect } from 'react';
import { accountsApi } from '@/lib/api/accounts';
import { transactionsApi } from '@/lib/api/transactions';
import { budgetsApi } from '@/lib/api/budgets';
import { goalsApi } from '@/lib/api/goals';
import { formatCurrency } from '@/lib/utils';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Lightbulb, Target, Zap, Shield, DollarSign, TrendingDown, Sparkles, RefreshCw } from 'lucide-react';

interface Insight { id: string; type: 'warning' | 'opportunity' | 'achievement' | 'tip'; icon: any; title: string; message: string; action?: string; impact: string; priority: number; }

export default function AIFinancialCoach() {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [acc, txn, bud, gol] = await Promise.all([
        accountsApi.getAll(), transactionsApi.getAll(),
        budgetsApi.getAll(), goalsApi.getAll(),
      ]);
      setAccounts(acc);
      setTransactions(txn);
      setBudgets(bud);
      setGoals(gol);
      analyzeFinances(acc, txn, bud, gol);
    } finally {
      setLoading(false);
    }
  };

  const analyzeFinances = (acc: any[], txn: any[], bud: any[], gol: any[]) => {
    const discovered: Insight[] = [];
    let healthScore = 100;

    const now = new Date();
    const curMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const monthTxns = txn.filter(t => {
      const d = new Date(t.date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === curMonth;
    });

    const monthIncome = monthTxns.filter(t => t.type === 'INCOME').reduce((s, t) => s + Number(t.amount), 0);
    const monthExpense = monthTxns.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + Number(t.amount), 0);
    const totalBalance = acc.reduce((s, a) => s + Number(a.balance), 0);
    const liquidCash = acc.filter(a => ['CHECKING', 'SAVINGS'].includes(a.type)).reduce((s, a) => s + Number(a.balance), 0);
    const savingsRate = monthIncome > 0 ? ((monthIncome - monthExpense) / monthIncome * 100) : 0;

    // 1. Emergency fund check
    const monthsOfExpenses = monthExpense > 0 ? liquidCash / monthExpense : 0;
    if (monthsOfExpenses < 3) {
      discovered.push({
        id: 'ef1', type: 'warning', icon: AlertTriangle, priority: 10,
        title: 'Emergency Fund Below Target',
        message: `You have only ${monthsOfExpenses.toFixed(1)} months of expenses saved. Aim for 6 months (${formatCurrency(monthExpense * 6)}).`,
        action: 'Set up auto-transfer of 10% income to savings',
        impact: `Build ${formatCurrency(monthExpense * 6 - liquidCash)} emergency cushion`,
      });
      healthScore -= 15;
    } else if (monthsOfExpenses >= 6) {
      discovered.push({
        id: 'ef2', type: 'achievement', icon: CheckCircle, priority: 3,
        title: 'Strong Emergency Fund',
        message: `Excellent! You have ${monthsOfExpenses.toFixed(1)} months of expenses saved. Your emergency fund is solid.`,
        impact: 'Financial security established',
      });
    }

    // 2. Savings rate analysis
    if (savingsRate < 10) {
      discovered.push({
        id: 'sr1', type: 'warning', icon: TrendingDown, priority: 9,
        title: 'Low Savings Rate',
        message: `You're saving only ${savingsRate.toFixed(1)}% of income. Aim for at least 20%.`,
        action: 'Review top 3 expense categories and cut 10%',
        impact: `Save additional ${formatCurrency(monthIncome * 0.1)}/month`,
      });
      healthScore -= 12;
    } else if (savingsRate >= 30) {
      discovered.push({
        id: 'sr2', type: 'achievement', icon: Target, priority: 2,
        title: 'Exceptional Savings Rate',
        message: `Outstanding! ${savingsRate.toFixed(1)}% savings rate puts you in the top 10%.`,
        impact: 'On track for early financial independence',
      });
    }

    // 3. Category spending anomalies
    const spendByCat = monthTxns.filter(t => t.type === 'EXPENSE').reduce((acc, t) => {
      const cat = t.category || 'Others';
      acc[cat] = (acc[cat] || 0) + Number(t.amount);
      return acc;
    }, {} as Record<string, number>);

    Object.entries(spendByCat).forEach(([cat, amt]) => {
      const pct = (amt / monthExpense) * 100;
      if (cat === 'Food' && pct > 30) {
        discovered.push({
          id: 'cat1', type: 'opportunity', icon: Lightbulb, priority: 7,
          title: 'High Food Spending Detected',
          message: `Food spending is ${pct.toFixed(0)}% of expenses (${formatCurrency(amt)}). Consider meal planning or cooking at home.`,
          action: 'Try cooking 2 more meals per week at home',
          impact: `Save up to ${formatCurrency(amt * 0.2)}/month`,
        });
        healthScore -= 5;
      }
      if (cat === 'Shopping' && pct > 20) {
        discovered.push({
          id: 'cat2', type: 'opportunity', icon: Lightbulb, priority: 6,
          title: 'Shopping Expenses High',
          message: `${formatCurrency(amt)} spent on shopping this month (${pct.toFixed(0)}%). Review if all purchases were necessary.`,
          action: 'Implement 48-hour rule before buying',
          impact: `Reduce impulse purchases by ${formatCurrency(amt * 0.15)}`,
        });
        healthScore -= 5;
      }
    });

    // 4. Budget adherence
    const budgetIssues = bud.filter((b: any) => {
      const spent = Number(b.spent);
      const limit = Number(b.amount);
      return spent > limit * 0.9;
    });
    if (budgetIssues.length > 0) {
      discovered.push({
        id: 'bud1', type: 'warning', icon: AlertTriangle, priority: 8,
        title: `${budgetIssues.length} Budget${budgetIssues.length > 1 ? 's' : ''} Exceeded`,
        message: `${budgetIssues.map((b: any) => b.name).join(', ')} over budget this month.`,
        action: 'Review and adjust spending habits or increase limits',
        impact: 'Stay within planned expenses',
      });
      healthScore -= 8;
    }

    // 5. Goal progress
    const stagnantGoals = gol.filter((g: any) => {
      const progress = (Number(g.currentAmount) / Number(g.targetAmount)) * 100;
      return progress < 10 && new Date(g.deadline).getTime() - Date.now() < 90 * 86400000; // 90 days left
    });
    if (stagnantGoals.length > 0) {
      discovered.push({
        id: 'goal1', type: 'opportunity', icon: Target, priority: 7,
        title: 'Goals Need Attention',
        message: `${stagnantGoals.length} goal${stagnantGoals.length > 1 ? 's are' : ' is'} behind schedule: ${stagnantGoals.map((g: any) => g.name).join(', ')}.`,
        action: 'Set up automatic monthly contributions',
        impact: 'Get back on track to meet deadlines',
      });
    }

    // 6. Income diversification
    const incomeTypes = txn.filter(t => t.type === 'INCOME').reduce((acc, t) => {
      const cat = t.category || 'Salary';
      acc.add(cat);
      return acc;
    }, new Set());
    if (incomeTypes.size === 1) {
      discovered.push({
        id: 'inc1', type: 'tip', icon: Zap, priority: 5,
        title: 'Single Income Source',
        message: 'All income from one source. Consider building secondary income streams.',
        action: 'Explore freelancing, investments, or side projects',
        impact: 'Reduce financial risk through diversification',
      });
    }

    // 7. Investment opportunity
    const investmentAcc = acc.filter(a => a.type === 'INVESTMENT');
    const investmentTotal = investmentAcc.reduce((s, a) => s + Number(a.balance), 0);
    const investmentPct = totalBalance > 0 ? (investmentTotal / totalBalance) * 100 : 0;
    if (investmentPct < 20 && totalBalance > 100000) {
      discovered.push({
        id: 'inv1', type: 'opportunity', icon: TrendingUp, priority: 6,
        title: 'Low Investment Allocation',
        message: `Only ${investmentPct.toFixed(0)}% of your wealth is invested. Consider allocating more to growth assets.`,
        action: 'Start SIP of ₹5,000/month in equity mutual funds',
        impact: 'Potential 12-15% annual returns vs 4-6% in savings',
      });
      healthScore -= 10;
    }

    // 8. Debt alert
    const debtAcc = acc.filter(a => a.type === 'CREDIT' || a.type === 'LOAN');
    const totalDebt = debtAcc.reduce((s, a) => s + Math.abs(Number(a.balance)), 0);
    if (totalDebt > monthIncome * 3) {
      discovered.push({
        id: 'debt1', type: 'warning', icon: AlertTriangle, priority: 10,
        title: 'High Debt Burden',
        message: `Total debt ${formatCurrency(totalDebt)} exceeds 3 months income. Prioritize debt repayment.`,
        action: 'Use debt avalanche method (highest interest first)',
        impact: 'Save on interest, improve credit score',
      });
      healthScore -= 15;
    }

    // 9. Tax optimization
    if (monthIncome * 12 > 500000) {
      discovered.push({
        id: 'tax1', type: 'tip', icon: Shield, priority: 4,
        title: 'Tax Saving Opportunity',
        message: 'You qualify for tax-saving investments under Section 80C and 80D.',
        action: 'Invest in ELSS, PPF, or NPS before March 31',
        impact: 'Save up to ₹46,800 in taxes annually',
      });
    }

    // 10. Positive reinforcement
    if (monthIncome > monthExpense) {
      discovered.push({
        id: 'pos1', type: 'achievement', icon: Sparkles, priority: 1,
        title: 'Positive Cash Flow',
        message: `Great job! You earned ${formatCurrency(monthIncome - monthExpense)} more than you spent this month.`,
        impact: 'Building wealth consistently',
      });
    }

    setInsights(discovered.sort((a, b) => b.priority - a.priority));
    setScore(Math.max(0, Math.min(100, healthScore)));
  };

  const getScoreColor = () => {
    if (score >= 80) return { bg: 'bg-green-100', text: 'text-green-700', ring: 'ring-green-500', label: 'Excellent' };
    if (score >= 60) return { bg: 'bg-blue-100', text: 'text-blue-700', ring: 'ring-blue-500', label: 'Good' };
    if (score >= 40) return { bg: 'bg-orange-100', text: 'text-orange-700', ring: 'ring-orange-500', label: 'Fair' };
    return { bg: 'bg-red-100', text: 'text-red-700', ring: 'ring-red-500', label: 'Needs Work' };
  };

  const scoreColors = getScoreColor();

  const typeStyles: Record<string, { bg: string; border: string; icon: string }> = {
    warning: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-600' },
    opportunity: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600' },
    achievement: { bg: 'bg-green-50', border: 'border-green-200', icon: 'text-green-600' },
    tip: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'text-purple-600' },
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-200 border-t-violet-600"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="w-6 h-6 text-violet-600" />AI Financial Coach
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Personalized insights and recommendations based on your spending patterns</p>
        </div>
        <button onClick={loadData} className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-violet-700">
          <RefreshCw className="w-4 h-4" />Analyze
        </button>
      </div>

      {/* Financial Health Score */}
      <div className={`${scoreColors.bg} rounded-2xl p-6 border-2 ${scoreColors.ring}`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none"
                  className={scoreColors.text}
                  strokeDasharray={`${(score / 100) * 251.2} 251.2`}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-2xl font-black ${scoreColors.text}`}>{score}</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{scoreColors.label}</p>
              <p className={`text-sm font-semibold ${scoreColors.text}`}>Financial Health Score</p>
              <p className="text-xs text-gray-500 mt-1">{insights.length} insights discovered</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-white/50 rounded-xl">
              <p className="text-xs text-gray-500">Warnings</p>
              <p className="text-xl font-bold text-red-600">{insights.filter(i => i.type === 'warning').length}</p>
            </div>
            <div className="text-center p-3 bg-white/50 rounded-xl">
              <p className="text-xs text-gray-500">Opportunities</p>
              <p className="text-xl font-bold text-blue-600">{insights.filter(i => i.type === 'opportunity').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {insights.map(insight => {
          const Icon = insight.icon;
          const styles = typeStyles[insight.type];
          
          return (
            <div key={insight.id} className={`${styles.bg} border-2 ${styles.border} rounded-2xl p-5 shadow-sm`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 bg-white rounded-xl ${styles.icon} shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">{insight.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${styles.bg} ${styles.icon} border ${styles.border} shrink-0`}>
                      {insight.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{insight.message}</p>
                  
                  {insight.action && (
                    <div className="p-3 bg-white/80 rounded-xl mb-3">
                      <p className="text-xs font-bold text-gray-600 mb-1">💡 Recommended Action</p>
                      <p className="text-sm text-gray-800">{insight.action}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-semibold text-gray-600">Impact:</span>
                    <span className="text-xs text-gray-800">{insight.impact}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {insights.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Add transactions to get personalized insights</p>
        </div>
      )}
    </div>
  );
}