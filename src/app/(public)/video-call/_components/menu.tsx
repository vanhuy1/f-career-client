"use client"

import { ReactNode } from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export interface MenuProps {
  visible: boolean
  onClose: () => void
  children: ReactNode
  position?: "left" | "right"
}

export interface MenuItemProps {
  icon: ReactNode
  text: string
  onClick?: () => void
  variant?: "default" | "destructive"
}

export function Menu({ visible, onClose, children, position = "right" }: MenuProps) {
  return (
    <Sheet open={visible} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side={position} data-testid="menu" className="flex flex-col space-y-4">
        {children}
      </SheetContent>
    </Sheet>
  )
}

export function MenuItem({ icon, text, onClick, variant = "default" }: MenuItemProps) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-muted",
        variant === "destructive" && "hover:bg-destructive hover:text-destructive-foreground text-destructive"
      )}
      onClick={onClick}
    >
      <span className="flex h-5 w-5 items-center justify-center">{icon}</span>
      {text}
    </button>
  )
}
