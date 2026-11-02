import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function createToken(userId) {
  return jwt.sign({ sub: userId.toString() }, env.jwtSecret, { expiresIn: '1d' });
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: ONE_DAY_MS,
    path: '/',
  };
}

function sendAuthenticatedUser(res, user, statusCode = 200, message = 'Login successful') {
  const token = createToken(user._id);
  res.cookie('token', token, cookieOptions());
  return res.status(statusCode).json({
    success: true,
    message,
    token,
    user: user.toJSON(),
  });
}

export async function register(req, res) {
  const { name, email, password } = req.body || {};

  if (![name, email, password].every((value) => typeof value === 'string')) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required as text values.' });
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (cleanName.length < 2 || cleanName.length > 60) {
    return res.status(400).json({ success: false, message: 'Name must be between 2 and 60 characters.' });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(cleanEmail)) {
    return res.status(400).json({ success: false, message: 'Enter a valid email address.' });
  }

  if (password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) {
    return res.status(400).json({ success: false, message: 'Password must contain at least 8 characters and cannot exceed 72 UTF-8 bytes.' });
  }

  const existingUser = await User.findOne({ email: cleanEmail });
  if (existingUser) {
    return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name: cleanName, email: cleanEmail, password: hashedPassword });

  return sendAuthenticatedUser(res, user, 201, 'Account created successfully');
}

export async function login(req, res) {
  const { email, password } = req.body || {};

  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
  if (!user) {
    return res.status(401).json({ success: false, message: 'Email or password is incorrect.' });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return res.status(401).json({ success: false, message: 'Email or password is incorrect.' });
  }

  return sendAuthenticatedUser(res, user);
}

export async function logout(_req, res) {
  return res
    .clearCookie('token', cookieOptions())
    .status(200)
    .json({ success: true, message: 'Login cookie cleared. The JWT itself remains usable until it expires if someone has copied it.' });
}

export async function getCurrentUser(req, res) {
  return res.status(200).json({ success: true, user: req.user.toJSON() });
}
