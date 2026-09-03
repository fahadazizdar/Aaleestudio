/**
 * Calculates distance in kilometers between two lat/lng points using Haversine formula
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 5; // Default fallback distance 5km
  
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  
  return Math.max(1, Math.round(distance * 10) / 10);
};

export const calculateDeliveryFee = (distanceKm, baseCharge = 150, ratePerKm = 15) => {
  const variableCharge = Math.round(distanceKm * ratePerKm);
  const total = Math.round(baseCharge + variableCharge);
  return {
    distanceKm,
    baseCharge,
    ratePerKm,
    variableCharge,
    totalCharges: total
  };
};
