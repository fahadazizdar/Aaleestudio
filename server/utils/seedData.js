import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import SiteSettings from '../models/SiteSettings.js';
import { isInMemoryDB } from '../config/db.js';

export const initialSiteSettings = {
  storeName: 'Aaleestudio Premium Apparel',
  contactPhone: '+92 300 1234567',
  contactEmail: 'support@aaleestudio.com',
  address: 'Main Boulevard, Gulberg III, Lahore, Pakistan',
  rulesAndTerms: [
    'All orders are processed under Cash on Delivery (COD) mode.',
    'Customers must register and log in to book or place orders.',
    'Returns & Exchanges are accepted within 7 days with tags attached.',
    'Delivery charges are dynamically computed based on your distance from store location.',
    'Deactivated customer accounts are restricted from placing orders.'
  ],
  ratePerKm: 15,
  baseCharge: 150,
  storeLocation: { lat: 31.5204, lng: 74.3587 },
  footerAboutText: 'Aaleestudio brings high-fashion apparel, multi-angle product previewing, dynamic color switching, and reliable Cash on Delivery nationwide.',
  heroSlides: [
    {
      title: 'Luxury Festive Collection 2026',
      subtitle: 'Handcrafted embroidered silk & lawn lawn formals for every special occasion.',
      image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1400&q=80',
      tag: 'NEW ARRIVALS'
    },
    {
      title: 'Modern Casuals & Pret Wear',
      subtitle: 'Breathable cotton tunics and minimalist co-ord sets designed for effortless daily elegance.',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80',
      tag: 'BESTSELLERS'
    },
    {
      title: 'Junior Fashion & Kids Wear',
      subtitle: 'Soft, hypoallergenic, colorful designer outfits for boys and girls.',
      image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=1400&q=80',
      tag: 'KIDS EDITION'
    }
  ]
};

export const sampleProducts = [
  {
    _id: 'prod_1',
    name: 'Embroidered Chiffon 3-Piece Suite',
    description: 'Exquisite heavy embroidered chiffon shirt with digital print silk dupatta and dyed trousers. Perfect for weddings and festive gatherings.',
    category: 'Ladies',
    basePrice: 6499,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      {
        colorName: 'Royal Maroon',
        colorCode: '#800020',
        images: [
          'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80'
        ],
        stock: 15
      },
      {
        colorName: 'Emerald Green',
        colorCode: '#004B23',
        images: [
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
        ],
        stock: 8
      }
    ],
    images360: [
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
    ],
    featured: true,
    isActive: true
  },
  {
    _id: 'prod_2',
    name: 'Minimalist Cotton Co-Ord Set',
    description: 'Premium combed breathable cotton tunic paired with matching wide-leg trousers. Modern relaxed fit.',
    category: 'Ladies',
    basePrice: 3999,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      {
        colorName: 'Powder Blue',
        colorCode: '#B0E0E6',
        images: [
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80'
        ],
        stock: 20
      },
      {
        colorName: 'Blush Pink',
        colorCode: '#FFB6C1',
        images: [
          'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=800&q=80'
        ],
        stock: 12
      }
    ],
    images360: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=800&q=80'
    ],
    featured: true,
    isActive: true
  },
  {
    _id: 'prod_3',
    name: 'Traditional Men Cotton Kurta Set',
    description: 'Classic embroidered collar cotton kurta with matching white pajama. Soft fabric with high durability.',
    category: 'Men',
    basePrice: 3499,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      {
        colorName: 'Charcoal Black',
        colorCode: '#1C1C1C',
        images: [
          'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80'
        ],
        stock: 25
      },
      {
        colorName: 'Off White',
        colorCode: '#FAF0E6',
        images: [
          'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
        ],
        stock: 18
      }
    ],
    images360: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
    ],
    featured: true,
    isActive: true
  },
  {
    _id: 'prod_4',
    name: 'Kids Festive Velvet Frock',
    description: 'Adorable velvet flared dress for girls with zari work border. Includes soft cotton lining.',
    category: 'Kids',
    basePrice: 2899,
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
    colors: [
      {
        colorName: 'Deep Purple',
        colorCode: '#4B0082',
        images: [
          'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80'
        ],
        stock: 10
      }
    ],
    images360: [
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80'
    ],
    featured: false,
    isActive: true
  }
];

// In-Memory Data Stores for immediate execution fallback
export let inMemoryUsers = [
  {
    _id: 'user_admin',
    name: 'Aaleestudio Admin',
    email: 'admin@aaleestudio.com',
    passwordHash: '$2a$10$edtbokhwVv8f8u3uX.KnO.I8Jpta1YrbIuJrhiDJjL8nm4.E.jjau', // "admin123"
    role: 'admin',
    phone: '+92 300 0000000',
    isActive: true
  },
  {
    _id: 'user_admin2',
    name: 'Alesstore Admin',
    email: 'admin@alesstore.com',
    passwordHash: '$2a$10$edtbokhwVv8f8u3uX.KnO.I8Jpta1YrbIuJrhiDJjL8nm4.E.jjau', // "admin123"
    role: 'admin',
    phone: '+92 300 0000000',
    isActive: true
  },
  {
    _id: 'user_customer1',
    name: 'Ali Raza',
    email: 'customer@gmail.com',
    passwordHash: '$2a$10$edtbokhwVv8f8u3uX.KnO.I8Jpta1YrbIuJrhiDJjL8nm4.E.jjau', // "admin123"
    role: 'customer',
    phone: '+92 321 9876543',
    isActive: true
  }
];

export let inMemoryProducts = [...sampleProducts];

export let inMemoryOrders = [
  {
    _id: 'ord_1001',
    customer: 'user_customer1',
    shippingDetails: {
      name: 'Ali Raza',
      phone: '+92 321 9876543',
      address: 'House 42, Block H, Johar Town',
      city: 'Lahore',
      latitude: 31.4697,
      longitude: 74.2728
    },
    items: [
      {
        product: 'prod_1',
        productName: 'Embroidered Chiffon 3-Piece Suite',
        selectedColor: 'Royal Maroon',
        selectedSize: 'M',
        quantity: 1,
        price: 6499,
        image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80'
      }
    ],
    deliveryCharges: 225,
    totalAmount: 6724,
    paymentMethod: 'COD',
    orderStatus: 'Confirmed',
    createdAt: new Date().toISOString()
  }
];

export let inMemorySiteSettings = { ...initialSiteSettings };

export const seedDatabase = async () => {
  if (isInMemoryDB) return;
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.create([
        {
          name: 'Aaleestudio Admin',
          email: 'admin@aaleestudio.com',
          password: 'admin123',
          role: 'admin',
          phone: '+92 300 0000000',
          isActive: true
        },
        {
          name: 'Ali Raza',
          email: 'customer@gmail.com',
          password: 'admin123',
          role: 'customer',
          phone: '+92 321 9876543',
          isActive: true
        }
      ]);
      console.log('[Seed] Default Admin and Customer accounts created!');
    }

    const prodCount = await Product.countDocuments();
    if (prodCount === 0) {
      await Product.insertMany(sampleProducts.map(({ _id, ...rest }) => rest));
      console.log('[Seed] Sample clothing products seeded into MongoDB!');
    }

    const settingsCount = await SiteSettings.countDocuments();
    if (settingsCount === 0) {
      await SiteSettings.create(initialSiteSettings);
      console.log('[Seed] Default site settings seeded into MongoDB!');
    }
  } catch (error) {
    console.error('[Seed Error]:', error.message);
  }
};
