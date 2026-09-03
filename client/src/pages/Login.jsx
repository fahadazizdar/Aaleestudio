import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const fromMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter your email and password.');
      return;
    }

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(location.state?.from?.pathname || '/');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-brand-600 text-white font-serif font-bold text-xl flex items-center justify-center mx-auto shadow-md">
            A
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900">Welcome Back</h2>
          <p className="text-xs text-stone-500">Sign in to your account to book orders & manage profile</p>
        </div>

        {fromMessage && (
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs text-center font-medium">
            {fromMessage}
          </div>
        )}

        {errorMessage && (
          <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-red-700 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1 text-stone-700">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-brand-600 outline-none"
                placeholder="admin@aaleestudio.com"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-stone-700">Password</label>
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
            className="w-full py-3.5 rounded-xl bg-stone-900 text-white font-semibold text-xs hover:bg-brand-600 transition-all shadow-lg"
          >
            {loading ? 'Authenticating...' : 'Sign In To Account'}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-stone-500">
          <span>Don't have an account yet? </span>
          <Link to="/register" className="font-bold text-brand-600 hover:underline">
            Register Account Now
          </Link>
        </div>
      </div>
    </div>
  );
}
