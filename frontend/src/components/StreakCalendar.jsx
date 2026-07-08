import { Check, X } from 'lucide-react';

export default function StreakCalendar({ currentStreak }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Calculate a visual mock representation based on streak
  const getDayStatus = (index) => {
    const dayOfWeek = new Date().getDay() - 1; // 0 for Monday, 6 for Sunday
    const normalizedToday = dayOfWeek < 0 ? 6 : dayOfWeek;
    
    if (index > normalizedToday) return 'upcoming';
    if (normalizedToday - index < currentStreak) return 'completed';
    return 'missed';
  };

  return (
    <div className="glass-panel border-l-4 border-l-orange-500 rounded-3xl p-6 bg-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      <h3 className="text-xl font-bold mb-4 text-orange-400 flex items-center gap-2">
        🔥 Learning Streak ({currentStreak} Days)
      </h3>
      <div className="flex justify-between items-center max-w-sm">
        {days.map((day, idx) => {
          const status = getDayStatus(idx);
          return (
            <div key={day} className="flex flex-col items-center gap-2">
              <div className="text-xs font-bold text-slate-400">{day}</div>
              <div className={`w-8 h-8 rounded-full flex justify-center items-center font-bold shadow-lg transition-transform hover:scale-110 ${
                status === 'completed' ? 'bg-orange-500 text-white shadow-orange-500/50' : 
                status === 'missed' ? 'bg-slate-700 text-slate-500' : 
                'border-2 border-slate-600 border-dashed text-transparent'
              }`}>
                {status === 'completed' && <Check size={16} strokeWidth={4} />}
                {status === 'missed' && <X size={16} strokeWidth={4} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
