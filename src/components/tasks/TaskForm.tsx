import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStudyStore } from '@/store/studyStore';
import type { Task } from '@/types/study';

interface TaskFormProps {
  task?: Task | null;
  onClose: () => void;
}

export function TaskForm({ task, onClose }: TaskFormProps) {
  const { addTask, updateTask } = useStudyStore();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<Task['priority']>(task?.priority || 'medium');
  const [pomodoros, setPomodoros] = useState(task?.pomodoros?.toString() || '4');
  const [category, setCategory] = useState(task?.category || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    const taskData: Task = {
      id: task?.id || crypto.randomUUID(),
      title: title.trim(),
      description: description.trim() || undefined,
      completed: task?.completed || false,
      priority,
      pomodoros: parseInt(pomodoros) || 4,
      completedPomodoros: task?.completedPomodoros || 0,
      createdAt: task?.createdAt || new Date(),
      category: category.trim() || undefined,
    };

    if (task) {
      updateTask(task.id, taskData);
    } else {
      addTask(taskData);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-strong rounded-2xl p-6 w-full max-w-md shadow-lg animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you need to do?"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Task['priority'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pomodoros">Pomodoros</Label>
              <Input
                id="pomodoros"
                type="number"
                min="1"
                max="20"
                value={pomodoros}
                onChange={(e) => setPomodoros(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category (optional)</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Work, Study, Personal"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="gradient" className="flex-1">
              {task ? 'Save Changes' : 'Add Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
