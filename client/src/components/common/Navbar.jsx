import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Shield, Menu, X, Sparkles, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin, siteSettings } = useAuth();
  const { cartTotalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200 shadow-sm transition-all duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-brand-900 to-stone-900 text-stone-200 text-xs py-2 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-accent-gold animate-pulse" />
        <span>COD Available Nationwide • Register Account To Book Orders • 360° Product Angle Previews</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white font-serif font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              A
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 block leading-none">
                {siteSettings?.storeName?.split(' ')[0] || 'AALEESTUDIO'}
              </span>
              <span className="text-[10px] tracking-widest text-brand-600 uppercase font-semibold block mt-0.5">
                {siteSettings?.storeName?.split(' ').slice(1).join(' ') || 'PREMIUM APPAREL'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-7 font-medium text-sm">
            <Link
              to="/"
              className={`transition-colors hover:text-brand-600 ${
                isActive('/') ? 'text-brand-600 font-semibold border-b-2 border-brand-600 pb-1' : 'text-stone-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`transition-colors hover:text-brand-600 ${
                isActive('/products') ? 'text-brand-600 font-semibold border-b-2 border-brand-600 pb-1' : 'text-stone-600'
              }`}
            >
              Shop Collection
            </Link>
            <Link
              to="/orders"
              className={`transition-colors flex items-center gap-1.5 hover:text-brand-600 ${
                isActive('/orders') ? 'text-brand-600 font-semibold border-b-2 border-brand-600 pb-1' : 'text-stone-600'
              }`}
            >
              <Package className="w-4 h-4 text-brand-600" />
              <span>Track Orders</span>
            </Link>
            <Link
              to="/about"
              className={`transition-colors hover:text-brand-600 ${
                isActive('/about') ? 'text-brand-600 font-semibold border-b-2 border-brand-600 pb-1' : 'text-stone-600'
              }`}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className={`transition-colors hover:text-brand-600 ${
                isActive('/contact') ? 'text-brand-600 font-semibold border-b-2 border-brand-600 pb-1' : 'text-stone-600'
              }`}
            >
              Contact Us
            </Link>
            <Link
              to="/terms"
              className={`transition-colors hover:text-brand-600 ${
                isActive('/terms') ? 'text-brand-600 font-semibold border-b-2 border-brand-600 pb-1' : 'text-stone-600'
              }`}
            >
              Rules & Terms
            </Link>
          </div>

          {/* Action Icons & User Account */}
          <div className="hidden md:flex items-center gap-5">
            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2 text-stone-700 hover:text-brand-600 transition-colors">
              <ShoppingBag className="w-6 h-6" />
              {cartTotalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {cartTotalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l border-stone-200">
                <Link
                  to={isAdmin ? '/admin' : '/orders'}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium transition-colors"
                >
                  {isAdmin ? <Shield className="w-4 h-4 text-brand-600" /> : <User className="w-4 h-4 text-stone-600" />}
                  <span>{user.name}</span>
                  {isAdmin && <span className="bg-brand-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">ADMIN</span>}
                </Link>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-stone-500 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 pl-4 border-l border-stone-200">
                <Link
                  to="/login"
                  className="text-sm font-medium text-stone-700 hover:text-brand-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-brand-600 rounded-full shadow-md hover:shadow-lg transition-all"
                >
                  Register Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center gap-3">
            <Link to="/cart" className="relative p-2 text-stone-700">
              <ShoppingBag className="w-6 h-6" />
              {cartTotalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartTotalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 hover:text-brand-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-700 font-medium border-b border-stone-100"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-700 font-medium border-b border-stone-100"
          >
            Shop Collection
          </Link>
          <Link
            to="/orders"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-brand-600 font-bold border-b border-stone-100 flex items-center gap-2"
          >
            <Package className="w-4 h-4" /> Track My Orders
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-700 font-medium border-b border-stone-100"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-700 font-medium border-b border-stone-100"
          >
            Contact Us
          </Link>
          <Link
            to="/terms"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-700 font-medium border-b border-stone-100"
          >
            Rules & Terms
          </Link>

          {user ? (
            <div className="pt-2 space-y-2">
              <Link
                to={isAdmin ? '/admin' : '/orders'}
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2 bg-stone-100 text-stone-800 rounded font-medium text-sm"
              >
                {isAdmin ? 'Admin Dashboard' : 'My Orders & Profile'}
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-center py-2 text-red-600 font-medium text-sm border border-red-200 rounded"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-2 space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2 text-stone-800 font-medium border border-stone-300 rounded"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2 bg-brand-600 text-white font-medium rounded"
              >
                Register Account
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
