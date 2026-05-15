import { useState, useEffect } from 'react';
import {Plus, X, Clock, CheckCircle2, XCircle, FileText, ChevronDown } from 'lucide-react';
import { mockActionItems } from '../data/mockData';

type ItemStatus = 'Pending' | 'Approved' | 'Deferred' | 'Colatilla' | 'Disapproved';

export default function ActionItems() {
  const [items, setItems] = useState<any[]>(() => {
    const saved = localStorage.getItem('board_action_items');
    if (saved) return JSON.parse(saved);
    
    return mockActionItems.map(i => ({
      ...i,
      status: (i.completed ? 'Approved' : 'Pending') as ItemStatus,
      reason: '',
    }));
  });

  useEffect(() => {
    localStorage.setItem('board_action_items', JSON.stringify(items));
  }, [items]);

  const [filter, setFilter] = useState<ItemStatus | 'All'>('All');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ description: '', dueDate: '', meetingTitle: '' });

  const filtered = items.filter(i => filter === 'All' || i.status === filter);
  const pending = items.filter(i => i.status === 'Pending');

  const groupedItems = filtered.reduce((groups: { [key: string]: any[] }, item) => {
    const title = item.meetingTitle || 'Uncategorized';
    if (!groups[title]) groups[title] = [];
    groups[title].push(item);
    return groups;
  }, {});

  function updateStatus(id: string, status: ItemStatus, updates: any = {}) {
    setItems(prev => prev.map(i => 
      i.id === id ? { ...i, status, ...updates, completed: status === 'Approved' } : i
    ));
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const newItem = {
      id: String(Date.now()),
      meetingTitle: form.meetingTitle,
      description: form.description,
      dueDate: form.dueDate,
      status: 'Pending' as ItemStatus,
      completed: false,
      reason: '',
    };
    setItems(prev => [newItem, ...prev]);
    setForm({ description: '', dueDate: '', meetingTitle: '' });
    setShowForm(false);
  }

  const getStatusConfig = (status: ItemStatus) => {
    switch (status) {
      case 'Approved': return { color: 'text-emerald-600 bg-emerald-50', icon: <CheckCircle2 size={16} /> };
      case 'Deferred': return { color: 'text-amber-600 bg-amber-50', icon: <Clock size={16} /> };
      case 'Colatilla': return { color: 'text-purple-600 bg-purple-50', icon: <FileText size={16} /> };
      case 'Disapproved': return { color: 'text-rose-600 bg-rose-50', icon: <XCircle size={16} /> };
      default: return { color: 'text-slate-500 bg-slate-100', icon: <Clock size={16} /> };
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Action Items</h1>
          <p className="text-slate-500 mt-1 text-sm">
            {pending.length} pending · {items.length - pending.length} processed
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-sky-100"
        >
          <Plus size={16} /> Add Action
        </button>
      </div>

      
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {(['All', 'Pending', 'Approved', 'Deferred', 'Colatilla', 'Disapproved'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              filter === f ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 border border-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-12">
        {Object.entries(groupedItems).map(([title, meetingItems]) => (
          <div key={title} className="space-y-4">
            
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
              {title}
            </h2>
            
            <div className="space-y-3">
              {meetingItems.map(item => {
                const config = getStatusConfig(item.status);
                return (
                  <div key={item.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${config.color}`}>
                            {config.icon} {item.status}
                          </span>
                        </div>
                        <p className={`text-sm font-semibold leading-relaxed transition-all ${
                          item.status === 'Disapproved' 
                            ? 'text-rose-800 line-through decoration-rose-300' 
                            : item.status === 'Approved' 
                              ? 'text-slate-400' 
                              : 'text-slate-800'
                        }`}>
                          {item.description}
                        </p>
                        
                        {item.status === 'Colatilla' && (
                          <div className="mt-3 p-3 bg-purple-50/50 border border-purple-100 rounded-xl inline-block">
                            <p className="text-[11px] text-purple-600 font-bold italic flex items-center gap-2">
                              <FileText size={14} />
                              To be followed by supporting document(s)
                            </p>
                          </div>
                        )}

                        {item.status === 'Disapproved' && (
                          <div className="mt-3 p-3 bg-rose-50/50 rounded-lg border border-rose-100">
                            <label className="block text-[10px] font-black text-rose-400 uppercase mb-1">Reason</label>
                            <input 
                              type="text"
                              placeholder="State supporting reason..."
                              value={item.reason}
                              onChange={(e) => updateStatus(item.id, 'Disapproved', { reason: e.target.value })}
                              className="w-full bg-transparent text-sm text-rose-800 outline-none"
                            />
                          </div>
                        )}
                      </div>

                      <div className="relative">
                        <select 
                          value={item.status}
                          onChange={(e) => updateStatus(item.id, e.target.value as ItemStatus)}
                          className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold py-2 pl-4 pr-10 rounded-xl outline-none cursor-pointer hover:bg-slate-100 transition-all"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Deferred">Deferred</option>
                          <option value="Colatilla">Colatilla</option>
                          <option value="Disapproved">Disapproved</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      
      {showForm && (
        <div className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="font-black text-slate-900 uppercase tracking-tight">New Action Entry</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreate} className="p-8 space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Description</label>
                <textarea
                  required
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Task description..."
                  className="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm focus:border-sky-500 outline-none transition-all resize-none min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Meeting Reference</label>
                  <input
                    type="text"
                    required
                    value={form.meetingTitle}
                    onChange={e => setForm(p => ({ ...p, meetingTitle: e.target.value }))}
                    placeholder="e.g. Q1 2026 BOARD MEETING"
                    className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-sky-500 outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Target Date</label>
                  <input
                    required
                    type="date"
                    value={form.dueDate}
                    onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))}
                    className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-sky-500 outline-none"
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all">
                Save Item
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}