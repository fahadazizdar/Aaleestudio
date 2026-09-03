import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  selectedColor: { type: String, required: true },
  selectedSize: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  image: { type: String }
});

const orderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    shippingDetails: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      latitude: { type: Number, default: 31.5204 },
      longitude: { type: Number, default: 74.3587 }
    },
    items: [orderItemSchema],
    deliveryCharges: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, default: 'COD' },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
