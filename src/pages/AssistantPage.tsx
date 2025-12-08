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

  const generateResponse = async (userMessage: string): Promise<string> => {
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      // Fallback to a mock response if API key is not set
      const mockResponses = [
        "That's a great question! Based on your study progress, I recommend trying the Pomodoro technique - 25 minutes of focused work followed by a 5-minute break. You've completed " + completedSessions + " sessions so far, which is excellent!",
        "Active recall is one of the most effective study techniques. Instead of just reading your notes, try testing yourself on the material. This helps strengthen memory retention.",
        "Space out your study sessions over time rather than cramming. This distributed practice leads to better long-term retention of information.",
        "Getting enough sleep is crucial for memory consolidation. Make sure you're getting 7-9 hours of quality sleep each night to optimize your learning.",
        "Exercise regularly to boost brain function and memory. Even a short walk can improve cognitive performance and reduce stress.",
      ];
      return mockResponses[Math.floor(Math.random() * mockResponses.length)];
    }

    const GEMINI_CHAT_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

    const response = await fetch(`${GEMINI_CHAT_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a helpful AI study assistant. Provide personalized study tips, advice, and guidance. The user has completed ${completedSessions} sessions, has ${tasks.filter(t => t.completed).length} completed tasks, and ${tasks.filter(t => !t.completed).length} pending tasks. Total focus time: ${completedSessions * timerSettings.workDuration} minutes. Be encouraging and provide actionable advice.

User message: ${userMessage}`
          }]
        }]
      }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
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

    const response = await generateResponse(userMessage.content);

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
