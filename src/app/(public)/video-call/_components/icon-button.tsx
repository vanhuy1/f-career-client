"use client"

import type * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  testId?: string
}

export function IconButton({ icon, className, testId, ...props }: IconButtonProps) {
  return (
    <Button variant="ghost" size="icon" data-testid={testId} className={cn("rounded-full", className)} {...props}>
      {icon}
    </Button>
  )
}
