import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  let message = "";
  let songUrl = "";
  try {
    const body = await req.json();
    message = body.message || "";
    songUrl = body.songUrl || "";
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!message.trim() && !songUrl.trim()) {
    return NextResponse.json({ error: "Please provide a message or song URL" }, { status: 400 });
  }

  const now = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Riyadh",
    dateStyle: "full",
    timeStyle: "short",
  });

  const songSection = songUrl.trim() 
    ? `
      <div style="margin: 16px 0; padding: 16px; background: linear-gradient(135deg, #f0f0ff, #e6e0ff); border-radius: 12px;">
        <p style="font-size: 13px; color: #666; margin: 0 0 6px;">Song request:</p>
        <a href="${songUrl}" style="font-size: 15px; color: #4a3aff; word-break: break-all; text-decoration: none; font-weight: 600;">
          ${songUrl}
        </a>
      </div>`
    : "";

  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; text-align: center;">
      <div style="font-size: 64px; margin-bottom: 16px;">💌</div>
      <h1 style="font-size: 24px; color: #821d30; margin-bottom: 8px;">Message from Rayan</h1>
      <div style="margin: 20px 0; padding: 20px; background: linear-gradient(135deg, #fff0f3, #ffe0e6); border-radius: 16px; text-align: left;">
        <p style="font-size: 16px; color: #333; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
      </div>
      ${songSection}
      <p style="font-size: 13px; color: #999; margin-top: 24px;">
        Sent on ${now} from Forever Music
      </p>
    </div>
  `;

  const mailOptions = {
    from: `"Forever Music 💌" <forever@music.app>`,
    to: "moeawidan99@gmail.com",
    subject: `💌 Message from Rayan${songUrl ? " + Song Request" : ""}`,
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
      mailOptions.from = `"Forever Music 💌" <${senderEmail}>`;
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
    console.log("Personal message email preview:", previewUrl);

    return NextResponse.json({ success: true, previewUrl });
  } catch (err) {
    console.error("Failed to send personal message email:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
