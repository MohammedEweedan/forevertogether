import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST() {
  const now = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Riyadh",
    dateStyle: "full",
    timeStyle: "short",
  });

  const htmlBody = `
    <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; text-align: center; background: #fffcf9;">
      <div style="font-size: 56px; margin-bottom: 12px;">💍</div>
      <h1 style="font-size: 30px; font-weight: normal; color: #7a1f33; margin: 0 0 8px;">Rayan said yes.</h1>
      <p style="font-size: 16px; color: #5b6443; font-style: italic; margin: 0;">Forever starts today.</p>
      <div style="margin: 28px auto; width: 56px; height: 1px; background: #f0b9c6;"></div>
      <p style="font-size: 13px; color: #6c565b; letter-spacing: 0.08em;">
        ${now}
      </p>
    </div>
  `;

  const mailOptions = {
    from: `"Forever Together 💍" <forever@music.app>`,
    to: "moeawidan99@gmail.com",
    subject: "💍 Rayan said YES!",
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
      mailOptions.from = `"Forever Together 💍" <${senderEmail}>`;
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
    console.log("Said-yes email preview:", previewUrl);

    return NextResponse.json({ success: true, previewUrl });
  } catch (err) {
    console.error("Failed to send said-yes email:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
