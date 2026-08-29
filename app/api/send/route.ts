import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, intent, message } = body;

    // Validate inputs
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, and message are required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      // Graceful fallback for local development before user configures API key
      console.warn("RESEND_API_KEY not configured. Message received in development mode:", body);
      return NextResponse.json({
        success: true,
        mock: true,
        message: "Message dispatched in simulation mode (Add RESEND_API_KEY in .env.local for live production delivery).",
      });
    }

    const resend = new Resend(apiKey);

    const data = await resend.emails.send({
      from: "HUMAN.EXE Portfolio <onboarding@resend.dev>",
      to: [process.env.CONTACT_EMAIL || "sumanpatra.swe@gmail.com"],
      replyTo: email,
      subject: `[${intent || "Message"}] New Portfolio Transmission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nIntent: ${intent}\n\nMessage:\n${message}`,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    console.error("Resend mail dispatch error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to dispatch transmission.";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
