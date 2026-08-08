'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Settings, BarChart3, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { href: '/', label: '대시보드', icon: LayoutDashboard },
  { href: '/users', label: '사용자', icon: Users },
  { href: '/analytics', label: '분석', icon: BarChart3 },
  { href: '/settings', label: '설정', icon: Settings },
];

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* 모바일 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* 사이드바 */}
      <aside
        className={cn(
          'fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r bg-white dark:bg-gray-950 transition-transform duration-300 z-40',
          'lg:relative lg:top-0 lg:h-screen lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col gap-4 p-4">
          {/* 모바일 닫기 버튼 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden self-end"
          >
            <X className="w-5 h-5" />
          </Button>

          {/* 네비게이션 */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className="w-full justify-start gap-3"
                    onClick={onClose}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
