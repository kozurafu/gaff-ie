import { NextRequest, NextResponse } from 'next/server';

const AGENTMAIL_API_KEY = process.env.AGENTMAIL_API_KEY;

function requireAgentMailKey(): string {
  if (!AGENTMAIL_API_KEY) {
    throw new Error('AGENTMAIL_API_KEY is not configured');
  }
  return AGENTMAIL_API_KEY;
}

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json();

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  try {
    const res = await fetch('https://api.agentmail.to/api/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${requireAgentMailKey()}`,
      },
      body: JSON.stringify({
        from: 'mmclaw@agentmail.to',
        to: ['mmclaw@agentmail.to'],
        subject: `[Gaff.ie Contact] ${subject}`,
        text: `New contact form submission:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
        html: `<h2>New Contact Form Submission</h2><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Subject:</strong> ${subject}</p><hr/><p>${message.replace(/\n/g, '<br/>')}</p>`,
      }),
    });

    if (!res.ok) {
      console.error('AgentMail error:', await res.text());
      return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}
