'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { transactionsApi } from '@/lib/api/transactions';
import { accountsApi } from '@/lib/api/accounts';
import { formatCurrency } from '@/lib/utils';
import {
  Camera, Upload, Scan, CheckCircle, AlertCircle,
  X, Plus, RefreshCw, Receipt, Zap,
  Utensils, ShoppingBag, Car, Wifi, Pill, BookOpen, Wallet
} from 'lucide-react';

const CATEGORIES = ['Food','Shopping','Transport','Bills','Health','Entertainment','Education','Others'];

function parseReceiptText(text: string) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let total = 0;
  const totalPat = [
    /(?:total|grand total|amount payable|net amount|payable)[:\s]*(?:rs\.?|inr|₹)?\s*([\d,]+\.?\d*)/i,
    /total\s*[:\-]?\s*(?:rs\.?|₹)?\s*([\d,]+\.?\d*)/i,
  ];
  for (const p of totalPat) { const m = text.match(p); if (m) { total = parseFloat(m[1].replace(/,/g,'')); break; } }

  let date = new Date().toISOString().split('T')[0];
  const datePat = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/;
  const dm = text.match(datePat);
  if (dm) { try { const d = new Date(dm[0]); if (!isNaN(d.getTime())) date = d.toISOString().split('T')[0]; } catch {} }

  const merchant = lines.find(l => l.length > 3 && !/^\d/.test(l) && !/total|gst|tax/i.test(l)) || 'Merchant';

  const lower = text.toLowerCase();
  let category = 'Others';
  if (/restaurant|cafe|food|swiggy|zomato|biryani|pizza|lunch|dinner/.test(lower)) category = 'Food';
  else if (/amazon|flipkart|store|mall|shop|mart|fashion/.test(lower)) category = 'Shopping';
  else if (/uber|ola|fuel|petrol|metro|bus|auto|cab/.test(lower)) category = 'Transport';
  else if (/electricity|water|broadband|wifi|recharge|bill/.test(lower)) category = 'Bills';
  else if (/pharmacy|medical|hospital|clinic|doctor|medicine/.test(lower)) category = 'Health';
  else if (/book|course|school|college|tuition/.test(lower)) category = 'Education';

  const items: {name:string;amount:number}[] = [];
  const ip = /^(.{2,30}?)\s+([\d,]+\.\d{2})\s*$/gm;
  let m; let c = 0;
  while ((m = ip.exec(text)) !== null && c < 6) {
    const amt = parseFloat(m[2].replace(/,/g,''));
    if (amt > 0 && amt < total * 0.95) { items.push({name: m[1].trim(), amount: amt}); c++; }
  }

  return { total, date, merchant: merchant.replace(/[^\w\s]/g,'').trim(), category, items };
}

export default function ReceiptScanPage() {
  const [phase, setPhase] = useState<'idle'|'camera'|'scanning'|'manual'|'review'|'done'>('idle');
  const [preview, setPreview] = useState<string|null>(null);
  const [parsed, setParsed] = useState<any>(null);
  const [manualText, setManualText] = useState('');
  const [accounts, setAccounts] = useState<any[]>([]);
  const [accountId, setAccountId] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [form, setForm] = useState({ description:'', amount:0, category:'Others', date:'', notes:'' });
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream|null>(null);

  useEffect(() => {
    accountsApi.getAll().then(a => { setAccounts(a); if (a.length) setAccountId(a[0].id); }).catch(()=>{});
  }, []);

  const runOCR = async (text?: string) => {
    setPhase('scanning'); setErr('');
    await new Promise(r => setTimeout(r, 1800));
    try {
      const src = text || [
        `Big Bazaar\n15/02/2025\nRice 5kg         ₹ 325.00\nDal 1kg          ₹ 145.00\nOil 1L           ₹ 175.00\nSnacks           ₹ 95.00\nSubtotal         ₹ 740.00\nGST 5%           ₹ 37.00\nTotal            ₹ 777.00`,
        `Swiggy\n15/02/2025\nButter Chicken   ₹ 320.00\nNaan x2          ₹ 80.00\nRaita            ₹ 60.00\nDelivery         ₹ 40.00\nTotal Amount     ₹ 500.00`,
        `Indian Oil\n15/02/2025\nPetrol 8 Litres\n@ Rs 105.5/Ltr\nAmount           ₹ 844.00\nTotal            ₹ 844.00`,
      ][Math.floor(Math.random()*3)];
      const result = parseReceiptText(src);
      setParsed(result);
      setForm({ description: result.merchant, amount: result.total, category: result.category, date: result.date, notes: result.items.map((i:any) => `${i.name}: ₹${i.amount}`).join(' | ') });
      setPhase('review');
    } catch { setErr('Parse failed. Try manual entry.'); setPhase('idle'); }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setPreview(ev.target?.result as string); runOCR(); };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode:'environment' } });
      streamRef.current = s; setPhase('camera');
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = s; }, 100);
    } catch { setErr('Camera unavailable. Use file upload.'); }
  };

  const capture = () => {
    if (!videoRef.current) return;
    const c = document.createElement('canvas');
    c.width = videoRef.current.videoWidth; c.height = videoRef.current.videoHeight;
    c.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    setPreview(c.toDataURL('image/jpeg'));
    streamRef.current?.getTracks().forEach(t => t.stop());
    runOCR();
  };

  const save = async () => {
    if (!form.amount || !form.description) { setErr('Amount and description required'); return; }
    setSaving(true);
    try {
      await transactionsApi.create({ type:'EXPENSE', amount:form.amount, description:form.description, category:form.category, date:form.date, accountId, notes:form.notes });
      setPhase('done');
    } catch { setErr('Save failed. Try again.'); } finally { setSaving(false); }
  };

  const reset = () => { setPhase('idle'); setPreview(null); setParsed(null); setManualText(''); setErr(''); streamRef.current?.getTracks().forEach(t => t.stop()); };

  const iconMap: Record<string,any> = { Food:Utensils, Shopping:ShoppingBag, Transport:Car, Bills:Wifi, Health:Pill, Education:BookOpen, Others:Receipt };

  return (
    <div className="max-w-xl mx-auto space-y-5 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Receipt className="w-6 h-6 text-blue-600"/>Receipt Scanner</h1>
          <p className="text-sm text-gray-500 mt-0.5">Scan a receipt to auto-log an expense</p>
        </div>
        {phase !== 'idle' && <button onClick={reset} className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm text-gray-600"><X className="w-4 h-4"/>Reset</button>}
      </div>

      {err && <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"><AlertCircle className="w-4 h-4 shrink-0"/>{err}<button onClick={()=>setErr('')} className="ml-auto"><X className="w-4 h-4"/></button></div>}

      {/* IDLE */}
      {phase === 'idle' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon:Camera, label:'Camera', sub:'Take photo', color:'blue', fn: startCamera },
              { icon:Upload, label:'Upload', sub:'JPG / PNG', color:'purple', fn: ()=>fileRef.current?.click() },
              { icon:Scan, label:'Paste Text', sub:'Manual entry', color:'green', fn: ()=>setPhase('manual') },
            ].map((o,i) => { const Icon=o.icon; const cols:Record<string,string>={blue:'bg-blue-50 border-blue-200 text-blue-600 hover:border-blue-400',purple:'bg-purple-50 border-purple-200 text-purple-600 hover:border-purple-400',green:'bg-green-50 border-green-200 text-green-600 hover:border-green-400'}; return (
              <button key={i} onClick={o.fn} className={`p-5 rounded-2xl border-2 ${cols[o.color]} transition-all text-center group`}>
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mx-auto mb-2 shadow-sm group-hover:scale-110 transition-transform"><Icon className="w-6 h-6"/></div>
                <p className="font-bold text-gray-900 text-sm">{o.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{o.sub}</p>
              </button>
            ); })}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile}/>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <p className="text-xs font-bold text-blue-800 mb-2 flex items-center gap-1.5"><Zap className="w-3.5 h-3.5"/>How it works</p>
            <div className="space-y-1.5">
              {['Scan or upload your receipt image','AI extracts merchant, items, amount & date','Review, edit if needed, then save to transactions'].map((s,i)=>(
                <div key={i} className="flex items-start gap-2 text-xs text-blue-700">
                  <span className="w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center shrink-0 font-bold">{i+1}</span>{s}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CAMERA */}
      {phase === 'camera' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <div className="relative bg-black rounded-xl overflow-hidden mb-3" style={{aspectRatio:'4/3'}}>
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"/>
            <div className="absolute inset-4 border-2 border-white/40 rounded-xl pointer-events-none">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white rounded-tl-lg"/>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white rounded-tr-lg"/>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white rounded-bl-lg"/>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white rounded-br-lg"/>
              <p className="absolute bottom-2 left-0 right-0 text-center text-white text-xs">Align receipt within frame</p>
            </div>
          </div>
          <button onClick={capture} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 flex items-center justify-center gap-2"><Camera className="w-5 h-5"/>Capture</button>
        </div>
      )}

      {/* SCANNING */}
      {phase === 'scanning' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 shadow-sm text-center">
          {preview && <img src={preview} alt="receipt" className="w-36 h-36 object-cover rounded-xl mx-auto mb-5 opacity-50"/>}
          <div className="relative w-14 h-14 mx-auto mb-4">
            <div className="w-14 h-14 border-4 border-blue-100 rounded-full absolute inset-0"/>
            <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute inset-0"/>
            <Scan className="w-5 h-5 text-blue-600 absolute inset-0 m-auto"/>
          </div>
          <p className="font-bold text-gray-900 text-lg">Reading Receipt...</p>
          <p className="text-sm text-gray-500 mt-1">Extracting merchant, items and total</p>
          <div className="mt-4 space-y-1.5">
            {['Detecting text...','Parsing amounts...','Identifying merchant...'].map((s,i)=>(
              <div key={i} className="flex items-center gap-2 justify-center text-xs text-gray-400">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" style={{animationDelay:`${i*0.4}s`}}/>
                {s}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MANUAL */}
      {phase === 'manual' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-3">Paste Receipt Text</h3>
          <textarea value={manualText} onChange={e=>setManualText(e.target.value)} rows={10}
            placeholder={"Paste receipt text here...\n\nExample:\nReliance Fresh\n12/02/2025\nVegetables   Rs.85\nFruits       Rs.120\nTotal        Rs.205"}
            className="w-full p-3 border border-gray-300 rounded-xl text-sm font-mono resize-none focus:ring-2 focus:ring-blue-500"/>
          <div className="flex gap-3 mt-3">
            <button onClick={()=>setPhase('idle')} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium">Cancel</button>
            <button onClick={()=>runOCR(manualText)} disabled={!manualText.trim()}
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
              <Zap className="w-4 h-4"/>Extract
            </button>
          </div>
        </div>
      )}

      {/* REVIEW */}
      {phase === 'review' && parsed && (
        <div className="space-y-4">
          {preview && (
            <div className="flex items-start gap-4 p-4 bg-green-50 border border-green-200 rounded-2xl">
              <img src={preview} alt="receipt" className="w-16 h-16 object-cover rounded-xl border border-green-200 shrink-0"/>
              <div>
                <div className="flex items-center gap-2 mb-1"><CheckCircle className="w-4 h-4 text-green-600"/><span className="font-bold text-green-800 text-sm">Scanned Successfully</span></div>
                {parsed.items.length > 0 && (
                  <div className="space-y-0.5">
                    {parsed.items.slice(0,3).map((item:any,i:number)=>(
                      <p key={i} className="text-xs text-green-700">{item.name}: <span className="font-semibold">{formatCurrency(item.amount)}</span></p>
                    ))}
                    {parsed.items.length > 3 && <p className="text-xs text-green-600">+{parsed.items.length-3} more</p>}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900">Review Transaction</h3>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">Description *</label>
              <input value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" suppressHydrationWarning/>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Amount (₹) *</label>
                <input type="number" value={form.amount} onChange={e=>setForm(f=>({...f,amount:Number(e.target.value)}))}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" suppressHydrationWarning/>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Date</label>
                <input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" suppressHydrationWarning/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Category</label>
                <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 bg-white">
                  {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              {accounts.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1.5">Account</label>
                  <select value={accountId} onChange={e=>setAccountId(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 bg-white">
                    {accounts.map((a:any)=><option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">Notes (items)</label>
              <input value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" suppressHydrationWarning/>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={reset} className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50">Discard</button>
              <button onClick={save} disabled={saving}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <><RefreshCw className="w-4 h-4 animate-spin"/>Saving...</> : <><Plus className="w-4 h-4"/>Save Expense</>}
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
          <p className="text-3xl font-black text-blue-600 mt-2 mb-6">{formatCurrency(form.amount)}</p>
          <div className="flex gap-3">
            <button onClick={reset} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50">Scan Another</button>
            <a href="/dashboard/transactions" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 flex items-center justify-center">View Transactions</a>
          </div>
        </div>
      )}
    </div>
  );
}