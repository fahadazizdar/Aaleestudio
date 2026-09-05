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

    let deliveryFeeAmount = baseCharge;
    let distanceKm = 0;

    if (shippingDetails.latitude && shippingDetails.longitude) {
      const custLat = Number(shippingDetails.latitude);
      const custLng = Number(shippingDetails.longitude);
      if (!isNaN(custLat) && !isNaN(custLng)) {
        distanceKm = calculateDistance(storeLoc.lat, storeLoc.lng, custLat, custLng);
        const feeResult = calculateDeliveryFee(distanceKm, baseCharge, ratePerKm);
        deliveryFeeAmount = typeof feeResult === 'object' ? Number(feeResult.totalCharges || baseCharge) : Number(feeResult);
      }
    }

    if (isNaN(deliveryFeeAmount) || deliveryFeeAmount < 0) {
      deliveryFeeAmount = baseCharge;
    }

    const formattedItems = items.map((item) => ({
      product: typeof item.product === 'object' ? item.product._id : (item.product || item._id || 'prod_1'),
      productName: item.productName || item.name || 'Apparel Item',
      selectedColor: item.selectedColor || item.color || 'Default',
      selectedSize: item.selectedSize || item.size || 'M',
      quantity: Number(item.quantity) || 1,
      price: Number(item.price) || 0,
      image: item.image || item.images?.[0] || ''
    }));

    const itemsPrice = formattedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalPrice = itemsPrice + deliveryFeeAmount;

    if (isInMemoryDB) {
      const newOrder = {
        _id: 'ord_' + Date.now(),
        customer: req.user._id,
        items: formattedItems,
        shippingDetails,
        paymentMethod: 'COD',
        itemsPrice,
        deliveryFee: deliveryFeeAmount,
        deliveryCharges: deliveryFeeAmount,
        totalPrice,
        totalAmount: totalPrice,
        status: 'Pending',
        orderStatus: 'Pending',
        isPaid: false,
        distanceKm,
        createdAt: new Date().toISOString()
      };

      inMemoryOrders.unshift(newOrder);
      return res.status(201).json(newOrder);
    }

    const order = await Order.create({
      customer: req.user._id,
      items: formattedItems,
      shippingDetails,
      paymentMethod: 'COD',
      itemsPrice,
      deliveryFee: deliveryFeeAmount,
      deliveryCharges: deliveryFeeAmount,
      totalPrice,
      totalAmount: totalPrice,
      status: 'Pending',
      orderStatus: 'Pending',
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
    const targetStatus = req.body?.status || req.body?.orderStatus;

    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Dispatched', 'Shipped', 'Delivered', 'Cancelled'];
    if (!targetStatus || !validStatuses.includes(targetStatus)) {
      res.status(400);
      throw new Error(`Invalid status provided. Must be one of: ${validStatuses.join(', ')}`);
    }

    if (isInMemoryDB) {
      const order = inMemoryOrders.find((o) => o._id === id);
      if (!order) {
        res.status(404);
        throw new Error('Order not found');
      }

      order.status = targetStatus;
      order.orderStatus = targetStatus;
      if (targetStatus === 'Delivered') {
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

    order.status = targetStatus;
    order.orderStatus = targetStatus;
    if (targetStatus === 'Delivered') {
      order.isPaid = true;
      order.deliveredAt = new Date();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};
