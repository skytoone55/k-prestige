// Tarifs du séjour (10 nuits)
export const PRICING = {
  ADULT: 2190,
  BABY: 0,
  KID_3Y: 390,
  KID_6Y: 990,
  KID_11Y: 1390,
  WEEKEND_ADULT: 290,
  WEEKEND_KID: 190,
  SEA_VIEW_SUPPLEMENT: 400, // par chambre (10 nuits)
} as const;

// Calcul du prix total
export function calculatePrice(
  adults: number,
  babies: number,
  kids_3y: number,
  kids_6y: number,
  kids_11y: number,
  weekend: boolean
): number {
  let total = 
    adults * PRICING.ADULT +
    babies * PRICING.BABY +
    kids_3y * PRICING.KID_3Y +
    kids_6y * PRICING.KID_6Y +
    kids_11y * PRICING.KID_11Y;

  if (weekend) {
    const totalPeople = adults + kids_3y + kids_6y + kids_11y;
    total += totalPeople * PRICING.WEEKEND_ADULT; // Simplification: même prix adulte/enfant pour weekend
  }

  return total;
}

