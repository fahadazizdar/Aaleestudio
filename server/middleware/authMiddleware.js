import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { inMemoryUsers } from '../utils/seedData.js';
import { isInMemoryDB } from '../config/db.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'aaleestudio_super_secret_jwt_key_2026');

      if (isInMemoryDB) {
        const found = inMemoryUsers.find((u) => u._id === decoded.id);
        if (!found) {
          res.status(401);
          return next(new Error('Not authorized, user account not found. Please log in again.'));
        }
        if (found.isActive === false) {
          res.status(403);
          return next(new Error('Your account has been deactivated by Admin. You cannot perform this action.'));
        }
        req.user = found;
        return next();
      }

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        res.status(401);
        return next(new Error('Not authorized, user account not found in database. Please Sign In again.'));
      }

      if (user.isActive === false) {
        res.status(403);
        return next(new Error('Your account has been deactivated by Admin. You cannot perform this action.'));
      }

      req.user = user;
      return next();
    } catch (error) {
      const code = res.statusCode && res.statusCode !== 200 ? res.statusCode : 401;
      res.status(code);
      return next(error);
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token provided. Registration/Login required.'));
  }
};
