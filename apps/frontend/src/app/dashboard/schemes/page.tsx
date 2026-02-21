'use client';

import { useState } from 'react';
import { Search, ExternalLink, CheckCircle, IndianRupee, Users, Home, GraduationCap, Heart, Briefcase, ChevronDown, ChevronUp, X } from 'lucide-react';

const schemes = [
  {
    id: 1,
    name: 'PM Jan Dhan Yojana',
    category: 'Banking',
    icon: IndianRupee,
    color: 'blue',
    description: 'Financial inclusion program providing bank accounts, insurance, and credit to unbanked households.',
    benefits: ['Zero balance savings account', 'RuPay debit card', 'Rs 1 lakh accident insurance', 'Rs 30,000 life insurance', 'Overdraft facility up to Rs 10,000'],
    eligibility: 'Any Indian citizen without a bank account',
    howToApply: 'Visit any nationalized bank or post office with Aadhaar card and a passport photo.',
    link: 'https://pmjdy.gov.in',
    tags: ['banking', 'savings', 'insurance'],
  },
  {
    id: 2,
    name: 'PM Kisan Samman Nidhi',
    category: 'Agriculture',
    icon: Home,
    color: 'green',
    description: 'Direct income support of Rs 6,000 per year to small and marginal farmers.',
    benefits: ['Rs 6,000 per year in 3 installments', 'Direct bank transfer', 'No middlemen', 'All small farmers eligible'],
    eligibility: 'Small and marginal farmers with land up to 2 hectares',
    howToApply: 'Register on pmkisan.gov.in or visit your nearest Common Service Centre (CSC).',
    link: 'https://pmkisan.gov.in',
    tags: ['agriculture', 'farmers', 'income'],
  },
  {
    id: 3,
    name: 'Ayushman Bharat (PMJAY)',
    category: 'Health',
    icon: Heart,
    color: 'red',
    description: 'Health insurance coverage of Rs 5 lakh per family per year for secondary and tertiary care.',
    benefits: ['Rs 5 lakh health cover per family', 'Cashless treatment at empanelled hospitals', 'Covers pre-existing diseases', 'No premium for beneficiaries', 'Pan-India portability'],
    eligibility: 'Families identified in SECC 2011 database, poor and vulnerable families',
    howToApply: 'Check eligibility at pmjay.gov.in or visit nearest Ayushman Bharat Arogya Mitra.',
    link: 'https://pmjay.gov.in',
    tags: ['health', 'insurance', 'medical'],
  },
  {
    id: 4,
    name: 'PM Awas Yojana (Urban)',
    category: 'Housing',
    icon: Home,
    color: 'purple',
    description: 'Housing for All mission providing affordable housing to urban poor by 2024.',
    benefits: ['Interest subsidy up to Rs 2.67 lakh', 'Subsidy on home loans', 'Women ownership encouraged', 'EWS/LIG families prioritized'],
    eligibility: 'EWS (income up to Rs 3L), LIG (Rs 3-6L), MIG-I (Rs 6-12L), MIG-II (Rs 12-18L)',
    howToApply: 'Apply online at pmaymis.gov.in or visit nearest housing board office.',
    link: 'https://pmaymis.gov.in',
    tags: ['housing', 'home loan', 'subsidy'],
  },
  {
    id: 5,
    name: 'PM Mudra Yojana',
    category: 'Business',
    icon: Briefcase,
    color: 'orange',
    description: 'Loans up to Rs 10 lakh for small businesses and entrepreneurs without collateral.',
    benefits: ['Shishu: Loans up to Rs 50,000', 'Kishore: Rs 50,000 to Rs 5 lakh', 'Tarun: Rs 5 lakh to Rs 10 lakh', 'No collateral required', 'Low interest rates'],
    eligibility: 'Any Indian citizen with a business plan for non-farm income generating activities',
    howToApply: 'Apply at any public/private sector bank, MFI, or NBFC with business plan and documents.',
    link: 'https://mudra.org.in',
    tags: ['business', 'loan', 'entrepreneur'],
  },
  {
    id: 6,
    name: 'National Scholarship Portal',
    category: 'Education',
    icon: GraduationCap,
    color: 'indigo',
    description: 'One-stop platform for various government scholarships for students from Class 1 to PhD.',
    benefits: ['Pre-matric scholarships', 'Post-matric scholarships', 'Merit-cum-means scholarships', 'Direct bank transfer', 'Multiple scholarship schemes'],
    eligibility: 'Students from economically weaker sections, minorities, SC/ST/OBC categories',
    howToApply: 'Register at scholarships.gov.in and apply for eligible schemes before deadline.',
    link: 'https://scholarships.gov.in',
    tags: ['education', 'scholarship', 'students'],
  },
  {
    id: 7,
    name: 'Atal Pension Yojana',
    category: 'Pension',
    icon: Users,
    color: 'teal',
    description: 'Pension scheme for unorganized sector workers guaranteeing monthly pension of Rs 1,000-5,000.',
    benefits: ['Guaranteed pension Rs 1,000-5,000/month', 'Government co-contribution for 5 years', 'Tax benefits under 80CCD', 'Spouse also covered', 'Nominee benefit on death'],
    eligibility: 'Indian citizens aged 18-40 years with a savings bank account',
    howToApply: 'Visit your bank or post office or apply through net banking.',
    link: 'https://npscra.nsdl.co.in',
    tags: ['pension', 'retirement', 'savings'],
  },
  {
    id: 8,
    name: 'PM Suraksha Bima Yojana',
    category: 'Insurance',
    icon: CheckCircle,
    color: 'cyan',
    description: 'Accident insurance scheme offering Rs 2 lakh cover at just Rs 20 per year premium.',
    benefits: ['Rs 2 lakh accidental death cover', 'Rs 1 lakh partial disability cover', 'Only Rs 20/year premium', 'Auto-debit from bank account', 'Age 18-70 eligible'],
    eligibility: 'Bank account holders aged 18-70 years',
    howToApply: 'Enable through your bank account, net banking, or bank branch.',
    link: 'https://jansuraksha.gov.in',
    tags: ['insurance', 'accident', 'affordable'],
  },
];

const categories = ['All', 'Banking', 'Agriculture', 'Health', 'Housing', 'Business', 'Education', 'Pension', 'Insurance'];

const colorMap: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  red: 'bg-red-100 text-red-600',
  purple: 'bg-purple-100 text-purple-600',
  orange: 'bg-orange-100 text-orange-600',
  indigo: 'bg-indigo-100 text-indigo-600',
  teal: 'bg-teal-100 text-teal-600',
  cyan: 'bg-cyan-100 text-cyan-600',
};

export default function SchemesPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedScheme, setSelectedScheme] = useState<typeof schemes[0] | null>(null);

  const filtered = schemes.filter(s => {
    const matchesSearch = search === '' ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Detail Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className={`p-6 rounded-t-2xl bg-gradient-to-r ${
              selectedScheme.color === 'blue' ? 'from-blue-600 to-blue-700' :
              selectedScheme.color === 'green' ? 'from-green-600 to-green-700' :
              selectedScheme.color === 'red' ? 'from-red-600 to-red-700' :
              selectedScheme.color === 'purple' ? 'from-purple-600 to-purple-700' :
              selectedScheme.color === 'orange' ? 'from-orange-600 to-orange-700' :
              'from-indigo-600 to-indigo-700'
            } text-white`}>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full mb-2 inline-block">
                    {selectedScheme.category}
                  </span>
                  <h2 className="text-2xl font-bold mt-1">{selectedScheme.name}</h2>
                  <p className="text-sm opacity-90 mt-2">{selectedScheme.description}</p>
                </div>
                <button onClick={() => setSelectedScheme(null)} className="p-2 hover:bg-white/20 rounded-lg transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Key Benefits
                </h3>
                <ul className="space-y-2">
                  {selectedScheme.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-2">Who Can Apply?</h3>
                <p className="text-sm text-gray-700">{selectedScheme.eligibility}</p>
              </div>

              <div className="p-4 bg-green-50 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-2">How to Apply</h3>
                <p className="text-sm text-gray-700">{selectedScheme.howToApply}</p>
              </div>

              <a
                href={selectedScheme.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                <ExternalLink className="w-5 h-5" />
                Apply on Official Website
              </a>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Government Schemes</h1>
        <p className="text-gray-600 mt-1">Explore government benefits you may qualify for</p>
      </div>

      {/* Search Bar - Working */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search schemes by name, category, or keyword..."
          className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
          suppressHydrationWarning
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2">
            <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Category Filter - Working */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500">
        Showing {filtered.length} of {schemes.length} schemes
        {search && ` for "${search}"`}
        {selectedCategory !== 'All' && ` in ${selectedCategory}`}
      </p>

      {/* Schemes Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filtered.length > 0 ? filtered.map((scheme) => {
          const Icon = scheme.icon;
          const isExpanded = expandedId === scheme.id;

          return (
            <div key={scheme.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
              <div className="p-6">
                <div className="flex items-start gap-4 mb-3">
                  <div className={`p-3 rounded-xl ${colorMap[scheme.color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {scheme.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900">{scheme.name}</h3>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{scheme.description}</p>

                {/* Quick Benefits Preview */}
                <div className="space-y-1 mb-4">
                  {scheme.benefits.slice(0, 2).map((b, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      {b}
                    </div>
                  ))}
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                    <div>
                      <h4 className="text-xs font-bold text-gray-700 mb-2">ALL BENEFITS</h4>
                      <ul className="space-y-1">
                        {scheme.benefits.map((b, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="text-xs font-bold text-gray-700 mb-1">ELIGIBILITY</h4>
                      <p className="text-xs text-gray-600">{scheme.eligibility}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="text-xs font-bold text-gray-700 mb-1">HOW TO APPLY</h4>
                      <p className="text-xs text-gray-600">{scheme.howToApply}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons - Both Working */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : scheme.id)}
                    className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm font-medium flex items-center justify-center gap-1"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    {isExpanded ? 'Show Less' : 'Learn More'}
                  </button>
                  <button
                    onClick={() => setSelectedScheme(scheme)}
                    className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm font-semibold flex items-center justify-center gap-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="col-span-2 text-center py-16 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No schemes found</p>
            <p className="text-sm mt-1">Try a different search term or category</p>
            <button
              onClick={() => { setSearch(''); setSelectedCategory('All'); }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}