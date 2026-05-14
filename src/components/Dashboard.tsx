import { Calendar, Users, FileText, Clock, BarChart3, AlertCircle } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: 'meetings' | 'members' | 'minutes' | 'actions') => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  // Navigation helper to ensure top-of-page view
  const handleNavigation = (page: 'meetings' | 'members' | 'minutes' | 'actions') => {
    window.scrollTo(0, 0);
    onNavigate(page);
  };

  const mockMembers = [
    {
      id: '1',
      name: 'HON. DESIDERIO R. APAG III',
      role: 'Chair',
      designation: 'Commissioner, CHED / Chairperson',
      email: 'd.apag@ched.gov.ph',
      avatar: '/desiderio.jpg',
    },
    {
      id: '2',
      name: 'HON. ANDRES C. PAGATPATAN, JR.',
      role: 'Vice Chair',
      designation: 'President, ESSU / Vice Chairperson',
      email: 'president@essu.edu.ph',
      avatar: '',
    },
    {
      id: '3',
      name: 'SENATOR LOREN B. LEGARDA',
      role: 'Member',
      designation: 'Chairperson, Senate Committee...',
      email: 'loren.legarda@senate.gov.ph',
      avatar: '',
    },
    {
      id: '4',
      name: 'CONGRESSMAN JUDE A. ACIDRE',
      role: 'Member',
      designation: 'Chairperson, House Committee...',
      email: 'jude.acidre@house.gov.ph',
      avatar: '',
    },
  ];

  const upcomingMeeting = {
    title: 'Q2 2026 Board Meeting',
    date: '2026-05-15',
    time: '10:00 AM',
    location: 'Boardroom A, HQ',
    status: 'Scheduled',
  };

  const pendingActions = [
    {
      id: '1',
      description: 'Prepare Q2 financial projections',
    },
  ];

  const stats = [
    {
      label: 'Total Members',
      value: 12,
      icon: Users,
      color: 'text-indigo-500', // Switched to Indigo
      bg: 'bg-indigo-50/50',
      page: 'members' as const,
    },
    {
      label: 'Upcoming Meetings',
      value: 2,
      icon: Calendar,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50/50',
      page: 'meetings' as const,
    },
    {
      label: 'Minutes on File',
      value: 2,
      icon: FileText,
      color: 'text-blue-500', // Switched to Blue
      bg: 'bg-blue-50/50',
      page: 'minutes' as const,
    },
    {
      label: 'Pending Actions',
      value: 1,
      icon: Clock,
      color: 'text-slate-500', // Changed to Gray (Slate)
      bg: 'bg-slate-100/50',
      page: 'actions' as const,
    },
  ];

  function formatDate(dateStr: string) {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Chair':
        return 'bg-sky-100 text-sky-700';
      case 'Vice Chair':
        return 'bg-emerald-100 text-emerald-700';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-emerald-900">Dashboard</h1>
        <p className="text-emerald-700/70 mt-1 text-sm font-medium">
          Welcome back, Dr. Debbie Joyce. Here's your board overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(({ label, value, icon: Icon, color, bg, page }) => (
          <button
            key={label}
            onClick={() => handleNavigation(page)}
            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  {label}
                </p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
              </div>
              <div className={`${bg} w-12 h-12 rounded-xl flex items-center justify-center`}>
                <Icon size={22} className={color} />
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Meeting */}
        <div className="lg:col-span-1 bg-white border border-emerald-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-emerald-600 p-6 text-white"> 
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-emerald-200" />
                <span className="text-emerald-50 text-[10px] font-bold uppercase tracking-wider">
                  Next Meeting
                </span>
              </div>
              <span className="bg-white/20 border border-white/30 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                {upcomingMeeting.status}
              </span>
            </div>
            <h3 className="text-xl font-bold leading-tight mb-1">
              {upcomingMeeting.title}
            </h3>
            <p className="text-emerald-50 text-sm">
              {formatDate(upcomingMeeting.date)} at {upcomingMeeting.time}
            </p>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 text-slate-600">
              <BarChart3 size={16} className="text-emerald-600" />
              <span className="text-sm font-medium">{upcomingMeeting.location}</span>
            </div>
            <div className="pt-2 border-t border-slate-50">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Agenda Items</p>
                <p className="text-sm font-semibold text-slate-700">6 items</p>
            </div>
          </div>
        </div>

        {/* Board Members Preview */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
            <h2 className="font-bold text-emerald-900 text-sm">Board Members Preview</h2>
            <button
              onClick={() => handleNavigation('members')}
              className="text-emerald-700 text-xs font-bold hover:text-emerald-900 transition-colors"
            >
              View all 12 members
            </button>
          </div>

          <div className="divide-y divide-slate-50">
            {mockMembers.map((member) => (
              <div
                key={member.id}
                className="px-6 py-4 flex items-center gap-3 hover:bg-slate-50/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm overflow-hidden">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    member.name.charAt(0)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{member.name}</p>
                  <p className="text-xs text-slate-500 truncate">{member.designation}</p>
                </div>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide ${getRoleBadge(member.role)}`}>
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Actions - Synchronized to Gray (Slate) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
          <h2 className="font-bold text-emerald-900 text-sm">Pending Action Items</h2>
          <button
            onClick={() => handleNavigation('actions')}
            className="text-emerald-700 text-xs font-bold hover:text-emerald-900 transition-colors"
          >
            Manage Actions
          </button>
        </div>

        <div className="p-2">
          {pendingActions.map((action) => (
            <div
              key={action.id}
              className="group flex items-center justify-between p-4 hover:bg-slate-50/50 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-4">
                {/* Synchronized with Gray Stat color */}
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{action.description}</p>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-tighter mt-0.5">
                    Status: Pending Review
                  </p>
                </div>
              </div>
              <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                <AlertCircle size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}