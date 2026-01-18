import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Trash2, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStudyStore } from '@/store/studyStore';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/types/study';

const studyTips = [
  "Try the Pomodoro technique: 25 minutes of focused work followed by a 5-minute break.",
  "Active recall is more effective than passive reading. Test yourself frequently!",
  "Space out your study sessions over time for better long-term retention.",
  "Get enough sleep - it's crucial for memory consolidation.",
  "Exercise regularly to boost brain function and memory.",
  "Use mnemonic devices to remember complex information.",
  "Take handwritten notes - they improve understanding and retention.",
  "Teach others what you've learned to deepen your understanding.",
  "Create a dedicated study space free from distractions.",
  "Break large tasks into smaller, manageable chunks.",
];

const quickPrompts = [
  "Give me a study tip",
  "How can I focus better?",
  "Help me create a study plan",
  "Explain the Pomodoro technique",
];

export default function AssistantPage() {
  const { chatMessages, addChatMessage, clearChat, tasks, completedSessions, timerSettings } = useStudyStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const generateResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Contextual responses based on user's data
    const totalMinutes = completedSessions * timerSettings.workDuration;
    const completedTasksCount = tasks.filter(t => t.completed).length;
    const pendingTasksCount = tasks.filter(t => !t.completed).length;

    if (message.includes('tip') || message.includes('advice')) {
      return studyTips[Math.floor(Math.random() * studyTips.length)];
    }

    if (message.includes('focus') || message.includes('concentrate')) {
      return "To improve focus:\n\n1. **Eliminate distractions** - Put your phone away and close unnecessary tabs\n2. **Use the Pomodoro technique** - Work for 25 minutes, then take a short break\n3. **Stay hydrated** - Drink water regularly\n4. **Take breaks** - Short breaks help maintain concentration\n5. **Set clear goals** - Know exactly what you want to accomplish";
    }

    if (message.includes('plan') || message.includes('schedule')) {
      return `Based on your current progress:\n\n📊 **Your Stats:**\n- Total focus time: ${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m\n- Completed sessions: ${completedSessions}\n- Tasks completed: ${completedTasksCount}\n- Pending tasks: ${pendingTasksCount}\n\n📋 **Recommended Plan:**\n1. Start with your highest priority task\n2. Use 25-minute focus sessions\n3. Take 5-minute breaks between sessions\n4. After 4 sessions, take a longer 15-minute break\n5. Review completed tasks at the end of the day`;
    }

    if (message.includes('pomodoro')) {
      return "**The Pomodoro Technique:**\n\n1. Choose a task to work on\n2. Set a timer for 25 minutes\n3. Work until the timer rings\n4. Take a short 5-minute break\n5. Every 4 pomodoros, take a longer break (15-30 min)\n\n💡 **Tip:** I see you've completed " + completedSessions + " sessions today! Keep up the great work!";
    }

    if (message.includes('progress') || message.includes('how am i doing')) {
      if (completedSessions === 0) {
        return "You haven't started any sessions yet today. Let's get going! Head to the Timer page and start your first focus session. 🎯";
      }
      return `Great job! Here's your progress:\n\n✅ ${completedSessions} focus sessions completed\n⏱️ ${totalMinutes} minutes of focused work\n📝 ${completedTasksCount} tasks completed\n📋 ${pendingTasksCount} tasks remaining\n\nKeep up the momentum! 💪`;
    }

    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return `Hello! I'm your StudyFlow AI assistant. 👋\n\nI can help you with:\n- Study tips and techniques\n- Creating study plans\n- Tracking your progress\n- Motivation and focus advice\n\nHow can I help you today?`;
    }

    if (message.includes('motivation') || message.includes('motivate')) {
      const motivationalMessages = [
        "Remember: Every expert was once a beginner. Keep pushing forward! 💪",
        "Small progress is still progress. Celebrate every completed task! 🎉",
        "Your future self will thank you for the work you put in today. 🌟",
        "Focus on progress, not perfection. You're doing great! ✨",
        "Difficult roads often lead to beautiful destinations. Keep going! 🚀",
      ];
      return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    }

    // Default response
    return `I understand you're asking about "${userMessage}". Here are some general study tips:\n\n${studyTips[Math.floor(Math.random() * studyTips.length)]}\n\nFeel free to ask me about:\n- Study tips and techniques\n- Focus and concentration\n- Creating study plans\n- The Pomodoro technique\n- Your progress`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    addChatMessage(userMessage);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const response = generateResponse(userMessage.content);
    
    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setIsTyping(false);
    addChatMessage(assistantMessage);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            AI Study Assistant
          </h1>
          <p className="text-muted-foreground">Get personalized study tips and guidance</p>
        </div>
        {chatMessages.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearChat}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Chat
          </Button>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 glass rounded-xl p-4 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {chatMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center mb-4 shadow-glow">
                <Bot className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">How can I help you study?</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-md">
                Ask me about study techniques, get personalized tips, or let me help you create a study plan.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {quickPrompts.map((prompt) => (
                  <Button
                    key={prompt}
                    variant="secondary"
                    size="sm"
                    onClick={() => handleQuickPrompt(prompt)}
                    className="text-xs"
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3 animate-slide-up",
                    message.role === 'user' && "flex-row-reverse"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    message.role === 'assistant' 
                      ? "gradient-hero text-primary-foreground" 
                      : "bg-secondary"
                  )}>
                    {message.role === 'assistant' ? (
                      <Bot className="w-4 h-4" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <div className={cn(
                    "max-w-[80%] rounded-2xl p-4",
                    message.role === 'assistant' 
                      ? "bg-secondary text-secondary-foreground" 
                      : "gradient-primary text-primary-foreground"
                  )}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3 animate-slide-up">
                  <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="bg-secondary rounded-2xl p-4">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-border">
          <Input
            placeholder="Ask me anything about studying..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button variant="gradient" onClick={handleSend} disabled={!input.trim() || isTyping}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
