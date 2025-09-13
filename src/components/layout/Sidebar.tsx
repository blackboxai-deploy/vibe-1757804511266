'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: '📊'
  },
  {
    title: 'Clientes',
    href: '/clientes',
    icon: '👥'
  },
  {
    title: 'Leads',
    href: '/leads',
    icon: '🎯'
  },
  {
    title: 'Oportunidades',
    href: '/oportunidades',
    icon: '💰'
  },
  {
    title: 'Tarefas',
    href: '/tarefas',
    icon: '✅'
  },
  {
    title: 'Relatórios',
    href: '/relatorios',
    icon: '📈'
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-40">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">CRM</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Sistema CRM</h1>
            <p className="text-sm text-gray-500">Gestão de Vendas</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        <ul className="space-y-1 px-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 hover:bg-gray-50",
                    isActive 
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600" 
                      : "text-gray-700 hover:text-gray-900"
                  )}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">CS</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Carlos Silva</p>
            <p className="text-xs text-gray-500">Administrador</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <main className="h-full overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}