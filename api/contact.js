import { Resend } from 'resend';

const requiredFields = ['fname', 'lname', 'cemail'];

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function normalize(value = '') {
  return String(value).trim();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function sendJson(res, statusCode, payload) {
  res.status(statusCode).json(payload);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return sendJson(res, 405, { message: 'Method not allowed.' });
  }

  if (!process.env.RESEND_API_KEY) {
    return sendJson(res, 500, { message: 'Missing RESEND_API_KEY.' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const body = req.body || {};
  const missingField = requiredFields.find((field) => !normalize(body[field]));

  if (missingField) {
    return sendJson(res, 400, { message: 'Please complete all required fields.' });
  }

  const firstName = normalize(body.fname);
  const lastName = normalize(body.lname);
  const email = normalize(body.cemail);
  const goal = normalize(body.goal) || 'Not selected';
  const message = normalize(body.message) || 'No message provided.';

  if (!isValidEmail(email)) {
    return sendJson(res, 400, { message: 'Please enter a valid email address.' });
  }

  const fullName = `${firstName} ${lastName}`;
  const to = process.env.CONTACT_TO_EMAIL || 'marianokelvin@yahoo.com';
  const from = process.env.RESEND_FROM_EMAIL || 'Kelvin Mariano <onboarding@resend.dev>';
  const subject = `New training inquiry from ${fullName}`;
  const text = [
    `Name: ${fullName}`,
    `Email: ${email}`,
    `Goal: ${goal}`,
    '',
    'Message:',
    message
  ].join('\n');

  const html = `
    <h2>New training inquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Goal:</strong> ${escapeHtml(goal)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replaceAll('\n', '<br>')}</p>
  `;

  const { data, error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject,
    text,
    html
  });

  if (error) {
    console.error('Resend contact error:', error);
    return sendJson(res, 502, { message: 'Unable to send the message right now.' });
  }

  return sendJson(res, 200, { id: data?.id, message: 'Message sent.' });
}
