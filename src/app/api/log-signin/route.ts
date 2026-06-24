import { NextResponse, type NextRequest } from "next/server";

interface SignInLog {
  method?: string;
  email?: string;
  name?: string;
}

export async function POST(req: NextRequest) {
  let body: SignInLog;
  try {
    body = (await req.json()) as SignInLog;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  console.log(
    "[sign-in]",
    JSON.stringify({
      method: body.method ?? "unknown",
      email: body.email ?? "unknown",
      name: body.name ?? "unknown",
      ip,
      userAgent: req.headers.get("user-agent") ?? "unknown",
      at: new Date().toISOString(),
    }),
  );

  return NextResponse.json({ ok: true });
}
