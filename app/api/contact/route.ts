import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Basic server-side validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // In a real application, you would connect to Resend, SendGrid, or Nodemailer here.
    // For this portfolio, we will simulate a successful submission.
    console.log('Contact form submission received:', { name, email, message });

    return NextResponse.json({ success: true, message: 'Message sent successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
