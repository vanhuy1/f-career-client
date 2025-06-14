"use client"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Edit, X } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "./ui-button"
import { Input } from "./ui-input"
import { IconButton } from "./icon-button"

export interface RenameMeetModalProps {
  visible: boolean
  defaultName?: string
  onClose: () => void
  onSubmit: (newName: string) => void
}

export function RenameMeetModal({ visible, defaultName = "", onClose, onSubmit }: RenameMeetModalProps) {
  const { t } = useTranslation()
  const [meetName, setMeetName] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleChangeName = () => {
    if (!meetName.trim()) return
    
    setIsLoading(true)
    try {
      onSubmit(meetName)
    } catch (error) {
      console.error("Error renaming meet:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (visible) {
      setMeetName(defaultName)
    }
  }, [visible, defaultName])

  return (
    <Dialog open={visible} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md" data-testid="renameMeetModal">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{t("renameMeetModal.title")}</DialogTitle>
          <IconButton icon={<X className="h-4 w-4" />} onClick={onClose} />
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Input
            testId="meetNameInput"
            name="meetName"
            placeholder={t("inputPlaceholder.meetName")}
            value={meetName}
            onChangeValue={setMeetName}
            icon={Edit}
          />
          <Button
            testId="changeMeetNameButton"
            disabled={!meetName.trim()}
            isLoading={isLoading}
            onClick={handleChangeName}
            className="w-full"
          >
            {t("renameMeetModal.button")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
