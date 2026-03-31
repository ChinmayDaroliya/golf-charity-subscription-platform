import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

const isAuthRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
  '/router(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    // Check if user is admin and redirect accordingly
    if (isAuthRoute(req)) {
      try {
        const { data: user } = await supabaseServer
          .from('users')
          .select('is_admin')
          .eq('clerk_id', userId)
          .single();

        // If accessing dashboard and is admin, redirect to admin
        if (req.nextUrl.pathname.startsWith('/dashboard') && user?.is_admin) {
          return NextResponse.redirect(new URL('/admin', req.url));
        }

        // If accessing admin and not admin, redirect to dashboard
        if (req.nextUrl.pathname.startsWith('/admin') && !user?.is_admin) {
          return NextResponse.redirect(new URL('/dashboard', req.url));
        }
      } catch (error) {
        console.error('Error checking admin status in middleware:', error);
      }
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};