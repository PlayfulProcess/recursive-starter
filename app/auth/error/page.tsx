'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get('email') || '';
  const error = searchParams.get('error');

  // Try to get email from URL params or sessionStorage
  const storedEmail = typeof window !== 'undefined' ? sessionStorage.getItem('auth-email') || '' : '';
  const defaultEmail = emailFromUrl || storedEmail;

  const [email, setEmail] = useState(defaultEmail);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  // Auto-show OTP input if we have an email from failed magic link
  const [showOtpInput, setShowOtpInput] = useState(!!defaultEmail);
  const router = useRouter();

  const supabase = createClient();

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    console.log('🔢 [Error Page] Attempting OTP verification:', {
      email,
      otpLength: otp.length,
      otpValue: otp,
    });

    try {
      const { error, data } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });

      console.log('🔢 [Error Page] OTP verification response:', {
        success: !error,
        error: error?.message,
        hasSession: !!data?.session,
        hasUser: !!data?.user,
      });

      if (error) throw error;

      // Clear stored email on success
      sessionStorage.removeItem('auth-email');

      // Success! Redirect to dashboard
      console.log('✅ [Error Page] OTP verification successful, redirecting to dashboard');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('❌ [Error Page] OTP verification failed:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Invalid code. Please check and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4">
      <div className="max-w-md w-full p-6 bg-gray-800 rounded-lg shadow-xl">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠</div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Authentication Failed
          </h1>
          <p className="text-gray-400 mb-6">
            We couldn't verify your login link. This could happen if:
          </p>
          <ul className="text-left text-sm text-gray-400 space-y-2 mb-6">
            <li>• The link has expired (links are valid for 1 hour)</li>
            <li>• The link was already used</li>
            <li>• The link was copied incorrectly</li>
          </ul>

          {/* Show OTP Input Option */}
          {!showOtpInput ? (
            <div className="space-y-3">
              <p className="text-gray-300 text-sm mb-4">
                If you received an email with a 6-digit code, you can try entering it below:
              </p>
              <button
                onClick={() => setShowOtpInput(true)}
                className="w-full bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-2"
              >
                Enter 6-Digit Code
              </button>
              <a
                href="/"
                className="inline-block w-full bg-gray-700 text-white py-2 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Request New Link
              </a>
            </div>
          ) : (
            <>
              {defaultEmail && (
                <div className="mb-4 p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
                  <p className="text-sm text-blue-200">
                    The magic link didn't work, but you can enter the 6-digit code from your email instead.
                  </p>
                </div>
              )}
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1 text-left">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={loading || !!defaultEmail}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 placeholder-gray-500"
                />
                {defaultEmail && (
                  <p className="text-xs text-gray-500 mt-1">Email pre-filled from your login attempt</p>
                )}
              </div>

              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-1 text-left">
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
                    setShowOtpInput(false);
                    setOtp('');
                    setEmail('');
                    setMessage(null);
                  }}
                  className="text-gray-400 hover:text-gray-200"
                >
                  ← Back
                </button>
                <a
                  href="/"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Request new code
                </a>
              </div>
            </form>
            </>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-lg">
              <p className="text-sm text-red-200">Error: {error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-gray-400">Loading...</div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}
