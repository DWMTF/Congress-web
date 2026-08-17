import { Resend } from "resend";

function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
}

const resendApiKey = getEnv("RESEND_API_KEY");
const FROM = getEnv("EMAIL_FROM");

if (!resendApiKey) {
  throw new Error("RESEND_API_KEY is not configured");
}

if (!FROM) {
  throw new Error("EMAIL_FROM is not configured");
}

const resend = new Resend(resendApiKey);

export interface ConfirmationEmailParams {
  to: string;
  firstName: string;
  lastName: string;
  attendanceType: "in-person" | "livestream";
  reference: string;
  amountLkr: number;
}

export async function sendConfirmationEmail(params: ConfirmationEmailParams): Promise<void> {
  const attendanceLabel =
    params.attendanceType === "in-person" ? "In Person" : "Livestream";

  const { error } = await resend.emails.send({
    from: FROM,
    to: params.to,
    subject: "Your registration is confirmed — Blue Mind Congress 2027",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
      <body style="margin:0;padding:0;background:#f5f5f0;font-family:system-ui,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
          <tr><td align="center">
            <table width="560" style="background:#ffffff;border-radius:12px;overflow:hidden;">
              <!-- Header -->
              <tr>
                <td style="background:#1a3a4a;padding:32px 40px;">
                  <p style="margin:0;color:#7ecfca;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Blue Mind Congress 2027</p>
                  <h1 style="margin:8px 0 0;color:#ffffff;font-size:24px;font-weight:600;">Registration Confirmed</h1>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:40px;">
                  <p style="margin:0 0 24px;color:#333;font-size:16px;">
                    Dear ${params.firstName},<br><br>
                    Your registration for <strong>Blue Mind Congress 2027</strong> has been confirmed. We look forward to seeing you.
                  </p>
                  <!-- Details table -->
                  <table width="100%" style="border:1px solid #e8e8e0;border-radius:8px;overflow:hidden;margin-bottom:32px;">
                    <tr style="background:#f9f9f6;">
                      <td style="padding:12px 16px;color:#666;font-size:13px;">Reference</td>
                      <td style="padding:12px 16px;color:#1a3a4a;font-weight:600;font-size:13px;">${params.reference}</td>
                    </tr>
                    <tr>
                      <td style="padding:12px 16px;color:#666;font-size:13px;border-top:1px solid #e8e8e0;">Attendance</td>
                      <td style="padding:12px 16px;color:#1a3a4a;font-weight:600;font-size:13px;border-top:1px solid #e8e8e0;">${attendanceLabel}</td>
                    </tr>
                    <tr style="background:#f9f9f6;">
                      <td style="padding:12px 16px;color:#666;font-size:13px;border-top:1px solid #e8e8e0;">Amount Paid</td>
                      <td style="padding:12px 16px;color:#1a3a4a;font-weight:600;font-size:13px;border-top:1px solid #e8e8e0;">LKR ${params.amountLkr.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td style="padding:12px 16px;color:#666;font-size:13px;border-top:1px solid #e8e8e0;">Name</td>
                      <td style="padding:12px 16px;color:#1a3a4a;font-weight:600;font-size:13px;border-top:1px solid #e8e8e0;">${params.firstName} ${params.lastName}</td>
                    </tr>
                  </table>
                  <p style="margin:0;color:#666;font-size:13px;line-height:1.6;">
                    Keep this email as proof of your registration. If you have any questions, reply to this email or visit our website.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding:24px 40px;background:#f9f9f6;border-top:1px solid #e8e8e0;">
                  <p style="margin:0;color:#999;font-size:12px;">Blue Mind Congress 2027 · This is an automated confirmation email.</p>
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `,
  });

  if (error) {
    throw new Error(`Resend email failed: ${error.message}`);
  }
}
