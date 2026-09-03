import Order from '../models/Order.js';
import SiteSettings from '../models/SiteSettings.js';
import { connectDB, isInMemoryDB } from '../config/db.js';
import { inMemoryOrders, inMemorySiteSettings } from '../utils/seedData.js';
import { calculateDistance, calculateDeliveryFee } from '../utils/deliveryCalculator.js';

// @desc    Create new order (COD)
// @route   POST /api/orders
// @access  Private (Registered & Active Customer only)
export const createOrder = async (req, res, next) => {
  try {
    await connectDB();
    const { items, shippingDetails } = req.body;

    if (!items || items.length === 0) {
      res.status(400);
      throw new Error('No order items provided in cart.');
    }

    if (!shippingDetails || !shippingDetails.name || !shippingDetails.phone || !shippingDetails.address || !shippingDetails.city) {
      res.status(400);
      throw new Error('Please provide complete shipping details (name, phone, address, city).');
    }

    // Retrieve active site delivery settings
    let storeLoc = { lat: 31.5204, lng: 74.3587 };
    let baseCharge = 150;
    let ratePerKm = 15;

    if (isInMemoryDB) {
      if (inMemorySiteSettings?.storeLocation?.lat && inMemorySiteSettings?.storeLocation?.lng) {
        storeLoc = inMemorySiteSettings.storeLocation;
      }
      if (typeof inMemorySiteSettings?.baseCharge === 'number') baseCharge = inMemorySiteSettings.baseCharge;
      if (typeof inMemorySiteSettings?.ratePerKm === 'number') ratePerKm = inMemorySiteSettings.ratePerKm;
    } else {
      const settings = await SiteSettings.findOne();
      if (settings) {
        if (settings.storeLocation?.lat && settings.storeLocation?.lng) storeLoc = settings.storeLocation;
        if (typeof settings.baseCharge === 'number') baseCharge = settings.baseCharge;
        if (typeof settings.ratePerKm === 'number') ratePerKm = settings.ratePerKm;
      }
    }

    let deliveryFee = baseCharge;
    let distanceKm = 0;

    if (shippingDetails.latitude && shippingDetails.longitude) {
      const custLat = Number(shippingDetails.latitude);
      const custLng = Number(shippingDetails.longitude);
      if (!isNaN(custLat) && !isNaN(custLng)) {
        distanceKm = calculateDistance(storeLoc.lat, storeLoc.lng, custLat, custLng);
        deliveryFee = calculateDeliveryFee(distanceKm, baseCharge, ratePerKm);
      }
    }

    const itemsPrice = items.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
    const totalPrice = itemsPrice + deliveryFee;

    if (isInMemoryDB) {
      const newOrder = {
        _id: 'ord_' + Date.now(),
        customer: req.user._id,
        items,
        shippingDetails,
        paymentMethod: 'COD',
        itemsPrice,
        deliveryFee,
        totalPrice,
        status: 'Pending',
        isPaid: false,
        distanceKm,
        createdAt: new Date().toISOString()
      };

      inMemoryOrders.unshift(newOrder);
      return res.status(201).json(newOrder);
    }

    const order = await Order.create({
      customer: req.user._id,
      items,
      shippingDetails,
      paymentMethod: 'COD',
      itemsPrice,
      deliveryFee,
      totalPrice,
      status: 'Pending',
      isPaid: false,
      distanceKm
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/my-orders
// @access  Private (Customer)
export const getMyOrders = async (req, res, next) => {
  try {
    await connectDB();
    if (isInMemoryDB) {
      const myOrders = inMemoryOrders.filter((o) => o.customer === req.user._id);
      return res.json(myOrders);
    }

    const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order details by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    await connectDB();
    const { id } = req.params;

    if (isInMemoryDB) {
      const order = inMemoryOrders.find((o) => o._id === id);
      if (!order) {
        res.status(404);
        throw new Error('Order not found');
      }

      if (req.user.role !== 'admin' && order.customer !== req.user._id) {
        res.status(403);
        throw new Error('Not authorized to view this order');
      }

      return res.json(order);
    }

    const order = await Order.findById(id).populate('customer', 'name email phone');
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    if (req.user.role !== 'admin' && order.customer._id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders across store
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    await connectDB();
    if (isInMemoryDB) {
      return res.json(inMemoryOrders);
    }

    const orders = await Order.find()
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    await connectDB();
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'];
    if (!status || !validStatuses.includes(status)) {
      res.status(400);
      throw new Error(`Invalid status provided. Must be one of: ${validStatuses.join(', ')}`);
    }

    if (isInMemoryDB) {
      const order = inMemoryOrders.find((o) => o._id === id);
      if (!order) {
        res.status(404);
        throw new Error('Order not found');
      }

      order.status = status;
      if (status === 'Delivered') {
        order.isPaid = true;
        order.deliveredAt = new Date().toISOString();
      }

      return res.json(order);
    }

    const order = await Order.findById(id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    order.status = status;
    if (status === 'Delivered') {
      order.isPaid = true;
      order.deliveredAt = new Date();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};
