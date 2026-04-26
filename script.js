import cron from "node-cron";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail", // Use any Service ID from the table below (case-insensitive)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
const args = process.argv.slice(2);

const receiverEmail = args[0];
const startTime = Number(args[1]);
const endTime = Number(args[2]);
const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0f172a;
      font-family: Arial, sans-serif;
      color: #e2e8f0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: #020617;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 0 20px rgba(0,255,150,0.2);
      border: 1px solid #22c55e;
    }
    .header {
      background: linear-gradient(90deg, #22c55e, #4ade80);
      padding: 20px;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      color: #020617;
    }
    .content {
      padding: 25px;
      text-align: center;
    }
    .glow {
      color: #22c55e;
      font-size: 22px;
      font-weight: bold;
      text-shadow: 0 0 10px #22c55e;
    }
    .message {
      margin-top: 15px;
      font-size: 16px;
      color: #cbd5f5;
    }
    .button {
      display: inline-block;
      margin-top: 25px;
      padding: 12px 24px;
      background: #22c55e;
      color: #020617;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
      box-shadow: 0 0 15px #22c55e;
    }
    .footer {
      text-align: center;
      padding: 15px;
      font-size: 12px;
      color: #64748b;
      border-top: 1px solid #1e293b;
    }
  </style>
</head>

<body>
  <div class="container">
    
    <div class="header">
      🎮 SYSTEM ALERT 🎮
    </div>

    <div class="content">
      <div class="glow">
        PLAYER DETECTED ⚡
      </div>

      <div class="message">
       hello message spam
      </div>

      <a href="#" class="button">
        ENTER GAME
      </a>
    </div>

    <div class="footer">
      © 2026 Shadow Systems | Level Up Your Reality
    </div>

  </div>
</body>
</html>
`;

if (!receiverEmail) {
  console.log("❌ Please provide receiver email");
  process.exit(1);
}

const sendEmail = async () => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: receiverEmail,
      subject: "MESSAGE",
      html: htmlTemplate,
    });
    console.log("Email sent!");
  } catch (err) {
    console.error("Error sending email:", err);
  }
};
let hasLogged = false;
const formatDate = (hr) => {
  if (hr === 0) return "12 AM";
  if (hr === 12) return "12 PM";
  return hr > 12 ? `${hr - 12} PM` : `${hr} AM`;
};
cron.schedule("*2 * * * *", () => {
  //This Runs Every Two minute
  const now = new Date();
  const hours = now.getHours();
  if (hours >= endTime) {
    console.log("⛔ Job finished");
    process.exit(0);
  }
  if (hours < startTime) {
    if (!hasLogged) {
      console.log(`⏳ Waiting for ${formatDate(startTime)}...`);
      hasLogged = true;
    }
    return;
  }
  if (hours >= startTime && hours < endTime) {
    hasLogged = false; // reset for next cycle
    sendEmail();
    console.log(
      `Running between ${formatDate(startTime)} - ${formatDate(endTime)}...`,
    );
  }
});
