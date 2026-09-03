import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !email.trim() || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    try {
      await register(name, email, password, phone);
      navigate('/');
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-brand-600 text-white font-serif font-bold text-xl flex items-center justify-center mx-auto shadow-md">
            A
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">Create Account</h2>
          <p className="text-xs text-stone-500">Register your customer account to book Cash on Delivery orders</p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-red-700 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1 text-stone-700">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-brand-600 outline-none"
                placeholder="Muhammad Ali"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-stone-700">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-brand-600 outline-none"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-stone-700">Phone Number *</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-brand-600 outline-none"
                placeholder="+92 300 1234567"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-stone-700">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-brand-600 outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-brand-600 text-white font-semibold text-xs hover:bg-brand-700 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-stone-500">
          <span>Already have an account? </span>
          <Link to="/login" className="font-bold text-brand-600 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
