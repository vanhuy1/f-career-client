"use client"

import type * as React from "react"
import { Input as ShadcnInput } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon
  error?: string
  testId?: string
  onChangeValue?: (value: string) => void
}

export function Input({ className, type, icon: Icon, error, testId, onChangeValue, onChange, ...props }: InputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChangeValue) {
      onChangeValue(e.target.value)
    }
    if (onChange) {
      onChange(e)
    }
  }

  return (
    <div className="w-full space-y-2">
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <ShadcnInput
          data-testid={testId}
          type={type}
          className={cn(Icon && "pl-10", error && "border-destructive focus-visible:ring-destructive", className)}
          onChange={handleChange}
          {...props}
        />
      </div>
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  )
}
