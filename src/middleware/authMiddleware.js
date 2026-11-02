import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';

export async function requireAuth(req, res, next) {
  try {
    const authorizationHeader = req.get('Authorization');
    const bearerToken = authorizationHeader?.startsWith('Bearer ')
      ? authorizationHeader.slice(7).trim()
      : null;
    const token = bearerToken || req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Log in and send the token as a Bearer token.',
      });
    }

    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The account for this token no longer exists.',
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Your login has expired. Please log in again.' });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'The authentication token is invalid.' });
    }

    return next(error);
  }
}
