import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useStudyStore } from '@/store/studyStore';
import { cn } from '@/lib/utils';
import type { TimerMode } from '@/types/study';

export function TimerDisplay() {
  const {
    timerSettings,
    currentMode,
    timeRemaining,
    isRunning,
    completedSessions,
    setTimeRemaining,
    setIsRunning,
    setCurrentMode,
    incrementSessions,
    currentTaskId,
    incrementTaskPomodoro,
  } = useStudyStore();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const totalDuration = 
    currentMode === 'work' ? timerSettings.workDuration * 60 :
    currentMode === 'shortBreak' ? timerSettings.shortBreakDuration * 60 :
    timerSettings.longBreakDuration * 60;

  const progress = ((totalDuration - timeRemaining) / totalDuration) * 100;
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const handleTimerComplete = React.useCallback(() => {
    setIsRunning(false);

    if (timerSettings.soundEnabled) {
      // Play notification sound
      const audio = new Audio('/notification.mp3');
      audio.play().catch(() => {});
    }

    if (currentMode === 'work') {
      incrementSessions();
      if (currentTaskId) {
        incrementTaskPomodoro(currentTaskId);
      }
      
      // Decide next break type
      const nextMode: TimerMode =
        (completedSessions + 1) % timerSettings.sessionsUntilLongBreak === 0
          ? 'longBreak'
          : 'shortBreak';
      
      if (timerSettings.autoStartBreaks) {
        setCurrentMode(nextMode);
        setTimeout(() => setIsRunning(true), 500);
      } else {
        setCurrentMode(nextMode);
      }
    } else {
      if (timerSettings.autoStartWork) {
        setCurrentMode('work');
        setTimeout(() => setIsRunning(true), 500);
      } else {
        setCurrentMode('work');
      }
    }
  }, [
    completedSessions,
    currentTaskId,
    incrementSessions,
    incrementTaskPomodoro,
    setCurrentMode,
    setIsRunning,
    timerSettings,
    currentMode,
  ]);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handleTimerComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining, handleTimerComplete, setTimeRemaining]);

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    const duration = 
      currentMode === 'work' ? timerSettings.workDuration :
      currentMode === 'shortBreak' ? timerSettings.shortBreakDuration :
      timerSettings.longBreakDuration;
    setTimeRemaining(duration * 60);
  };

  const handleSkip = () => {
    setIsRunning(false);
    if (currentMode === 'work') {
      const nextMode: TimerMode =
        (completedSessions + 1) % timerSettings.sessionsUntilLongBreak === 0
          ? 'longBreak'
          : 'shortBreak';
      setCurrentMode(nextMode);
    } else {
      setCurrentMode('work');
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const modeConfig = {
    work: {
      label: 'Focus Time',
      color: 'text-timer-work',
      ringColor: 'stroke-timer-work',
      bgGlow: 'shadow-glow',
    },
    shortBreak: {
      label: 'Short Break',
      color: 'text-timer-break',
      ringColor: 'stroke-timer-break',
      bgGlow: 'shadow-[0_0_60px_hsl(158_64%_50%/0.25)]',
    },
    longBreak: {
      label: 'Long Break',
      color: 'text-timer-longBreak',
      ringColor: 'stroke-timer-longBreak',
      bgGlow: 'shadow-[0_0_60px_hsl(220_70%_60%/0.25)]',
    },
  };

  const config = modeConfig[currentMode];

  return (
    <>
      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center gap-12">
          {/* Close Button */}
          <div className="absolute top-8 right-8">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleFullscreen}
              className="rounded-full"
            >
              <Minimize2 className="w-5 h-5" />
            </Button>
          </div>

          {/* Fullscreen Timer Circle */}
          <div className={cn(
            "relative w-96 h-96 flex items-center justify-center rounded-full transition-shadow duration-500",
            isRunning && config.bgGlow
          )}>
            {/* SVG Ring */}
            <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 200 200">
              {/* Background ring */}
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                className="stroke-muted/30"
                strokeWidth="8"
              />
              {/* Progress ring */}
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                className={cn("transition-all duration-300", config.ringColor)}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>

            {/* Time Display */}
            <div className="flex flex-col items-center z-10">
              <span className={cn("text-8xl font-bold tabular-nums tracking-tight", config.color)}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
              <span className="text-lg text-muted-foreground mt-4">{config.label}</span>
            </div>
          </div>

          {/* Fullscreen Controls */}
          <div className="flex items-center gap-6">
            <Button
              variant="outline"
              size="icon-lg"
              onClick={handleReset}
              className="rounded-full"
            >
              <RotateCcw className="w-6 h-6" />
            </Button>

            <Button
              variant="timer"
              size="xl"
              onClick={handlePlayPause}
              className={cn(
                "rounded-full w-24 h-24 text-xl",
                currentMode === 'shortBreak' && "bg-timer-break hover:bg-timer-break/90",
                currentMode === 'longBreak' && "bg-timer-longBreak hover:bg-timer-longBreak/90"
              )}
            >
              {isRunning ? (
                <Pause className="w-10 h-10" />
              ) : (
                <Play className="w-10 h-10 ml-1" />
              )}
            </Button>

            <Button
              variant="outline"
              size="icon-lg"
              onClick={handleSkip}
              className="rounded-full"
            >
              <SkipForward className="w-6 h-6" />
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-8">
        {/* Mode Selector */}
        <div className="flex gap-2 p-1.5 rounded-xl bg-secondary/50 glass">
          {(['work', 'shortBreak', 'longBreak'] as const).map((mode) => (
            <Button
              key={mode}
              variant="ghost"
              size="sm"
              onClick={() => setCurrentMode(mode)}
              className={cn(
                "px-4 py-2 transition-all",
                currentMode === mode && mode === 'work' && "bg-timer-work text-white hover:bg-timer-work/90",
                currentMode === mode && mode === 'shortBreak' && "bg-timer-break text-white hover:bg-timer-break/90",
                currentMode === mode && mode === 'longBreak' && "bg-timer-longBreak text-white hover:bg-timer-longBreak/90",
                currentMode !== mode && "hover:bg-secondary/80"
              )}
            >
              {mode === 'work' ? 'Focus' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
            </Button>
          ))}
        </div>

        {/* Timer Circle */}
        <div className={cn(
          "relative w-64 h-64 flex items-center justify-center rounded-full transition-shadow duration-500",
          isRunning && config.bgGlow
        )}>
          {/* SVG Ring */}
          <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 200 200">
            {/* Background ring */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              className="stroke-muted/30"
              strokeWidth="8"
            />
            {/* Progress ring */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              className={cn("transition-all duration-300", config.ringColor)}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>

          {/* Time Display */}
          <div className="flex flex-col items-center z-10">
            <span className={cn("text-6xl font-bold tabular-nums tracking-tight", config.color)}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-sm text-muted-foreground mt-2">{config.label}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon-lg"
            onClick={handleReset}
            className="rounded-full"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
          
          <Button
            variant="timer"
            size="xl"
            onClick={handlePlayPause}
            className={cn(
              "rounded-full w-20 h-20 text-lg",
              currentMode === 'shortBreak' && "bg-timer-break hover:bg-timer-break/90",
              currentMode === 'longBreak' && "bg-timer-longBreak hover:bg-timer-longBreak/90"
            )}
          >
            {isRunning ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon-lg"
            onClick={handleSkip}
            className="rounded-full"
          >
            <SkipForward className="w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            size="icon-lg"
            onClick={toggleFullscreen}
            className="rounded-full"
          >
            <Maximize2 className="w-5 h-5" />
          </Button>
          <ThemeToggle />
        </div>

        {/* Session Counter */}
        <div className="flex items-center gap-2">
          {Array.from({ length: timerSettings.sessionsUntilLongBreak }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                i < completedSessions % timerSettings.sessionsUntilLongBreak
                  ? "bg-primary scale-110"
                  : "bg-muted"
              )}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          {completedSessions} sessions completed today
        </p>
      </div>
    </>
  );
}
