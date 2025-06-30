import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { to, subject, text, html, cc, bcc, attachments } = req.body;

  // Validate required fields
  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({
      error: "Missing required fields: to, subject, and text or html",
    });
  }

  // Check for required SMTP environment variables
  const missingEnv = [];
  if (!process.env.SMTP_HOST) missingEnv.push("SMTP_HOST");
  if (!process.env.SMTP_PORT) missingEnv.push("SMTP_PORT");
  if (!process.env.SMTP_USER) missingEnv.push("SMTP_USER");
  if (!process.env.SMTP_PASS) missingEnv.push("SMTP_PASS");
  if (missingEnv.length > 0) {
    return res
      .status(500)
      .json({
        error: `Missing SMTP environment variables: ${missingEnv.join(", ")}`,
      });
  }

  // Configure SMTP transport using environment variables
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: String(process.env.SMTP_SECURE || "true") === "true", // allow override
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `Uniride <no-reply@uniride.ng>`,
      to,
      subject,
      text,
      html,
      cc,
      bcc,
      attachments,
    });
    console.log(`Email sent to ${to} with subject '${subject}'`);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Email send error:", err);
    res
      .status(500)
      .json({ error: "Failed to send email", details: err.message });
  }
}
