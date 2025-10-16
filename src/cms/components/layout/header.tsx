'use client';

import React from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';
import { Input } from '@/cms/components/ui/input';
import { Button } from '@/cms/components/ui/button';
import { Badge } from '@/cms/components/ui/badge';

interface HeaderProps {
  onMenuToggle: () => void;
  title?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, title, breadcrumbs }) => {
  return (
    <header className="bg-black backdrop-blur-sm border-b border-gray-200/50 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {title && (
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
              {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <span>/</span>}
                      {crumb.href ? (
                        <a
                          href={crumb.href}
                          className="hover:text-gray-700 transition-colors"
                        >
                          {crumb.label}
                        </a>
                      ) : (
                        <span>{crumb.label}</span>
                      )}
                    </React.Fragment>
                  ))}
                </nav>
              )}
            </div>
          )}
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search content..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <Badge
              variant="error"
              size="sm"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
            >
              3
            </Badge>
          </Button>

          {/* User menu */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@example.com</p>
            </div>
            <Button variant="ghost" size="sm" className="p-0">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
