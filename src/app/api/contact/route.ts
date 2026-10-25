import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Validate inputs
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required fields." },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const recipientEmail =
      process.env.CONTACT_RECIPIENT_EMAIL || "hello@zoriq.co.in";

    // If Resend is not configured yet (e.g. initial dev), log and return gracefully
    if (!apiKey) {
      console.warn("[ZORIQ Contact Form Submission (Dev/Simulated)]:", {
        name,
        email,
        subject,
        message,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json({
        success: true,
        isDevFallback: true,
        message:
          "Thank you! Your feedback has been received. (Config: Add RESEND_API_KEY in .env to deliver to inbox)",
      });
    }

    const resend = new Resend(apiKey);
    const fromAddress =
      process.env.RESEND_FROM_EMAIL || "ZORIQ Contact <onboarding@resend.dev>";

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
        <div style="border-bottom: 2px solid #8b5cf6; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="color: #1e293b; margin: 0; font-size: 20px;">📩 New Message Received on ZORIQ</h2>
          <p style="color: #64748b; margin: 4px 0 0 0; font-size: 13px;">Received via https://www.zoriq.co.in/contact</p>
        </div>

        <div style="margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #64748b; width: 100px; font-weight: 600;">From:</td>
              <td style="padding: 6px 0; color: #1e293b; font-weight: 600;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Email:</td>
              <td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #8b5cf6; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Subject:</td>
              <td style="padding: 6px 0; color: #1e293b;">${subject || "General Inquiry"}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Time:</td>
              <td style="padding: 6px 0; color: #64748b;">${new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })} IST</td>
            </tr>
          </table>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <h3 style="color: #475569; margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Message:</h3>
          <p style="color: #1e293b; margin: 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 14px; text-align: center;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">You can reply directly to this email to contact <strong>${name}</strong>.</p>
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [recipientEmail],
      replyTo: email,
      subject: `[ZORIQ Feedback] ${subject || "New Inquiry from " + name}`,
      html: htmlContent,
    });

    if (error) {
      console.error("[Resend Email Error]:", error);
      return NextResponse.json(
        { error: `Failed to send email: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      id: data?.id,
      message: "Your message has been sent successfully!",
    });
  } catch (err: unknown) {
    console.error("[Contact API Exception]:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while sending your message." },
      { status: 500 },
    );
  }
}
