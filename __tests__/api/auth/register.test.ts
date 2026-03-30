/// <reference types="jest" />
/**
 * Tests for /api/auth/register
 * Mocks prisma, bcryptjs, jose, and next/server to run without a live DB.
 */

// ---- mocks ----
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashed_password"),
  compare: jest.fn(),
}));

jest.mock("jose", () => ({
  SignJWT: jest.fn().mockImplementation(() => ({
    setProtectedHeader: jest.fn().mockReturnThis(),
    setIssuedAt: jest.fn().mockReturnThis(),
    setExpirationTime: jest.fn().mockReturnThis(),
    sign: jest.fn().mockResolvedValue("mock_token"),
  })),
  jwtVerify: jest.fn(),
}));

jest.mock("@/app/api/auth/verify-email/route", () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn().mockResolvedValue({ get: jest.fn().mockReturnValue(null) }),
}));

// ---- helpers ----
import { prisma } from "@/lib/prisma";

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

function makeRequest(body: unknown): Request {
  return {
    json: () => Promise.resolve(body),
    headers: new Headers(),
  } as unknown as Request;
}

// ---- tests ----

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 with user and sets cookie on valid payload", async () => {
    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (mockPrisma.user.create as jest.Mock).mockResolvedValue({
      id: "user-1",
      email: "test@example.com",
      name: "Test User",
      role: "TENANT",
    });

    const { POST } = await import("@/app/api/auth/register/route");
    // @ts-expect-error - NextRequest vs Request in tests
    const response = await POST(makeRequest({ email: "test@example.com", password: "password123", name: "Test User", role: "TENANT" }));

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.user.email).toBe("test@example.com");
    expect(response.headers.get("Set-Cookie")).toContain("gaff-token=");
  });

  it("returns 400 with field errors when email is missing", async () => {
    const { POST } = await import("@/app/api/auth/register/route");
    // @ts-expect-error - NextRequest vs Request in tests
    const response = await POST(makeRequest({ password: "password123", name: "Test User" }));

    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.fields).toBeDefined();
    expect(json.fields.email).toBeDefined();
  });

  it("returns 400 with field errors when password is missing", async () => {
    const { POST } = await import("@/app/api/auth/register/route");
    // @ts-expect-error - NextRequest vs Request in tests
    const response = await POST(makeRequest({ email: "test@example.com", name: "Test User" }));

    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.fields.password).toBeDefined();
  });

  it("returns 400 with field errors when email is already registered", async () => {
    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({ id: "existing-user" });

    const { POST } = await import("@/app/api/auth/register/route");
    // @ts-expect-error - NextRequest vs Request in tests
    const response = await POST(makeRequest({ email: "dupe@example.com", password: "password123", name: "Test User" }));

    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.fields.email).toMatch(/already registered/i);
  });

  it("defaults role to TENANT when invalid role is provided", async () => {
    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (mockPrisma.user.create as jest.Mock).mockResolvedValue({
      id: "user-2",
      email: "test2@example.com",
      name: "Test User",
      role: "TENANT",
    });

    const { POST } = await import("@/app/api/auth/register/route");
    // @ts-expect-error - NextRequest vs Request in tests
    await POST(makeRequest({ email: "test2@example.com", password: "password123", name: "Test User", role: "INVALID_ROLE" }));

    expect(mockPrisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ role: "TENANT" }) })
    );
  });
});
