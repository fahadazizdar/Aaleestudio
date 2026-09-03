import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import SiteSettings from '../models/SiteSettings.js';
import ContactMessage from '../models/ContactMessage.js';
import { connectDB, isInMemoryDB } from '../config/db.js';
import {
  inMemoryUsers,
  inMemoryProducts,
  inMemoryOrders,
  inMemorySiteSettings
} from '../utils/seedData.js';

export let inMemoryContactMessages = [];

// @desc    Get all registered customers
// @route   GET /api/admin/customers
// @access  Private/Admin
export const getAllCustomers = async (req, res, next) => {
  try {
    await connectDB();
    if (isInMemoryDB) {
      const customers = inMemoryUsers.filter((u) => u.role === 'customer');
      return res.json(customers);
    }

    const customers = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle customer active status (deactivate/activate)
// @route   PUT /api/admin/customers/:id/toggle-status
// @access  Private/Admin
export const toggleUserStatus = async (req, res, next) => {
  try {
    await connectDB();
    const { id } = req.params;

    if (isInMemoryDB) {
      const user = inMemoryUsers.find((u) => u._id === id);
      if (!user) {
        res.status(404);
        throw new Error('User not found');
      }

      user.isActive = !user.isActive;
      return res.json({
        message: `User account has been ${user.isActive ? 'activated' : 'deactivated'}.`,
        user: { _id: user._id, name: user.name, email: user.email, isActive: user.isActive }
      });
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User account has been ${user.isActive ? 'activated' : 'deactivated'}.`,
      user: { _id: user._id, name: user.name, email: user.email, isActive: user.isActive }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard metrics & summary
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    await connectDB();
    if (isInMemoryDB) {
      const totalRevenue = inMemoryOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
      return res.json({
        totalProducts: inMemoryProducts.length,
        totalOrders: inMemoryOrders.length,
        totalCustomers: inMemoryUsers.filter((u) => u.role === 'customer').length,
        totalRevenue,
        recentOrders: inMemoryOrders.slice(0, 5)
      });
    }

    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    const revenueResult = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    const recentOrders = await Order.find()
      .populate('customer', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalProducts,
      totalOrders,
      totalCustomers,
      totalRevenue,
      recentOrders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current site settings
// @route   GET /api/admin/settings
// @access  Public
export const getSiteSettings = async (req, res, next) => {
  try {
    await connectDB();
    if (isInMemoryDB) {
      return res.json(inMemorySiteSettings);
    }

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(inMemorySiteSettings);
    }

    res.json(settings);
  } catch (error) {
    next(error);
  }
};

// @desc    Update site settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
export const updateSiteSettings = async (req, res, next) => {
  try {
    await connectDB();
    if (isInMemoryDB) {
      Object.assign(inMemorySiteSettings, req.body);
      return res.json(inMemorySiteSettings);
    }

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer contact messages
// @route   GET /api/admin/contact-messages
// @access  Private/Admin
export const getContactMessages = async (req, res, next) => {
  try {
    await connectDB();
    if (isInMemoryDB) {
      return res.json(inMemoryContactMessages);
    }

    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new contact message
// @route   POST /api/admin/contact-messages
// @access  Public
export const createContactMessage = async (req, res, next) => {
  try {
    await connectDB();
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      res.status(400);
      throw new Error('Please fill in required fields (name, email, message)');
    }

    if (isInMemoryDB) {
      const newMessage = {
        _id: 'msg_' + Date.now(),
        name,
        email,
        subject: subject || 'General Inquiry',
        message,
        createdAt: new Date().toISOString()
      };
      inMemoryContactMessages.unshift(newMessage);
      return res.status(201).json({ message: 'Message sent successfully!', data: newMessage });
    }

    const newMessage = await ContactMessage.create({
      name,
      email,
      subject: subject || 'General Inquiry',
      message
    });

    res.status(201).json({ message: 'Message sent successfully!', data: newMessage });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact message
// @route   DELETE /api/admin/contact-messages/:id
// @access  Private/Admin
export const deleteContactMessage = async (req, res, next) => {
  try {
    await connectDB();
    const { id } = req.params;

    if (isInMemoryDB) {
      inMemoryContactMessages = inMemoryContactMessages.filter((m) => m._id !== id);
      return res.json({ message: 'Message deleted successfully' });
    }

    const msg = await ContactMessage.findById(id);
    if (!msg) {
      res.status(404);
      throw new Error('Message not found');
    }

    await msg.deleteOne();
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    next(error);
  }
};
