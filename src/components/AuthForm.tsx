import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { GraduationCap } from 'lucide-react';

interface AuthFormProps {
  onAuthSuccess: () => void;
}

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return null;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = isSignUp 
        ? await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: window.location.origin
            }
          })
        : await supabase.auth.signInWithPassword({
            email,
            password
          });

      if (error) throw error;
      
      if (!isSignUp) {
        onAuthSuccess();
      } else {
        setError('Check your email to confirm your account');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(isSignUp ? 'Failed to sign up' : 'Failed to sign in');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <GraduationCap className="w-20 h-20 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            SynClass
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Intelligent Timetable Generation System
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                required
                minLength={6}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password (minimum 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div className="text-sm text-gray-600 text-center">
            Password must be at least 6 characters long
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? (isSignUp ? 'Signing up...' : 'Signing in...') : (isSignUp ? 'Sign up' : 'Sign in')}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}