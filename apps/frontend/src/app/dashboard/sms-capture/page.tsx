'use client';

import { useState, useEffect, useCallback } from 'react';
import { transactionsApi } from '@/lib/api/transactions';
import { accountsApi } from '@/lib/api/accounts';
import { formatCurrency } from '@/lib/utils';
import { MessageSquare, CheckCircle, X, Plus, RefreshCw, AlertCircle, Sparkles, Filter, ChevronRight, Inbox } from 'lucide-react';

const SAMPLE_SMS = [
  { id:'s1', from:'HDFCBK', text:'Dear Customer, Rs.2,450.00 debited from A/c XX1234 on 14-Feb-25 at AMAZON INDIA. Avl Bal Rs.45,230.00', time:'2h ago' },
  { id:'s2', from:'SBIBNK', text:'Your SBI A/c XXXXXX6789 is credited with INR 85,000.00 on 14/02/25 by NEFT from COMPANY LTD. Ref No 123456', time:'5h ago' },
  { id:'s3', from:'ICICIB', text:'ICICI Bank: Rs 1,200 spent on your Credit Card XX4321 at SWIGGY on 2025-02-14. Available limit: Rs.48,800', time:'8h ago' },
  { id:'s4', from:'AXISBK', text:'Rs.550.00 debited from Axis Bank A/c XX8877 on 14-02-25 for PETROL PUMP. Balance: Rs.12,450.00', time:'1d ago' },
  { id:'s5', from:'PAYTMB', text:'Paytm: Rs.3,500 paid to RELIANCE FRESH on 13-Feb-25. UPI Ref: 987654321. Balance: Rs.6,200', time:'1d ago' },
  { id:'s6', from:'HDFCBK', text:'Rs.15,000.00 debited from your HDFC A/c XX1234 on 13-Feb-25 - RENT PAYMENT to MR SHARMA. Bal Rs.30,230.00', time:'2d ago' },
];

function parseSMS(text: string) {
  const lower = text.toLowerCase();
  // Amount
  let amount = 0;
  const amtPats = [
    /(?:rs|inr)\.?\s*([\d,]+\.?\d*)/i,
    /(?:rupees?|amount)\s+([\d,]+\.?\d*)/i,
  ];
  for (const p of amtPats) { const m = text.match(p); if (m) { amount = parseFloat(m[1].replace(/,/g,'')); break; } }

  // Type
  const type = /credited|credit|received|deposited|salary|cashback|refund/.test(lower) ? 'INCOME' : 'EXPENSE';

  // Merchant
  let merchant = 'Unknown';
  const atPat = /at\s+([A-Z\s]{3,25})(?:\s+on|\.|$)/i;
  const forPat = /for\s+([A-Z\s]{3,25})(?:\s+on|\.|$)/i;
  const paidPat = /paid\s+to\s+([A-Z\s]{3,25})(?:\s+on|\.|$)/i;
  const fromPat = /from\s+([A-Z\s]{3,25})(?:\s+on|\.|ref|\.|$)/i;
  if (type === 'EXPENSE') {
    const m = text.match(atPat) || text.match(forPat) || text.match(paidPat);
    if (m) merchant = m[1].trim();
  } else {
    const m = text.match(fromPat);
    if (m) merchant = m[1].trim();
  }

  // Date
  let date = new Date().toISOString().split('T')[0];
  const dp = /(\d{1,2})[-\/](\w{2,3})[-\/](\d{2,4})|(\d{1,2})[-\/](\d{1,2})[-\/](\d{2,4})/;
  const dm = text.match(dp);
  if (dm) { try { const d = new Date(dm[0]); if (!isNaN(d.getTime())) date = d.toISOString().split('T')[0]; } catch {} }

  // Category
  let category = type === 'INCOME' ? 'Income' : 'Others';
  if (/amazon|flipkart|myntra|shopping/.test(lower)) category = 'Shopping';
  else if (/swiggy|zomato|restaurant|food/.test(lower)) category = 'Food';
  else if (/petrol|fuel|uber|ola|metro/.test(lower)) category = 'Transport';
  else if (/rent|electricity|water|bill/.test(lower)) category = 'Bills';
  else if (/salary|neft.*company|credited.*company/.test(lower)) category = 'Salary';

  return { amount, type, merchant: merchant.replace(/\s+/g,' ').trim(), date, category };
}

export default function SMSCapturePage() {
  const [smsList] = useState(SAMPLE_SMS);
  const [parsed, setParsed] = useState<Record<string,any>>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [accounts, setAccounts] = useState<any[]>([]);
  const [accountId, setAccountId] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all'|'debit'|'credit'>('all');
  const [err, setErr] = useState('');

  useEffect(() => {
    accountsApi.getAll().then(a => { setAccounts(a); if (a.length) setAccountId(a[0].id); }).catch(()=>{});
    const p: Record<string,any> = {};
    SAMPLE_SMS.forEach(s => { p[s.id] = parseSMS(s.text); });
    setParsed(p);
  }, []);

  const toggle = (id: string) => {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const selectAll = () => {
    const ids = filtered.filter(s => !saved.has(s.id)).map(s => s.id);
    setSelected(new Set(ids));
  };

  const saveSelected = async () => {
    if (!selected.size) return;
    setSaving(true); setErr('');
    try {
      const toSave = Array.from(selected).filter(id => !saved.has(id));
      await Promise.all(toSave.map(id => {
        const p = parsed[id];
        return transactionsApi.create({ type: p.type, amount: p.amount, description: p.merchant, category: p.category, date: p.date, accountId });
      }));
      setSaved(prev => new Set([...prev, ...toSave]));
      setSelected(new Set());
    } catch { setErr('Failed to save some transactions.'); } finally { setSaving(false); }
  };

  const filtered = smsList.filter(s => {
    if (filter === 'all') return true;
    const p = parsed[s.id];
    if (!p) return true;
    return filter === 'credit' ? p.type === 'INCOME' : p.type === 'EXPENSE';
  });

  const totalAmount = Array.from(selected).reduce((s, id) => s + (parsed[id]?.amount || 0), 0);

  return (
    <div className="max-w-2xl mx-auto space-y-5 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><MessageSquare className="w-6 h-6 text-indigo-600"/>SMS Transaction Capture</h1>
        <p className="text-sm text-gray-500 mt-0.5">Auto-detect bank SMS and log transactions in one tap</p>
      </div>

      {err && <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"><AlertCircle className="w-4 h-4"/>{err}</div>}

      {/* Info banner */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5"/>
        <div>
          <p className="font-semibold text-indigo-900 text-sm">How SMS Capture Works</p>
          <p className="text-xs text-indigo-700 mt-0.5">Your bank SMS messages are scanned locally on-device. We extract the amount, merchant, and transaction type automatically. Select messages to import in bulk.</p>
        </div>
      </div>

      {/* Filters + Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
          {(['all','debit','credit'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize ${filter===f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {f === 'all' ? 'All SMS' : f === 'debit' ? 'Debits' : 'Credits'}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={selectAll} className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50">Select All</button>
          {accounts.length > 0 && (
            <select value={accountId} onChange={e => setAccountId(e.target.value)} className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700">
              {accounts.map((a:any) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          )}
        </div>
      </div>

      {/* SMS List */}
      <div className="space-y-3">
        {filtered.map(sms => {
          const p = parsed[sms.id];
          const isSelected = selected.has(sms.id);
          const isSaved = saved.has(sms.id);
          if (!p || p.amount === 0) return null;
          return (
            <div key={sms.id} onClick={() => !isSaved && toggle(sms.id)}
              className={`bg-white rounded-2xl border-2 p-4 transition-all ${isSaved ? 'border-green-200 bg-green-50 opacity-60' : isSelected ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 hover:border-gray-300 cursor-pointer'}`}>
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${isSaved ? 'border-green-500 bg-green-500' : isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'}`}>
                  {(isSelected || isSaved) && <CheckCircle className="w-3.5 h-3.5 text-white"/>}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Bank + time */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{sms.from}</span>
                    <span className="text-xs text-gray-400">{sms.time}</span>
                  </div>

                  {/* Raw SMS */}
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-2">{sms.text}</p>

                  {/* Parsed data */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-sm font-black ${p.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                      {p.type === 'INCOME' ? '+' : '-'}{formatCurrency(p.amount)}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full font-medium">{p.merchant}</span>
                    <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium">{p.category}</span>
                    <span className="text-xs text-gray-400">{p.date}</span>
                  </div>
                </div>
              </div>
              {isSaved && <div className="mt-2 text-xs text-green-600 font-semibold flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5"/>Saved to transactions</div>}
            </div>
          );
        })}
      </div>

      {/* Sticky save bar */}
      {selected.size > 0 && (
        <div className="sticky bottom-4 bg-white border border-indigo-200 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-bold text-gray-900">{selected.size} selected</p>
              <p className="text-sm text-gray-500">Total: {formatCurrency(totalAmount)}</p>
            </div>
            <button onClick={saveSelected} disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-50">
              {saving ? <><RefreshCw className="w-4 h-4 animate-spin"/>Saving...</> : <><Plus className="w-4 h-4"/>Import {selected.size} Transactions</>}
            </button>
          </div>
        </div>
      )}

      {filtered.filter(s => parsed[s.id]?.amount > 0).length === 0 && (
        <div className="text-center py-12 text-gray-400"><Inbox className="w-12 h-12 mx-auto mb-3 opacity-30"/><p>No SMS messages found</p></div>
      )}
    </div>
  );
}