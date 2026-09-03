import Product from '../models/Product.js';
import { isInMemoryDB } from '../config/db.js';
import { inMemoryProducts } from '../utils/seedData.js';

// @desc    Get all active products with filters
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const { category, search, featured } = req.query;

    if (isInMemoryDB) {
      let filtered = inMemoryProducts.filter((p) => p.isActive !== false);

      if (category && category !== 'All') {
        filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
      }

      if (featured === 'true') {
        filtered = filtered.filter((p) => p.featured === true);
      }

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
        );
      }

      return res.json(filtered);
    }

    const filterObj = { isActive: true };

    if (category && category !== 'All') {
      filterObj.category = category;
    }

    if (featured === 'true') {
      filterObj.featured = true;
    }

    if (search) {
      filterObj.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(filterObj).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isInMemoryDB) {
      const product = inMemoryProducts.find((p) => p._id === id);
      if (!product) {
        res.status(404);
        throw new Error('Product not found');
      }
      return res.json(product);
    }

    const product = await Product.findById(id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, category, basePrice, sizes, colors, images360, featured } = req.body;

    if (!name || !description || !category || !basePrice) {
      res.status(400);
      throw new Error('Please fill in required product fields (name, description, category, basePrice)');
    }

    if (isInMemoryDB) {
      const newProduct = {
        _id: 'prod_' + Date.now(),
        name,
        description,
        category,
        basePrice: Number(basePrice),
        sizes: sizes || ['S', 'M', 'L'],
        colors: colors || [
          {
            colorName: 'Default',
            colorCode: '#000000',
            images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80'],
            stock: 10
          }
        ],
        images360: images360 || [],
        featured: Boolean(featured),
        isActive: true,
        createdAt: new Date().toISOString()
      };

      inMemoryProducts.unshift(newProduct);
      return res.status(201).json(newProduct);
    }

    const product = await Product.create({
      name,
      description,
      category,
      basePrice,
      sizes: sizes || ['S', 'M', 'L'],
      colors,
      images360: images360 || [],
      featured: Boolean(featured),
      createdBy: req.user._id
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isInMemoryDB) {
      const index = inMemoryProducts.findIndex((p) => p._id === id);
      if (index === -1) {
        res.status(404);
        throw new Error('Product not found');
      }

      inMemoryProducts[index] = { ...inMemoryProducts[index], ...req.body };
      return res.json(inMemoryProducts[index]);
    }

    const product = await Product.findById(id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    Object.assign(product, req.body);
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isInMemoryDB) {
      const index = inMemoryProducts.findIndex((p) => p._id === id);
      if (index === -1) {
        res.status(404);
        throw new Error('Product not found');
      }
      inMemoryProducts.splice(index, 1);
      return res.json({ message: 'Product deleted successfully' });
    }

    const product = await Product.findById(id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};
