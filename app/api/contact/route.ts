import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message, human, expected } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "MISSING_FIELDS" },
        { status: 400 }
      );
    }

    if (typeof human !== "number" || typeof expected !== "number") {
      return NextResponse.json(
        { ok: false, error: "INVALID_CAPTCHA" },
        { status: 400 }
      );
    }

    if (human !== expected) {
      return NextResponse.json(
        { ok: false, error: "CAPTCHA_FAILED" },
        { status: 400 }
      );
    }

    const user = process.env.CONTACT_EMAIL_USER;
    const pass = process.env.CONTACT_EMAIL_APP_PASSWORD;

    if (!user || !pass) {
      console.error("Email credentials are not configured.");
      return NextResponse.json(
        { ok: false, error: "SERVER_EMAIL_NOT_CONFIGURED" },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass,
      },
    });

    await transporter.sendMail({
      from: `"Kahramani Website" <${user}>`,
      to: "dotcosoft@gmail.com",
      replyTo: email,
      subject: `New contact from ${name}`,
      text: `Name: ${name}
Email: ${email}

Message:
${message}
`,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form error", error);
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
