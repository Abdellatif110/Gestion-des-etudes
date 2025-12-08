import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Timer,
  CheckSquare,
  FileText,
  BarChart3,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Layers,
  Target,
  LogOut,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { icon: Timer, label: 'Focus Timer', path: '/timer' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
  { icon: FileText, label: 'Notes', path: '/notes' },
  { icon: Layers, label: 'Flashcards', path: '/flashcards' },
  { icon: Target, label: 'Goals', path: '/goals' },
  { icon: BarChart3, label: 'Statistics', path: '/stats' },
  { icon: Sparkles, label: 'AI Assistant', path: '/assistant' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 px-4 h-16 border-b border-sidebar-border",
        collapsed && "justify-center px-2"
      )}>
        <div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-hero shadow-md">
          <GraduationCap className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-semibold text-sidebar-foreground">StudyFlow</span>
            <span className="text-xs text-muted-foreground">Focus & Learn</span>
          </div>
        )}
      </div>

      {/* User Profile */}
      {user && (
        <div className={cn(
          "p-3 border-b border-sidebar-border",
          collapsed && "px-2"
        )}>
          <div className={cn(
            "flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent/50",
            collapsed && "justify-center"
          )}>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground shrink-0">
              <User className="w-4 h-4" />
            </div>
            {!collapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-medium text-sidebar-foreground truncate">
                  {user.email}
                </span>
                <span className="text-xs text-muted-foreground">Learner</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 shrink-0 transition-transform group-hover:scale-110",
                isActive && "drop-shadow-sm"
              )} />
              {!collapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Theme Toggle, Collapse & Logout */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        <div className={cn(
          "flex items-center",
          collapsed ? "justify-center" : "justify-between"
        )}>
          <ThemeToggle />
          {!collapsed && <span className="text-xs text-muted-foreground">Theme</span>}
        </div>

        {/* Logout Button */}
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          onClick={handleLogout}
          className={cn(
            "w-full justify-center text-destructive hover:text-destructive hover:bg-destructive/10",
            !collapsed && "justify-start gap-3"
          )}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span className="text-sm">Logout</span>}
        </Button>

        {/* Collapse Button */}
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full justify-center",
            !collapsed && "justify-start gap-3"
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
