'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(true); // ALWAYS START TRUE
  const [accepted, setAccepted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Check if accepted in THIS PAGE VIEW
    const pageAccepted = sessionStorage.getItem('disclaimer-page-' + window.location.pathname);
    
    if (pageAccepted === 'true') {
      setIsOpen(false);
    } else {
      // Force show
      setTimeout(() => {
        setIsOpen(true);
        console.log('DISCLAIMER SHOWING FOR:', window.location.pathname);
      }, 300);
    }
  }, [mounted]);

  const handleAccept = () => {
    if (!accepted) {
      alert('⚠️ You MUST check the acknowledgment box to continue');
      return;
    }
    
    // Store acceptance for THIS PAGE only
    sessionStorage.setItem('disclaimer-page-' + window.location.pathname, 'true');
    setIsOpen(false);
  };

  if (!mounted || !isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.90)',
        backdropFilter: 'blur(10px)'
      }}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 rounded-t-2xl text-white sticky top-0 z-10 shadow-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-8 h-8 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <h2 className="text-2xl font-bold mb-1">⚠️ MANDATORY LEGAL DISCLAIMER</h2>
              <p className="text-sm text-red-100">You MUST read and accept before using MoneyNext</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* What we do */}
          <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-blue-900 mb-2 text-lg">✓ What MoneyNext Does</h3>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>Track your income, expenses, and accounts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>Provide calculators and visualization tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>Suggest general financial best practices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>Help organize your financial data</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* What we DON'T do */}
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <XCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-900 mb-2 text-lg">✗ What MoneyNext Does NOT Do</h3>
                <ul className="text-sm text-red-800 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-0.5">✗</span>
                    <span><strong className="text-red-900">NOT personalized financial advice</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-0.5">✗</span>
                    <span><strong className="text-red-900">NOT investment recommendations</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-0.5">✗</span>
                    <span><strong className="text-red-900">NOT tax filing or legal advice</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-0.5">✗</span>
                    <span><strong className="text-red-900">NOT a replacement for professionals</strong></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Key Points */}
          <div className="space-y-3 text-sm text-gray-700 bg-yellow-50 border-2 border-yellow-300 rounded-xl p-5">
            <h3 className="font-bold text-yellow-900 text-base mb-3">⚠️ Critical Information:</h3>
            <div className="space-y-3">
              <div>
                <p className="font-bold text-gray-900 mb-1">1. Not Financial Advice</p>
                <p className="text-gray-700">MoneyNext provides general information only. This is NOT personalized financial, investment, tax, or legal advice.</p>
              </div>
              <div>
                <p className="font-bold text-gray-900 mb-1">2. Your Responsibility</p>
                <p className="text-gray-700">You are solely responsible for all financial decisions you make. Always verify with qualified professionals.</p>
              </div>
              <div>
                <p className="font-bold text-gray-900 mb-1">3. Consult Professionals</p>
                <p className="text-gray-700">For specific advice: CA for tax, SEBI-registered advisor for investments, licensed agent for insurance.</p>
              </div>
              <div>
                <p className="font-bold text-gray-900 mb-1">4. No Guarantees</p>
                <p className="text-gray-700">All projections are estimates. Actual results may vary. We make no accuracy guarantees.</p>
              </div>
            </div>
          </div>

          {/* Acceptance Checkbox */}
          <div className="border-4 border-red-500 rounded-xl p-5 bg-red-50 shadow-lg">
            <label className="flex items-start gap-4 cursor-pointer group">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-1.5 w-7 h-7 text-red-600 border-3 border-red-400 rounded focus:ring-4 focus:ring-red-500 cursor-pointer"
              />
              <span className="text-sm text-gray-800 leading-relaxed">
                <strong className="text-red-900 text-lg block mb-2">✓ I UNDERSTAND AND ACKNOWLEDGE:</strong>
                <span className="block text-base">
                  MoneyNext is an <strong className="text-red-900">informational tool only</strong>, NOT financial advice. 
                  I will consult qualified professionals for personalized guidance and am 
                  <strong className="text-red-900"> solely responsible</strong> for my financial decisions.
                </span>
              </span>
            </label>
          </div>

          {/* Accept Button */}
          <button
            onClick={handleAccept}
            disabled={!accepted}
            className={`w-full py-5 rounded-xl font-bold text-xl transition-all transform ${
              accepted 
                ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer shadow-lg hover:scale-105 active:scale-95' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {accepted ? '✓ I UNDERSTAND - Continue to Dashboard' : '⚠️ You MUST check the box above to continue'}
          </button>

          <p className="text-xs text-center text-gray-500 mt-4 bg-gray-100 p-3 rounded-lg">
            <strong>Note:</strong> This disclaimer will appear on every dashboard page to ensure you remain aware of MoneyNext's limitations. It will hide once you accept on each specific page.
          </p>
        </div>
      </div>
    </div>
  );
}
