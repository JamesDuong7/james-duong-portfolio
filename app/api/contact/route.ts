import { NextResponse } from "next/server";
import { Resend } from "resend";

function getContactConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL;
  const from =
    process.env.RESEND_FROM_EMAIL ??
    (process.env.NODE_ENV === "development"
      ? "Portfolio Contact Form <onboarding@resend.dev>"
      : undefined);

  if (!apiKey || !to || !from) return null;

  return { apiKey, to, from };
}

export async function POST(request: Request) {
  const config = getContactConfig();
  if (!config) {
    console.error(
      "Contact form misconfigured. Set RESEND_API_KEY, CONTACT_EMAIL, and RESEND_FROM_EMAIL.",
    );
    return NextResponse.json(
      { error: "Contact form is temporarily unavailable." },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const resend = new Resend(config.apiKey);
    const { error } = await resend.emails.send({
      from: config.from,
      to: config.to,
      replyTo: email,
      subject: `New Portfolio Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    if (error) {
      console.error("Resend API error:", error);
      return NextResponse.json(
        { error: "Failed to send message. Please try again later." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Message sent successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
