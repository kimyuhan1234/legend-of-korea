"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Flag,
  Map,
  BarChart3,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

const NAV_ITEMS = [
  { name: '대시보드', icon: LayoutDashboard, href: '/admin' },
  { name: '주문 관리', icon: ShoppingBag, href: '/admin/orders' },
  { name: 'B2B 관리', icon: Users, href: '/admin/b2b' },
  { name: '미션 관리', icon: Map, href: '/admin/missions' },
  { name: '커뮤니티 관리', icon: Flag, href: '/admin/community' },
  { name: '통계 분석', icon: BarChart3, href: '/admin/stats' },
];

export default function AdminLayout({ children, params }: AdminLayoutProps) {
  const { locale } = params;
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActive = (href: string) => {
    const fullPath = `/${locale}${href}`;
    return pathname === fullPath || (href !== '/admin' && pathname.startsWith(fullPath));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-br from-mint to-blossom text-ink transition-transform duration-300 ease-in-out transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 border-r border-slate-800
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 flex items-center justify-between">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#F0B8B8] flex items-center justify-center font-black text-[#111]">
                L
              </div>
              <span className="font-black text-xl tracking-tighter">LOK ADMIN</span>
            </Link>
            <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              const linkHref = `/${locale}${item.href}`;
              
              return (
                <Link
                  key={item.href}
                  href={linkHref}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                    ${active 
                      ? 'bg-[#F0B8B8] text-[#111] font-bold shadow-lg shadow-[#F0B8B8]/20' 
                      : 'hover:bg-white/5 text-slate-400 hover:text-white'}
                  `}
                >
                  <item.icon className={`w-5 h-5 ${active ? 'text-[#111]' : 'group-hover:scale-110 transition-transform'}`} />
                  <span className="flex-1 text-sm">{item.name}</span>
                  {active && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-800 space-y-2">
            <Link href={`/${locale}`} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all text-sm">
              <Globe className="w-5 h-5" />
              <span>메인 홈페이지</span>
            </Link>
            <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20 px-4 py-6 rounded-xl">
              <LogOut className="w-5 h-5 mr-3" />
              <span>로그아웃</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
          <button 
            className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-[#111]">관리자</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Super Admin</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-cloud text-blossom-deep flex items-center justify-center font-black ring-2 ring-slate-100">
              A
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 md:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
