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
    const recipientEmail = process.env.CONTACT_EMAIL || "ksumanpatra06@gmail.com";

    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [recipientEmail],
      replyTo: email,
      subject: `[${intent || "Transmission"}] Portfolio Message from ${name}`,
      text: `New Portfolio Message:\n\nName: ${name}\nEmail: ${email}\nIntent: ${intent}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: 'Courier New', Courier, monospace; max-width: 600px; margin: 0 auto; background: #0a0e14; color: #e6edf3; padding: 24px; border: 1px solid #39ff88; border-radius: 8px;">
          <div style="border-bottom: 1px solid rgba(57, 255, 136, 0.3); padding-bottom: 12px; margin-bottom: 16px;">
            <h2 style="color: #39ff88; margin: 0; font-size: 18px; letter-spacing: 1px;">// NEW PORTFOLIO TRANSMISSION</h2>
            <p style="color: #8b949e; margin: 4px 0 0 0; font-size: 12px;">Received via human.exe contact gateway</p>
          </div>

          <table style="width: 100%; font-size: 13px; margin-bottom: 20px; border-collapse: collapse;">
            <tr>
              <td style="color: #00e5ff; padding: 6px 0; width: 100px; font-weight: bold;">Sender:</td>
              <td style="color: #e6edf3; padding: 6px 0;"><strong>${name}</strong></td>
            </tr>
            <tr>
              <td style="color: #00e5ff; padding: 6px 0; font-weight: bold;">Reply Email:</td>
              <td style="color: #39ff88; padding: 6px 0;"><a href="mailto:${email}" style="color: #39ff88; text-decoration: underline;">${email}</a></td>
            </tr>
            <tr>
              <td style="color: #00e5ff; padding: 6px 0; font-weight: bold;">Intent:</td>
              <td style="color: #e6edf3; padding: 6px 0;"><span style="background: rgba(0, 229, 255, 0.15); color: #00e5ff; padding: 2px 8px; border-radius: 4px; font-size: 11px; border: 1px solid rgba(0, 229, 255, 0.3);">${intent}</span></td>
            </tr>
          </table>

          <div style="background: #111820; border-left: 3px solid #39ff88; padding: 14px; margin-bottom: 20px; border-radius: 4px;">
            <p style="margin: 0 0 6px 0; color: #8b949e; font-size: 11px; text-transform: uppercase;">Message Payload:</p>
            <p style="margin: 0; color: #e6edf3; white-space: pre-wrap; font-size: 13px; line-height: 1.6;">${message}</p>
          </div>

          <div style="border-top: 1px solid rgba(230, 237, 243, 0.1); padding-top: 12px; font-size: 11px; color: #8b949e; text-align: center;">
            Click "Reply" in your email client to directly reply to ${email}.
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API error:", error);
      return NextResponse.json(
        { error: error.message || "Resend email delivery failed." },
        { status: 500 }
      );
    }

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
