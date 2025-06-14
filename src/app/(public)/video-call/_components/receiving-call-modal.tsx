"use client"
import { useTranslation } from "react-i18next"
import { PhoneCall, PhoneOff, X } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "./ui-button"
import { IconButton } from "./icon-button"

export interface ReceivingCallModalProps {
  visible: boolean
  userName: string
  onAccept: () => void
  onReject: () => void
}

export function ReceivingCallModal({
  visible,
  userName, 
  onAccept, 
  onReject 
}: ReceivingCallModalProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={visible}>
      <DialogContent className="sm:max-w-md" data-testid="receivingCallModal">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{t("receivingCallModal.title")}</DialogTitle>
          <IconButton icon={<X className="h-4 w-4" />} onClick={onReject} />
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="h-16 w-16 animate-pulse rounded-full bg-primary/20">
            <div className="h-full w-full animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
          <p className="text-center text-lg">
            {t("receivingCallModal.message", { userName })}
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <Button
            testId="rejectCallButton"
            onClick={onReject}
            variant="outline"
            className="w-full"
          >
            <PhoneOff className="mr-2 h-4 w-4" />
            {t("receivingCallModal.reject")}
          </Button>
          <Button testId="acceptCallButton" className="w-full" onClick={onAccept}>
            <PhoneCall className="mr-2 h-4 w-4" />
            {t("receivingCallModal.accept")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
