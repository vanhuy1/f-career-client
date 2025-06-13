"use client"

import type * as React from "react"
import { X } from "lucide-react"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { IconButton } from "./icon-button"
import { LanguageSwitch } from "./language-switch"
import { cn } from "@/lib/utils"

interface MenuProps {
  visible: boolean
  onClose: () => void
  children: React.ReactNode
  userData: {
    name: string
    email: string
  }
  selectedLanguage: string
  changeSelectedLanguage: () => void
}

export function Menu({ visible, onClose, children, userData, selectedLanguage, changeSelectedLanguage }: MenuProps) {
  return (
    <Sheet open={visible} onOpenChange={(open: any) => !open && onClose()}>
      <SheetContent data-testid="menu" className="flex flex-col">
        <SheetHeader className="flex flex-row items-start justify-between">
          <div className="space-y-1">
            <SheetTitle>{userData.name}</SheetTitle>
            <p className="text-sm text-muted-foreground">{userData.email}</p>
          </div>
          <IconButton testId="closeMenuButton" onClick={onClose} icon={<X className="h-4 w-4" />} />
        </SheetHeader>
        <div className="mt-6 flex-1 space-y-2">{children}</div>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-sm text-muted-foreground">Language:</span>
          <LanguageSwitch selectedLanguage={selectedLanguage} changeSelectedLanguage={changeSelectedLanguage} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function MenuItem({ children, className, ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
