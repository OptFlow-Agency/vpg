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

type Field =
  | { name: string; label: string; kind: "text"; placeholder: string; type?: string; autoComplete?: string }
  | { name: string; label: string; kind: "select"; options: string[] }

const types = ["Any type", "House", "Villa", "Apartment", "Penthouse", "Land"]

const tabs: { id: string; label: string; cta: string; target: string; fields: Field[] }[] = [
  {
    id: "buy",
    label: "Buy",
    cta: "Search homes",
    target: "#properties",
    fields: [
      { name: "location", label: "Location", kind: "text", placeholder: "City, area or address" },
      { name: "type", label: "Property type", kind: "select", options: types },
      { name: "budget", label: "Max price", kind: "select", options: ["No limit", "$500,000", "$1,000,000", "$2,000,000", "$5,000,000+"] },
    ],
  },
  {
    id: "rent",
    label: "Rent",
    cta: "Search rentals",
    target: "#properties",
    fields: [
      { name: "location", label: "Location", kind: "text", placeholder: "City, area or address" },
      { name: "type", label: "Property type", kind: "select", options: types },
      { name: "budget", label: "Max rent / month", kind: "select", options: ["No limit", "$1,500", "$3,000", "$5,000", "$10,000+"] },
    ],
  },
  {
    id: "sell",
    label: "Sell",
    cta: "Get a valuation",
    target: "#contact",
    fields: [
      { name: "address", label: "Property address", kind: "text", placeholder: "Where is your property?", autoComplete: "street-address" },
      { name: "type", label: "Property type", kind: "select", options: types.slice(1) },
      { name: "email", label: "Your email", kind: "text", type: "email", placeholder: "name@email.com", autoComplete: "email" },
    ],
  },
]

const cell = "flex flex-col gap-1.5"
const labelCls = "text-subtitle text-xs font-medium lg:text-sm"
const control =
  "text-title h-11 w-full rounded-none border-input bg-white px-3 text-sm font-medium shadow-none lg:text-base"

export default function SearchForm() {
  const [tab, setTab] = React.useState("buy")

  function onSubmit(target: string) {
    return (e: React.FormEvent) => {
      e.preventDefault()
      // No search backend yet: send people to the matching section.
      const el = document.querySelector<HTMLElement>(target)
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
            onSubmit={onSubmit(t.target)}
            className="grid gap-4 p-5 md:grid-cols-3 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end lg:p-6"
          >
            {t.fields.map((f) => {
              const id = `${t.id}-${f.name}`
              return (
                <div key={f.name} className={cell}>
                  <Label htmlFor={id} className={labelCls}>
                    {f.label}
                  </Label>
                  {f.kind === "select" ? (
                    <Select name={f.name} defaultValue={f.options[0]}>
                      <SelectTrigger
                        id={id}
                        className={`${control} justify-between data-[size=default]:h-11 [&_svg]:text-teal`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-none">
                        {f.options.map((o) => (
                          <SelectItem key={o} value={o} className="rounded-none">
                            {o}
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
                      className={`${control} placeholder:text-taupe md:text-sm lg:text-base`}
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
