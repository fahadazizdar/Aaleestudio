import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: 'Aaleestudio Premium Apparel' },
    contactPhone: { type: String, default: '+92 300 1234567' },
    contactEmail: { type: String, default: 'support@aaleestudio.com' },
    address: { type: String, default: 'Main Boulevard, Gulberg III, Lahore, Pakistan' },
    rulesAndTerms: {
      type: [String],
      default: [
        'All orders are processed under Cash on Delivery (COD) mode.',
        'Customers must have a verified registered account before placing orders.',
        'Returns & Exchanges are valid within 7 days of delivery with tag intact.',
        'Delivery charges are dynamically computed based on your delivery distance from store hub.',
        'Deactivated customer accounts are restricted from ordering.'
      ]
    },
    ratePerKm: { type: Number, default: 15 },
    baseCharge: { type: Number, default: 150 },
    storeLocation: {
      lat: { type: Number, default: 31.5204 },
      lng: { type: Number, default: 74.3587 }
    },
    footerAboutText: {
      type: String,
      default: 'Aaleestudio brings high-fashion, high-quality modern apparel directly to your doorstep with 360 multi-angle previews and seamless Cash on Delivery.'
    },
    heroSlides: [
      {
        title: { type: String },
        subtitle: { type: String },
        image: { type: String },
        tag: { type: String }
      }
    ]
  },
  { timestamps: true }
);

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
export default SiteSettings;
