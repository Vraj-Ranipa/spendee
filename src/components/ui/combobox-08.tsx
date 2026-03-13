"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export type ComboboxOption = {
  value: string
  label: string
  image?: string
  description?: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
  className?: string
  label?: string
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No result found.",
  disabled = false,
  className,
  label,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const selectedOption = options.find((option) => option.value === value)
  const id = React.useId()

  return (
    <div className="w-full space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between h-auto py-2", className)}
            disabled={disabled}
          >
            {selectedOption ? (
              <span className="flex items-center gap-2 text-left w-full truncate">
                {(selectedOption.image !== undefined) && (
                   <Avatar className="h-6 w-6">
                     {selectedOption.image ? (
                        <AvatarImage src={selectedOption.image} alt={selectedOption.label} />
                     ) : null}
                     <AvatarFallback>{selectedOption.label.substring(0, 1).toUpperCase()}</AvatarFallback>
                   </Avatar>
                )}
                <span className="font-medium truncate">{selectedOption.label}</span>
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    keywords={[option.value]}
                    onSelect={() => {
                       onChange(option.value === value ? "" : option.value)
                       setOpen(false)
                    }}
                  >
                    <div className="flex items-center gap-2 w-full overflow-hidden">
                       {(option.image !== undefined) && (
                        <Avatar className="h-7 w-7 flex-shrink-0">
                           {option.image ? (
                               <AvatarImage src={option.image} alt={option.label} />
                           ) : null}
                           <AvatarFallback>{option.label.substring(0, 1).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex flex-col truncate">
                        <span className="font-medium truncate">{option.label}</span>
                        {option.description && (
                          <span className="text-muted-foreground text-xs truncate">{option.description}</span>
                        )}
                      </div>
                    </div>
                    {value === option.value && <CheckIcon className="ml-auto h-4 w-4 shrink-0" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}