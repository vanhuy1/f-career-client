"use client"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useTranslation } from "react-i18next"
import { AtSignIcon as At, X } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "./ui-button"
import { Input } from "./ui-input"
import { IconButton } from "./icon-button"

interface RenameMeetModalProps {
  visible: boolean
  onClose: () => void
  renameMeet: (newName: string) => void
}

export function RenameMeetModal({ visible, onClose, renameMeet }: RenameMeetModalProps) {
  const { t } = useTranslation()

  const form = useFormik({
    initialValues: {
      newMeetName: "",
    },
    validationSchema: Yup.object().shape({
      newMeetName: Yup.string()
        .min(3, "formValidations.meetName.tooShort")
        .max(50, "formValidations.meetName.tooLong")
        .required("formValidations.meetName.required"),
    }),
    onSubmit: (values) => {
      renameMeet(values.newMeetName)
      form.resetForm()
      onClose()
    },
  })

  return (
    <Dialog open={visible} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md" data-testid="renameMeetModal">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{t("renameMeetModal.title")}</DialogTitle>
          <IconButton testId="closeRenameMeetModalButton" icon={<X className="h-4 w-4" />} onClick={onClose} />
        </DialogHeader>
        <form onSubmit={form.handleSubmit} className="space-y-4">
          <Input
            testId="renameMeetInput"
            name="newMeetName"
            placeholder={t("inputPlaceholder.newMeetName")}
            error={form.errors.newMeetName && form.touched.newMeetName ? t(form.errors.newMeetName as string): undefined}
            value={form.values.newMeetName}
            onBlur={form.handleBlur}
            onChangeValue={(value) => form.setFieldValue("newMeetName", value)}
            icon={At}
          />
          <Button testId="renameMeetButton" type="submit" disabled={!form.isValid} className="w-full">
            {t("renameMeetModal.rename")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
