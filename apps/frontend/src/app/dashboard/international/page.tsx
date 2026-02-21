'use client';
import { Globe, DollarSign, TrendingUp, CreditCard, Building2, ArrowUpRight } from 'lucide-react';
export default function InternationalPage() {
  const services = [
    { title: 'Forex Exchange', desc: 'Live USD/INR, EUR/INR rates & converter', icon: DollarSign, color: 'blue', link: 'https://www.xe.com' },
    { title: 'International Transfers', desc: 'Send money abroad at best rates', icon: Globe, color: 'green', link: 'https://wise.com' },
    { title: 'Foreign Investments', desc: 'Invest in US stocks & global ETFs', icon: TrendingUp, color: 'purple', link: 'https://www.vested.co.in' },
    { title: 'Travel Card', desc: 'Zero forex markup travel cards', icon: CreditCard, color: 'orange', link: 'https://www.niyo.com' },
    { title: 'NRI Banking', desc: 'NRE/NRO account management', icon: Building2, color: 'cyan', link: 'https://www.sbi.co.in/web/nri' },
  ];
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600', green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600', orange: 'bg-orange-100 text-orange-600', cyan: 'bg-cyan-100 text-cyan-600',
  };
  const rates = [
    { pair: 'USD / INR', rate: '83.12', change: '+0.15%' },
    { pair: 'EUR / INR', rate: '89.45', change: '-0.08%' },
    { pair: 'GBP / INR', rate: '104.32', change: '+0.22%' },
    { pair: 'AED / INR', rate: '22.63', change: '+0.05%' },
  ];
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div><h1 className="text-3xl font-bold text-gray-900">International Finance</h1><p className="text-gray-500 text-sm mt-1">Manage your global money needs</p></div>
      <div className="grid gap-3 md:grid-cols-4">
        {rates.map((r, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm text-center">
            <p className="text-xs text-gray-500 mb-1">{r.pair}</p>
            <p className="text-2xl font-bold text-gray-900">{r.rate}</p>
            <p className={`text-xs font-semibold mt-1 ${r.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{r.change}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {services.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${colorMap[s.color]}`}><Icon className="w-6 h-6" /></div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{s.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
                </div>
              </div>
              <a href={s.link} target="_blank" rel="noopener noreferrer"
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-semibold">
                <ArrowUpRight className="w-4 h-4" />Explore
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
