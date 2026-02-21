'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { Users, Plus, Trash2, Split, CheckCircle, Copy, RefreshCw, AlertCircle, Receipt, ArrowRight , X} from 'lucide-react';

interface Person { id: string; name: string; paid: number; items: string[] }
interface Item { id: string; name: string; amount: number; splitWith: string[] }

const uid = () => Math.random().toString(36).slice(2, 8);

export default function BillSplitterPage() {
  const [billName, setBillName] = useState('Dinner at Restaurant');
  const [people, setPeople] = useState<Person[]>([
    { id: 'p1', name: 'You', paid: 0, items: [] },
    { id: 'p2', name: 'Friend 1', paid: 0, items: [] },
  ]);
  const [items, setItems] = useState<Item[]>([
    { id: 'i1', name: 'Main Course', amount: 800, splitWith: ['p1', 'p2'] },
    { id: 'i2', name: 'Drinks', amount: 300, splitWith: ['p1', 'p2'] },
  ]);
  const [tax, setTax] = useState(18);
  const [tip, setTip] = useState(10);
  const [newPerson, setNewPerson] = useState('');
  const [newItem, setNewItem] = useState({ name: '', amount: '' });
  const [mode, setMode] = useState<'split' | 'result'>('split');
  const [copied, setCopied] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.amount, 0);
  const taxAmt = subtotal * tax / 100;
  const tipAmt = subtotal * tip / 100;
  const grandTotal = subtotal + taxAmt + tipAmt;

  // Calculate what each person owes
  const calculations = people.map(person => {
    let owes = 0;
    items.forEach(item => {
      if (item.splitWith.includes(person.id)) {
        owes += item.amount / item.splitWith.length;
      }
    });
    // Add proportional tax and tip
    const itemTotal = items.reduce((s, item) => {
      if (item.splitWith.includes(person.id)) return s + item.amount / item.splitWith.length;
      return s;
    }, 0);
    const proportion = subtotal > 0 ? itemTotal / subtotal : 0;
    owes += (taxAmt + tipAmt) * proportion;
    return { ...person, owes: Math.round(owes * 100) / 100 };
  });

  // Settlement: who pays whom
  const settlements: { from: string; to: string; amount: number }[] = [];
  const balances = calculations.map(p => ({ id: p.id, name: p.name, balance: p.paid - p.owes }));
  const debtors = balances.filter(b => b.balance < -0.5).sort((a, b) => a.balance - b.balance);
  const creditors = balances.filter(b => b.balance > 0.5).sort((a, b) => b.balance - a.balance);
  const d = debtors.map(d => ({ ...d, balance: Math.abs(d.balance) }));
  const c = creditors.map(c => ({ ...c }));
  let di = 0; let ci = 0;
  while (di < d.length && ci < c.length) {
    const amt = Math.min(d[di].balance, c[ci].balance);
    if (amt > 0.5) settlements.push({ from: d[di].name, to: c[ci].name, amount: Math.round(amt * 100) / 100 });
    d[di].balance -= amt; c[ci].balance -= amt;
    if (d[di].balance < 0.5) di++; else ci++;
  }

  const addPerson = () => {
    if (!newPerson.trim()) return;
    setPeople(p => [...p, { id: uid(), name: newPerson.trim(), paid: 0, items: [] }]);
    setNewPerson('');
  };

  const addItem = () => {
    if (!newItem.name || !newItem.amount) return;
    const id = uid();
    setItems(i => [...i, { id, name: newItem.name, amount: Number(newItem.amount), splitWith: people.map(p => p.id) }]);
    setNewItem({ name: '', amount: '' });
  };

  const toggleItemSplit = (itemId: string, personId: string) => {
    setItems(items.map(item => {
      if (item.id !== itemId) return item;
      const already = item.splitWith.includes(personId);
      if (already && item.splitWith.length <= 1) return item; // keep at least 1
      return { ...item, splitWith: already ? item.splitWith.filter(p => p !== personId) : [...item.splitWith, personId] };
    }));
  };

  const copyResult = () => {
    const text = [
      `Bill Split: ${billName}`,
      `Total: ${formatCurrency(grandTotal)}`,
      '',
      'Each person owes:',
      ...calculations.map(p => `${p.name}: ${formatCurrency(p.owes)}`),
      '',
      'Settlements:',
      ...settlements.map(s => `${s.from} pays ${s.to}: ${formatCurrency(s.amount)}`),
    ].join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Split className="w-6 h-6 text-green-600" />Bill Splitter</h1>
        <p className="text-gray-500 text-sm mt-0.5">Split bills fairly with custom item allocation</p>
      </div>

      {/* Tab */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        {(['split', 'result'] as const).map(tab => (
          <button key={tab} onClick={() => setMode(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${mode === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {tab === 'split' ? 'Setup Split' : 'Settlement'}
          </button>
        ))}
      </div>

      {mode === 'split' && (
        <div className="space-y-5">
          {/* Bill Name */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Bill Name</label>
            <input value={billName} onChange={e => setBillName(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-green-500" suppressHydrationWarning />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Tax ({tax}%)</label>
                <input type="range" min={0} max={30} value={tax} onChange={e => setTax(Number(e.target.value))} className="w-full accent-green-600" suppressHydrationWarning /></div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Tip ({tip}%)</label>
                <input type="range" min={0} max={30} value={tip} onChange={e => setTip(Number(e.target.value))} className="w-full accent-green-600" suppressHydrationWarning /></div>
            </div>
          </div>

          {/* People */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-green-600" />People ({people.length})</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {people.map(p => (
                <div key={p.id} className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">{p.name[0].toUpperCase()}</div>
                  <span className="text-sm font-medium text-gray-800">{p.name}</span>
                  {people.length > 2 && (
                    <button onClick={() => setPeople(people.filter(x => x.id !== p.id))} className="text-gray-400 hover:text-red-500"><X className="w-3 h-3" /></button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newPerson} onChange={e => setNewPerson(e.target.value)} onKeyDown={e => e.key === 'Enter' && addPerson()}
                placeholder="Add person..." className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-green-500" suppressHydrationWarning />
              <button onClick={addPerson} className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700"><Plus className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Receipt className="w-4 h-4 text-blue-600" />Items</h3>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={item.id} className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-800 text-sm">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{formatCurrency(item.amount)}</span>
                      <button onClick={() => setItems(items.filter(i => i.id !== item.id))} className="text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {people.map(p => (
                      <button key={p.id} onClick={() => toggleItemSplit(item.id, p.id)}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${item.splitWith.includes(p.id) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}>
                        {p.name}
                      </button>
                    ))}
                    <span className="px-2 py-1 text-xs text-gray-400">{formatCurrency(item.amount / Math.max(item.splitWith.length, 1))} each</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newItem.name} onChange={e => setNewItem(n => ({ ...n, name: e.target.value }))} placeholder="Item name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" suppressHydrationWarning />
              <input type="number" value={newItem.amount} onChange={e => setNewItem(n => ({ ...n, amount: e.target.value }))} placeholder="Amount"
                className="w-28 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" suppressHydrationWarning />
              <button onClick={addItem} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700"><Plus className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Totals */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="space-y-2 text-sm">
              {[{ label: 'Subtotal', value: subtotal }, { label: `Tax (${tax}%)`, value: taxAmt }, { label: `Tip (${tip}%)`, value: tipAmt }].map((r, i) => (
                <div key={i} className="flex justify-between text-gray-600"><span>{r.label}</span><span>{formatCurrency(r.value)}</span></div>
              ))}
              <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200"><span>Grand Total</span><span className="text-green-600">{formatCurrency(grandTotal)}</span></div>
            </div>
          </div>

          <button onClick={() => setMode('result')} className="w-full py-3.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 flex items-center justify-center gap-2">
            Calculate Settlement <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {mode === 'result' && (
        <div className="space-y-5">
          {/* Per Person */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Each Person Owes</h3>
            <div className="space-y-3">
              {calculations.map((p, i) => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">{p.name[0].toUpperCase()}</div>
                    <div><p className="font-semibold text-gray-900">{p.name}</p><p className="text-xs text-gray-500">{((p.owes / grandTotal) * 100).toFixed(1)}% of bill</p></div>
                  </div>
                  <p className="text-xl font-black text-gray-900">{formatCurrency(p.owes)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Settlements */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Who Pays Whom</h3>
            {settlements.length > 0 ? (
              <div className="space-y-3">
                {settlements.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-green-50 border border-green-100 rounded-xl">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">{s.from[0]}</div>
                    <div className="flex-1"><span className="font-bold text-gray-900">{s.from}</span><span className="text-gray-500 text-sm"> pays </span><span className="font-bold text-gray-900">{s.to}</span></div>
                    <span className="font-black text-green-600 text-lg">{formatCurrency(s.amount)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400"><CheckCircle className="w-10 h-10 mx-auto mb-2 text-green-400" /><p>All settled! No transfers needed.</p></div>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setMode('split')} className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium text-sm">Edit Split</button>
            <button onClick={copyResult} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 flex items-center justify-center gap-2">
              {copied ? <><CheckCircle className="w-4 h-4" />Copied!</> : <><Copy className="w-4 h-4" />Copy Summary</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}