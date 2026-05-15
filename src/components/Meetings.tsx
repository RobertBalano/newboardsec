import { useState } from 'react';
import { 
  Plus, Calendar, MapPin, Users, ChevronRight, Clock, X,
  Upload, Edit2, Eye 
} from 'lucide-react';
import { Meeting, AgendaItem } from '../types';
import { mockMeetings } from '../data/mockData';

export default function Meetings() {
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);
  const [selected, setSelected] = useState<Meeting | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [form, setForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
  });

  const filtered = (filterStatus === 'all' ? meetings : meetings.filter(m => m.status === filterStatus))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


  function formatDate(d: string) {
    return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }

  function statusBadge(status: string) {
    const map: Record<string, string> = {
      scheduled: 'bg-sky-50 text-sky-600 border-sky-100',
      completed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      'in-progress': 'bg-amber-50 text-amber-600 border-amber-100',
      cancelled: 'bg-rose-50 text-rose-500 border-rose-100',
    };
    return map[status] ?? 'bg-slate-100 text-slate-500';
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const newMeeting: Meeting = {
      id: String(Date.now()),
      title: form.title,
      date: form.date,
      time: form.time,
      location: form.location,
      status: 'scheduled',
      attendees: [],
      agenda: [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    setMeetings(prev => [newMeeting, ...prev]);
    setForm({ title: '', date: '', time: '', location: '' });
    setShowForm(false);
  }

  const totalDuration = (items: AgendaItem[]) => items.reduce((sum, i) => sum + i.duration, 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Meetings</h1>
          <p className="text-slate-500 mt-1 text-sm">{meetings.length} total meetings</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-sky-100"
        >
          <Plus size={16} />
          New Meeting
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {['all', 'scheduled', 'in-progress', 'completed', 'cancelled'].map(f => (
          <button
            key={f}
            onClick={() => setFilterStatus(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === f ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Meeting List */}
      <div className="space-y-3">
        {filtered.map(meeting => (
          <div
            key={meeting.id}
            onClick={() => setSelected(meeting)}
            className="bg-white border border-slate-100 rounded-xl p-5 cursor-pointer hover:border-sky-200 hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-slate-900 text-sm">{meeting.title}</h3>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusBadge(meeting.status)}`}>
                    {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-slate-400" />
                    {formatDate(meeting.date)} at {meeting.time}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={12} className="text-slate-400" />
                    {meeting.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users size={12} className="text-slate-400" />
                    {meeting.attendees.length} attendees
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} className="text-slate-400" />
                    {totalDuration(meeting.agenda)} min estimated
                  </span>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-sky-400 transition-colors mt-0.5 flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-end p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[calc(100vh-2rem)] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <div>
                <h2 className="font-bold text-slate-900">{selected.title}</h2>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusBadge(selected.status)}`}>
                  {selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}
                </span>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Schedule Meeting</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Meeting Title</label>
                <select
                  required
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition bg-white"
                >
                  <option value="" disabled>Select Meeting Type</option>
                  <optgroup label="Board Meetings: Regular">
                    <option value="1st Quarter Board Meeting">1st Quarter Board Meeting</option>
                    <option value="2nd Quarter Board Meeting">2nd Quarter Board Meeting</option>
                    <option value="3rd Quarter Board Meeting">3rd Quarter Board Meeting</option>
                    <option value="4th Quarter Board Meeting">4th Quarter Board Meeting</option>
                  </optgroup>
                  <optgroup label="Board Meetings: Special">
                    <option value="1st Special Board Meeting">1st Special Board Meeting</option>
                    <option value="2nd Special Board Meeting">2nd Special Board Meeting</option>
                  </optgroup>
                  <optgroup label="BOR-Committee Meetings">
                    <option value="Finance Committee Meeting">Finance Committee Meeting</option>
                    <option value="Administrative and Program Standards Committee Meeting">Administrative and Program Standards Committee Meeting</option>
                    <option value="Joint Committee Meeting">Joint Committee Meeting</option>
                  </optgroup>
                  <optgroup label="Council Meetings">
                    <option value="Academic Council Meeting">Academic Council Meeting</option>
                    <option value="Administrative Council Meeting">Administrative Council Meeting</option>
                    <option value="Joint Council Meeting">Joint Council Meeting</option>
                  </optgroup>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Date</label>
                  <input
                    required
                    type="date"
                    value={form.date}
                    onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Time</label>
                  <input
                    required
                    type="time"
                    value={form.time}
                    onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Location</label>
                <input
                  required
                  type="text"
                  value={form.location}
                  onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                  placeholder="e.g. Boardroom A"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
                />
              </div>

              
              <div className="pt-2">
                <label className="block text-xs font-medium text-slate-600 mb-2">Meeting Agenda</label>
                <div className="flex items-center justify-between p-3 border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                  <span className="text-xs text-slate-500 italic">No agenda attached yet</span>
                  <div className="flex gap-2">
                    <button 
                      type="button" 
                      className="p-1.5 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-md transition-colors"
                      title="Upload Agenda"
                    >
                      <Upload size={16} />
                    </button>
                    <button 
                      type="button" 
                      className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-md transition-colors"
                      title="Edit Agenda"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      type="button" 
                      className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-md transition-colors"
                      title="View Agenda"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-sky-500 hover:bg-sky-600 text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-sky-100">
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}