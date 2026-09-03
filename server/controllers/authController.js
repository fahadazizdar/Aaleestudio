import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { isInMemoryDB } from '../config/db.js';
import { inMemoryUsers } from '../utils/seedData.js';

// @desc    Register a new customer
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body || {};

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please fill in all required fields (name, email, password).');
    }

    const cleanName = name.trim();
    const lowerEmail = email.toLowerCase().trim();

    if (password.length < 4) {
      res.status(400);
      throw new Error('Password must be at least 4 characters long.');
    }

    if (isInMemoryDB) {
      const exists = inMemoryUsers.find((u) => u.email === lowerEmail);
      if (exists) {
        res.status(400);
        throw new Error('User with this email already exists. Please Sign In.');
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: 'user_' + Date.now(),
        name: cleanName,
        email: lowerEmail,
        passwordHash: hashedPassword,
        phone: phone ? phone.trim() : '',
        role: 'customer',
        isActive: true,
        createdAt: new Date().toISOString()
      };

      inMemoryUsers.push(newUser);

      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        isActive: newUser.isActive,
        token: generateToken(newUser._id)
      });
    }

    const userExists = await User.findOne({ email: lowerEmail });
    if (userExists) {
      res.status(400);
      throw new Error('User with this email already exists. Please Sign In.');
    }

    const user = await User.create({
      name: cleanName,
      email: lowerEmail,
      password,
      phone: phone ? phone.trim() : '',
      role: 'customer',
      isActive: true
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        token: generateToken(user._id)
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data provided.');
    }
  } catch (error) {
    if (error.code === 11000) {
      res.status(400);
      return next(new Error('User with this email is already registered. Please Sign In.'));
    }
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password.');
    }

    const lowerEmail = email.toLowerCase().trim();

    if (isInMemoryDB) {
      const user = inMemoryUsers.find((u) => u.email === lowerEmail);
      if (!user) {
        res.status(401);
        throw new Error('Invalid email or password.');
      }

      if (user.isActive === false) {
        res.status(403);
        throw new Error('Your account has been deactivated by Admin. Please contact customer support.');
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        res.status(401);
        throw new Error('Invalid email or password.');
      }

      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        token: generateToken(user._id)
      });
    }

    const user = await User.findOne({ email: lowerEmail });
    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password.');
    }

    if (user.isActive === false) {
      res.status(403);
      throw new Error('Your account has been deactivated by Admin. Please contact customer support.');
    }

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        token: generateToken(user._id)
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password.');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
};
