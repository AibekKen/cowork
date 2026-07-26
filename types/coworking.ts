export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocalizedString {
  ru: string;
  kk: string;
  en: string;
}

export interface Coworking {
  id: string;
  slug: string;
  name: string;
  description: LocalizedString;
  fullDescription: LocalizedString;
  address: LocalizedString;
  district: LocalizedString;
  coordinates: Coordinates;
  priceFrom: number;
  priceMeetingRoom: number;
  whatsappNumber: string;
  photos: string[];
  amenities: LocalizedString[];
  rating: number;
}
