import type { Offer } from "@/lib/offers"

// Placeholder listings until there is a backend. `image` is a key of the
// image map the offers page builds from src/assets.
export const offers: Offer[] = [
  { id: "sunset-villa", name: "Modern Sunset Villa", location: "Beverly Hills, CA", mode: "buy", type: "Villa", price: 1_450_000, beds: 4, baths: 3.5, sqft: 3200, availableIn: 0, image: "sunset" },
  { id: "archway-house", name: "Archway Brick House", location: "Charlotte, NC", mode: "buy", type: "House", price: 685_000, beds: 4, baths: 3, sqft: 2650, availableIn: 0, image: "archway" },
  { id: "palm-residence", name: "Palm Court Residence", location: "Miami, FL", mode: "buy", type: "House", price: 2_250_000, beds: 5, baths: 4.5, sqft: 4100, availableIn: 21, image: "hero" },
  { id: "skyline-penthouse", name: "Skyline Penthouse", location: "Manhattan, NY", mode: "buy", type: "Penthouse", price: 4_800_000, beds: 3, baths: 3.5, sqft: 2900, availableIn: 45, image: "sunset" },
  { id: "garden-apartment", name: "Garden View Apartment", location: "Austin, TX", mode: "buy", type: "Apartment", price: 395_000, beds: 2, baths: 2, sqft: 1150, availableIn: 0, image: "archway" },
  { id: "hillside-villa", name: "Hillside Villa", location: "Malibu, CA", mode: "buy", type: "Villa", price: 6_200_000, beds: 6, baths: 6, sqft: 6800, availableIn: 120, image: "hero" },
  { id: "lakeview-lot", name: "Lakeview Building Plot", location: "Austin, TX", mode: "buy", type: "Land", price: 240_000, beds: 0, baths: 0, sqft: 9800, availableIn: 0, image: "archway" },
  { id: "bayfront-house", name: "Bayfront Family House", location: "Miami, FL", mode: "buy", type: "House", price: 1_180_000, beds: 4, baths: 3, sqft: 2800, availableIn: 75, image: "sunset" },
  { id: "downtown-loft", name: "Downtown Loft", location: "Manhattan, NY", mode: "rent", type: "Apartment", price: 4_200, beds: 1, baths: 1.5, sqft: 980, availableIn: 0, image: "archway" },
  { id: "canyon-villa-rental", name: "Canyon Retreat Villa", location: "Beverly Hills, CA", mode: "rent", type: "Villa", price: 9_800, beds: 4, baths: 4, sqft: 3400, availableIn: 14, image: "sunset" },
  { id: "oak-street-house", name: "Oak Street Townhouse", location: "Charlotte, NC", mode: "rent", type: "House", price: 2_750, beds: 3, baths: 2.5, sqft: 1900, availableIn: 0, image: "archway" },
  { id: "harbor-apartment", name: "Harbor Studio Apartment", location: "Miami, FL", mode: "rent", type: "Apartment", price: 1_850, beds: 1, baths: 1, sqft: 620, availableIn: 30, image: "hero" },
  { id: "eastside-penthouse", name: "Eastside Penthouse", location: "Austin, TX", mode: "rent", type: "Penthouse", price: 7_500, beds: 3, baths: 3, sqft: 2400, availableIn: 60, image: "hero" },
  { id: "cedar-house", name: "Cedar Lane Cottage", location: "Charlotte, NC", mode: "rent", type: "House", price: 1_450, beds: 2, baths: 1, sqft: 1100, availableIn: 90, image: "archway" },
]
