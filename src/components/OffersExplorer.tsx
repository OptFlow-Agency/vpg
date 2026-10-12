import * as React from "react"
import { ArrowRight, Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fieldCell, fieldLabel, inputControl, selectControl } from "@/lib/field-styles"
import {
  ANY,
  applyFilters,
  availabilityLabel,
  availabilityOptions,
  defaultFilters,
  formatPrice,
  isFiltered,
  parseFilters,
  priceSteps,
  propertyTypes,
  toQuery,
  type Filters,
  type Mode,
  type Offer,
} from "@/lib/offers"

export interface OfferImage {
  src: string
  width: number
  height: number
}

interface Props {
  offers: Offer[]
  images: Record<string, OfferImage>
  icons: { mapPin: string; building: string }
}

const num = new Intl.NumberFormat("en-US")

function FilterSelect({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string; disabled?: boolean }[]
}) {
  return (
    <div className={fieldCell}>
      <Label htmlFor={id} className={fieldLabel}>
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className={selectControl}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="rounded-none">
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value} disabled={o.disabled} className="rounded-none">
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default function OffersExplorer({ offers, images, icons }: Props) {
  // Pre-filters arrive as query params from the home page search form.
  const [filters, setFilters] = React.useState<Filters>(() => parseFilters(window.location.search))

  React.useEffect(() => {
    history.replaceState(null, "", `${window.location.pathname}?${toQuery(filters)}`)
  }, [filters])

  const update = (patch: Partial<Filters>) => setFilters((f) => ({ ...f, ...patch }))
  const reset = () => setFilters({ ...defaultFilters, mode: filters.mode })

  const results = React.useMemo(() => applyFilters(offers, filters), [offers, filters])

  const steps = priceSteps[filters.mode]
  const priceOptions = (disabled: (n: number) => boolean) => [
    { value: ANY, label: "No limit" },
    ...steps.map((n) => ({ value: String(n), label: formatPrice(n), disabled: disabled(n) })),
  ]
  const perMonth = filters.mode === "rent"

  return (
    <>
      <Tabs
        value={filters.mode}
        onValueChange={(m) => update({ mode: m as Mode, min: ANY, max: ANY })}
        className="shadow-lift gap-0 bg-white"
      >
        <div className="border-b border-stone">
          <TabsList
            variant="line"
            aria-label="Buy or rent"
            className="-mb-px h-auto w-full gap-0 p-0 group-data-horizontal/tabs:h-auto sm:w-72"
          >
            {(["buy", "rent"] as const).map((m) => (
              <TabsTrigger
                key={m}
                value={m}
                className="text-subtitle data-active:text-title hover:text-title h-auto rounded-none py-4 text-sm capitalize focus-visible:border-transparent focus-visible:ring-0 focus-visible:outline-2 focus-visible:-outline-offset-2 lg:text-base group-data-horizontal/tabs:after:bottom-0 group-data-horizontal/tabs:after:bg-teal group-data-horizontal/tabs:after:h-[2px] after:transition-opacity"
              >
                {m}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <form
          noValidate
          role="search"
          aria-label="Filter offers"
          onSubmit={(e) => e.preventDefault()}
          className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-6 lg:p-6"
        >
          <div className={`${fieldCell} sm:col-span-2 lg:col-span-2`}>
            <Label htmlFor="filter-location" className={fieldLabel}>
              Location
            </Label>
            <div className="relative">
              <Search
                className="text-teal pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                aria-hidden="true"
              />
              <Input
                id="filter-location"
                type="text"
                autoComplete="off"
                placeholder="City, area or address"
                value={filters.location}
                onChange={(e) => update({ location: e.target.value })}
                className={`${inputControl} pl-9`}
              />
            </div>
          </div>
          <FilterSelect
            id="filter-type"
            label="Property type"
            value={filters.type}
            onChange={(type) => update({ type })}
            options={[
              { value: ANY, label: "Any type" },
              ...propertyTypes.map((t) => ({ value: t, label: t })),
            ]}
          />
          <FilterSelect
            id="filter-availability"
            label="Availability"
            value={filters.available}
            onChange={(available) => update({ available })}
            options={availabilityOptions}
          />
          <FilterSelect
            id="filter-min"
            label={perMonth ? "Min rent / month" : "Min price"}
            value={filters.min}
            onChange={(min) => update({ min })}
            options={priceOptions((n) => filters.max !== ANY && n > Number(filters.max))}
          />
          <FilterSelect
            id="filter-max"
            label={perMonth ? "Max rent / month" : "Max price"}
            value={filters.max}
            onChange={(max) => update({ max })}
            options={priceOptions((n) => filters.min !== ANY && n < Number(filters.min))}
          />
        </form>
      </Tabs>

      <div className="mt-10 flex items-center justify-between gap-4 md:mt-14">
        <p aria-live="polite" className="text-subtitle text-xs font-medium lg:text-sm">
          <span className="text-title font-semibold">{results.length}</span>{" "}
          {results.length === 1 ? "offer" : "offers"} {perMonth ? "for rent" : "for sale"}
        </p>
        {isFiltered(filters) && (
          <button type="button" onClick={reset} className="link-draw text-title text-xs font-medium lg:text-sm">
            Clear filters
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="shadow-card mt-6 bg-white px-6 py-16 text-center">
          <h2 className="text-title text-lg font-semibold lg:text-2xl">No offers match your filters</h2>
          <p className="text-subtitle mx-auto mt-3 max-w-sm text-xs leading-relaxed lg:text-sm">
            Try widening your price range or availability, or searching a different location.
          </p>
          <button type="button" onClick={reset} className="btn btn-solid mt-6">
            Clear filters
          </button>
        </div>
      ) : (
        <ul className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {results.map((o) => {
            const img = images[o.image]
            return (
              <li
                key={o.id}
                className="group shadow-card hover:shadow-lift bg-white transition-shadow duration-500"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={img.src}
                    width={img.width}
                    height={img.height}
                    alt={`${o.name} exterior`}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-105"
                  />
                  <span className="text-title absolute top-3 left-3 bg-white px-2.5 py-1 text-[0.65rem] font-medium lg:text-xs">
                    {availabilityLabel(o.availableIn)}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-title text-base font-semibold lg:text-lg">{o.name}</h3>
                  <p className="text-subtitle mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.65rem] lg:text-xs">
                    <span className="inline-flex items-center gap-1">
                      <span className="shrink-0" dangerouslySetInnerHTML={{ __html: icons.mapPin }} />
                      {o.location}
                    </span>
                    {o.beds > 0 && <span>{o.beds} Beds</span>}
                    {o.baths > 0 && <span>{o.baths} Baths</span>}
                    <span className="inline-flex items-center gap-1">
                      <span className="shrink-0" dangerouslySetInnerHTML={{ __html: icons.building }} />
                      {num.format(o.sqft)} Sq Ft
                    </span>
                  </p>
                  <div className="border-stone mt-5 flex items-center justify-between border-t pt-5">
                    <span className="text-title text-sm font-semibold tracking-tight tabular-nums lg:text-lg">
                      {formatPrice(o.price)}
                      {o.mode === "rent" && (
                        <span className="text-subtitle text-[0.65rem] font-medium lg:text-xs"> /mo</span>
                      )}
                    </span>
                    <a href="/#contact" className="btn btn-solid">
                      Book Now
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
