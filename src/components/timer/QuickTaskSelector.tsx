import { CheckCircle2, Circle, Target } from 'lucide-react';
import { useStudyStore } from '@/store/studyStore';
import { cn } from '@/lib/utils';

export function QuickTaskSelector() {
  const { tasks, currentTaskId, setCurrentTaskId } = useStudyStore();
  const incompleteTasks = tasks.filter(t => !t.completed).slice(0, 5);

  if (incompleteTasks.length === 0) {
    return (
      <div className="glass rounded-xl p-6 text-center">
        <Target className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
        <p className="text-muted-foreground text-sm">No tasks yet</p>
        <p className="text-xs text-muted-foreground/70 mt-1">Add tasks to track your progress</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-4">
      <h3 className="font-medium text-sm mb-3 text-muted-foreground">Current Focus</h3>
      <div className="space-y-2">
        {incompleteTasks.map((task) => {
          const isSelected = currentTaskId === task.id;
          return (
            <button
              key={task.id}
              onClick={() => setCurrentTaskId(isSelected ? null : task.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left",
                isSelected
                  ? "bg-primary/10 border border-primary/30"
                  : "hover:bg-secondary/80 border border-transparent"
              )}
            >
              {isSelected ? (
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "font-medium text-sm truncate",
                  isSelected && "text-primary"
                )}>
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">
                    {task.completedPomodoros}/{task.pomodoros} pomodoros
                  </span>
                  <span className={cn(
                    "text-xs px-1.5 py-0.5 rounded",
                    task.priority === 'high' && "bg-destructive/10 text-destructive",
                    task.priority === 'medium' && "bg-warning/10 text-warning",
                    task.priority === 'low' && "bg-success/10 text-success"
                  )}>
                    {task.priority}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
