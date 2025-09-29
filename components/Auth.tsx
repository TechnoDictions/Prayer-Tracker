import React, { useState } from 'react';
import { LogoIcon } from './icons/LogoIcon';

interface AuthProps {
  onLogin: (username: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');

      if (isLogin) {
        // Handle Login
        if (userData[username] && userData[username].password === password) {
          onLogin(username);
        } else {
          setError('Invalid username or password.');
        }
      } else {
        // Handle Signup
        if (userData[username]) {
          setError('Username already exists. Please choose another.');
        } else {
          userData[username] = { password, prayerLog: {} };
          localStorage.setItem('userData', JSON.stringify(userData));
          onLogin(username);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <LogoIcon className="w-12 h-12 text-sky-400 mb-3" />
          <h1 className="text-3xl font-bold text-slate-50 tracking-tight">
            Prayer Tracker
          </h1>
          <p className="text-slate-400 mt-1">Sign in to continue</p>
        </div>

        <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>
            
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="font-medium text-sky-400 hover:text-sky-300 ml-2"
            >
              {isLogin ? 'Sign up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
