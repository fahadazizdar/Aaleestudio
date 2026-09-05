import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.Mixed, required: true },
  productName: { type: String, required: true },
  selectedColor: { type: String, required: true },
  selectedSize: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  image: { type: String }
});

const orderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.Mixed, required: true, ref: 'User' },
    shippingDetails: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      latitude: { type: Number, default: 31.5204 },
      longitude: { type: Number, default: 74.3587 }
    },
    items: [orderItemSchema],
    itemsPrice: { type: Number },
    deliveryFee: { type: Number },
    deliveryCharges: { type: Number },
    totalPrice: { type: Number },
    totalAmount: { type: Number },
    paymentMethod: { type: String, default: 'COD' },
    status: { type: String, default: 'Pending' },
    orderStatus: {
      type: String,
      default: 'Pending'
    },
    isPaid: { type: Boolean, default: false },
    distanceKm: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
