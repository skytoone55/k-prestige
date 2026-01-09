// Images Unsplash temporaires en attendant les vraies photos du client

export const placeholderImages = {
  // Pessah / Hôtel
  hotelExterior: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
  hotelPool: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80',
  hotelRoom: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80',
  hotelBeach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
  hotelRestaurant: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
  
  // Marbella Restaurant
  restaurantInterior: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80',
  restaurantFood: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80',
  restaurantTerrace: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80',
  restaurantExterior: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80',
  
  // Marrakech Events
  weddingMorocco: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
  eventMorocco: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80',
  moroccanDecor: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80',
  marrakechEvent: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1200&q=80',
  
  // Hilloula / Spirituel
  candles: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1200&q=80',
  synagogue: 'https://images.unsplash.com/photo-1579952363873-27d3bade8dca?w=1200&q=80',
  prayer: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1200&q=80',
  pilgrimage: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1200&q=80',
  
  // Soucott / Loulav
  loulav: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1200&q=80',
  palm: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=1200&q=80',
  nature: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=1200&q=80',
  plants: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1200&q=80',
  
  // Animation / Musique
  musicBand: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80',
  dj: 'https://images.unsplash.com/photo-1571332652065-5e0df0f5c9b1?w=1200&q=80',
  singer: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80',
  kidsAnimation: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&q=80',
  
  // Services Hôtel
  beachAccess: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
  pool: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80',
  spa: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&q=80',
  restaurant: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
  kidsClub: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&q=80',
  fitness: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80',
};

// Fonction pour obtenir une image avec fallback
export function getImage(key: keyof typeof placeholderImages, customSrc?: string) {
  return customSrc || placeholderImages[key];
}

