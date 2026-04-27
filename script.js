import cron from "node-cron";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const args = process.argv.slice(2);
const receiverEmail = args[0];
const startTime = Number(args[1]);
const endTime = Number(args[2]);

if (!receiverEmail) {
  console.log("❌ Please provide receiver email");
  process.exit(1);
}

// add all ur gif/img filenames here
const images = ["1.gif", "hello.gif", "hii.gif", "bubu-dudu.gif"];

const messages = [
  "thinking about you 🫶",
  "just a reminder that you're my favourite person",
  "hi bestie 🥺",
  "missing you rn🥺",
  "you make everything better",
  "ur literally the cutest",
  "sending you a hug 🤍",
  "you okay? just checking 💛",
];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const sendEmail = async () => {
  const randomImage = getRandom(images);
  const randomMessage = getRandom(messages);

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: receiverEmail,
      subject: randomMessage,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:20px;background:#fff;font-family:sans-serif;text-align:center;">
          <p style="font-size:18px;color:#333;margin-bottom:16px;">${randomMessage}</p>
          <img src="cid:bubu" style="width:100%;max-width:500px;border-radius:12px;" />
        </body>
        </html>
      `,
      attachments: [
        {
          filename: randomImage,
          path: `./${randomImage}`,
          cid: "bubu",
        },
      ],
    });
    console.log(`✅ Email sent! [${randomImage}] "${randomMessage}"`);
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

cron.schedule("*/2 * * * *", () => {
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
    hasLogged = false;
    sendEmail();
    console.log(`Running between ${formatDate(startTime)} - ${formatDate(endTime)}...`);
  }
});