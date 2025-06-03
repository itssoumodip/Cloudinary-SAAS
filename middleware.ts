import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
    "/sign-in",
    "/sign-up",
    "/"
])

const isPublicApiRoute = createRouteMatcher([
    "api/videos"
])

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth();
    const currentUrl = new URL(req.url);
    const isApiRequest = currentUrl.pathname.startsWith('/api');

    // if user is logged in and accessing the root route, redirect to home
    if (userId && currentUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/home', req.url));
    }

    // if user is not logged in
    if (!userId) {
        // if trying to access a protected route, redirect to signin
        if (!isPublicRoute(req) && !isPublicApiRoute(req)) {
            return NextResponse.redirect(new URL('/sign-in', req.url));
        }
        // if the request is for a protected API, redirect to signin
        if (isApiRequest && !isPublicApiRoute(req)) {
            return NextResponse.redirect(new URL('/sign-in', req.url));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
};