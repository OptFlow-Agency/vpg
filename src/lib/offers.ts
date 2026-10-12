export type Mode = "buy" | "rent"

export const ANY = "any"

export interface Offer {
  id: string
  name: string
  location: string
  mode: Mode
  type: string
  price: number
  beds: number
  baths: number
  sqft: number
  /** Days from today until the property can be moved into / purchased. 0 = now. */
  availableIn: number
  image: string
}

export interface Filters {
  mode: Mode
  location: string
  type: string
  min: string
  max: string
  available: string
}

export const propertyTypes = ["House", "Villa", "Apartment", "Penthouse", "Land"]

export const priceSteps: Record<Mode, number[]> = {
  buy: [250_000, 500_000, 1_000_000, 2_000_000, 5_000_000],
  rent: [1_500, 3_000, 5_000, 10_000],
}

export const availabilityOptions = [
  { value: ANY, label: "Any time" },
  { value: "now", label: "Available now" },
  { value: "30", label: "Within 30 days" },
  { value: "90", label: "Within 3 months" },
]

export const defaultFilters: Filters = {
  mode: "buy",
  location: "",
  type: ANY,
  min: ANY,
  max: ANY,
  available: ANY,
}

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

export const formatPrice = (n: number) => usd.format(n)

export function availabilityLabel(days: number) {
  if (days === 0) return "Available now"
  if (days < 14) return `Available in ${days} days`
  if (days < 60) return `Available in ${Math.round(days / 7)} weeks`
  return `Available in ${Math.round(days / 30)} months`
}

/** Reads filters from a query string, ignoring anything unknown or malformed. */
export function parseFilters(search: string): Filters {
  const p = new URLSearchParams(search)
  const mode: Mode = p.get("mode") === "rent" ? "rent" : "buy"
  const price = (key: string) => {
    const v = p.get(key)
    return v && priceSteps[mode].includes(Number(v)) ? v : ANY
  }
  const available = p.get("available") ?? ANY
  const type = p.get("type") ?? ANY
  return {
    mode,
    location: p.get("location")?.trim() ?? "",
    type: propertyTypes.includes(type) ? type : ANY,
    min: price("min"),
    max: price("max"),
    available: availabilityOptions.some((o) => o.value === available) ? available : ANY,
  }
}

/** Serialises filters, leaving out defaults to keep URLs short. */
export function toQuery(f: Filters) {
  const p = new URLSearchParams()
  p.set("mode", f.mode)
  if (f.location.trim()) p.set("location", f.location.trim())
  for (const key of ["type", "min", "max", "available"] as const) {
    if (f[key] !== ANY) p.set(key, f[key])
  }
  return p.toString()
}

export function isFiltered(f: Filters) {
  return (
    f.location.trim() !== "" ||
    f.type !== ANY ||
    f.min !== ANY ||
    f.max !== ANY ||
    f.available !== ANY
  )
}

export function applyFilters(offers: Offer[], f: Filters) {
  const query = f.location.trim().toLowerCase()
  const maxDays = f.available === ANY ? Infinity : f.available === "now" ? 0 : Number(f.available)
  return offers.filter(
    (o) =>
      o.mode === f.mode &&
      (!query || o.location.toLowerCase().includes(query) || o.name.toLowerCase().includes(query)) &&
      (f.type === ANY || o.type === f.type) &&
      (f.min === ANY || o.price >= Number(f.min)) &&
      (f.max === ANY || o.price <= Number(f.max)) &&
      o.availableIn <= maxDays,
  )
}
