import mongoose from 'mongoose';

const colorSchema = new mongoose.Schema({
  colorName: { type: String, required: true },
  colorCode: { type: String, required: true },
  images: [{ type: String, required: true }],
  stock: { type: Number, default: 10 }
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true, enum: ['Ladies', 'Kids', 'Men', 'Accessories', 'Festive'] },
    basePrice: { type: Number, required: true },
    sizes: [{ type: String, required: true }],
    colors: [colorSchema],
    images360: [{ type: String }],
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
