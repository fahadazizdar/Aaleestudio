import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Users,
  Settings,
  MessageSquare,
  ArrowLeft,
  Menu,
  X,
  Shield
} from 'lucide-react';

export default function AdminSidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: 'Overview Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Product Catalog', path: '/admin/products', icon: ShoppingBag },
    { label: 'Orders Pipeline', path: '/admin/orders', icon: ClipboardList },
    { label: 'Customer Accounts', path: '/admin/customers', icon: Users },
    { label: 'Customer Inquiries', path: '/admin/inquiries', icon: MessageSquare },
    { label: 'Rules & Store Settings', path: '/admin/settings', icon: Settings }
  ];

  const activeLink = links.find((l) => l.path === location.pathname);

  return (
    <>
      {/* 1. Mobile Top Navigation Bar (Shown ONLY on Mobile md:hidden) */}
      <div className="md:hidden sticky top-16 z-40 bg-stone-900 text-stone-200 px-4 py-3 border-b border-stone-800 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest text-brand-400 uppercase block">
              Admin Portal
            </span>
            <span className="font-semibold text-xs text-white block">
              {activeLink?.label || 'Control Dashboard'}
            </span>
          </div>
        </div>

        {/* Hamburger Toggle Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-stone-800 text-stone-200 hover:text-white hover:bg-stone-700 transition-colors"
          aria-label="Toggle Admin Menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* 2. Mobile Drawer Slide-over Menu (Shown when mobileOpen is true) */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex justify-end">
          <div className="w-4/5 max-w-xs bg-stone-900 text-stone-300 p-6 flex flex-col justify-between h-full shadow-2xl border-l border-stone-800 animate-in slide-in-from-right duration-300">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-brand-400 uppercase block">
                    Admin Navigation
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white mt-0.5">
                    Control Panel
                  </h3>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-stone-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-2">
                {links.map((link) => {
                  const Icon = link.icon;
                  const active = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-xs transition-all ${
                        active
                          ? 'bg-brand-600 text-white font-semibold shadow-md'
                          : 'text-stone-400 hover:bg-stone-800 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-stone-800">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Store Front</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 3. Desktop Persistent Sidebar (Hidden on Mobile, flex on Desktop md:flex) */}
      <aside className="hidden md:flex w-64 bg-stone-900 text-stone-300 p-6 flex-col justify-between border-r border-stone-800 min-h-screen sticky top-0 flex-shrink-0">
        <div className="space-y-8">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-brand-400 uppercase block">
              Admin Management
            </span>
            <h2 className="font-serif text-xl font-bold text-white tracking-wide mt-1">
              Control Portal
            </h2>
          </div>

          <nav className="space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-xs transition-all ${
                    active
                      ? 'bg-brand-600 text-white font-semibold shadow-md'
                      : 'text-stone-400 hover:bg-stone-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-stone-800">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Store Front</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
