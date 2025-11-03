'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-client';

type AuthMode = 'email' | 'verify';

export function DualAuth() {
  const [mode, setMode] = useState<AuthMode>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const supabase = createClient();

  // Step 1: Send email with magic link + OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Store email in sessionStorage so error page can access it
      sessionStorage.setItem('auth-email', email);

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // This will send BOTH magic link and OTP in one email
          shouldCreateUser: true, // Allow signup via auth
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      setMessage({
        type: 'success',
        text: `Check your email! We sent you a magic link and a 6-digit code to ${email}`,
      });
      setMode('verify');
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to send email. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP code
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });

      if (error) throw error;

      // Success! User is now logged in
      window.location.href = '/dashboard';
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Invalid code. Please check and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Resend code
  const handleResend = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      setMessage({
        type: 'success',
        text: 'New code sent! Check your email.',
      });
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to resend. Please wait 60 seconds.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-xl">
      {/* Step 1: Enter Email */}
      {mode === 'email' && (
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Sign In</h2>
            <p className="text-gray-400 text-sm">
              Enter your email to receive a magic link and verification code
            </p>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 placeholder-gray-500"
            />
          </div>

          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-green-900/50 text-green-200 border border-green-700'
                  : 'bg-red-900/50 text-red-200 border border-red-700'
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Sending...' : 'Send Magic Link & Code'}
          </button>

          <p className="text-xs text-gray-500 text-center">
            We'll send you an email with both a clickable link and a 6-digit code
          </p>
        </form>
      )}

      {/* Step 2: Verify OTP */}
      {mode === 'verify' && (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
            <p className="text-gray-400 text-sm mb-4">
              We sent an email to <strong className="text-white">{email}</strong>
            </p>
            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-200 mb-2"><strong>Option 1:</strong> Click the magic link in the email</p>
              <p className="text-sm text-blue-200"><strong>Option 2:</strong> Enter the 6-digit code below</p>
            </div>
          </div>

          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-1">
              Enter 6-digit code
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              required
              disabled={loading}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 placeholder-gray-500"
              maxLength={6}
              pattern="\d{6}"
            />
          </div>

          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-green-900/50 text-green-200 border border-green-700'
                  : 'bg-red-900/50 text-red-200 border border-red-700'
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>

          <div className="flex justify-between text-sm">
            <button
              type="button"
              onClick={() => {
                setMode('email');
                setOtp('');
                setMessage(null);
              }}
              className="text-gray-400 hover:text-gray-200"
            >
              ← Change email
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              className="text-blue-400 hover:text-blue-300 disabled:opacity-50"
            >
              Resend code
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Code expires in 1 hour • Can request new code after 60 seconds
          </p>
        </form>
      )}
    </div>
  );
}
