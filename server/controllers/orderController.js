import Order from '../models/Order.js';
import SiteSettings from '../models/SiteSettings.js';
import { isInMemoryDB } from '../config/db.js';
import { inMemoryOrders, inMemorySiteSettings } from '../utils/seedData.js';
import { calculateDistance, calculateDeliveryFee } from '../utils/deliveryCalculator.js';

// @desc    Create new order (COD)
// @route   POST /api/orders
// @access  Private (Registered & Active Customer only)
export const createOrder = async (req, res, next) => {
  try {
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
      baseCharge = inMemorySiteSettings?.baseCharge ?? baseCharge;
      ratePerKm = inMemorySiteSettings?.ratePerKm ?? ratePerKm;
    } else {
      const settings = await SiteSettings.findOne();
      if (settings) {
        if (settings.storeLocation && typeof settings.storeLocation.lat === 'number' && typeof settings.storeLocation.lng === 'number') {
          storeLoc = { lat: settings.storeLocation.lat, lng: settings.storeLocation.lng };
        }
        if (typeof settings.baseCharge === 'number' && !isNaN(settings.baseCharge)) {
          baseCharge = settings.baseCharge;
        }
        if (typeof settings.ratePerKm === 'number' && !isNaN(settings.ratePerKm)) {
          ratePerKm = settings.ratePerKm;
        }
      }
    }

    // Calculate delivery charges based on customer coordinates vs store location
    const custLat = Number(shippingDetails.latitude) || 31.4697;
    const custLng = Number(shippingDetails.longitude) || 74.2728;

    const distanceKm = calculateDistance(storeLoc.lat, storeLoc.lng, custLat, custLng);
    const deliveryInfo = calculateDeliveryFee(distanceKm, baseCharge, ratePerKm);
    const deliveryCharges = deliveryInfo.totalCharges;

    // Calculate items total
    const itemsTotal = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
    const grandTotal = itemsTotal + deliveryCharges;

    if (isInMemoryDB) {
      const newOrder = {
        _id: 'ord_' + Date.now(),
        customer: req.user._id,
        shippingDetails: {
          name: shippingDetails.name,
          phone: shippingDetails.phone,
          address: shippingDetails.address,
          city: shippingDetails.city,
          latitude: custLat,
          longitude: custLng
        },
        items,
        deliveryCharges,
        totalAmount: grandTotal,
        paymentMethod: 'COD',
        orderStatus: 'Pending',
        createdAt: new Date().toISOString()
      };

      inMemoryOrders.unshift(newOrder);
      return res.status(201).json(newOrder);
    }

    const order = await Order.create({
      customer: req.user._id,
      shippingDetails: {
        name: shippingDetails.name,
        phone: shippingDetails.phone,
        address: shippingDetails.address,
        city: shippingDetails.city,
        latitude: custLat,
        longitude: custLng
      },
      items,
      deliveryCharges,
      totalAmount: grandTotal,
      paymentMethod: 'COD',
      orderStatus: 'Pending'
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    if (isInMemoryDB) {
      const userOrders = inMemoryOrders.filter((o) => o.customer === req.user._id);
      return res.json(userOrders);
    }

    const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
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
    const { id } = req.params;
    const { orderStatus } = req.body;

    if (!orderStatus) {
      res.status(400);
      throw new Error('Please provide target orderStatus');
    }

    if (isInMemoryDB) {
      const order = inMemoryOrders.find((o) => o._id === id);
      if (!order) {
        res.status(404);
        throw new Error('Order not found');
      }
      order.orderStatus = orderStatus;
      return res.json(order);
    }

    const order = await Order.findById(id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    order.orderStatus = orderStatus;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};
