import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        <div className="container max-w-6xl py-8 px-6 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
