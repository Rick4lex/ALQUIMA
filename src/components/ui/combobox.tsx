
"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type ComboboxOption = {
    value: string;
    label: string;
}

type ComboboxProps = {
    options: ComboboxOption[];
    selectedValue: string;
    onSelectValue: (value: string | null) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    notFoundMessage?: string;
    className?: string;
}

export function Combobox({ 
    options, 
    selectedValue,
    onSelectValue, 
    placeholder = "Select option...",
    searchPlaceholder = "Search...",
    notFoundMessage = "No option found.",
    className 
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", className)}
        >
          {selectedValue
            ? options.find((option) => option.value === selectedValue)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandEmpty>{notFoundMessage}</CommandEmpty>
          <CommandGroup>
            <CommandList>
                {options.map((option) => (
                <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                        onSelectValue(currentValue === selectedValue ? null : currentValue)
                        setOpen(false)
                    }}
                >
                    <Check
                    className={cn(
                        "mr-2 h-4 w-4",
                        selectedValue === option.value ? "opacity-100" : "opacity-0"
                    )}
                    />
                    {option.label}
                </CommandItem>
                ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
