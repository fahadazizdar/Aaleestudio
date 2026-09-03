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
          throw new Error('Not authorized, user not found');
        }
        if (found.isActive === false) {
          res.status(403);
          throw new Error('Your account has been deactivated by Admin. You cannot perform this action.');
        }
        req.user = found;
        return next();
      }

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        res.status(401);
        throw new Error('Not authorized, token failed');
      }

      if (user.isActive === false) {
        res.status(403);
        throw new Error('Your account has been deactivated by Admin. You cannot perform this action.');
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(req.statusCode === 403 ? 403 : 401);
      next(error);
    }
  }

  if (!token) {
    res.status(401);
    next(new Error('Not authorized, no token provided. Registration/Login required.'));
  }
};
