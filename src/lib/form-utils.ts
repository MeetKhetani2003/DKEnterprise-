import 'server-only';

import nodemailer from 'nodemailer';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

type NotificationPayload = {
  title: string;
  subject: string;
  fields: Record<string, string>;
  attachment?: {
    filename: string;
    content: Buffer;
    contentType?: string;
  };
};

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

export async function createSubmissionPdf(title: string, fields: Record<string, string>) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  page.drawRectangle({
    x: 0,
    y: 0,
    width: 595,
    height: 842,
    color: rgb(0.97, 0.99, 0.99),
  });

  page.drawText('DK Enterprise', {
    x: 50,
    y: 780,
    size: 24,
    font: boldFont,
    color: rgb(0.05, 0.58, 0.53),
  });

  page.drawText(title, {
    x: 50,
    y: 748,
    size: 16,
    font: boldFont,
    color: rgb(0.06, 0.09, 0.16),
  });

  let cursorY = 700;
  Object.entries(fields).forEach(([label, value]) => {
    page.drawText(label, {
      x: 50,
      y: cursorY,
      size: 11,
      font: boldFont,
      color: rgb(0.05, 0.58, 0.53),
    });
    page.drawText(value, {
      x: 50,
      y: cursorY - 18,
      size: 11,
      font,
      color: rgb(0.2, 0.25, 0.33),
      maxWidth: 480,
      lineHeight: 14,
    });
    cursorY -= 58;
  });

  return Buffer.from(await pdfDoc.save());
}

export async function sendNotificationEmail(payload: NotificationPayload) {
  const transporter = getTransporter();
  const recipient = process.env.NOTIFICATION_TO ?? process.env.SMTP_USER;

  if (!transporter || !recipient) {
    return { sent: false as const, reason: 'SMTP not configured' };
  }

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 24px; color: #0f172a;">
      <h2 style="color: #0d9488; margin-bottom: 16px;">${payload.title}</h2>
      ${Object.entries(payload.fields)
        .map(
          ([label, value]) =>
            `<p style="margin: 0 0 10px;"><strong>${label}:</strong> ${value.replace(/\n/g, '<br/>')}</p>`,
        )
        .join('')}
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to: recipient,
    subject: payload.subject,
    html,
    attachments: payload.attachment ? [payload.attachment] : undefined,
  });

  return { sent: true as const };
}
