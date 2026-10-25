import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
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

    if (!apiKey) {
      console.warn("[ZORIQ Newsletter Subscriber (Dev/Simulated)]:", {
        email,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json({
        success: true,
        message: "Subscribed successfully! Thank you for joining.",
      });
    }

    const resend = new Resend(apiKey);
    const fromAddress =
      process.env.RESEND_FROM_EMAIL ||
      "ZORIQ Newsletter <onboarding@resend.dev>";

    // Notify administrator about new newsletter subscriber
    await resend.emails.send({
      from: fromAddress,
      to: [recipientEmail],
      subject: `[ZORIQ Newsletter] New Subscriber: ${email}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #8b5cf6;">🎉 New Newsletter Subscriber</h2>
          <p>A new visitor subscribed to updates on ZORIQ:</p>
          <p style="font-size: 16px; font-weight: bold; color: #1e293b;">${email}</p>
          <p style="color: #64748b; font-size: 12px;">Timestamp: ${new Date().toISOString()}</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Subscribed successfully! Thank you for joining.",
    });
  } catch (err: unknown) {
    console.error("[Newsletter API Exception]:", err);
    return NextResponse.json(
      { error: "Failed to process newsletter subscription." },
      { status: 500 },
    );
  }
}
