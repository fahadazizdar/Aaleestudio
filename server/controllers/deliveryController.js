import SiteSettings from '../models/SiteSettings.js';
import { isInMemoryDB } from '../config/db.js';
import { inMemorySiteSettings } from '../utils/seedData.js';
import { calculateDistance, calculateDeliveryFee } from '../utils/deliveryCalculator.js';

// @desc    Calculate distance-based delivery fee
// @route   POST /api/delivery/calculate
// @access  Public
export const calculateFee = async (req, res, next) => {
  try {
    const { lat, lng } = req.body || {};

    let storeLoc = { lat: 31.5204, lng: 74.3587 };
    let baseCharge = 150;
    let ratePerKm = 15;

    if (isInMemoryDB) {
      if (inMemorySiteSettings?.storeLocation?.lat && inMemorySiteSettings?.storeLocation?.lng) {
        storeLoc = {
          lat: Number(inMemorySiteSettings.storeLocation.lat) || 31.5204,
          lng: Number(inMemorySiteSettings.storeLocation.lng) || 74.3587
        };
      }
      baseCharge = Number(inMemorySiteSettings?.baseCharge) || baseCharge;
      ratePerKm = Number(inMemorySiteSettings?.ratePerKm) || ratePerKm;
    } else {
      const settings = await SiteSettings.findOne();
      if (settings) {
        const sLat = Number(settings.storeLocation?.lat);
        const sLng = Number(settings.storeLocation?.lng);
        if (!isNaN(sLat) && !isNaN(sLng) && sLat !== 0 && sLng !== 0) {
          storeLoc = { lat: sLat, lng: sLng };
        }
        if (typeof settings.baseCharge === 'number' && !isNaN(settings.baseCharge)) {
          baseCharge = settings.baseCharge;
        }
        if (typeof settings.ratePerKm === 'number' && !isNaN(settings.ratePerKm)) {
          ratePerKm = settings.ratePerKm;
        }
      }
    }

    const custLat = (typeof lat === 'number' && !isNaN(lat)) ? lat : Number(lat) || 31.4697;
    const custLng = (typeof lng === 'number' && !isNaN(lng)) ? lng : Number(lng) || 74.2728;

    const distanceKm = calculateDistance(storeLoc.lat, storeLoc.lng, custLat, custLng);
    const feeCalculation = calculateDeliveryFee(distanceKm, baseCharge, ratePerKm);

    res.json(feeCalculation);
  } catch (error) {
    console.error('Error in calculateFee delivery controller:', error);
    // Return graceful fallback fee calculation instead of 500 error
    res.json({
      distanceKm: 5,
      baseCharge: 150,
      ratePerKm: 15,
      variableCharge: 75,
      totalCharges: 225
    });
  }
};
