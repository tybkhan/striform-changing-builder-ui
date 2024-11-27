const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configure nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Send email notification
router.post('/email', async (req, res) => {
  try {
    const { formId, email, answers } = req.body;

    // Format answers for email
    const formattedAnswers = Object.entries(answers)
      .map(([question, answer]) => `${question}: ${JSON.stringify(answer)}`)
      .join('\n');

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: `New Form Submission - Form #${formId}`,
      text: `You have received a new form submission:\n\n${formattedAnswers}`,
      html: `
        <h2>New Form Submission</h2>
        <p>You have received a new submission for Form #${formId}</p>
        <h3>Responses:</h3>
        <pre>${formattedAnswers}</pre>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Email notification sent successfully' });
  } catch (error) {
    console.error('Email notification error:', error);
    res.status(500).json({ message: 'Failed to send email notification' });
  }
});

module.exports = router;