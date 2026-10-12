import * as React from "react"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fieldCell, fieldLabel, inputControl, selectControl } from "@/lib/field-styles"
import {
  ANY,
  defaultFilters,
  formatPrice,
  priceSteps,
  propertyTypes,
  toQuery,
  type Mode,
} from "@/lib/offers"

type Option = { value: string; label: string }
type Field =
  | { name: string; label: string; kind: "text"; placeholder: string; type?: string; autoComplete?: string }
  | { name: string; label: string; kind: "select"; options: Option[] }

const typeOptions: Option[] = propertyTypes.map((t) => ({ value: t, label: t }))
const anyType: Option = { value: ANY, label: "Any type" }
const budgetOptions = (mode: Mode): Option[] => [
  { value: ANY, label: "No limit" },
  ...priceSteps[mode].map((n) => ({ value: String(n), label: formatPrice(n) })),
]

const tabs: { id: string; label: string; cta: string; mode?: Mode; target?: string; fields: Field[] }[] = [
  {
    id: "buy",
    label: "Buy",
    cta: "Search homes",
    mode: "buy",
    fields: [
      { name: "location", label: "Location", kind: "text", placeholder: "City, area or address" },
      { name: "type", label: "Property type", kind: "select", options: [anyType, ...typeOptions] },
      { name: "budget", label: "Max price", kind: "select", options: budgetOptions("buy") },
    ],
  },
  {
    id: "rent",
    label: "Rent",
    cta: "Search rentals",
    mode: "rent",
    fields: [
      { name: "location", label: "Location", kind: "text", placeholder: "City, area or address" },
      { name: "type", label: "Property type", kind: "select", options: [anyType, ...typeOptions] },
      { name: "budget", label: "Max rent / month", kind: "select", options: budgetOptions("rent") },
    ],
  },
  {
    id: "sell",
    label: "Sell",
    cta: "Get a valuation",
    target: "#contact",
    fields: [
      { name: "address", label: "Property address", kind: "text", placeholder: "Where is your property?", autoComplete: "street-address" },
      { name: "type", label: "Property type", kind: "select", options: typeOptions },
      { name: "email", label: "Your email", kind: "text", type: "email", placeholder: "name@email.com", autoComplete: "email" },
    ],
  },
]

export default function SearchForm() {
  const [tab, setTab] = React.useState("buy")

  function onSubmit(t: (typeof tabs)[number]) {
    return (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (t.mode) {
        const data = new FormData(e.currentTarget)
        const query = toQuery({
          ...defaultFilters,
          mode: t.mode,
          location: String(data.get("location") ?? ""),
          type: String(data.get("type") ?? ANY),
          max: String(data.get("budget") ?? ANY),
        })
        window.location.assign(`/offers?${query}`)
        return
      }
      // No valuation backend yet: send people to the contact section.
      const el = t.target && document.querySelector<HTMLElement>(t.target)
      if (!el) return
      window.lenis ? window.lenis.scrollTo(el) : el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <Tabs value={tab} onValueChange={setTab} className="shadow-lift gap-0 bg-white">
      <div className="border-b border-stone">
        <TabsList
          variant="line"
          aria-label="What would you like to do?"
          className="-mb-px h-auto w-full gap-0 p-0 group-data-horizontal/tabs:h-auto sm:w-96"
        >
          {tabs.map((t) => (
            <TabsTrigger
              key={t.id}
              value={t.id}
              className="text-subtitle data-active:text-title hover:text-title h-auto rounded-none py-4 text-sm focus-visible:border-transparent focus-visible:ring-0 focus-visible:outline-2 focus-visible:-outline-offset-2 lg:text-base group-data-horizontal/tabs:after:bottom-0 group-data-horizontal/tabs:after:bg-teal group-data-horizontal/tabs:after:h-[2px] after:transition-opacity"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {tabs.map((t) => (
        <TabsContent
          key={t.id}
          value={t.id}
          asChild
        >
          <form
            noValidate
            onSubmit={onSubmit(t)}
            className="grid gap-4 p-5 md:grid-cols-3 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end lg:p-6"
          >
            {t.fields.map((f) => {
              const id = `${t.id}-${f.name}`
              return (
                <div key={f.name} className={fieldCell}>
                  <Label htmlFor={id} className={fieldLabel}>
                    {f.label}
                  </Label>
                  {f.kind === "select" ? (
                    <Select name={f.name} defaultValue={f.options[0].value}>
                      <SelectTrigger id={id} className={selectControl}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-none">
                        {f.options.map((o) => (
                          <SelectItem key={o.value} value={o.value} className="rounded-none">
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={id}
                      name={f.name}
                      type={f.type ?? "text"}
                      autoComplete={f.autoComplete ?? "off"}
                      placeholder={f.placeholder}
                      className={inputControl}
                    />
                  )}
                </div>
              )
            })}
            <div className="md:col-span-3 lg:col-span-1">
              <Button
                type="submit"
                className="bg-title text-paper hover:bg-teal h-11 w-full gap-2.5 rounded-none px-5 text-xs font-medium tracking-[0.02em] transition-colors lg:px-8 lg:text-sm"
              >
                {t.cta}
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Button>
            </div>
          </form>
        </TabsContent>
      ))}
    </Tabs>
  )
}
