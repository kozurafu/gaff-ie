import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const HTTPS_LOCAL_HOSTS = ['localhost', '127.0.0.1', '::1'];

const csp = [
  "default-src 'self'",
  "img-src 'self' data: https:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self'",
  "font-src 'self' https: data:",
  "connect-src 'self' https://api.agentmail.to https://api.stripe.com",
].join('; ');

export function middleware(req: NextRequest) {
  const forwardedHost = req.headers.get('x-forwarded-host');
  const hostHeader = forwardedHost ?? req.headers.get('host') ?? req.nextUrl.host ?? req.nextUrl.hostname;
  const host = hostHeader?.split(':')[0] ?? '';
  const forwardedProto = req.headers.get('x-forwarded-proto');
  const protocol = (forwardedProto ?? req.nextUrl.protocol).replace(/:$/u, '');
  const isLocal = HTTPS_LOCAL_HOSTS.includes(host) || host.endsWith('.local');
  const forceHttps = (process.env.FORCE_HTTPS ?? 'false').toLowerCase() === 'true';

  if (process.env.NODE_ENV === 'production' && forceHttps && !isLocal && protocol !== 'https') {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.protocol = 'https';
    redirectUrl.host = hostHeader;
    redirectUrl.port = '';
    return NextResponse.redirect(redirectUrl, 301);
  }

  const res = NextResponse.next();
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.headers.set('Content-Security-Policy', csp);
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
