import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import SiteSettings from '../models/SiteSettings.js';
import ContactMessage from '../models/ContactMessage.js';
import { isInMemoryDB } from '../config/db.js';
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

// @desc    Toggle customer active/deactive status
// @route   PUT /api/admin/customers/:id/status
// @access  Private/Admin
export const toggleCustomerStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isInMemoryDB) {
      const customer = inMemoryUsers.find((u) => u._id === id);
      if (!customer) {
        res.status(404);
        throw new Error('Customer not found');
      }
      customer.isActive = !customer.isActive;
      return res.json({
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        isActive: customer.isActive,
        message: `Customer account status updated to ${customer.isActive ? 'Active' : 'Deactive'}`
      });
    }

    const customer = await User.findById(id);
    if (!customer) {
      res.status(404);
      throw new Error('Customer not found');
    }

    customer.isActive = !customer.isActive;
    await customer.save();

    res.json({
      _id: customer._id,
      name: customer.name,
      email: customer.email,
      isActive: customer.isActive,
      message: `Customer account status updated to ${customer.isActive ? 'Active' : 'Deactive'}`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get site settings & rules
// @route   GET /api/admin/settings
// @access  Public
export const getSiteSettings = async (req, res, next) => {
  try {
    if (isInMemoryDB) {
      return res.json(inMemorySiteSettings);
    }

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

// @desc    Update site settings, rules, and delivery parameters
// @route   PUT /api/admin/settings
// @access  Private/Admin
export const updateSiteSettings = async (req, res, next) => {
  try {
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

    const updated = await settings.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a contact inquiry message
// @route   POST /api/admin/contact-messages
// @access  Public
export const createContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      res.status(400);
      throw new Error('Please fill in required fields (name, email, message).');
    }

    if (isInMemoryDB) {
      const newMessage = {
        _id: 'msg_' + Date.now(),
        name,
        email,
        phone: phone || '',
        message,
        status: 'Unread',
        createdAt: new Date().toISOString()
      };
      inMemoryContactMessages.unshift(newMessage);
      return res.status(201).json(newMessage);
    }

    const newMessage = await ContactMessage.create({
      name,
      email,
      phone: phone || '',
      message
    });

    res.status(201).json(newMessage);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact inquiry messages
// @route   GET /api/admin/contact-messages
// @access  Private/Admin
export const getContactMessages = async (req, res, next) => {
  try {
    if (isInMemoryDB) {
      return res.json(inMemoryContactMessages);
    }

    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact message
// @route   DELETE /api/admin/contact-messages/:id
// @access  Private/Admin
export const deleteContactMessage = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isInMemoryDB) {
      inMemoryContactMessages = inMemoryContactMessages.filter((m) => m._id !== id);
      return res.json({ message: 'Message deleted' });
    }

    const msg = await ContactMessage.findById(id);
    if (!msg) {
      res.status(404);
      throw new Error('Message not found');
    }

    await msg.deleteOne();
    res.json({ message: 'Message deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Admin Dashboard metrics
// @route   GET /api/admin/dashboard-stats
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    if (isInMemoryDB) {
      const totalOrders = inMemoryOrders.length;
      const totalRevenue = inMemoryOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
      const pendingOrders = inMemoryOrders.filter((o) => o.orderStatus === 'Pending').length;
      const totalCustomers = inMemoryUsers.filter((u) => u.role === 'customer').length;
      const totalProducts = inMemoryProducts.length;
      const totalInquiries = inMemoryContactMessages.length;

      return res.json({
        totalOrders,
        totalRevenue,
        pendingOrders,
        totalCustomers,
        totalProducts,
        totalInquiries
      });
    }

    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments();
    const totalInquiries = await ContactMessage.countDocuments();

    const revenueResult = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.json({
      totalOrders,
      totalRevenue,
      pendingOrders,
      totalCustomers,
      totalProducts,
      totalInquiries
    });
  } catch (error) {
    next(error);
  }
};
