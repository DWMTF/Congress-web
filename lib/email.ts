import { Resend } from "resend";

function getResendClient(): { client: Resend; from: string } {
  const apiKey = process.env.RESEND_API_KEY;
  let from = process.env.EMAIL_FROM || "Blue Mind Congress <onboarding@resend.dev>";

  // Resend requires verified custom domains. Public email providers (gmail, yahoo, etc.)
  // or placeholder domains cannot be used as the 'from' sender on Resend.
  const unverifiedPatterns = [
    "yourdomain.com",
    "example.com",
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "icloud.com",
  ];

  if (unverifiedPatterns.some((pattern) => from.toLowerCase().includes(pattern))) {
    from = "Blue Mind Congress <onboarding@resend.dev>";
  }

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  return { client: new Resend(apiKey), from };
}

export interface ConfirmationEmailParams {
  to: string;
  firstName: string;
  lastName: string;
  attendanceType: "in-person" | "livestream";
  reference: string;
  amountLkr: number;
}

export async function sendConfirmationEmail(params: ConfirmationEmailParams): Promise<void> {
  const { client, from } = getResendClient();
  const attendanceLabel =
    params.attendanceType === "in-person" ? "In Person" : "Livestream";

  const { error } = await client.emails.send({
    from,
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

export interface PartnershipInquiryParams {
  name: string;
  email: string;
  organization: string;
  tier: string;
  message: string;
}

/**
 * Sends notification to the admin/organizer with the submitted partnership details.
 */
export async function sendPartnershipInquiryNotification(
  params: PartnershipInquiryParams
): Promise<void> {
  const { client, from } = getResendClient();
  const recipient =
    process.env.PARTNERSHIP_INQUIRY_RECIPIENT_EMAIL ||
    "nipunprjay@gmail.com";

  const formattedDate = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Colombo",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const { error } = await client.emails.send({
    from,
    to: recipient,
    replyTo: params.email,
    subject: `New Partnership Inquiry: ${params.tier} — ${params.organization}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
      <body style="margin:0;padding:0;background:#f5f5f0;font-family:system-ui,sans-serif;color:#1a3a4a;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
          <tr><td align="center">
            <table width="600" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e8e8e0;">
              <!-- Header -->
              <tr>
                <td style="background:#0a4d68;padding:32px 40px;">
                  <p style="margin:0;color:#3aafa9;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:600;">Blue Mind Congress 2027 · Sponsorship Lead</p>
                  <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:600;">New Partnership Inquiry</h1>
                  <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">Received on ${formattedDate} (IST)</p>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding:36px 40px;">
                  <p style="margin:0 0 20px;font-size:15px;line-height:1.5;">
                    A new partnership inquiry was submitted through the website form. You can reply directly to this email to reach <strong>${params.name}</strong>.
                  </p>

                  <table width="100%" style="border-collapse:collapse;margin-bottom:28px;">
                    <tr style="border-bottom:1px solid #edf2f7;">
                      <td style="padding:12px 0;color:#718096;font-size:13px;width:140px;">Contact Person</td>
                      <td style="padding:12px 0;font-weight:600;font-size:14px;color:#1a3a4a;">${params.name}</td>
                    </tr>
                    <tr style="border-bottom:1px solid #edf2f7;">
                      <td style="padding:12px 0;color:#718096;font-size:13px;">Business Email</td>
                      <td style="padding:12px 0;font-size:14px;">
                        <a href="mailto:${params.email}" style="color:#0a4d68;text-decoration:none;font-weight:600;">${params.email}</a>
                      </td>
                    </tr>
                    <tr style="border-bottom:1px solid #edf2f7;">
                      <td style="padding:12px 0;color:#718096;font-size:13px;">Organization</td>
                      <td style="padding:12px 0;font-weight:600;font-size:14px;color:#1a3a4a;">${params.organization}</td>
                    </tr>
                    <tr style="border-bottom:1px solid #edf2f7;">
                      <td style="padding:12px 0;color:#718096;font-size:13px;">Selected Tier</td>
                      <td style="padding:12px 0;font-size:14px;">
                        <span style="display:inline-block;background:#e0f2fe;color:#0369a1;font-weight:600;font-size:12px;padding:4px 10px;border-radius:20px;">
                          ${params.tier}
                        </span>
                      </td>
                    </tr>
                  </table>

                  <div style="background:#f8fafc;border-left:4px solid #3aafa9;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:30px;">
                    <p style="margin:0 0 6px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Objectives &amp; Notes</p>
                    <p style="margin:0;font-size:14px;line-height:1.6;white-space:pre-wrap;color:#334155;">${params.message}</p>
                  </div>

                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <a href="mailto:${params.email}?subject=Re:%20Blue%20Mind%20Congress%202027%20Partnership%20Inquiry"
                           style="display:inline-block;background:#0a4d68;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:30px;font-size:14px;font-weight:600;">
                          Reply to ${params.name} &rarr;
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding:20px 40px;background:#f8fafc;border-top:1px solid #e8e8e0;">
                  <p style="margin:0;color:#94a3b8;font-size:12px;text-align:center;">
                    Blue Mind Congress 2027 · Automated Partnership Notification
                  </p>
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
    throw new Error(`Resend notification email failed: ${error.message}`);
  }
}

/**
 * Sends automated confirmation receipt back to the prospective partner.
 */
export async function sendPartnershipInquiryConfirmation(
  params: PartnershipInquiryParams
): Promise<void> {
  const { client, from } = getResendClient();
  const replyToEmail =
    process.env.PARTNERSHIP_INQUIRY_RECIPIENT_EMAIL ||
    "nipunprjay@gmail.com";

  const { error } = await client.emails.send({
    from,
    to: params.email,
    replyTo: replyToEmail,
    subject: `We've received your partnership inquiry — Blue Mind Congress 2027`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
      <body style="margin:0;padding:0;background:#f5f5f0;font-family:system-ui,sans-serif;color:#1a3a4a;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
          <tr><td align="center">
            <table width="560" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e8e8e0;">
              <!-- Header -->
              <tr>
                <td style="background:#0a4d68;padding:32px 40px;">
                  <p style="margin:0;color:#3aafa9;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:600;">Blue Mind Congress 2027</p>
                  <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:600;">Partnership Inquiry Received</h1>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding:36px 40px;">
                  <p style="margin:0 0 20px;font-size:15px;line-height:1.6;">
                    Dear ${params.name},<br><br>
                    Thank you for your interest in partnering with <strong>Blue Mind Congress 2027</strong> on behalf of <strong>${params.organization}</strong>.
                  </p>

                  <p style="margin:0 0 24px;font-size:14px;color:#4a5568;line-height:1.6;">
                    We have received your inquiry for the <strong>${params.tier}</strong> package. Our Partnership Director is reviewing your objectives and will connect with you within 24 business hours with the full 2027 Sponsorship Prospectus, delegate reach data, and custom activation options.
                  </p>

                  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin-bottom:28px;">
                    <p style="margin:0 0 10px;font-size:12px;color:#718096;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Summary of Your Submission</p>
                    <table width="100%" style="font-size:13px;color:#2d3748;">
                      <tr>
                        <td style="padding:4px 0;color:#718096;width:120px;">Tier:</td>
                        <td style="padding:4px 0;font-weight:600;">${params.tier}</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;color:#718096;">Organization:</td>
                        <td style="padding:4px 0;font-weight:600;">${params.organization}</td>
                      </tr>
                    </table>
                  </div>

                  <p style="margin:0;font-size:13px;color:#718096;line-height:1.6;">
                    If you have immediate questions or require a non-disclosure agreement prior to our discussion, simply reply directly to this email.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding:20px 40px;background:#f8fafc;border-top:1px solid #e8e8e0;">
                  <p style="margin:0;color:#94a3b8;font-size:12px;text-align:center;">
                    Water &amp; Mountain Tourism Foundation · Kelani River Valley, Sri Lanka
                  </p>
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
    throw new Error(`Resend confirmation email failed: ${error.message}`);
  }
}
