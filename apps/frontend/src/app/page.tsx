'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, CheckCircle, Star, Users, Shield, TrendingUp, 
  Smartphone, Heart, PiggyBank, Target, BarChart3, Menu, X, 
  Zap, Award, Lock, ChevronRight, Globe, MessageSquare,
  Receipt, Mic, Calculator, CreditCard, TrendingDown, DollarSign,
  FileText, Briefcase
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTier, setActiveTier] = useState<'low' | 'middle' | 'high'>('middle');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      window.location.href = '/signup';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo with white background */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-lg p-2 border-2 border-gray-200 shadow-sm">
                <Image 
                  src="/logo.png" 
                  alt="MoneyNext Logo" 
                  width={32} 
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                MoneyNext
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('features')} className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                Features
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                How It Works
              </button>
              <button onClick={() => scrollToSection('pricing')} className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                Pricing
              </button>
              <button onClick={() => scrollToSection('testimonials')} className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                Reviews
              </button>
              <Link href="/login" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                Sign In
              </Link>
              <Link href="/signup" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all">
                Get Started Free
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white absolute w-full shadow-lg">
            <div className="px-4 py-4 space-y-4">
              <button 
                onClick={() => scrollToSection('features')} 
                className="block w-full text-left text-gray-700 hover:text-gray-900 font-medium py-2"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')} 
                className="block w-full text-left text-gray-700 hover:text-gray-900 font-medium py-2"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('pricing')} 
                className="block w-full text-left text-gray-700 hover:text-gray-900 font-medium py-2"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')} 
                className="block w-full text-left text-gray-700 hover:text-gray-900 font-medium py-2"
              >
                Reviews
              </button>
              <Link href="/login" className="block text-gray-700 hover:text-gray-900 font-medium py-2">
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-semibold shadow-md"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-blue-50 via-white to-emerald-50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mt-8">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold animate-pulse">
                <Zap className="w-4 h-4" />
                India's First Income-Adaptive Finance Platform
              </div>
              
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Financial Wellness for{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                    Every Indian
                  </span>
                </h1>
                
                <p className="text-2xl text-gray-700 font-medium">
                  From Daily Wages to Wealth Management
                </p>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  Whether you earn ₹20,000 or ₹2,00,000 monthly, get a completely personalized money management experience built for your income level.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/signup" 
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  Start Free Today
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button 
                  onClick={() => scrollToSection('how-it-works')} 
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold text-lg hover:border-gray-400 hover:bg-gray-50 transition-all"
                >
                  See How It Works
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>Free for low-income users</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>No credit card needed</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>Bank-level security</span>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-white rounded-full p-2.5 border-2 border-gray-200 shadow-sm">
                      <Image 
                        src="/logo.png" 
                        alt="MoneyNext" 
                        width={36} 
                        height={36}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Net Worth</div>
                      <div className="text-2xl font-bold text-gray-900">₹4,52,340</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 font-medium">This Month</div>
                    <div className="text-lg font-bold text-emerald-600">+₹15,230</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                    <div className="flex items-center gap-3">
                      <PiggyBank className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-semibold text-gray-700">Emergency Fund</span>
                    </div>
                    <span className="text-sm font-bold text-emerald-700">₹45,000</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-semibold text-gray-700">Vacation Savings</span>
                    </div>
                    <span className="text-sm font-bold text-blue-700">₹28,340</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-semibold text-gray-700">Investment Portfolio</span>
                    </div>
                    <span className="text-sm font-bold text-purple-700">₹3,79,000</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Budget Used: 68%</span>
                    <span className="text-emerald-600 font-semibold">On Track! 🎯</span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-[68%] bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-gradient-to-r from-blue-200 to-emerald-200 rounded-full blur-3xl opacity-40 -z-10"></div>
              <div className="absolute -top-6 -left-6 w-72 h-72 bg-gradient-to-r from-emerald-200 to-blue-200 rounded-full blur-3xl opacity-40 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10,000+', label: 'Active Users' },
              { value: '₹50Cr+', label: 'Money Managed' },
              { value: '4.8★', label: 'User Rating' },
              { value: '100%', label: 'Secure' },
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features by Tier */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              One App, Three Experiences
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              MoneyNext adapts to your income level, showing features that actually matter for your financial situation
            </p>
          </div>

          {/* Tier Tabs */}
          <div className="flex justify-center gap-2 mb-12 flex-wrap">
            {[
              { id: 'low' as const, label: 'Low Income', subtitle: 'Under ₹30k/month', color: 'emerald' },
              { id: 'middle' as const, label: 'Middle Income', subtitle: '₹30k - ₹1L/month', color: 'blue' },
              { id: 'high' as const, label: 'High Income', subtitle: 'Above ₹1L/month', color: 'purple' },
            ].map((tier) => (
              <button
                key={tier.id}
                onClick={() => setActiveTier(tier.id)}
                className={`px-6 py-4 rounded-xl font-semibold transition-all ${
                  activeTier === tier.id
                    ? tier.color === 'emerald'
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : tier.color === 'blue'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="text-sm md:text-base">{tier.label}</div>
                <div className="text-xs opacity-90">{tier.subtitle}</div>
              </button>
            ))}
          </div>

          {/* Tier Content */}
          {activeTier === 'low' && (
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <h3 className="text-3xl font-bold text-gray-900">Built for Daily Wage Earners</h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Simple tools to help you save small amounts consistently and track cash expenses easily
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: PiggyBank, title: 'Micro Savings', desc: 'Save ₹10/day with fun challenges that make saving a habit' },
                  { icon: Mic, title: 'Voice Expense', desc: 'Speak in Hindi: "Bees rupay chai" - Automatically logged!' },
                  { icon: MessageSquare, title: 'SMS Auto-Capture', desc: 'Bank messages automatically become expense entries' },
                  { icon: Shield, title: 'Daily Spending Limit', desc: 'Set ₹200/day cap and get alerts before you overspend' },
                  { icon: Target, title: 'No-Spend Challenges', desc: 'Gamified saving: "No chai week" = Save ₹350!' },
                  { icon: Award, title: 'Govt Schemes', desc: 'Check eligibility for PM-KISAN, Ayushman Bharat & more' },
                ].map((feature, i) => (
                  <div key={i} className="p-6 bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-200 rounded-2xl hover:shadow-xl transition-shadow">
                    <feature.icon className="w-12 h-12 text-emerald-600 mb-4" />
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h4>
                    <p className="text-gray-600">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTier === 'middle' && (
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <h3 className="text-3xl font-bold text-gray-900">Smart Planning for Salaried Professionals</h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Optimize debt, plan retirement, and make informed financial decisions
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: Calculator, title: 'EMI Optimizer', desc: 'See true cost of loans. That ₹5L car loan? Actually ₹7.2L!' },
                  { icon: CreditCard, title: 'Credit Score Simulator', desc: 'What-if scenarios: Pay off card = +45 points, Miss EMI = -80' },
                  { icon: TrendingUp, title: 'Retirement Planner', desc: 'Will your ₹10k/month SIP give you ₹2Cr at 60? Find out!' },
                  { icon: TrendingDown, title: 'Tax Harvesting', desc: 'Offset gains with losses. Save ₹25k in taxes this year' },
                  { icon: Briefcase, title: 'Debt Payoff Plan', desc: 'Pay highest interest first. Clear ₹3L debt 2 years faster' },
                  { icon: Receipt, title: 'Subscription Tracker', desc: 'Netflix, Prime, Spotify = ₹2,400/month. Worth it?' },
                ].map((feature, i) => (
                  <div key={i} className="p-6 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-2xl hover:shadow-xl transition-shadow">
                    <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h4>
                    <p className="text-gray-600">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTier === 'high' && (
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <h3 className="text-3xl font-bold text-gray-900">Wealth Management for Entrepreneurs</h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Consolidate assets, plan succession, and optimize taxes across holdings
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: FileText, title: 'Estate Planning', desc: 'Track ₹5Cr across properties, stocks, business - Assign nominees' },
                  { icon: Globe, title: 'Multi-Account Tracker', desc: 'All bank accounts, mutual funds, stocks in one dashboard' },
                  { icon: Heart, title: 'Charitable Giving', desc: 'Donate ₹1L to 80G NGO = Save ₹30k in taxes. Track it!' },
                  { icon: Lock, title: 'Nominee Management', desc: 'Ensure family knows about all assets. Update every 5 years' },
                  { icon: BarChart3, title: 'Net Worth Dashboard', desc: 'Consolidated view: Real estate + Investments + Business value' },
                  { icon: DollarSign, title: 'Tax Optimizer', desc: 'Section 80C, 80D, 80G - Maximize deductions legally' },
                ].map((feature, i) => (
                  <div key={i} className="p-6 bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 rounded-2xl hover:shadow-xl transition-shadow">
                    <feature.icon className="w-12 h-12 text-purple-600 mb-4" />
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h4>
                    <p className="text-gray-600">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From signup to financial insights in under 5 minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Sign Up & Tell Us Your Income',
                desc: 'Create account in 30 seconds. We ask your monthly income to personalize your experience - that\'s it!',
                icon: Users,
              },
              {
                step: '2',
                title: 'Connect Your Bank SMS',
                desc: 'Grant permission to read bank SMSes. We automatically log your expenses - no manual entry needed.',
                icon: Smartphone,
              },
              {
                step: '3',
                title: 'Get Personalized Insights',
                desc: 'See your custom dashboard with features built for YOUR income level. Start saving smarter today!',
                icon: TrendingUp,
              },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-2xl transition-all h-full">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6">
                    {step.step}
                  </div>
                  <step.icon className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Pricing That Makes Sense
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Pay based on what you earn. Free for those who need it most.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Low Income',
                price: '₹0',
                period: 'Forever Free',
                desc: 'For earners under ₹30,000/month',
                features: [
                  'Micro savings challenges',
                  'Voice expense in Hindi',
                  'SMS auto-capture',
                  'Government scheme checker',
                  'Basic budgeting tools',
                  'Community support',
                ],
                cta: 'Start Free',
                popular: false,
                color: 'emerald',
              },
              {
                name: 'Middle Income',
                price: '₹99',
                period: 'per month',
                desc: 'For earners ₹30k-₹1L/month',
                features: [
                  'Everything in Free, plus:',
                  'EMI optimizer & calculators',
                  'Credit score simulator',
                  'Retirement planner',
                  'Tax loss harvesting',
                  'Debt payoff strategies',
                  'Priority support',
                ],
                cta: 'Try Free for 3 Months',
                popular: true,
                color: 'blue',
              },
              {
                name: 'High Income',
                price: '₹499',
                period: 'per month',
                desc: 'For earners above ₹1L/month',
                features: [
                  'Everything in Standard, plus:',
                  'Estate planning dashboard',
                  'Multi-account consolidation',
                  'Charitable giving optimizer',
                  'Nominee management',
                  'Tax planning tools',
                  'Dedicated support',
                ],
                cta: 'Start Free Trial',
                popular: false,
                color: 'purple',
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative p-8 rounded-2xl border-2 hover:shadow-2xl transition-all ${
                  plan.popular
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-white scale-105'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-1 bg-blue-600 text-white text-sm font-bold rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.price !== '₹0' && <span className="text-gray-600 ml-2">{plan.period}</span>}
                    {plan.price === '₹0' && <span className="text-emerald-600 ml-2 font-semibold">{plan.period}</span>}
                  </div>
                  <p className="text-gray-600">{plan.desc}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        plan.color === 'emerald' ? 'text-emerald-600' :
                        plan.color === 'blue' ? 'text-blue-600' : 'text-purple-600'
                      }`} />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  className={`block w-full text-center px-6 py-3 rounded-lg font-bold transition-all ${
                    plan.color === 'emerald'
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : plan.color === 'blue'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Loved by Indians Across Income Levels
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from real users
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Ramesh Kumar',
                role: 'Delivery Partner, Mumbai',
                income: 'Low Income User',
                text: 'Finally an app that doesn\'t make me feel poor! The ₹10/day savings challenge helped me save ₹3,000 in 3 months. Voice expense in Hindi is super easy!',
                rating: 5,
                avatar: '👨‍🔧',
              },
              {
                name: 'Priya Sharma',
                role: 'Software Engineer, Bangalore',
                income: 'Middle Income User',
                text: 'The EMI calculator showed me I was paying ₹2.4L extra in interest! Cleared my loans 2 years faster using the debt payoff planner. Worth every rupee!',
                rating: 5,
                avatar: '👩‍💻',
              },
              {
                name: 'Vikram Patel',
                role: 'Business Owner, Pune',
                income: 'High Income User',
                text: 'Estate planning feature helped me organize ₹5Cr across accounts. My family now knows exactly where everything is. Best investment in peace of mind.',
                rating: 5,
                avatar: '👨‍💼',
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">{testimonial.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-xs text-blue-600 font-semibold">{testimonial.income}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Ready to Take Control of Your Money?
          </h2>
          <p className="text-xl text-white/90">
            Join 10,000+ Indians already managing their finances smarter with MoneyNext
          </p>
          <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="px-6 py-4 rounded-lg text-lg w-full sm:w-96 focus:outline-none focus:ring-4 focus:ring-white/50"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all whitespace-nowrap"
            >
              Get Started Free
            </button>
          </form>
          <p className="text-white/80 text-sm">
            No credit card required • Free for low-income users • 3-month free trial for middle-income
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                {/* Logo with white background and padding */}
                <div className="w-16 h-16 bg-white rounded-xl p-3 shadow-lg">
                  <Image 
                    src="/logo.png" 
                    alt="MoneyNext Logo" 
                    width={40} 
                    height={40}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xl font-bold">MoneyNext</span>
              </div>
              <p className="text-gray-400">
                Financial wellness for every Indian, from daily wages to wealth management.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors">Pricing</button></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><Link href="/signup" className="hover:text-white transition-colors">Get Started</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => scrollToSection('testimonials')} className="hover:text-white transition-colors">About Us</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors">How It Works</button></li>
                <li><Link href="/login/signup" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/login/signup" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button 
                    onClick={() => alert('Privacy Policy: MoneyNext respects your privacy. We encrypt all data and never share your information with third parties.')} 
                    className="hover:text-white transition-colors text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => alert('Terms of Service: By using MoneyNext, you agree to our terms. We provide financial tools but are not financial advisors.')} 
                    className="hover:text-white transition-colors text-left"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => alert('Security: We use bank-level encryption (AES-256) to protect your data. Your information is stored securely with regular backups.')} 
                    className="hover:text-white transition-colors text-left"
                  >
                    Security
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2026 MoneyNext. Made with ❤️ for India. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
