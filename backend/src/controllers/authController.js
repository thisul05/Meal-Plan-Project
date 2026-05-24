const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const crypto  = require('crypto');
const pool    = require('../config/db');
const { sendVerificationEmail } = require('../services/emailService');

function signToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length) {
      return res.status(409).json({ error: 'An account with that email already exists' });
    }

    const hash  = await bcrypt.hash(password, 12);
    const token = crypto.randomBytes(48).toString('hex');

    await pool.query(
      `INSERT INTO users (name, email, password, email_verified, verification_token)
       VALUES ($1, $2, $3, FALSE, $4)`,
      [name || null, email.toLowerCase(), hash, token]
    );

    // Non-blocking — if email fails the account is still created
    sendVerificationEmail(email.toLowerCase(), token).catch(err =>
      console.error('Email send failed:', err.message)
    );

    res.status(201).json({ message: 'Account created. Please check your email to verify.' });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    const user = result.rows[0];

    const dummy = '$2a$12$dummyhashtopreventtimingattacksonuserlookup.dummy';
    const valid = user
      ? await bcrypt.compare(password, user.password)
      : await bcrypt.compare(password, dummy).then(() => false);

    if (!user || !valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.email_verified) {
      return res.status(403).json({
        error: 'Please verify your email before logging in.',
        needsVerification: true,
        email: user.email,
      });
    }

    res.json({ token: signToken(user), user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/verify?token=...
async function verifyEmail(req, res, next) {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: 'Token is required' });

    const result = await pool.query(
      'SELECT * FROM users WHERE verification_token = $1',
      [token]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification link.' });
    }

    await pool.query(
      'UPDATE users SET email_verified = TRUE, verification_token = NULL WHERE id = $1',
      [user.id]
    );

    res.json({ token: signToken(user), user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/resend-verification
async function resendVerification(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    const user = result.rows[0];

    // Return success even if not found — prevents email enumeration
    if (!user || user.email_verified) {
      return res.json({ message: 'If that account exists and is unverified, a new link has been sent.' });
    }

    const token = crypto.randomBytes(48).toString('hex');
    await pool.query('UPDATE users SET verification_token = $1 WHERE id = $2', [token, user.id]);

    sendVerificationEmail(user.email, token).catch(err =>
      console.error('Email send failed:', err.message)
    );

    res.json({ message: 'A new verification link has been sent to your email.' });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me
async function me(req, res, next) {
  try {
    const result = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [req.user.userId]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, verifyEmail, resendVerification, me };
