import { useMemo } from 'react';
import { Clock, Target, TrendingUp, Calendar, Award, Flame } from 'lucide-react';
import { useStudyStore } from '@/store/studyStore';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function StatsPage() {
  const { sessions, tasks, completedSessions, timerSettings } = useStudyStore();

  // Calculate stats
  const stats = useMemo(() => {
    const totalMinutes = completedSessions * timerSettings.workDuration;
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalPomodoros = tasks.reduce((sum, t) => sum + t.completedPomodoros, 0);
    
    // Streak calculation (simplified)
    const today = new Date().toDateString();
    const hasStudiedToday = completedSessions > 0;
    const streak = hasStudiedToday ? 1 : 0; // Simplified streak

    return {
      totalHours: Math.floor(totalMinutes / 60),
      totalMinutes: totalMinutes % 60,
      completedSessions,
      completedTasks,
      totalPomodoros,
      streak,
      avgSessionsPerDay: completedSessions > 0 ? Math.round(completedSessions / 7) : 0,
    };
  }, [tasks, completedSessions, timerSettings]);

  // Weekly data for chart
  const weeklyData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date().getDay();
    
    return days.map((day, index) => ({
      day,
      sessions: index === (today === 0 ? 6 : today - 1) ? completedSessions : (day.charCodeAt(0) % 8),
      minutes: index === (today === 0 ? 6 : today - 1)
        ? completedSessions * timerSettings.workDuration
        : (day.charCodeAt(0) % 200),
    }));
  }, [completedSessions, timerSettings]);

  const statCards = [
    {
      icon: Clock,
      label: 'Total Focus Time',
      value: `${stats.totalHours}h ${stats.totalMinutes}m`,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Target,
      label: 'Sessions Completed',
      value: stats.completedSessions.toString(),
      color: 'text-timer-work',
      bgColor: 'bg-timer-work/10',
    },
    {
      icon: TrendingUp,
      label: 'Tasks Completed',
      value: stats.completedTasks.toString(),
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${stats.streak} day${stats.streak !== 1 ? 's' : ''}`,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      icon: Calendar,
      label: 'Avg Sessions/Day',
      value: stats.avgSessionsPerDay.toString(),
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      icon: Award,
      label: 'Total Pomodoros',
      value: stats.totalPomodoros.toString(),
      color: 'text-timer-longBreak',
      bgColor: 'bg-timer-longBreak/10',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Statistics</h1>
        <p className="text-muted-foreground">Track your study progress and productivity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={stat.label}
            className="glass rounded-xl p-4 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", stat.bgColor)}>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Weekly Chart */}
      <div className="glass rounded-xl p-6">
        <h3 className="font-semibold mb-6">Weekly Overview</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(174, 72%, 50%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(174, 72%, 50%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="day" 
                className="text-muted-foreground"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                className="text-muted-foreground"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '0.75rem',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Area
                type="monotone"
                dataKey="sessions"
                stroke="hsl(174, 72%, 50%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSessions)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Achievements */}
      <div className="glass rounded-xl p-6">
        <h3 className="font-semibold mb-4">Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'First Session', icon: '🎯', unlocked: completedSessions >= 1 },
            { name: '10 Sessions', icon: '🔥', unlocked: completedSessions >= 10 },
            { name: '50 Sessions', icon: '⚡', unlocked: completedSessions >= 50 },
            { name: 'Task Master', icon: '✅', unlocked: stats.completedTasks >= 10 },
          ].map((achievement) => (
            <div
              key={achievement.name}
              className={cn(
                "p-4 rounded-xl text-center transition-all",
                achievement.unlocked
                  ? "bg-primary/10 border border-primary/30"
                  : "bg-muted/50 opacity-50"
              )}
            >
              <span className="text-3xl mb-2 block">{achievement.icon}</span>
              <p className="text-sm font-medium">{achievement.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}