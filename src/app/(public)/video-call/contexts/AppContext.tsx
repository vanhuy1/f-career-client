"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { useTranslation } from "react-i18next"

interface AppContextProps {
  selectedLanguage: string
  changeSelectedLanguage: () => void
}

const AppContext = createContext<AppContextProps>({
  selectedLanguage: "en",
  changeSelectedLanguage: () => {},
})

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation()
  const [selectedLanguage, setSelectedLanguage] = useState<string>(i18n.language || "en")

  const changeSelectedLanguage = () => {
    const newLanguage = selectedLanguage === "en" ? "pt" : "en"
    i18n.changeLanguage(newLanguage)
    setSelectedLanguage(newLanguage)
  }

  return (
    <AppContext.Provider
      value={{
        selectedLanguage,
        changeSelectedLanguage,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
export default useAppContext
