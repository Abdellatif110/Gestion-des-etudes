import { TimerDisplay } from '@/components/timer/TimerDisplay';
import { TimerPresets } from '@/components/timer/TimerPresets';
import { QuickTaskSelector } from '@/components/timer/QuickTaskSelector';
import { useStudyStore } from '@/store/studyStore';
import { Clock, Target, TrendingUp, Flame } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function TimerPage() {
  const { completedSessions, tasks, timerSettings, studyGoals } = useStudyStore();
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalMinutes = completedSessions * timerSettings.workDuration;
  const activeGoals = studyGoals?.filter(g => !g.completed).length || 0;

  const stats = [
    { 
      icon: Clock, 
      label: 'Focus Time', 
      value: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`,
      color: 'text-primary' 
    },
    { 
      icon: Target, 
      label: 'Sessions', 
      value: completedSessions.toString(),
      color: 'text-timer-work' 
    },
    { 
      icon: TrendingUp, 
      label: 'Tasks Done', 
      value: completedTasks.toString(),
      color: 'text-success' 
    },
    { 
      icon: Flame, 
      label: 'Active Goals', 
      value: activeGoals.toString(),
      color: 'text-warning' 
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Focus Timer</h1>
        <p className="text-muted-foreground">Stay focused and boost your productivity</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-4 text-center animate-slide-up">
            <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Timer Presets */}
      <TimerPresets />

      {/* Main Timer */}
      <div className="flex justify-center py-8">
        <TimerDisplay />
      </div>

      {/* Task Selector */}
      <div className="max-w-md mx-auto">
        <QuickTaskSelector />
      </div>

      {/* Theme Toggle */}
      <div className="flex justify-center pt-4">
        <ThemeToggle />
      </div>
    </div>
  );
}
