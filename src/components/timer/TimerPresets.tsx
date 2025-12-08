import { useStudyStore } from '@/store/studyStore';
import { cn } from '@/lib/utils';
import type { TimerPreset } from '@/types/study';

export function TimerPresets() {
  const { timerPresets, timerSettings, applyPreset } = useStudyStore();

  const isPresetActive = (preset: TimerPreset) => {
    return (
      timerSettings.workDuration === preset.workDuration &&
      timerSettings.shortBreakDuration === preset.shortBreakDuration &&
      timerSettings.longBreakDuration === preset.longBreakDuration
    );
  };

  return (
    <div className="glass rounded-xl p-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Presets</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {timerPresets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => applyPreset(preset)}
            className={cn(
              "p-3 rounded-lg text-left transition-all hover:scale-[1.02]",
              isPresetActive(preset)
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/50 hover:bg-secondary"
            )}
          >
            <span className="text-xl mb-1 block">{preset.icon}</span>
            <span className="text-sm font-medium block">{preset.name}</span>
            <span className={cn(
              "text-xs",
              isPresetActive(preset) ? "text-primary-foreground/80" : "text-muted-foreground"
            )}>
              {preset.workDuration}m / {preset.shortBreakDuration}m
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
