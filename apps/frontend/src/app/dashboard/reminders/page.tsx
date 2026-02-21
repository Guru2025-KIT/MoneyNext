'use client';

import { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, CheckCircle, Clock, AlertCircle, Calendar, X, Edit2, RefreshCw } from 'lucide-react';

interface Reminder { id: string; title: string; amount: number; dueDate: string; category: string; repeat: string; status: 'pending'|'paid'|'overdue'; note: string; }

const CATEGORIES = ['Rent','Loan EMI','Credit Card','Insurance','Utility','Subscription','Investment','Other'];
const REPEATS = ['One-time','Monthly','Quarterly','Yearly'];

const uid = () => Math.random().toString(36).slice(2,9);
const today = new Date().toISOString().split('T')[0];

const DEFAULTS: Reminder[] = [
  { id:'r1', title:'House Rent', amount:15000, dueDate:'2025-03-01', category:'Rent', repeat:'Monthly', status:'pending', note:'Pay to landlord via bank transfer' },
  { id:'r2', title:'Home Loan EMI', amount:28500, dueDate:'2025-02-28', category:'Loan EMI', repeat:'Monthly', status:'pending', note:'SBI Home Loan - Account ending 5678' },
  { id:'r3', title:'LIC Premium', amount:12000, dueDate:'2025-03-15', category:'Insurance', repeat:'Quarterly', status:'pending', note:'Policy No: 123456789' },
  { id:'r4', title:'Netflix', amount:649, dueDate:'2025-02-20', category:'Subscription', repeat:'Monthly', status:'overdue', note:'' },
  { id:'r5', title:'Electricity Bill', amount:2200, dueDate:'2025-02-25', category:'Utility', repeat:'Monthly', status:'pending', note:'' },
];

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>(DEFAULTS);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string|null>(null);
  const [filter, setFilter] = useState<'all'|'pending'|'overdue'|'paid'>('all');
  const [form, setForm] = useState({ title:'', amount:'', dueDate:'', category:'Rent', repeat:'Monthly', note:'' });

  // Auto-mark overdue
  useEffect(() => {
    setReminders(prev => prev.map(r => ({
      ...r, status: r.status === 'paid' ? 'paid' : r.dueDate < today ? 'overdue' : 'pending'
    })));
  }, []);

  const addOrUpdate = () => {
    if (!form.title || !form.amount || !form.dueDate) return;
    const reminder: Reminder = {
      id: editing || uid(),
      title: form.title, amount: Number(form.amount), dueDate: form.dueDate,
      category: form.category, repeat: form.repeat, note: form.note,
      status: form.dueDate < today ? 'overdue' : 'pending',
    };
    if (editing) setReminders(prev => prev.map(r => r.id === editing ? reminder : r));
    else setReminders(prev => [...prev, reminder]);
    setForm({ title:'', amount:'', dueDate:'', category:'Rent', repeat:'Monthly', note:'' });
    setShowForm(false); setEditing(null);
  };

  const markPaid = (id: string) => setReminders(prev => prev.map(r => r.id === id ? {...r, status:'paid'} : r));
  const del = (id: string) => setReminders(prev => prev.filter(r => r.id !== id));
  const startEdit = (r: Reminder) => { setEditing(r.id); setForm({ title:r.title, amount:String(r.amount), dueDate:r.dueDate, category:r.category, repeat:r.repeat, note:r.note }); setShowForm(true); };

  const filtered = reminders.filter(r => filter === 'all' || r.status === filter).sort((a,b) => a.dueDate.localeCompare(b.dueDate));
  const totalPending = reminders.filter(r => r.status !== 'paid').reduce((s,r) => s+r.amount, 0);
  const overdue = reminders.filter(r => r.status === 'overdue');
  const daysUntil = (date: string) => Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);

  const statusBadge = (r: Reminder) => {
    if (r.status === 'paid') return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">Paid</span>;
    if (r.status === 'overdue') return <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">Overdue</span>;
    const d = daysUntil(r.dueDate);
    if (d <= 3) return <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">Due in {d}d</span>;
    return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Due in {d}d</span>;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Bell className="w-6 h-6 text-orange-500"/>Bill Reminders</h1>
          <p className="text-sm text-gray-500 mt-0.5">Never miss a payment deadline</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({title:'',amount:'',dueDate:'',category:'Rent',repeat:'Monthly',note:''}); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600">
          <Plus className="w-4 h-4"/>Add Reminder
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label:'Total Due', value:`₹${(totalPending/1000).toFixed(0)}K`, sub:`${reminders.filter(r=>r.status!=='paid').length} bills`, bg:'bg-orange-50', color:'text-orange-700' },
          { label:'Overdue', value:String(overdue.length), sub:overdue.length > 0 ? 'Needs attention' : 'All clear', bg:'bg-red-50', color:'text-red-700' },
          { label:'Paid', value:String(reminders.filter(r=>r.status==='paid').length), sub:`of ${reminders.length} total`, bg:'bg-green-50', color:'text-green-700' },
        ].map((s,i) => (
          <div key={i} className={`${s.bg} rounded-2xl p-4 text-center`}>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs font-semibold text-gray-600 mt-0.5">{s.label}</p>
            <p className="text-xs text-gray-400">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Overdue alert */}
      {overdue.length > 0 && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5"/>
          <div>
            <p className="font-bold text-red-800 text-sm">{overdue.length} overdue payment{overdue.length>1?'s':''}</p>
            <p className="text-xs text-red-600 mt-0.5">{overdue.map(r=>r.title).join(', ')} — mark as paid when done</p>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border-2 border-orange-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">{editing ? 'Edit Reminder' : 'New Reminder'}</h3>
            <button onClick={() => { setShowForm(false); setEditing(null); }}><X className="w-5 h-5 text-gray-400 hover:text-gray-600"/></button>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Bill Name *</label>
                <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="e.g. House Rent"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-400" suppressHydrationWarning/>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Amount (₹) *</label>
                <input type="number" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} placeholder="0"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-400" suppressHydrationWarning/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Due Date *</label>
                <input type="date" value={form.dueDate} onChange={e=>setForm(f=>({...f,dueDate:e.target.value}))}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-400" suppressHydrationWarning/>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Category</label>
                <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-orange-400">
                  {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Repeat</label>
                <select value={form.repeat} onChange={e=>setForm(f=>({...f,repeat:e.target.value}))}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-orange-400">
                  {REPEATS.map(r=><option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Note</label>
                <input value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))} placeholder="Account/policy details"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-400" suppressHydrationWarning/>
              </div>
            </div>
            <button onClick={addOrUpdate} className="w-full py-3 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600">
              {editing ? 'Update Reminder' : 'Add Reminder'}
            </button>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        {(['all','pending','overdue','paid'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${filter===f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {f} {f !== 'all' && <span className="ml-1 opacity-60">({reminders.filter(r=>r.status===f).length})</span>}
          </button>
        ))}
      </div>

      {/* Reminder Cards */}
      <div className="space-y-3">
        {filtered.map(r => (
          <div key={r.id} className={`bg-white rounded-2xl border-2 p-4 shadow-sm transition-all ${r.status==='overdue'?'border-red-200':'r.status'==='paid'?'border-green-200 opacity-70':'border-gray-200'}`}>
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${r.status==='paid'?'bg-green-100':r.status==='overdue'?'bg-red-100':'bg-orange-100'}`}>
                {r.status==='paid' ? <CheckCircle className="w-5 h-5 text-green-600"/> : r.status==='overdue' ? <AlertCircle className="w-5 h-5 text-red-600"/> : <Bell className="w-5 h-5 text-orange-600"/>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                  <p className="font-bold text-gray-900">{r.title}</p>
                  {statusBadge(r)}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/>{r.dueDate}</span>
                  <span className="px-2 py-0.5 bg-gray-100 rounded-full">{r.category}</span>
                  <span className="px-2 py-0.5 bg-gray-100 rounded-full">{r.repeat}</span>
                </div>
                {r.note && <p className="text-xs text-gray-400 mt-1">{r.note}</p>}
              </div>
              <div className="text-right shrink-0">
                <p className="font-black text-gray-900 text-lg">₹{r.amount.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
              {r.status !== 'paid' && (
                <button onClick={() => markPaid(r.id)}
                  className="flex-1 py-2 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700 flex items-center justify-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5"/>Mark Paid
                </button>
              )}
              <button onClick={() => startEdit(r)} className="px-3 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50">
                <Edit2 className="w-3.5 h-3.5"/>
              </button>
              <button onClick={() => del(r.id)} className="px-3 py-2 border border-red-200 text-red-500 rounded-xl hover:bg-red-50">
                <Trash2 className="w-3.5 h-3.5"/>
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400"><Bell className="w-12 h-12 mx-auto mb-3 opacity-20"/><p>No {filter !== 'all' ? filter : ''} reminders</p></div>
        )}
      </div>
    </div>
  );
}