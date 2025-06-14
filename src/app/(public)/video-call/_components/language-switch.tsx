"use client"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface LanguageSwitchProps {
  selectedLanguage: string
  changeSelectedLanguage: () => void
  className?: string
}

export function LanguageSwitch({ selectedLanguage, changeSelectedLanguage, className }: LanguageSwitchProps) {
  return (
    <button
      data-testid="languageSwitch"
      onClick={changeSelectedLanguage}
      className={cn(
        "flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-secondary-foreground hover:bg-secondary/80",
        className,
      )}
    >
      <span className="text-xs font-medium uppercase">{selectedLanguage}</span>
    </button>
  )
}
