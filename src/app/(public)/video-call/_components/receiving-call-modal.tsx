"use client"
import { useTranslation } from "react-i18next"
import { X } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "./ui-button"
import { IconButton } from "./icon-button"

interface ReceivingCallModalProps {
  visible: boolean
  callingOtherUserData: {
    name: string
  }
  acceptMeetRequest: () => void
  rejectMeetRequest: () => void
}

export function ReceivingCallModal({
  visible,
  callingOtherUserData,
  acceptMeetRequest,
  rejectMeetRequest,
}: ReceivingCallModalProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={visible} onOpenChange={(open) => !open && rejectMeetRequest()}>
      <DialogContent className="sm:max-w-md" data-testid="receivingCallModal">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>
            {t("receivingCallModal.title", {
              user: callingOtherUserData.name,
            })}
          </DialogTitle>
          <IconButton icon={<X className="h-4 w-4" />} onClick={rejectMeetRequest} />
        </DialogHeader>
        <div className="flex gap-3">
          <Button testId="rejectMeetRequestButton" variant="destructive" onClick={rejectMeetRequest} className="flex-1">
            {t("receivingCallModal.decline")}
          </Button>
          <Button testId="acceptMeetRequestButton" onClick={acceptMeetRequest} className="flex-1">
            {t("receivingCallModal.accept")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
