import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  let url = "";
  try {
    const body = await req.json();
    url = body.url || "";
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!url || (!url.includes("youtube.com") && !url.includes("youtu.be"))) {
    return NextResponse.json({ error: "Please provide a valid YouTube URL" }, { status: 400 });
  }

  const now = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Riyadh",
    dateStyle: "full",
    timeStyle: "short",
  });

  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; text-align: center;">
      <div style="font-size: 64px; margin-bottom: 16px;">🎵✨🎵</div>
      <h1 style="font-size: 24px; color: #821d30; margin-bottom: 8px;">Song Suggestion from Rayan!</h1>
      <p style="font-size: 16px; color: #666; line-height: 1.6;">
        Rayan wants you to add this song to the <strong>Forever Music</strong> playlist:
      </p>
      <div style="margin: 24px 0; padding: 20px; background: linear-gradient(135deg, #f0f0ff, #e6e0ff); border-radius: 16px;">
        <a href="${url}" style="font-size: 16px; color: #4a3aff; word-break: break-all; text-decoration: none; font-weight: 600;">
          ${url}
        </a>
      </div>
      <p style="font-size: 13px; color: #999; margin-top: 24px;">
        Suggested on ${now}
      </p>
    </div>
  `;

  const mailOptions = {
    from: `"Forever Music 🎵" <forever@music.app>`,
    to: "moeawidan99@gmail.com",
    subject: "🎵 Rayan suggested a song for the playlist!",
    html: htmlBody,
  };

  const senderEmail = process.env.KISS_SENDER_EMAIL;
  const senderPass = process.env.KISS_SENDER_PASSWORD?.replace(/\s/g, "");

  if (senderEmail && senderPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: { user: senderEmail, pass: senderPass },
      });
      mailOptions.from = `"Forever Music 🎵" <${senderEmail}>`;
      await transporter.sendMail(mailOptions);
      return NextResponse.json({ success: true });
    } catch (gmailErr) {
      console.warn("Gmail failed, falling back to Ethereal:", gmailErr);
    }
  }

  try {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });

    const info = await transporter.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(info) || null;
    console.log("Song suggestion email preview:", previewUrl);

    return NextResponse.json({ success: true, previewUrl });
  } catch (err) {
    console.error("Failed to send song suggestion email:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
