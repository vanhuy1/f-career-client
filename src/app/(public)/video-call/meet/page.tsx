"use client"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import Head from "next/head"
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
  Share,
  UserCircle,
  UserX,
  Video,
  VideoOff,
  X,
  Users,
} from "lucide-react"

import { Button } from "../_components/ui-button"
import { IconButton } from "../_components/icon-button"
import { RenameMeetModal } from "../_components/rename-meet-modal"
import { ReceivingCallModal } from "../_components/receiving-call-modal"
import { Chat } from "../_components/chat"
import { Menu as MenuComponent, MenuItem } from "../_components/menu"
import  useMeetContext from "../contexts/MeetContext"
import { useAppContext } from "../contexts/AppContext"
import { cn } from "@/lib/utils"
import { isEmpty } from "../utils/functions"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function Meet() {
  const router = useRouter()
  const { t } = useTranslation()
  const { selectedLanguage } = useAppContext()
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
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false)
  const [participantCount, setParticipantCount] = useState<number>(1)

  const handleCopyMeetId = async () => {
    try {
      setIsMenuOpen(false)
      const meetLink = `${window.location.origin}/video-call?meetId=${userData.id}`
      await navigator.clipboard.writeText(meetLink)
      toast(t("toastMessage.copiedMeetLink"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        type: "success",
      })
    } catch (error) {
      console.error("Error copying meet link:", error)
      toast(t("toastMessage.errorWhileCopyingMeetLink"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        type: "error",
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

  const handleToggleFullScreen = () => {
    try {
      if (!document.fullscreenElement) {
        const mainElement = document.getElementById('video-container')
        if (mainElement) {
          mainElement.requestFullscreen()
          setIsFullScreen(true)
        }
      } else {
        document.exitFullscreen()
        setIsFullScreen(false)
      }
    } catch (error) {
      console.error("Error toggling fullscreen:", error)
      toast(t("toastMessage.fullscreenError"), {
        position: "top-right",
        type: "error",
      })
    }
  }

  const handleShareMeeting = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: meetName || t("page.meet.sharing.title"),
          text: t("page.meet.sharing.text"),
          url: `${window.location.origin}/video-call?meetId=${userData.id}`,
        })
      } else {
        // Fallback to copy if Web Share API is not available
        handleCopyMeetId()
      }
    } catch (error) {
      console.error("Error sharing meeting:", error)
      // Fallback to copy if sharing fails
      handleCopyMeetId()
    }
  }

  useEffect(() => {
    if (isEmpty(userData)) {
      router.replace("/video-call?stopStream=true")
      return
    }
    
    getUserStream()
    
    // Update participant count when other user joins or leaves
    if (!isEmpty(otherUserData)) {
      setParticipantCount(2)
    } else {
      setParticipantCount(1)
    }

    // Handle fullscreen change
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherUserData])

  return (
    <>
      <Head>
        <title>{meetName ? `${meetName} | ` : ""}Meet - F-Career</title>
      </Head>

      {isReceivingMeetRequest && (
        <ReceivingCallModal
          visible={isReceivingMeetRequest}
          userName={callingOtherUserData.name}
          onAccept={acceptMeetRequest}
          onReject={rejectMeetRequest}
        />
      )}

      <div className="flex h-screen flex-col bg-background">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b px-4 shadow-sm">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium truncate max-w-[200px] md:max-w-md" title={meetName || t("page.meet.defaultMeetName")}>
              {meetName || t("page.meet.defaultMeetName")}
            </h2>
            <IconButton
              testId="editMeetNameButton"
              onClick={handleRenameMeet}
              className="text-muted-foreground hover:text-primary"
              icon={<Edit className="h-4 w-4" />}
            />
            <div className="ml-4 flex items-center gap-1 text-xs bg-muted/50 px-2 py-1 rounded-full">
              <Users className="h-3 w-3" />
              <span>{participantCount}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <IconButton
                    testId="shareButton"
                    onClick={handleShareMeeting}
                    className="text-muted-foreground hover:text-primary"
                    icon={<Share className="h-5 w-5" />}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("page.meet.share")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <IconButton
              testId="headerOpenMenuButton"
              onClick={() => setIsMenuOpen(true)}
              icon={<Menu className="h-5 w-5" />}
            />
          </div>
        </header>

        <div id="video-container" className="relative flex flex-1 flex-col md:flex-row overflow-hidden">
          {/* User video */}
          <aside
            className={cn(
              "relative h-1/4 border-b md:h-auto md:w-1/4 md:border-b-0 md:border-r",
              !isUsingVideo && "bg-muted",
              isChatOpen && "md:w-1/5"
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
            <div className="absolute bottom-2 left-2 flex items-center gap-2 rounded-md bg-background/80 px-2 py-1 text-xs backdrop-blur-sm">
              <span>{userData.name || t("page.meet.you")}</span>
              {!isUsingMicrophone && <MicOff className="h-3 w-3 text-destructive" />}
            </div>
          </aside>

          {/* Main content */}
          <main className={cn(
            "relative flex flex-1 items-center justify-center",
            isChatOpen && "md:w-3/5"
          )}>
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
                      user: otherUserData.name || callingOtherUserData.name,
                    })}
                  </h2>
                  <p className="text-muted-foreground">
                    <button onClick={cancelMeetRequest} className="text-primary hover:underline">
                      {t("page.meet.calling.cancelButton")}
                    </button>{" "}
                    {t("page.meet.calling.message")}
                  </p>
                </div>
              </div>
            ) : isEmpty(otherUserData) ? (
              <div
                data-testid="emptyContent"
                className="flex flex-col items-center justify-center space-y-4 text-center p-4"
              >
                <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                  <Users className="h-12 w-12 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{t("page.meet.empty.title")}</h2>
                  <p className="text-muted-foreground max-w-md">
                    {t("page.meet.empty.message")}{" "}
                    <button onClick={handleCopyMeetId} className="text-primary hover:underline">
                      {t("page.meet.empty.copyLink")}
                    </button>
                  </p>
                </div>
                <Button 
                  className="mt-4"
                  onClick={handleShareMeeting}
                >
                  <Share className="mr-2 h-4 w-4" />
                  {t("page.meet.empty.shareButton")}
                </Button>
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
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <UserCircle className="h-32 w-32 text-muted-foreground" />
                  </div>
                )}

                <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-md bg-background/80 px-3 py-1.5 backdrop-blur-sm">
                  <span className="font-medium">{otherUserData.name || t("page.meet.participant")}</span>
                  {isOtherUserMuted ? (
                    <MicOff className="h-4 w-4 text-destructive" />
                  ) : (
                    <Mic className="h-4 w-4 text-green-500" />
                  )}
                </div>

                {isOtherUserSharingScreen && (
                  <div className="absolute right-4 top-4 rounded-md bg-background/80 px-3 py-1.5 backdrop-blur-sm">
                    <span className="text-sm">{t("page.meet.screenShare")}</span>
                  </div>
                )}

                <button
                  className="absolute right-4 top-4 rounded-md bg-background/80 p-2 backdrop-blur-sm hover:bg-background"
                  onClick={handleToggleFullScreen}
                >
                  <Expand className="h-4 w-4" />
                </button>
              </div>
            )}
          </main>

          {/* Chat panel */}
          {isChatOpen && (
            <aside className="relative border-t h-1/4 md:h-auto md:w-1/5 md:border-t-0 md:border-l">
              <button
                className="absolute right-2 top-2 md:right-4 md:top-4 rounded-full bg-background p-1 hover:bg-muted"
                onClick={() => setIsChatOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
              <Chat />
            </aside>
          )}
        </div>

        {/* Control bar */}
        <footer className="flex h-16 items-center justify-center gap-4 border-t px-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <IconButton
                  testId="toggleMicButton"
                  onClick={updateStreamAudio}
                  variant={isUsingMicrophone ? "default" : "destructive"}
                  className="h-10 w-10 rounded-full"
                  icon={
                    isUsingMicrophone ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />
                  }
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{isUsingMicrophone ? t("page.meet.muteMic") : t("page.meet.unmuteMic")}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <IconButton
                  testId="toggleVideoButton"
                  onClick={updateStreamVideo}
                  variant={isUsingVideo ? "default" : "destructive"}
                  className="h-10 w-10 rounded-full"
                  icon={
                    isUsingVideo ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />
                  }
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{isUsingVideo ? t("page.meet.stopVideo") : t("page.meet.startVideo")}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <IconButton
                  testId="toggleScreenShareButton"
                  onClick={updateScreenSharing}
                  variant={isSharingScreen ? "destructive" : "default"}
                  className="h-10 w-10 rounded-full"
                  icon={<Desktop className="h-5 w-5" />}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{isSharingScreen ? t("page.meet.stopSharing") : t("page.meet.startSharing")}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <IconButton
                  testId="openChatButton"
                  onClick={() => setIsChatOpen(true)}
                  className={cn("h-10 w-10 rounded-full", isChatOpen && "bg-primary/20")}
                  icon={<MessageSquare className="h-5 w-5" />}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("page.meet.openChat")}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <IconButton
                  testId="hangUpButton"
                  onClick={leftMeet}
                  variant="destructive"
                  className="h-10 w-10 rounded-full"
                  icon={<PhoneOff className="h-5 w-5" />}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("page.meet.hangUp")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </footer>
      </div>

      <RenameMeetModal
        visible={isRenameMeetModalVisible}
        defaultName={meetName}
        onClose={() => setIsRenameMeetModalVisible(false)}
        onSubmit={(newName) => {
          renameMeet(newName)
          setIsRenameMeetModalVisible(false)
        }}
      />

      <MenuComponent
        visible={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        position="right"
      >
        <MenuItem
          icon={<Copy className="h-4 w-4" />}
          text={t("menu.copyMeetLink")}
          onClick={handleCopyMeetId}
        />
        <MenuItem
          icon={<Edit className="h-4 w-4" />}
          text={t("menu.changeMeetName")}
          onClick={handleRenameMeet}
        />
        <MenuItem
          icon={<MessageSquare className="h-4 w-4" />}
          text={t("menu.openChat")}
          onClick={handleOpenChat}
        />
        {!isEmpty(otherUserData) && (
          <MenuItem
            icon={<UserX className="h-4 w-4" />}
            text={t("menu.kickUser")}
            onClick={() => {
              setIsMenuOpen(false)
              removeOtherUserFromMeet()
            }}
            variant="destructive"
          />
        )}
      </MenuComponent>
    </>
  )
}
