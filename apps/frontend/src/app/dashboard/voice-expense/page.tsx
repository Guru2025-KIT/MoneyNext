'use client';

import { useState, useRef, useEffect } from 'react';
import { transactionsApi } from '@/lib/api/transactions';
import { accountsApi } from '@/lib/api/accounts';
import { formatCurrency } from '@/lib/utils';
import { Mic, MicOff, CheckCircle, AlertCircle, Plus, RefreshCw, X, Volume2, Waveform } from 'lucide-react';

const EXAMPLES = [
  'Spent 450 on lunch at Swiggy today',
  'Paid 1200 for electricity bill',
  'Received 85000 salary from company',
  'Bought groceries for 680 at Big Bazaar',
  'Auto rickshaw 120 rupees',
  'Coffee 80 at Starbucks',
];

function parseVoice(text: string) {
  const lower = text.toLowerCase();

  // Amount - look for numbers near keywords
  let amount = 0;
  const amtPat = /(?:rs\.?|rupees?|inr)?\s*(\d[\d,]*\.?\d*)\s*(?:rs\.?|rupees?)?/gi;
  let best = 0;
  let m;
  while ((m = amtPat.exec(text)) !== null) {
    const v = parseFloat(m[1].replace(/,/g,''));
    if (v > best) best = v;
  }
  amount = best;

  // Type
  const incomeWords = /received|salary|income|credited|got|earned|refund|cashback/;
  const type = incomeWords.test(lower) ? 'INCOME' : 'EXPENSE';

  // Merchant / description - words after 'at', 'from', 'for'
  let description = text;
  const atM = lower.match(/(?:at|from|for|in)\s+([a-z\s]+?)(?:\s+(?:today|yesterday|on|this|\d)|$)/i);
  if (atM) description = atM[1].trim().replace(/\b\w/g, c => c.toUpperCase());
  else {
    // Clean up numbers and keywords
    description = text.replace(/(\d[\d,]*\.?\d*)\s*(rs|rupees?|inr)?/gi,'').replace(/\b(spent|paid|bought|purchased|received|for|at|on|today|yesterday|the|a|an)\b/gi,'').trim().replace(/\s+/g,' ');
    if (!description) description = type === 'INCOME' ? 'Income' : 'Expense';
  }

  // Category
  let category = type === 'INCOME' ? 'Income' : 'Others';
  if (/lunch|dinner|food|swiggy|zomato|restaurant|cafe|coffee|snack/.test(lower)) category = 'Food';
  else if (/grocery|vegetables|market|bazaar|shopping|amazon/.test(lower)) category = 'Shopping';
  else if (/auto|cab|uber|ola|petrol|fuel|bus|metro|train/.test(lower)) category = 'Transport';
  else if (/electricity|water|internet|wifi|bill|rent|phone/.test(lower)) category = 'Bills';
  else if (/doctor|medicine|hospital|pharmacy|health/.test(lower)) category = 'Health';
  else if (/salary|company/.test(lower)) category = 'Salary';

  return { amount, type, description: description.replace(/\b\w/g,c=>c.toUpperCase()).trim() || 'Expense', category, date: new Date().toISOString().split('T')[0] };
}

export default function VoiceExpensePage() {
  const [phase, setPhase] = useState<'idle'|'listening'|'processing'|'review'|'done'>('idle');
  const [transcript, setTranscript] = useState('');
  const [parsed, setParsed] = useState<any>(null);
  const [form, setForm] = useState({ description:'', amount:0, category:'Others', date:'' });
  const [accounts, setAccounts] = useState<any[]>([]);
  const [accountId, setAccountId] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [waveBars] = useState(() => Array.from({length:20},()=>Math.random()*60+20));
  const recogRef = useRef<any>(null);
  const [supported, setSupported] = useState(true);

  const CATEGORIES = ['Food','Shopping','Transport','Bills','Health','Entertainment','Salary','Income','Others'];

  useEffect(() => {
    accountsApi.getAll().then(a => { setAccounts(a); if (a.length) setAccountId(a[0].id); }).catch(()=>{});
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) setSupported(false);
  }, []);

  const startListening = () => {
    setErr(''); setTranscript(''); setPhase('listening');
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { setErr('Speech recognition not supported in this browser. Try Chrome.'); setPhase('idle'); return; }
    const rec = new SpeechRecognition();
    recogRef.current = rec;
    rec.continuous = false; rec.interimResults = true; rec.lang = 'en-IN';
    rec.onresult = (e: any) => {
      const t = Array.from(e.results).map((r:any) => r[0].transcript).join('');
      setTranscript(t);
    };
    rec.onend = () => {
      setPhase('processing');
      setTimeout(() => {
        const t = recogRef.current?._lastTranscript || transcript;
        processText(t || transcript);
      }, 500);
    };
    rec.onerror = (e: any) => { setErr(`Mic error: ${e.error}. Please allow microphone access.`); setPhase('idle'); };
    rec.start();
    // Capture transcript before end
    rec.onresult = (e: any) => {
      const t = Array.from(e.results).map((r:any) => r[0].transcript).join('');
      setTranscript(t);
      rec._lastTranscript = t;
    };
  };

  const stopListening = () => { recogRef.current?.stop(); };

  const processText = (text: string) => {
    if (!text.trim()) { setErr('No speech detected. Try again.'); setPhase('idle'); return; }
    const result = parseVoice(text);
    setParsed(result);
    setForm({ description: result.description, amount: result.amount, category: result.category, date: result.date });
    setPhase('review');
  };

  const tryExample = (ex: string) => {
    setTranscript(ex); setPhase('processing');
    setTimeout(() => processText(ex), 600);
  };

  const save = async () => {
    if (!form.amount || !form.description) { setErr('Amount and description required'); return; }
    setSaving(true);
    try {
      await transactionsApi.create({ type: parsed.type, amount: form.amount, description: form.description, category: form.category, date: form.date, accountId });
      setPhase('done');
    } catch { setErr('Save failed.'); } finally { setSaving(false); }
  };

  const reset = () => { setPhase('idle'); setTranscript(''); setParsed(null); setErr(''); recogRef.current?.stop(); };

  return (
    <div className="max-w-xl mx-auto space-y-5 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Mic className="w-6 h-6 text-rose-600"/>Voice Expense Logger</h1>
        <p className="text-sm text-gray-500 mt-0.5">Say your expense out loud — we'll log it instantly</p>
      </div>

      {err && <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"><AlertCircle className="w-4 h-4 shrink-0"/>{err}<button onClick={()=>setErr('')} className="ml-auto"><X className="w-4 h-4"/></button></div>}

      {!supported && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-orange-700 text-sm">
          <p className="font-bold mb-1">Browser Not Supported</p>
          <p>Speech recognition works best in Chrome. Use the example phrases below to test.</p>
        </div>
      )}

      {/* IDLE */}
      {phase === 'idle' && (
        <div className="space-y-4">
          {/* Big mic button */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm text-center">
            <button onClick={startListening}
              className="w-28 h-28 bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all mx-auto flex items-center justify-center group mb-4">
              <Mic className="w-12 h-12 group-hover:scale-110 transition-transform"/>
            </button>
            <p className="font-bold text-gray-900 text-lg">Tap to Speak</p>
            <p className="text-gray-500 text-sm mt-1">Say your expense in plain English</p>
          </div>

          {/* Examples */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <p className="text-xs font-bold text-gray-600 mb-3 flex items-center gap-1.5"><Volume2 className="w-3.5 h-3.5"/>Try these examples</p>
            <div className="space-y-2">
              {EXAMPLES.map((ex, i) => (
                <button key={i} onClick={() => tryExample(ex)}
                  className="w-full text-left px-3 py-2.5 bg-gray-50 hover:bg-rose-50 hover:border-rose-200 border border-gray-200 rounded-xl text-sm text-gray-700 transition-colors flex items-center justify-between group">
                  <span>"{ex}"</span>
                  <Plus className="w-4 h-4 text-gray-400 group-hover:text-rose-500 shrink-0"/>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LISTENING */}
      {phase === 'listening' && (
        <div className="bg-white rounded-2xl border-2 border-rose-300 p-8 shadow-sm text-center">
          {/* Waveform animation */}
          <div className="flex items-center justify-center gap-0.5 h-16 mb-4">
            {waveBars.map((h, i) => (
              <div key={i} className="w-1.5 bg-rose-400 rounded-full animate-pulse"
                style={{ height: `${h}%`, animationDelay: `${i * 0.05}s`, animationDuration: `${0.6 + Math.random() * 0.4}s` }}/>
            ))}
          </div>
          <p className="font-bold text-rose-700 text-lg mb-1">Listening...</p>
          {transcript && <p className="text-gray-600 text-sm italic mb-4">"{transcript}"</p>}
          {!transcript && <p className="text-gray-400 text-sm mb-4">Speak clearly into your microphone</p>}
          <button onClick={stopListening} className="px-6 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-900 flex items-center gap-2 mx-auto">
            <MicOff className="w-4 h-4"/>Stop
          </button>
        </div>
      )}

      {/* PROCESSING */}
      {phase === 'processing' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 shadow-sm text-center">
          <div className="relative w-14 h-14 mx-auto mb-4">
            <div className="w-14 h-14 border-4 border-rose-100 rounded-full absolute"/>
            <div className="w-14 h-14 border-4 border-rose-500 border-t-transparent rounded-full animate-spin absolute"/>
          </div>
          <p className="font-bold text-gray-900 text-lg">Processing...</p>
          {transcript && <p className="text-gray-500 text-sm mt-2 italic">"{transcript}"</p>}
        </div>
      )}

      {/* REVIEW */}
      {phase === 'review' && parsed && (
        <div className="space-y-4">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl">
            <p className="text-xs font-bold text-rose-700 mb-1 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5"/>Understood</p>
            <p className="text-sm text-rose-900 italic">"{transcript}"</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{backgroundColor: parsed.type==='INCOME'?'#f0fdf4':'#fff1f2'}}>
              <div><p className="text-xs font-semibold text-gray-500">Detected as</p>
                <p className={`font-bold text-lg ${parsed.type==='INCOME'?'text-green-600':'text-rose-600'}`}>{parsed.type === 'INCOME' ? 'Income' : 'Expense'}</p></div>
              <div className="ml-auto"><p className="text-xs font-semibold text-gray-500">Amount</p>
                <p className="font-black text-2xl text-gray-900">{formatCurrency(parsed.amount)}</p></div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">Description *</label>
              <input value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-rose-400" suppressHydrationWarning/>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Amount (₹) *</label>
                <input type="number" value={form.amount} onChange={e=>setForm(f=>({...f,amount:Number(e.target.value)}))}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-rose-400" suppressHydrationWarning/>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Category</label>
                <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 bg-white">
                  {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            {accounts.length > 0 && (
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Account</label>
                <select value={accountId} onChange={e=>setAccountId(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-rose-400 bg-white">
                  {accounts.map((a:any)=><option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
            )}
            <div className="flex gap-3 pt-1">
              <button onClick={reset} className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium">Retry</button>
              <button onClick={save} disabled={saving}
                className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-bold text-sm hover:bg-rose-700 disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <><RefreshCw className="w-4 h-4 animate-spin"/>Saving...</> : <><Plus className="w-4 h-4"/>Save</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DONE */}
      {phase === 'done' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 shadow-sm text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-500"/>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Saved!</h3>
          <p className="text-gray-600 text-sm">{form.description}</p>
          <p className="text-3xl font-black text-rose-600 mt-2 mb-6">{formatCurrency(form.amount)}</p>
          <div className="flex gap-3">
            <button onClick={reset} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm">Log Another</button>
            <a href="/dashboard/transactions" className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-bold text-sm hover:bg-rose-700 flex items-center justify-center">View All</a>
          </div>
        </div>
      )}
    </div>
  );
}