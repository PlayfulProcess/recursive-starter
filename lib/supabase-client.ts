import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Determine cookie domain based on environment
  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  const isVercelPreview = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');

  // Use undefined for localhost (browser default), otherwise set domain
  const cookieDomain = isLocalhost
    ? undefined
    : isVercelPreview
    ? undefined
    : '.recursive.eco';

  // Ensures session is persisted (not just in-memory)
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'recursive-eco-auth'
      },
      cookieOptions: {
        domain: cookieDomain,
        maxAge: 100000000,
        path: '/',
        sameSite: 'lax',
        secure: isLocalhost ? false : true, // Allow non-HTTPS in local dev
      },
    }
  )
}
