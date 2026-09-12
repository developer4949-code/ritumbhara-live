export interface Property {
  name: string;
  slug: string;
  destinationSlug: "jaipur" | "alwar" | "sariska" | "agra";
  propertyType: "Studio" | "Serviced Apartment" | "Villa";
  heroImage: string;
  amenities: string[];
  description: string;
  hotelSpiderBookingUrl: string;
  contact: { phone: string; email: string };
  featured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  h1?: string;
  faqSchema?: any;
}

import propertiesData from "../data/properties.json";

export const properties: Property[] = propertiesData as Property[];
