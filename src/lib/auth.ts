import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "gaff-dev-secret-change-me"
);
const COOKIE_NAME = "gaff-token";

export interface JWTPayload {
  sub: string;
  email: string;
  role: string;
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export function createTokenCookie(token: string): { name: string; value: string; options: Record<string, unknown> } {
  return {
    name: COOKIE_NAME,
    value: token,
    options: {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    },
  };
}

export function createClearCookie(): { name: string; value: string; options: Record<string, unknown> } {
  return {
    name: COOKIE_NAME,
    value: "",
    options: {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 0,
    },
  };
}

// For use in API route handlers — set cookie on NextResponse
export function setTokenOnResponse(response: Response, token: string): Response {
  const cookie = createTokenCookie(token);
  const cookieStr = `${cookie.name}=${cookie.value}; Path=${cookie.options.path}; Max-Age=${cookie.options.maxAge}; HttpOnly; SameSite=${cookie.options.sameSite}${cookie.options.secure ? '; Secure' : ''}`;
  response.headers.set('Set-Cookie', cookieStr);
  return response;
}

export function clearTokenOnResponse(response: Response): Response {
  const cookie = createClearCookie();
  const cookieStr = `${cookie.name}=; Path=${cookie.options.path}; Max-Age=0; HttpOnly; SameSite=${cookie.options.sameSite}${cookie.options.secure ? '; Secure' : ''}`;
  response.headers.set('Set-Cookie', cookieStr);
  return response;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, name: true, role: true, avatar: true, createdAt: true },
  });
  return user;
}

export async function getTokenFromRequest(request: Request): Promise<JWTPayload | null> {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match) return null;
  return verifyToken(match[1]);
}
