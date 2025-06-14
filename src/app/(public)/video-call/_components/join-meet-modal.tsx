"use client"
import { useEffect } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useTranslation } from "react-i18next"
import { AtSignIcon as At, Mail, User, X } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "./ui-button"
import { Input } from "./ui-input"
import { IconButton } from "./icon-button"
import  useMeetContext from "../contexts/MeetContext"
import { toast } from "react-toastify"

interface JoinMeetModalProps {
  visible: boolean
  defaultMeetId?: string
  onClose: () => void
}

export function JoinMeetModal({ visible, defaultMeetId, onClose }: JoinMeetModalProps) {
  const { t } = useTranslation()
  const { joinMeet } = useMeetContext();

  const form = useFormik({
    initialValues: {
      userName: "",
      userEmail: "",
      meetId: "",
    },
    validationSchema: Yup.object().shape({
      userName: Yup.string()
        .min(3, "formValidations.userName.tooShort")
        .max(50, "formValidations.userName.tooLong")
        .required("formValidations.userName.required"),
      userEmail: Yup.string().email("formValidations.email.invalid").required("formValidations.email.required"),
      meetId: Yup.string().required("formValidations.meetId.required"),
    }),
    onSubmit: (values) => {
      try {
        form.setSubmitting(true);
        joinMeet(values.userName, values.userEmail, values.meetId);
        handleCloseModal();
      } catch (error) {
        console.error("Error joining meet:", error);
        toast(t("toastMessage.errorJoiningMeet"), {
          type: "error",
          position: "top-right",
        });
      } finally {
        form.setSubmitting(false);
      }
    },
  })

  const handleCloseModal = () => {
    form.resetForm()
    onClose()
  }

  useEffect(() => {
    if (defaultMeetId) form.setFieldValue("meetId", defaultMeetId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultMeetId])

  return (
    <Dialog open={visible} onOpenChange={(open) => !open && handleCloseModal()}>
      <DialogContent className="sm:max-w-md" data-testid="joinMeetModal">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{t("joinMeetModal.title")}</DialogTitle>
          <IconButton icon={<X className="h-4 w-4" />} onClick={handleCloseModal} />
        </DialogHeader>
        <form onSubmit={form.handleSubmit} className="space-y-4">
          <Input
            testId="joinMeetModalUserNameInput"
            name="userName"
            placeholder={t("inputPlaceholder.userName")}
            error={form.errors.userName && form.touched.userName ? t(form.errors.userName as string) : undefined}
            value={form.values.userName}
            onBlur={form.handleBlur}
            onChangeValue={(value) => form.setFieldValue("userName", value)}
            icon={User}
          />
          <Input
            testId="joinMeetModalUserEmailInput"
            name="userEmail"
            type="email"
            placeholder={t("inputPlaceholder.email")}
            error={form.errors.userEmail && form.touched.userEmail ? t(form.errors.userEmail as string) : undefined}
            value={form.values.userEmail}
            onBlur={form.handleBlur}
            onChangeValue={(value) => form.setFieldValue("userEmail", value)}
            icon={Mail}
          />
          <Input
            testId="meetIdInput"
            name="meetId"
            placeholder={t("inputPlaceholder.meetId")}
            error={form.errors.meetId && form.touched.meetId ? t(form.errors.meetId as string): undefined}
            value={form.values.meetId}
            onBlur={form.handleBlur}
            onChangeValue={(value) => form.setFieldValue("meetId", value)}
            icon={At}
          />
          <Button
            type="submit"
            testId="joinMeetButton"
            disabled={!form.isValid || form.isSubmitting}
            className="w-full"
            isLoading={form.isSubmitting}
          >
            {t("joinMeetModal.button")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}


