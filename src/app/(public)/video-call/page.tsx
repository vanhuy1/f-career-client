"use client"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useFormik } from "formik"
import * as Yup from "yup"
import { toast } from "react-toastify"
import { useRouter, useSearchParams } from "next/navigation"
import Head from "next/head"
import { AtSignIcon as At, Compass, Mail, User } from "lucide-react"

import { Button } from "./_components/ui-button"
import { Input } from "./_components/ui-input"
import { JoinMeetModal } from "./_components/join-meet-modal"
import { LanguageSwitch } from "./_components/language-switch"
import { useMeetContext } from "./contexts/MeetContext"
import { useAppContext } from "./contexts/AppContext"

const formValidations = Yup.object().shape({
  userName: Yup.string()
    .min(3, "formValidations.userName.tooShort")
    .max(50, "formValidations.userName.tooLong")
    .required("formValidations.userName.required"),
  userEmail: Yup.string().email("formValidations.email.invalid").required("formValidations.email.required"),
  meetName: Yup.string()
    .min(3, "formValidations.meetName.tooShort")
    .max(50, "formValidations.meetName.tooLong")
    .required("formValidations.meetName.required"),
})

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams() // Use searchParams instead of router.query
  const { t } = useTranslation()
  const { userStream, startNewMeet, clearUserStream } = useMeetContext()
  const { selectedLanguage, changeSelectedLanguage } = useAppContext()

  const [defaultMeetId, setDefaultMeetId] = useState<string>("")
  const [isJoinMeetModalVisible, setIsJoinMeetModalVisible] = useState<boolean>(false)

  const handleCreateMeet = (values: {
    userName: string
    userEmail: string
    meetName: string
  }) => {
    const { userName, userEmail, meetName } = values

    form.setSubmitting(true)
    const hadSuccess = startNewMeet(userName, userEmail, meetName)

    form.setSubmitting(false)
    if (!hadSuccess)
      return toast(t("toastMessage.errorWhileStartingMeet"), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })

    router.push("/meet")
  }

  const form = useFormik({
    initialValues: {
      userName: "",
      userEmail: "",
      meetName: "",
    },
    validationSchema: formValidations,
    onSubmit: (values) => {
      handleCreateMeet(values)
    },
  })

  useEffect(() => {
    // Get parameters from searchParams instead of router.query
    const meetId = searchParams?.get("meetId")
    const stopStream = searchParams?.get("stopStream")

    if (meetId) {
      setIsJoinMeetModalVisible(true)
      setDefaultMeetId(meetId)
    }

    if (stopStream) {
      const tracks = userStream?.getTracks()
      tracks?.forEach((track) => track.stop())

      clearUserStream()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]) // Depend on searchParams instead of router.query

  return (
    <>
      <Head>
        <title>Meet Compass</title>
      </Head>

      <div className="flex min-h-screen">
        {/* Left sidebar */}
        <aside className="hidden bg-primary md:flex md:w-1/3 md:items-center md:justify-center lg:w-1/2">
          <Compass className="h-32 w-32 text-primary-foreground" />
        </aside>

        {/* Main content */}
        <main className="flex w-full flex-col items-center justify-center p-6 md:w-2/3 lg:w-1/2">
          <div className="w-full max-w-md space-y-8">
            <header className="flex flex-col items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Compass className="h-10 w-10 text-primary" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold tracking-tight">{t("page.home.title")}</h1>
                <p className="text-muted-foreground">{t("page.home.subtitle")}</p>
              </div>
            </header>

            <form onSubmit={form.handleSubmit} className="space-y-4">
              <Input
                testId="userNameInput"
                name="userName"
                placeholder={t("inputPlaceholder.userName")}
                error={form.touched.userName && form.errors.userName ? t(form.errors.userName as string) : undefined}
                value={form.values.userName}
                onBlur={form.handleBlur}
                onChangeValue={(value) => form.setFieldValue("userName", value)}
                icon={User}
              />

              <Input
                testId="userEmailInput"
                name="userEmail"
                type="email"
                placeholder={t("inputPlaceholder.email")}
                error={form.touched.userEmail && form.errors.userEmail ? t(form.errors.userEmail as string) : undefined}
                value={form.values.userEmail}
                onBlur={form.handleBlur}
                onChangeValue={(value) => form.setFieldValue("userEmail", value)}
                icon={Mail}
              />

              <Input
                testId="meetNameInput"
                name="meetName"
                placeholder={t("inputPlaceholder.meetName")}
                error={form.touched.meetName && form.errors.meetName ? t(form.errors.meetName as string) : undefined}
                value={form.values.meetName}
                onBlur={form.handleBlur}
                onChangeValue={(value) => form.setFieldValue("meetName", value)}
                icon={At}
              />

              <Button
                type="submit"
                testId="startMeetButton"
                disabled={!form.isValid || form.isSubmitting}
                className="w-full"
                isLoading={form.isSubmitting}
              >
                {t("page.home.button")}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">{t("page.home.or")}</span>
              </div>
            </div>

            <div className="text-center">
              <span className="text-sm">
                {t("page.home.joinMeet")}{" "}
                <button
                  data-testid="joinMeetLink"
                  onClick={() => setIsJoinMeetModalVisible(true)}
                  className="text-primary hover:underline"
                >
                  {t("page.home.joinMeetLink")}
                </button>
              </span>
            </div>
          </div>

          <div className="absolute bottom-4 right-4">
            <LanguageSwitch selectedLanguage={selectedLanguage} changeSelectedLanguage={changeSelectedLanguage} />
          </div>
        </main>

        <JoinMeetModal
          visible={isJoinMeetModalVisible}
          defaultMeetId={defaultMeetId}
          onClose={() => setIsJoinMeetModalVisible(false)}
        />
      </div>
    </>
  )
}
