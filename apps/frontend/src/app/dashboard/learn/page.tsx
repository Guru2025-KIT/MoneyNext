'use client';

import { useState } from 'react';
import { BookOpen, Target, PiggyBank, Shield, ChevronRight, ChevronDown, CheckCircle, Clock, ArrowLeft } from 'lucide-react';

const modules = [
  {
    id: 'budgeting',
    icon: BookOpen,
    color: 'blue',
    title: 'Budgeting Basics',
    description: 'Learn how to create and stick to a budget',
    duration: '10 min read',
    lessons: [
      {
        title: 'What is a Budget?',
        content: `A budget is a financial plan that helps you track your income and expenses. It tells your money where to go instead of wondering where it went.

**Why budgeting matters:**
- Gives you control over your finances
- Helps you save for goals
- Reduces financial stress
- Prevents overspending

**The 50/30/20 Rule:**
- 50% of income for Needs (rent, food, utilities)
- 30% for Wants (entertainment, dining out)
- 20% for Savings and debt repayment

**Getting Started:**
1. Calculate your monthly income
2. List all your fixed expenses (rent, EMI)
3. Track variable expenses (food, transport)
4. Set spending limits for each category
5. Review and adjust monthly`,
      },
      {
        title: 'Creating Your First Budget',
        content: `Follow these steps to create a realistic budget:

**Step 1: Know Your Income**
Add up all sources of income - salary, freelance work, side income.

**Step 2: List Fixed Expenses**
These are expenses that stay the same each month:
- Rent or home loan EMI
- Insurance premiums
- Loan repayments
- Subscriptions

**Step 3: Estimate Variable Expenses**
These change month to month:
- Groceries
- Utilities
- Transportation
- Entertainment

**Step 4: Set Savings Goals**
Pay yourself first - set aside savings before spending.

**Step 5: Track and Review**
Use MoneyNext to track daily and review weekly.`,
      },
      {
        title: 'Sticking to Your Budget',
        content: `Creating a budget is easy. Sticking to it is the challenge.

**Tips to Stay on Track:**
- Use the envelope method for cash spending
- Review your budget every Sunday
- Allow for occasional treats (build it in!)
- Track every expense, no matter how small
- Adjust when life changes

**Common Budget Mistakes:**
- Being too strict (leads to giving up)
- Forgetting irregular expenses (car service, festivals)
- Not having an emergency fund
- Not tracking small purchases

**Using MoneyNext:**
- Add transactions immediately after spending
- Set budget alerts for each category
- Review the spending breakdown chart weekly`,
      },
    ],
  },
  {
    id: 'goals',
    icon: Target,
    color: 'green',
    title: 'Setting Financial Goals',
    description: 'How to set and achieve your money goals',
    duration: '8 min read',
    lessons: [
      {
        title: 'Types of Financial Goals',
        content: `Financial goals give your money a purpose. Without goals, it is easy to spend everything.

**Short-term Goals (Under 1 year):**
- Build an emergency fund
- Pay off a small debt
- Save for a gadget or appliance
- Vacation fund

**Medium-term Goals (1-5 years):**
- Buy a vehicle
- Save for wedding expenses
- Higher education fund
- Home down payment

**Long-term Goals (5+ years):**
- Retirement corpus
- Children education fund
- Buy a house
- Financial independence

**SMART Goals:**
- Specific: "Save Rs 50,000" not "save money"
- Measurable: Track progress monthly
- Achievable: Realistic given your income
- Relevant: Matters to your life
- Time-bound: Set a deadline`,
      },
      {
        title: 'Prioritizing Your Goals',
        content: `You cannot do everything at once. Here is how to prioritize:

**Priority 1: Emergency Fund**
Before any other goal, build 3-6 months of expenses as emergency savings. This protects you from taking loans during crises.

**Priority 2: High-interest Debt**
Pay off credit card debt and personal loans. The interest you save is guaranteed return.

**Priority 3: Retirement Savings**
Start early. Even small amounts grow enormously over time due to compounding.

**Priority 4: Other Goals**
Once the above are handled, work on your personal goals.

**The Power of Compounding:**
Rs 1,000 per month at 12% annual return:
- After 10 years: Rs 2.3 lakh becomes Rs 23 lakh
- After 20 years: Rs 2.3 lakh invested becomes Rs 96 lakh

Start as early as possible!`,
      },
      {
        title: 'Tracking Goal Progress',
        content: `Tracking progress keeps you motivated and on course.

**How to Track Effectively:**
1. Break big goals into monthly milestones
2. Celebrate small wins
3. Review progress monthly
4. Adjust contribution amounts if needed

**Using MoneyNext Goals:**
- Create a goal with target amount and deadline
- Add contributions regularly
- Watch the progress bar fill up
- Get motivated by seeing how close you are

**When You Fall Behind:**
- Do not give up, just adjust
- Look for expenses to cut temporarily
- Consider increasing income
- Extend the deadline if truly necessary

**Automating Savings:**
Set up automatic transfers on salary day. You cannot spend what you do not see.`,
      },
    ],
  },
  {
    id: 'saving',
    icon: PiggyBank,
    color: 'purple',
    title: 'Saving Strategies',
    description: 'Simple ways to save more money every month',
    duration: '12 min read',
    lessons: [
      {
        title: 'The Psychology of Saving',
        content: `Saving money is more about behavior than math. Understanding why we overspend helps us save more.

**Why We Overspend:**
- Instant gratification vs future rewards
- Social pressure and lifestyle inflation
- Emotional spending (stress, boredom)
- Easy access to credit

**Mindset Shifts for Better Saving:**
- Think of saving as paying your future self
- Delay purchases by 48 hours before buying
- Unsubscribe from shopping emails and apps
- Avoid comparing lifestyle with others

**The Latte Factor:**
Small daily expenses add up dramatically:
- Rs 100 daily coffee = Rs 36,500 per year
- Rs 200 daily lunch out = Rs 73,000 per year
- Rs 500 monthly subscriptions = Rs 6,000 per year

Redirect even part of these to savings.`,
      },
      {
        title: 'Practical Saving Tips',
        content: `Here are proven strategies to save more starting today:

**Grocery and Food:**
- Plan meals for the week before shopping
- Buy in bulk for non-perishables
- Cook at home at least 5 days a week
- Avoid impulse buys at the store

**Utilities and Bills:**
- Switch off appliances when not in use
- Negotiate better rates for internet and phone
- Use LED bulbs throughout your home
- Fix leaking taps immediately

**Transportation:**
- Use public transport when possible
- Carpool with colleagues
- Walk or cycle for short distances
- Service your vehicle regularly to avoid big repairs

**Shopping:**
- Make a list and stick to it
- Wait for sales for big purchases
- Buy second-hand for items like furniture
- Compare prices before buying

**Entertainment:**
- Use free library resources
- Share streaming subscriptions
- Look for free local events
- Entertain at home instead of going out`,
      },
      {
        title: 'Building Saving Habits',
        content: `Good saving habits become automatic over time.

**The Pay Yourself First Method:**
Transfer savings on the day your salary arrives, before any spending. Treat it like a non-negotiable bill.

**The 30-Day Rule:**
For non-essential purchases over Rs 1,000, wait 30 days. If you still want it after 30 days, buy it. Most times the urge passes.

**Round-Up Saving:**
Round up every purchase and save the difference. If you spend Rs 85, save Rs 15. Small amounts add up.

**No-Spend Days:**
Challenge yourself to 2-3 no-spend days per week. Only buy absolute necessities.

**Saving Milestones:**
- First Rs 10,000 saved
- One month expenses saved
- Three months emergency fund
- Six months emergency fund
- First lakh saved

Celebrate each milestone. It builds momentum.`,
      },
    ],
  },
  {
    id: 'emergency',
    icon: Shield,
    color: 'orange',
    title: 'Emergency Fund',
    description: 'Why you need one and how to build it fast',
    duration: '7 min read',
    lessons: [
      {
        title: 'Why You Need an Emergency Fund',
        content: `An emergency fund is money set aside for unexpected expenses. It is the foundation of financial security.

**What Counts as an Emergency:**
- Job loss or reduced income
- Medical emergency
- Major home repair (roof leak, plumbing)
- Car breakdown
- Family crisis requiring travel

**What is NOT an Emergency:**
- Sale on items you want
- Vacation
- Planned expenses you forgot to budget for
- Upgrading gadgets

**How Much to Save:**
- Minimum: 1 month of expenses
- Good: 3 months of expenses
- Ideal: 6 months of expenses

If you have dependents, an irregular income, or work in an unstable industry, aim for 6+ months.

**The Cost of Not Having One:**
Without an emergency fund, any crisis becomes a debt crisis. A Rs 20,000 medical bill becomes a loan at 18-24% interest.`,
      },
      {
        title: 'Building Your Emergency Fund',
        content: `Building an emergency fund feels slow at first. Here is how to do it efficiently:

**Step 1: Calculate Your Target**
Monthly expenses x 3 = minimum emergency fund
Monthly expenses x 6 = ideal emergency fund

Include: rent, food, utilities, transport, insurance, loan payments.

**Step 2: Open a Separate Account**
Keep emergency fund separate from your spending account. A savings account in a different bank works well. Out of sight, out of mind.

**Step 3: Start Small**
Even Rs 500 per month is a start. As you cut expenses or earn more, increase the contribution.

**Step 4: Use Windfalls**
Bonus, tax refund, gifts - put 50% directly into the emergency fund.

**Step 5: Do Not Touch It**
Resist the temptation to "borrow" from it. It is for emergencies only.

**Fast-Track Strategies:**
- Sell unused items at home
- Take up freelance work temporarily
- Cut one major expense for 3 months
- Use a portion of every pay raise`,
      },
      {
        title: 'Managing and Using Your Emergency Fund',
        content: `Knowing when and how to use your emergency fund is just as important as building it.

**Rules for Using It:**
1. Is it unexpected? (not a planned expense)
2. Is it necessary? (health, housing, income)
3. Is it urgent? (cannot wait)

If yes to all three, use the fund.

**After Using It:**
- Immediately start rebuilding
- Treat replenishment like a debt payment
- Do not feel guilty, that is what it is for

**Where to Keep It:**
- High-interest savings account
- Liquid mutual funds (easy to withdraw)
- Fixed deposit with premature withdrawal option

Do NOT invest in stocks or long-term investments. Liquidity is more important than returns for emergency funds.

**Review Annually:**
Your expenses change over time. Recalculate your target every year and adjust accordingly.

Congratulations on completing the Emergency Fund module!`,
      },
    ],
  },
];

export default function LearnPage() {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<number>(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const currentModule = modules.find(m => m.id === activeModule);

  const markComplete = (moduleId: string, lessonIndex: number) => {
    setCompleted(prev => new Set([...prev, `${moduleId}-${lessonIndex}`]));
  };

  const isLessonComplete = (moduleId: string, lessonIndex: number) =>
    completed.has(`${moduleId}-${lessonIndex}`);

  const getModuleProgress = (moduleId: string) => {
    const mod = modules.find(m => m.id === moduleId);
    if (!mod) return 0;
    const completedCount = mod.lessons.filter((_, i) => isLessonComplete(moduleId, i)).length;
    return Math.round((completedCount / mod.lessons.length) * 100);
  };

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600 border-blue-200',
    green: 'bg-green-100 text-green-600 border-green-200',
    purple: 'bg-purple-100 text-purple-600 border-purple-200',
    orange: 'bg-orange-100 text-orange-600 border-orange-200',
  };

  const progressColorMap: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  if (activeModule && currentModule) {
    const lesson = currentModule.lessons[activeLesson];
    const Icon = currentModule.icon;
    const progress = getModuleProgress(activeModule);

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => setActiveModule(null)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Modules
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className={`p-6 bg-gradient-to-r ${
            currentModule.color === 'blue' ? 'from-blue-600 to-cyan-600' :
            currentModule.color === 'green' ? 'from-green-600 to-emerald-600' :
            currentModule.color === 'purple' ? 'from-purple-600 to-pink-600' :
            'from-orange-600 to-amber-600'
          } text-white`}>
            <div className="flex items-center gap-3 mb-2">
              <Icon className="w-7 h-7" />
              <h1 className="text-2xl font-bold">{currentModule.title}</h1>
            </div>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex-1 h-2 bg-white/30 rounded-full">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-semibold">{progress}% Complete</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="p-4 space-y-2">
              {currentModule.lessons.map((l, i) => (
                <button
                  key={i}
                  onClick={() => setActiveLesson(i)}
                  className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition ${
                    activeLesson === i ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isLessonComplete(activeModule, i) ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {isLessonComplete(activeModule, i)
                      ? <CheckCircle className="w-4 h-4 text-green-600" />
                      : <span className="text-xs font-bold text-gray-500">{i + 1}</span>
                    }
                  </div>
                  <span className={`text-sm font-medium ${activeLesson === i ? 'text-blue-700' : 'text-gray-700'}`}>
                    {l.title}
                  </span>
                </button>
              ))}
            </div>

            <div className="md:col-span-2 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{lesson.title}</h2>
              <div className="prose prose-sm max-w-none text-gray-700 space-y-3">
                {lesson.content.split('\n\n').map((para, i) => {
                  if (para.startsWith('**') && para.endsWith('**')) {
                    return <h3 key={i} className="font-bold text-gray-900 text-base mt-4">{para.replace(/\*\*/g, '')}</h3>;
                  }
                  if (para.includes('\n-')) {
                    const lines = para.split('\n');
                    return (
                      <div key={i}>
                        {lines[0].startsWith('**') && <h3 className="font-bold text-gray-900 text-base mb-2">{lines[0].replace(/\*\*/g, '')}</h3>}
                        <ul className="space-y-1.5 ml-4">
                          {lines.slice(lines[0].startsWith('**') ? 1 : 0).filter(l => l.startsWith('-')).map((item, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                              <span>{item.replace('- ', '').replace(/\*\*/g, '')}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  }
                  if (para.includes('\n1.')) {
                    const lines = para.split('\n');
                    return (
                      <div key={i}>
                        {lines[0].startsWith('**') && <h3 className="font-bold text-gray-900 text-base mb-2">{lines[0].replace(/\*\*/g, '')}</h3>}
                        <ol className="space-y-1.5 ml-4 list-decimal">
                          {lines.slice(1).filter(l => l.match(/^\d+\./)).map((item, j) => (
                            <li key={j} className="text-sm ml-4">{item.replace(/^\d+\.\s/, '').replace(/\*\*/g, '')}</li>
                          ))}
                        </ol>
                      </div>
                    );
                  }
                  return <p key={i} className="text-sm leading-relaxed">{para.replace(/\*\*/g, '')}</p>;
                })}
              </div>

              <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setActiveLesson(Math.max(0, activeLesson - 1))}
                  disabled={activeLesson === 0}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Previous
                </button>

                {!isLessonComplete(activeModule, activeLesson) && (
                  <button
                    onClick={() => markComplete(activeModule, activeLesson)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-semibold flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Complete
                  </button>
                )}

                {isLessonComplete(activeModule, activeLesson) && (
                  <span className="flex items-center gap-2 text-green-600 font-semibold text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Completed!
                  </span>
                )}

                <button
                  onClick={() => {
                    markComplete(activeModule, activeLesson);
                    if (activeLesson < currentModule.lessons.length - 1) {
                      setActiveLesson(activeLesson + 1);
                    }
                  }}
                  disabled={activeLesson === currentModule.lessons.length - 1}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed text-sm font-semibold"
                >
                  Next Lesson
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Financial Education</h1>
        <p className="text-gray-600 mt-1">Build your financial knowledge step by step</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {modules.map((module) => {
          const Icon = module.icon;
          const progress = getModuleProgress(module.id);

          return (
            <div
              key={module.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition cursor-pointer group"
              onClick={() => { setActiveModule(module.id); setActiveLesson(0); }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl border ${colorMap[module.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Clock className="w-4 h-4" />
                  {module.duration}
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">{module.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{module.description}</p>

              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{module.lessons.length} lessons</span>
                  <span>{progress}% complete</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${progressColorMap[module.color]}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <button className={`w-full py-2.5 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 group-hover:gap-3 ${
                progress === 100
                  ? 'bg-green-50 text-green-600 border border-green-200'
                  : progress > 0
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}>
                {progress === 100 ? 'Review Module' : progress > 0 ? 'Continue Learning' : 'Start Learning'}
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <h3 className="text-xl font-bold mb-2">Your Learning Progress</h3>
        <div className="grid grid-cols-4 gap-4 mt-4">
          {modules.map(m => {
            const prog = getModuleProgress(m.id);
            const Icon = m.icon;
            return (
              <div key={m.id} className="text-center">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-xs opacity-80 mb-1">{m.title.split(' ')[0]}</p>
                <p className="font-bold">{prog}%</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}