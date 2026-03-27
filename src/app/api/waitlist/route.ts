import { NextResponse } from "next/server";

const AGENTMAIL_ENDPOINT = "https://api.agentmail.to/v0/inboxes/mmclaw@agentmail.to/messages/send";
const AGENTMAIL_TOKEN = process.env.AGENTMAIL_API_KEY;

function requireAgentMailToken(): string {
  if (!AGENTMAIL_TOKEN) {
    throw new Error("AGENTMAIL_API_KEY is not configured");
  }
  return AGENTMAIL_TOKEN;
}

export async function POST(request: Request) {
  try {
    const { name, email, role, portfolioSize, notes } = await request.json();

    if (!name || !email || !role || !portfolioSize) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const payload = {
      subject: `[Gaff Waitlist] ${name} — ${role}`,
      body: `Name: ${name}\nEmail: ${email}\nRole: ${role}\nPortfolio: ${portfolioSize}\nNotes: ${notes || "(none)"}`,
    };

    const agentMailRes = await fetch(AGENTMAIL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${requireAgentMailToken()}`,
      },
      body: JSON.stringify({
        from: "mmclaw@agentmail.to",
        to: ["mmclaw@agentmail.to"],
        subject: payload.subject,
        text: payload.body,
        html: payload.body.replace(/\n/g, "<br/>") || undefined,
      }),
    });

    if (!agentMailRes.ok) {
      console.error("AgentMail waitlist error", await agentMailRes.text());
      return NextResponse.json({ error: "Failed to store" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Waitlist submission error", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
