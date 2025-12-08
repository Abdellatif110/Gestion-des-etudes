import { useState } from 'react';
import { Clock, Bell, Volume2, RotateCcw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useStudyStore } from '@/store/studyStore';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { timerSettings, setTimerSettings, resetSessions } = useStudyStore();
  const [localSettings, setLocalSettings] = useState(timerSettings);

  const handleSave = () => {
    setTimerSettings(localSettings);
    toast.success('Settings saved successfully!');
  };

  const handleReset = () => {
    const defaultSettings = {
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      sessionsUntilLongBreak: 4,
      autoStartBreaks: false,
      autoStartWork: false,
      soundEnabled: true,
    };
    setLocalSettings(defaultSettings);
    setTimerSettings(defaultSettings);
    toast.success('Settings reset to defaults');
  };

  const handleResetSessions = () => {
    resetSessions();
    toast.success('Session count reset');
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Customize your study experience</p>
      </div>

      {/* Timer Settings */}
      <div className="glass rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">Timer Settings</h2>
            <p className="text-sm text-muted-foreground">Configure your Pomodoro durations</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="work">Focus Duration (minutes)</Label>
            <Input
              id="work"
              type="number"
              min="1"
              max="120"
              value={localSettings.workDuration}
              onChange={(e) => setLocalSettings({ ...localSettings, workDuration: parseInt(e.target.value) || 25 })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shortBreak">Short Break (minutes)</Label>
            <Input
              id="shortBreak"
              type="number"
              min="1"
              max="60"
              value={localSettings.shortBreakDuration}
              onChange={(e) => setLocalSettings({ ...localSettings, shortBreakDuration: parseInt(e.target.value) || 5 })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longBreak">Long Break (minutes)</Label>
            <Input
              id="longBreak"
              type="number"
              min="1"
              max="60"
              value={localSettings.longBreakDuration}
              onChange={(e) => setLocalSettings({ ...localSettings, longBreakDuration: parseInt(e.target.value) || 15 })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sessions">Sessions Until Long Break</Label>
            <Input
              id="sessions"
              type="number"
              min="1"
              max="10"
              value={localSettings.sessionsUntilLongBreak}
              onChange={(e) => setLocalSettings({ ...localSettings, sessionsUntilLongBreak: parseInt(e.target.value) || 4 })}
            />
          </div>
        </div>
      </div>

      {/* Auto-Start Settings */}
      <div className="glass rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-success" />
          </div>
          <div>
            <h2 className="font-semibold">Automation</h2>
            <p className="text-sm text-muted-foreground">Configure automatic timer behavior</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="autoBreaks">Auto-start Breaks</Label>
              <p className="text-sm text-muted-foreground">Automatically start breaks after focus sessions</p>
            </div>
            <Switch
              id="autoBreaks"
              checked={localSettings.autoStartBreaks}
              onCheckedChange={(checked) => setLocalSettings({ ...localSettings, autoStartBreaks: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="autoWork">Auto-start Focus</Label>
              <p className="text-sm text-muted-foreground">Automatically start focus sessions after breaks</p>
            </div>
            <Switch
              id="autoWork"
              checked={localSettings.autoStartWork}
              onCheckedChange={(checked) => setLocalSettings({ ...localSettings, autoStartWork: checked })}
            />
          </div>
        </div>
      </div>

      {/* Sound Settings */}
      <div className="glass rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
            <Volume2 className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h2 className="font-semibold">Sound</h2>
            <p className="text-sm text-muted-foreground">Configure notification sounds</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="sound">Notification Sound</Label>
            <p className="text-sm text-muted-foreground">Play sound when timer completes</p>
          </div>
          <Switch
            id="sound"
            checked={localSettings.soundEnabled}
            onCheckedChange={(checked) => setLocalSettings({ ...localSettings, soundEnabled: checked })}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <Button variant="gradient" onClick={handleSave}>
          <Save className="w-4 h-4" />
          Save Settings
        </Button>
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="w-4 h-4" />
          Reset to Defaults
        </Button>
        <Button variant="secondary" onClick={handleResetSessions}>
          Reset Session Count
        </Button>
      </div>

      {/* About */}
      <div className="glass rounded-xl p-6">
        <h2 className="font-semibold mb-2">About StudyFlow</h2>
        <p className="text-sm text-muted-foreground mb-4">
          StudyFlow is a productivity app designed to help you focus, manage tasks, and achieve your study goals using the proven Pomodoro Technique.
        </p>
        <p className="text-xs text-muted-foreground">Version 1.0.0</p>
      </div>
    </div>
  );
}