import { useState } from 'react';
import { CheckCircle2, Circle, Trash2, Edit3, Clock, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useStudyStore } from '@/store/studyStore';
import { cn } from '@/lib/utils';
import type { Task } from '@/types/study';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export function TaskItem({ task, onEdit }: TaskItemProps) {
  const { toggleTaskComplete, deleteTask, setCurrentTaskId, currentTaskId } = useStudyStore();
  const isActive = currentTaskId === task.id;

  const priorityColors = {
    high: 'border-l-destructive bg-destructive/5',
    medium: 'border-l-warning bg-warning/5',
    low: 'border-l-success bg-success/5',
  };

  return (
    <div
      className={cn(
        "group glass rounded-xl p-4 border-l-4 transition-all duration-200 hover:shadow-md animate-scale-in",
        priorityColors[task.priority],
        task.completed && "opacity-60",
        isActive && "ring-2 ring-primary/50"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => toggleTaskComplete(task.id)}
          className="mt-0.5 transition-transform hover:scale-110"
        >
          {task.completed ? (
            <CheckCircle2 className="w-6 h-6 text-success" />
          ) : (
            <Circle className="w-6 h-6 text-muted-foreground hover:text-primary" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-medium",
            task.completed && "line-through text-muted-foreground"
          )}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
          
          {/* Meta info */}
          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {task.completedPomodoros}/{task.pomodoros} pomodoros
            </span>
            {task.category && (
              <span className="px-2 py-0.5 rounded-full bg-secondary">
                {task.category}
              </span>
            )}
            <span className={cn(
              "px-2 py-0.5 rounded-full capitalize",
              task.priority === 'high' && "bg-destructive/10 text-destructive",
              task.priority === 'medium' && "bg-warning/10 text-warning",
              task.priority === 'low' && "bg-success/10 text-success"
            )}>
              {task.priority}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setCurrentTaskId(isActive ? null : task.id)}
            className={cn(isActive && "text-primary")}
          >
            <Clock className="w-4 h-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => deleteTask(task.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}