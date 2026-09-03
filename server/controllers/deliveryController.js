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
