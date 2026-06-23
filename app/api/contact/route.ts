import { NextResponse } from "next/server";

function getContactConfig() {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) return null;
  return { accessKey };
}

export async function POST(request: Request) {
  const config = getContactConfig();
  if (!config) {
    console.error(
      "Contact form misconfigured. Set WEB3FORMS_ACCESS_KEY.",
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

    const web3FormsResponse = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_key: config.accessKey,
        name,
        email,
        message,
        // Web3Forms uses `email` as the sender/reply address.
        subject: `New Portfolio Message from ${name}`,
      }),
    });

    let web3FormsResult: unknown = null;
    try {
      web3FormsResult = await web3FormsResponse.json();
    } catch {
      web3FormsResult = null;
    }
    const isFailedSend =
      !web3FormsResponse.ok ||
      typeof web3FormsResult !== "object" ||
      web3FormsResult === null ||
      !("success" in web3FormsResult) ||
      web3FormsResult.success !== true;

    if (isFailedSend) {
      console.error("Web3Forms API error:", web3FormsResult);
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
