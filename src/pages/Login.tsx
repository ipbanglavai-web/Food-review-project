import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Shield, Mail, Lock, ArrowLeft, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, currentUser } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/admin');
      } else {
        setError('Invalid email address or password. For demo administration, use admin@admin.com and password admin.');
      }
    } catch (e: any) {
      setError(e.message || 'Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Back to Home Button */}
      <div className="absolute top-6 left-6">
        <Link 
          to="/" 
          className="flex items-center gap-1.5 text-sm font-bold text-neutral-600 hover:text-red-600 transition"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 font-extrabold text-white shadow-lg shadow-red-200">
            FR
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-black text-neutral-900 tracking-tight font-sans">
          Sign In Portal
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-500">
          Admin & Moderator Verification Panel
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-neutral-100 rounded-2xl border border-neutral-100 sm:px-10">
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-2.5 text-sm text-red-600">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-neutral-500 uppercase tracking-wider">
                Email Address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <Mail size={16} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="admin@admin.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-neutral-200 rounded-xl text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-neutral-50"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-neutral-500 uppercase tracking-wider">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <Lock size={16} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="admin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-neutral-200 rounded-xl text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-neutral-50"
                />
              </div>
            </div>

            {/* Demo Credentials Alert */}
            <div className="p-3 bg-yellow-50/80 rounded-xl border border-yellow-100 text-[11px] text-yellow-800 leading-relaxed">
              <strong>Quick Demo Access:</strong> Use email <code className="bg-yellow-100 px-1 py-0.5 rounded text-red-600 font-bold">admin@admin.com</code> and password <code className="bg-yellow-100 px-1 py-0.5 rounded text-red-600 font-bold">admin</code> to unlock full Admin capabilities instantly.
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-extrabold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In as Staff'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
