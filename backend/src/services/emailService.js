const nodemailer = require('nodemailer');

// If SMTP_HOST is not set we fall back to console-logging the link.
// This lets you develop and test without a real mail server — just watch
// the terminal and copy the link straight into your browser.
async function sendVerificationEmail(toEmail, token) {
  const base = process.env.FRONTEND_URL || 'http://localhost:5173';
  const link = `${base}/verify-email?token=${token}`;

  if (!process.env.SMTP_HOST) {
    console.log('\n📧 [DEV] Verification link (no SMTP configured):');
    console.log('   ' + link + '\n');
    return;
  }

  const transport = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transport.sendMail({
    from:    `"NutriPlan" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to:      toEmail,
    subject: 'Verify your NutriPlan account ✅',
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:2rem;color:#0f172a">
        <div style="text-align:center;margin-bottom:1.5rem">
          <span style="font-size:3rem">🥗</span>
          <h1 style="font-size:1.6rem;font-weight:900;color:#2563eb;margin:.5rem 0 .25rem">NutriPlan</h1>
          <p style="color:#475569;margin:0">Your personalised nutrition assistant</p>
        </div>
        <h2 style="font-size:1.3rem;font-weight:800;margin-bottom:.75rem">Almost there! 🎉</h2>
        <p style="margin-bottom:1.5rem;line-height:1.7;color:#334155">
          Thanks for signing up. Click the button below to verify your email address
          and start building your meal plans.
        </p>
        <div style="text-align:center;margin:2rem 0">
          <a href="${link}"
             style="display:inline-block;padding:.9rem 2.25rem;background:#2563eb;color:white;
                    text-decoration:none;border-radius:10px;font-weight:700;font-size:1rem;
                    box-shadow:0 4px 14px rgba(37,99,235,.35)">
            ✅ Verify my email
          </a>
        </div>
        <p style="color:#94a3b8;font-size:.8rem;line-height:1.6;text-align:center">
          This link expires in 24 hours.<br>
          If you didn't create an account you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

module.exports = { sendVerificationEmail };
