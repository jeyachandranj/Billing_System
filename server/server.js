const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API);

app.post('/send-email', async (req, res) => {
  const { to, from, subject, html } = req.body;

  try {
    const result = await resend.emails.send({ to, from, subject, html });
    res.status(200).json(result);
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.listen(4000, () => {
  console.log('Server running on port 4000');
});