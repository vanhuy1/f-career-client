"use client"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation" // Changed from next/router
import Head from "next/head"
// import Lottie from "react-lottie"
import {
  Copy,
  ComputerIcon as Desktop,
  Edit,
  Expand,
  Mail,
  Menu,
  MessageSquare,
  Mic,
  MicOff,
  PhoneOff,
  UserCircle,
  UserX,
  Video,
  VideoOff,
} from "lucide-react"

import { Button } from "../_components/ui-button"
import { IconButton } from "../_components/icon-button"
import { RenameMeetModal } from "../_components/rename-meet-modal"
import { ReceivingCallModal } from "../_components/receiving-call-modal"
import { Chat } from "../_components/chat"
import { Menu as MenuComponent, MenuItem } from "../_components/menu"
import { useMeetContext } from "../contexts/MeetContext"
import { useAppContext } from "../contexts/AppContext"
// import { useWindowBreakpoints } from "@/hooks/use-window-breakpoints"
import { cn } from "@/lib/utils"
import { isEmpty } from "../utils/functions"

// // Import your animation JSON
// import * as emptyAnimation from "../../../public/assets/animations/empty.json"

// const ANIMATION_DIMENSIONS = {
//   xsm: { width: 275, height: 115 },
//   sm: { width: 275, height: 115 },
//   md: { width: 370, height: 165 },
//   lg: { width: 370, height: 165 },
//   xl: { width: 550, height: 230 },
//   xxl: { width: 550, height: 230 },
// }

export default function Meet() {
  const router = useRouter()
  // const breakpoint = useWindowBreakpoints()
  const { t } = useTranslation()
  const { selectedLanguage, changeSelectedLanguage } = useAppContext()
  const {
    userVideoRef,
    otherUserVideoRef,
    meetName,
    userData,
    otherUserData,
    isOtherUserMuted,
    isOtherUserVideoStopped,
    isCallingUser,
    meetRequestAccepted,
    isReceivingMeetRequest,
    isSharingScreen,
    isUsingVideo,
    isUsingMicrophone,
    isOtherUserSharingScreen,
    socketRef,
    getUserStream,
    cancelMeetRequest,
    removeOtherUserFromMeet,
    leftMeet,
    updateStreamAudio,
    updateStreamVideo,
    updateScreenSharing,
    renameMeet,
    callingOtherUserData,
    acceptMeetRequest,
    rejectMeetRequest,
  } = useMeetContext()

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false)
  const [isRenameMeetModalVisible, setIsRenameMeetModalVisible] = useState<boolean>(false)

  const handleCopyMeetId = async () => {
    try {
      setIsMenuOpen(false)
      await navigator.clipboard.writeText(`${window.origin}/video-call?meetId=${userData.id}`)
      toast(t("toastMessage.copiedMeetLink"), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } catch (error) {
      toast(t("toastMessage.errorWhileCopyingMeetLink"), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  const handleRenameMeet = () => {
    setIsMenuOpen(false)
    setIsRenameMeetModalVisible(true)
  }

  const handleOpenChat = () => {
    setIsMenuOpen(false)
    setIsChatOpen(true)
  }

  useEffect(() => {
    if (isEmpty(userData)) router.replace("/video-call?stopStream=true")
    getUserStream()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Head>
        <title>Meet Compass - {t("page.meet.title")}</title>
      </Head>

      <div className="flex h-screen flex-col bg-background">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b px-4">
          <h2 className="text-lg font-medium">{meetName || "Meet name"}</h2>
          <IconButton
            testId="headerOpenMenuButton"
            onClick={() => setIsMenuOpen(true)}
            icon={<Menu className="h-5 w-5" />}
          />
        </header>

        <div className="flex flex-1 flex-col md:flex-row">
          {/* User video */}
          <aside
            className={cn(
              "relative h-1/4 border-b md:h-auto md:w-1/4 md:border-b-0 md:border-r",
              !isUsingVideo && "bg-muted",
            )}
          >
            <video
              muted
              playsInline
              autoPlay
              ref={userVideoRef}
              className={cn("h-full w-full object-cover", !isUsingVideo && "hidden")}
              id="user-video"
            ></video>
            {!isUsingVideo && (
              <div className="flex h-full w-full items-center justify-center">
                <UserCircle className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
          </aside>

          {/* Main content */}
          <main className="relative flex flex-1 items-center justify-center">
            {isCallingUser ? (
              <div
                data-testid="callingContent"
                className="flex flex-col items-center justify-center space-y-4 text-center"
              >
                <div className="h-20 w-20 animate-pulse rounded-full bg-primary/20">
                  <div className="h-full w-full animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    {t("page.meet.calling.title", {
                      user: otherUserData.name,
                    })}
                  </h2>
                  <p className="text-muted-foreground">
                    <button onClick={cancelMeetRequest} className="text-primary hover:underline">
                      {t("page.meet.calling.messageLink")}
                    </button>{" "}
                    {t("page.meet.calling.message")}
                  </p>
                </div>
              </div>
            ) : isEmpty(otherUserData) ? (
              <div
                data-testid="emptyContent"
                className="flex flex-col items-center justify-center space-y-4 text-center"
              >
                {/* <Lottie
                  isPaused={false}
                  isStopped={false}
                  isClickToPauseDisabled={true}
                  style={{ transition: ".3s" }}
                  width={ANIMATION_DIMENSIONS[breakpoint].width}
                  height={ANIMATION_DIMENSIONS[breakpoint].height}
                  options={{
                    loop: true,
                    autoplay: true,
                    animationData: emptyAnimation,
                    rendererSettings: {
                      preserveAspectRatio: "xMidYMid slice",
                    },
                  }}
                /> */}
                <div>
                  <h2 className="text-xl font-semibold">{t("page.meet.empty.title")}</h2>
                  <p className="text-muted-foreground">
                    {t("page.meet.empty.message")}{" "}
                    <button onClick={handleCopyMeetId} className="text-primary hover:underline">
                      {t("page.meet.empty.messageLink")}
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative h-full w-full">
                <video
                  playsInline
                  autoPlay
                  ref={otherUserVideoRef}
                  className={cn("h-full w-full object-cover", isOtherUserVideoStopped && "hidden")}
                ></video>

                {isOtherUserVideoStopped && (
                  <div className="flex h-full w-full items-center justify-center">
                    <UserCircle className="h-32 w-32 text-muted-foreground" />
                  </div>
                )}

                <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-md bg-background/80 px-3 py-1.5 backdrop-blur-sm">
                  <span className="font-medium">{otherUserData.name || "My friend"}</span>
                  {isOtherUserMuted ? (
                    <MicOff className="h-4 w-4 text-destructive" />
                  ) : (
                    <Mic className="h-4 w-4 text-green-500" />
                  )}
                </div>

                {isOtherUserSharingScreen && (
                  <button
                    className="absolute right-4 top-4 rounded-md bg-background/80 p-2 backdrop-blur-sm hover:bg-background"
                    onClick={() => otherUserVideoRef.current?.requestFullscreen()}
                  >
                    <Expand className="h-5 w-5" />
                  </button>
                )}
              </div>
            )}
          </main>
        </div>

        {/* Footer */}
        <footer className="flex h-16 items-center justify-between border-t px-4">
          <h2 className="hidden text-sm font-medium md:block">{meetName || "Meet name"}</h2>

          <div className="flex items-center justify-center gap-2 md:gap-4">
            <Button
              variant={isUsingMicrophone ? "outline" : "secondary"}
              size="icon"
              onClick={updateStreamAudio}
              className="rounded-full"
            >
              {isUsingMicrophone ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              <span className="sr-only">
                {isUsingMicrophone
                  ? t("page.meet.tooltip.microphone.disable")
                  : t("page.meet.tooltip.microphone.enable")}
              </span>
            </Button>

            <Button
              variant={isUsingVideo ? "outline" : "secondary"}
              size="icon"
              onClick={updateStreamVideo}
              className="rounded-full"
            >
              {isUsingVideo ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              <span className="sr-only">
                {isUsingVideo ? t("page.meet.tooltip.video.disable") : t("page.meet.tooltip.video.enable")}
              </span>
            </Button>

            <Button
              variant={isSharingScreen ? "default" : "outline"}
              size="icon"
              onClick={updateScreenSharing}
              className="rounded-full"
            >
              <Desktop className="h-5 w-5" />
              <span className="sr-only">
                {isSharingScreen ? t("page.meet.tooltip.shareScreen.stop") : t("page.meet.tooltip.shareScreen.start")}
              </span>
            </Button>

            <Button
              variant="destructive"
              size="icon"
              data-testid="leftMeetButton"
              onClick={leftMeet}
              className="rounded-full"
            >
              <PhoneOff className="h-5 w-5" />
              <span className="sr-only">{t("page.meet.tooltip.left")}</span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground md:block">{userData.id}</span>
            <IconButton
              testId="footerOpenMenuButton"
              onClick={() => setIsMenuOpen(true)}
              icon={<Menu className="h-5 w-5" />}
            />
          </div>
        </footer>
      </div>

      {/* Modals and sheets */}
      <Chat
        visible={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        socketRef={socketRef}
        otherUserData={otherUserData}
      />

      <MenuComponent
        visible={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        userData={userData}
        selectedLanguage={selectedLanguage}
        changeSelectedLanguage={changeSelectedLanguage}
      >
        <MenuItem onClick={handleRenameMeet} data-testid="openRenameMeetModalButton">
          <Edit className="h-4 w-4 text-muted-foreground" />
          <p>{t("page.meet.menu.editName")}</p>
        </MenuItem>

        <MenuItem onClick={handleCopyMeetId}>
          <Copy className="h-4 w-4 text-muted-foreground" />
          <p>{t("page.meet.menu.copyId")}</p>
        </MenuItem>

        {!isEmpty(otherUserData) && (
          <>
            <MenuItem data-testid="openChatButton" onClick={handleOpenChat}>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <p>{t("page.meet.menu.openChat")}</p>
            </MenuItem>

            <MenuItem
              onClick={() => {
                window.open(`mailto:${otherUserData.email}`, "_blank")
              }}
            >
              <Mail className="h-4 w-4 text-muted-foreground" />
              <p>{t("page.meet.menu.sendEmail", { user: otherUserData.name })}</p>
            </MenuItem>

            <MenuItem onClick={removeOtherUserFromMeet}>
              <UserX className="h-4 w-4 text-muted-foreground" />
              <p>{t("page.meet.menu.removeUser", { user: otherUserData.name })}</p>
            </MenuItem>
          </>
        )}
      </MenuComponent>

      <RenameMeetModal
        visible={isRenameMeetModalVisible}
        onClose={() => setIsRenameMeetModalVisible(false)}
        renameMeet={renameMeet}
      />

      <ReceivingCallModal
        visible={isReceivingMeetRequest && !meetRequestAccepted}
        callingOtherUserData={callingOtherUserData}
        acceptMeetRequest={acceptMeetRequest}
        rejectMeetRequest={rejectMeetRequest}
      />
    </>
  )
}
