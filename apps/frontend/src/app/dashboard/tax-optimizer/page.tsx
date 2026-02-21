'use client';

import { Award } from 'lucide-react';

export default function ComingSoonPage() {
  const pageName = window.location.pathname.split('/').pop()?.replace(/-/g, ' ') || 'Feature';
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Award className="w-10 h-10 text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3 capitalize">{pageName}</h1>
        <p className="text-lg text-gray-600 mb-6">This premium feature is coming soon!</p>
        <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium">
          Available for Premium Members
        </div>
      </div>
    </div>
  );
}
