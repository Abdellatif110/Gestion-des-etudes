import { useState } from 'react';
import { Plus, Filter, CheckSquare, ListTodo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskItem } from '@/components/tasks/TaskItem';
import { TaskForm } from '@/components/tasks/TaskForm';
import { useStudyStore } from '@/store/studyStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Task } from '@/types/study';

export default function TasksPage() {
  const { tasks } = useStudyStore();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'date' | 'pomodoros'>('priority');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const priority = { high: 3, medium: 2, low: 1 };
      return priority[b.priority] - priority[a.priority];
    }
    if (sortBy === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return b.pomodoros - a.pomodoros;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const activeCount = tasks.filter(t => !t.completed).length;

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Manage your study tasks and track progress</p>
        </div>
        <Button variant="gradient" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4">
          <ListTodo className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-bold">{tasks.length}</p>
          <p className="text-xs text-muted-foreground">Total Tasks</p>
        </div>
        <div className="glass rounded-xl p-4">
          <CheckSquare className="w-5 h-5 text-success mb-2" />
          <p className="text-2xl font-bold">{completedCount}</p>
          <p className="text-xs text-muted-foreground">Completed</p>
        </div>
        <div className="glass rounded-xl p-4">
          <Filter className="w-5 h-5 text-warning mb-2" />
          <p className="text-2xl font-bold">{activeCount}</p>
          <p className="text-xs text-muted-foreground">Active</p>
        </div>
        <div className="glass rounded-xl p-4">
          <CheckSquare className="w-5 h-5 text-muted-foreground mb-2" />
          <p className="text-2xl font-bold">
            {tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0}%
          </p>
          <p className="text-xs text-muted-foreground">Progress</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex gap-2 p-1 rounded-lg bg-secondary/50">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f}
            </Button>
          ))}
        </div>
        
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="pomodoros">Pomodoros</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {sortedTasks.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center">
            <ListTodo className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
            <h3 className="font-medium text-lg mb-2">No tasks yet</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Create your first task to start tracking your progress
            </p>
            <Button variant="gradient" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4" />
              Add Your First Task
            </Button>
          </div>
        ) : (
          sortedTasks.map((task) => (
            <TaskItem key={task.id} task={task} onEdit={handleEdit} />
          ))
        )}
      </div>

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm task={editingTask} onClose={handleCloseForm} />
      )}
    </div>
  );
}