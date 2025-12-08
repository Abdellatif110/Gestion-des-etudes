import { useState } from 'react';
import { Plus, Target, Trophy, Clock, Zap, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useStudyStore } from '@/store/studyStore';
import { cn } from '@/lib/utils';
import type { StudyGoal } from '@/types/study';

export default function GoalsPage() {
  const { studyGoals, addStudyGoal, updateStudyGoal, deleteStudyGoal, completedSessions, timerSettings } = useStudyStore();
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    targetMinutes: 60,
    targetSessions: 4,
  });

  const totalMinutesToday = completedSessions * timerSettings.workDuration;

  const handleAddGoal = () => {
    if (!newGoal.title.trim()) return;
    const goal: StudyGoal = {
      id: crypto.randomUUID(),
      title: newGoal.title,
      targetMinutes: newGoal.targetMinutes,
      currentMinutes: 0,
      targetSessions: newGoal.targetSessions,
      currentSessions: 0,
      completed: false,
      createdAt: new Date(),
    };
    addStudyGoal(goal);
    setNewGoal({ title: '', targetMinutes: 60, targetSessions: 4 });
    setShowAddGoal(false);
  };

  const toggleGoalComplete = (goal: StudyGoal) => {
    updateStudyGoal(goal.id, { completed: !goal.completed });
  };

  const activeGoals = studyGoals.filter(g => !g.completed);
  const completedGoals = studyGoals.filter(g => g.completed);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Target className="w-8 h-8 text-primary" />
            Study Goals
          </h1>
          <p className="text-muted-foreground">Set and track your study objectives</p>
        </div>
        <Button variant="gradient" onClick={() => setShowAddGoal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Goal
        </Button>
      </div>

      {/* Today's Progress Card */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">Today's Progress</h2>
            <p className="text-sm text-muted-foreground">Keep up the great work!</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-secondary/50">
            <Clock className="w-5 h-5 text-primary mb-2" />
            <p className="text-2xl font-bold">{Math.floor(totalMinutesToday / 60)}h {totalMinutesToday % 60}m</p>
            <p className="text-sm text-muted-foreground">Focus Time</p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/50">
            <Target className="w-5 h-5 text-timer-work mb-2" />
            <p className="text-2xl font-bold">{completedSessions}</p>
            <p className="text-sm text-muted-foreground">Sessions</p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/50">
            <CheckCircle2 className="w-5 h-5 text-success mb-2" />
            <p className="text-2xl font-bold">{completedGoals.length}</p>
            <p className="text-sm text-muted-foreground">Goals Completed</p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/50">
            <Trophy className="w-5 h-5 text-warning mb-2" />
            <p className="text-2xl font-bold">{activeGoals.length}</p>
            <p className="text-sm text-muted-foreground">Active Goals</p>
          </div>
        </div>
      </div>

      {/* Add Goal Form */}
      {showAddGoal && (
        <div className="glass rounded-xl p-6 space-y-4 animate-slide-up">
          <h3 className="font-semibold">Create New Goal</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>Goal Title</Label>
              <Input
                placeholder="e.g., Complete Chapter 5"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Target Minutes</Label>
              <Input
                type="number"
                min="15"
                max="480"
                value={newGoal.targetMinutes}
                onChange={(e) => setNewGoal({ ...newGoal, targetMinutes: parseInt(e.target.value) || 60 })}
              />
            </div>
            <div>
              <Label>Target Sessions</Label>
              <Input
                type="number"
                min="1"
                max="20"
                value={newGoal.targetSessions}
                onChange={(e) => setNewGoal({ ...newGoal, targetSessions: parseInt(e.target.value) || 4 })}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="gradient" onClick={handleAddGoal}>Create Goal</Button>
            <Button variant="outline" onClick={() => setShowAddGoal(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Active Goals */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Active Goals</h2>
        <div className="space-y-4">
          {activeGoals.map((goal) => {
            const minuteProgress = Math.min((goal.currentMinutes / goal.targetMinutes) * 100, 100);
            const sessionProgress = Math.min((goal.currentSessions / goal.targetSessions) * 100, 100);
            const avgProgress = (minuteProgress + sessionProgress) / 2;
            
            return (
              <div key={goal.id} className="glass rounded-xl p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      avgProgress >= 100 ? "bg-success/20" : "bg-primary/20"
                    )}>
                      {avgProgress >= 100 ? (
                        <Trophy className="w-5 h-5 text-success" />
                      ) : (
                        <Target className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{goal.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {Math.round(avgProgress)}% complete
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleGoalComplete(goal)}
                      className="text-success"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Complete
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteStudyGoal(goal.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Time Progress</span>
                      <span>{goal.currentMinutes} / {goal.targetMinutes} min</span>
                    </div>
                    <Progress value={minuteProgress} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Session Progress</span>
                      <span>{goal.currentSessions} / {goal.targetSessions}</span>
                    </div>
                    <Progress value={sessionProgress} className="h-2" />
                  </div>
                </div>
              </div>
            );
          })}
          {activeGoals.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No active goals. Set a goal to stay motivated!</p>
            </div>
          )}
        </div>
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-warning" />
            Completed Goals
          </h2>
          <div className="space-y-3">
            {completedGoals.map((goal) => (
              <div key={goal.id} className="glass rounded-xl p-4 opacity-75">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <span className="line-through text-muted-foreground">{goal.title}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteStudyGoal(goal.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}