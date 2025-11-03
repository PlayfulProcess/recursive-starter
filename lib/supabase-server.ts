import { createServerClient } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  const headersList = await headers()

  // Determine cookie domain based on environment
  const host = headersList.get('host') || '';
  const isLocalhost = host.includes('localhost');
  const isVercelPreview = host.includes('vercel.app');

  // Use undefined for localhost/preview, otherwise set domain
  const cookieDomain = isLocalhost || isVercelPreview ? undefined : '.recursive.eco';

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storageKey: 'recursive-eco-auth'
      },
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Ensure correct domain for each environment
              const cookieOptions = {
                ...options,
                domain: cookieDomain,
                path: '/',
                sameSite: 'lax' as const,
                secure: isLocalhost ? false : true, // Allow non-HTTPS in local dev
              };
              cookieStore.set(name, value, cookieOptions);
            })
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
