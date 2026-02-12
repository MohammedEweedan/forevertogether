import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST() {
  const now = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Riyadh",
    dateStyle: "full",
    timeStyle: "short",
  });

  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; text-align: center;">
      <div style="font-size: 64px; margin-bottom: 16px;">💋💋💋</div>
      <h1 style="font-size: 24px; color: #821d30; margin-bottom: 8px;">Kisses from Rayan!</h1>
      <p style="font-size: 16px; color: #666; line-height: 1.6;">
        Rayan just sent you a bunch of kisses from the <strong>Forever Music</strong> app! 🥰
      </p>
      <div style="margin: 24px 0; padding: 20px; background: linear-gradient(135deg, #fff0f3, #ffe0e6); border-radius: 16px;">
        <p style="font-size: 18px; color: #821d30; margin: 0;">
          💕 I love you forever and always 💕
        </p>
      </div>
      <p style="font-size: 13px; color: #999; margin-top: 24px;">
        Sent on ${now}
      </p>
    </div>
  `;

  const mailOptions = {
    from: `"Forever Together 💕" <forever@music.app>`,
    to: "moeawidan99@gmail.com",
    subject: "💋 You just received kisses! 💋",
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
      mailOptions.from = `"Forever Together 💕" <${senderEmail}>`;
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
    console.log("Kiss email preview:", previewUrl);

    return NextResponse.json({ success: true, previewUrl });
  } catch (err) {
    console.error("Failed to send kiss email:", err);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
