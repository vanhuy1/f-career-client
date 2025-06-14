"use client"
import { useEffect } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { AtSignIcon as At, Mail, User, X } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "./ui-button"
import { Input } from "./ui-input"
import { IconButton } from "./icon-button"
import useMeetContext from "../contexts/MeetContext"
import { toast } from "react-toastify"
import { videoCallText } from "../utils/text"

interface JoinMeetModalProps {
  visible: boolean
  defaultMeetId?: string
  onClose: () => void
}

export function JoinMeetModal({ visible, defaultMeetId, onClose }: JoinMeetModalProps) {
  const { joinMeet } = useMeetContext();

  const form = useFormik({
    initialValues: {
      userName: "",
      userEmail: "",
      meetId: "",
    },
    validationSchema: Yup.object().shape({
      userName: Yup.string()
        .min(3, videoCallText.formValidations.userName.tooShort)
        .max(50, videoCallText.formValidations.userName.tooLong)
        .required(videoCallText.formValidations.userName.required),
      userEmail: Yup.string()
        .email(videoCallText.formValidations.userEmail.invalid)
        .required(videoCallText.formValidations.userEmail.required),
      meetId: Yup.string()
        .required(videoCallText.formValidations.meetId.required),
    }),
    onSubmit: (values) => {
      try {
        form.setSubmitting(true);
        joinMeet(values.userName, values.userEmail, values.meetId);
        handleCloseModal();
      } catch (error) {
        console.error("Error joining meet:", error);
        toast(videoCallText.toastMessage.errorWhileStartingMeet, {
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
          <DialogTitle>{videoCallText.joinMeetModal.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit} className="space-y-4">
          <Input
            testId="joinMeetModalUserNameInput"
            name="userName"
            placeholder={videoCallText.inputPlaceholder.userName}
            error={form.errors.userName && form.touched.userName ? form.errors.userName : undefined}
            value={form.values.userName}
            onBlur={form.handleBlur}
            onChangeValue={(value) => form.setFieldValue("userName", value)}
            icon={User}
          />
          <Input
            testId="joinMeetModalUserEmailInput"
            name="userEmail"
            type="email"
            placeholder={videoCallText.inputPlaceholder.email}
            error={form.errors.userEmail && form.touched.userEmail ? form.errors.userEmail : undefined}
            value={form.values.userEmail}
            onBlur={form.handleBlur}
            onChangeValue={(value) => form.setFieldValue("userEmail", value)}
            icon={Mail}
          />
          <Input
            testId="meetIdInput"
            name="meetId"
            placeholder={videoCallText.inputPlaceholder.meetId}
            error={form.errors.meetId && form.touched.meetId ? form.errors.meetId : undefined}
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
            {videoCallText.joinMeetModal.button}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}


