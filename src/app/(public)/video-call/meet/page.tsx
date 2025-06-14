"use client"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import Head from "next/head"
import {
  Copy,
  ComputerIcon as Desktop,
  Edit,
  Expand,
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
import useMeetContext from "../contexts/MeetContext"
import { cn } from "@/lib/utils"
import { isEmpty } from "../utils/functions"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { videoCallText } from "../utils/text"

export default function Meet() {
  const router = useRouter()
  const {
    userVideoRef,
    otherUserVideoRef,
    meetName,
    userData,
    otherUserData,
    isOtherUserMuted,
    isOtherUserVideoStopped,
    isCallingUser,
    isReceivingMeetRequest,
    isSharingScreen,
    isUsingVideo,
    isUsingMicrophone,
    isOtherUserSharingScreen,
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
  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(true)

  const handleCopyMeetId = async () => {
    try {
      setIsMenuOpen(false)
      const meetLink = `${window.location.origin}/video-call?meetId=${userData.id}`
      await navigator.clipboard.writeText(meetLink)
      toast(videoCallText.toastMessage.copiedMeetLink, {
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
      toast(videoCallText.toastMessage.errorWhileCopyingMeetLink, {
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
        const mainElement = document.getElementById("video-container")
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
      toast(videoCallText.toastMessage.fullscreenError, {
        position: "top-right",
        type: "error",
      })
    }
  }

  const handleShareMeeting = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: meetName || videoCallText.page.meet.title,
          text: videoCallText.page.meet.title,
          url: `${window.location.origin}/video-call?meetId=${userData.id}`,
        })
      } else {
        handleCopyMeetId()
      }
    } catch (error) {
      console.error("Error sharing meeting:", error)
      handleCopyMeetId()
    }
  }

  useEffect(() => {
    if (isEmpty(userData)) {
      router.replace("/video-call?stopStream=true")
      return
    }

    getUserStream()

    if (!isEmpty(otherUserData)) {
      setParticipantCount(2)
    } else {
      setParticipantCount(1)
    }

    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [otherUserData])

  // Auto-hide header on mobile after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.innerWidth < 768) {
        setIsHeaderVisible(false)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

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

      <div className="relative h-screen overflow-hidden bg-background">
        {/* Header - Fixed and can slide up/down */}
        <header
          className={cn(
            "fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b bg-background/95 px-4 shadow-sm backdrop-blur-sm transition-transform duration-300",
            !isHeaderVisible && "md:-translate-y-full",
          )}
          onMouseEnter={() => setIsHeaderVisible(true)}
        >
          <div className="flex items-center gap-2">
            <h2
              className="truncate text-lg font-medium max-w-[200px] md:max-w-md"
              title={meetName || videoCallText.page.meet.title}
            >
              {meetName || videoCallText.page.meet.title}
            </h2>
            <IconButton
              testId="editMeetNameButton"
              onClick={handleRenameMeet}
              className="text-muted-foreground hover:text-primary"
              icon={<Edit className="h-4 w-4" />}
            />
            <div className="ml-4 flex items-center gap-1 rounded-full bg-muted/50 px-2 py-1 text-xs">
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
                  <p>{videoCallText.page.meet.share}</p>
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

        {/* Main video container */}
        <main
          id="video-container"
          className={cn(
            "flex h-full items-center justify-center p-8 transition-all duration-300",
            isHeaderVisible ? "pt-24" : "pt-8",
          )}
        >
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
                  {videoCallText.page.meet.calling.title.replace("{{ user }}", otherUserData.name || callingOtherUserData.name)}
                </h2>
                <p className="text-muted-foreground">
                  <button onClick={cancelMeetRequest} className="text-primary hover:underline">
                    {videoCallText.page.meet.calling.messageLink}
                  </button>{" "}
                  {videoCallText.page.meet.calling.message}
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
                <h2 className="text-xl font-semibold">{videoCallText.page.meet.empty.title}</h2>
                <p className="text-muted-foreground max-w-md">
                  {videoCallText.page.meet.empty.message}{" "}
                  <button onClick={handleCopyMeetId} className="text-primary hover:underline">
                    {videoCallText.page.meet.empty.messageLink}
                  </button>
                </p>
              </div>
                              <Button className="mt-4" onClick={handleShareMeeting}>
                  <Share className="mr-2 h-4 w-4" />
                  {videoCallText.page.meet.share}
                </Button>
            </div>
          ) : (
            <div className="relative h-full w-full overflow-hidden rounded-2xl border-4 border-muted">
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
                <span className="font-medium">{otherUserData.name || "Participant"}</span>
                {isOtherUserMuted ? (
                  <MicOff className="h-4 w-4 text-destructive" />
                ) : (
                  <Mic className="h-4 w-4 text-green-500" />
                )}
              </div>

              {isOtherUserSharingScreen && (
                <div className="absolute right-4 top-4 rounded-md bg-background/80 px-3 py-1.5 backdrop-blur-sm">
                  <span className="text-sm">{videoCallText.page.meet.screenShare}</span>
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

        {/* User video - Fixed overlay in bottom right */}
        {isUsingVideo && (
          <div className="fixed bottom-20 right-4 z-40 h-32 w-24 overflow-hidden rounded-2xl border-4 border-primary bg-background shadow-lg transition-all duration-300 md:bottom-24 md:h-44 md:w-72">
            <video
              muted
              playsInline
              autoPlay
              ref={userVideoRef}
              className="h-full w-full object-cover"
              id="user-video"
            ></video>
            <div className="absolute bottom-1 left-1 rounded bg-background/80 px-1 py-0.5 text-xs backdrop-blur-sm">
              <span>{userData.name || "You"}</span>
              {!isUsingMicrophone && <MicOff className="ml-1 inline h-2 w-2 text-destructive" />}
            </div>
          </div>
        )}

        {/* Control bar - Fixed at bottom */}
        <footer className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-t bg-background/95 px-4 backdrop-blur-sm">
          <div className="hidden md:block">
            <h3 className="text-lg font-medium">{meetName || videoCallText.page.meet.title}</h3>
          </div>

          <div className="flex items-center justify-center gap-4 md:absolute md:left-1/2 md:-translate-x-1/2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <IconButton
                    testId="toggleMicButton"
                    onClick={updateStreamAudio}
                    variant={isUsingMicrophone ? "default" : "destructive"}
                    className="h-10 w-10 rounded-full"
                    icon={isUsingMicrophone ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isUsingMicrophone ? videoCallText.page.meet.tooltip.microphone.disable : videoCallText.page.meet.tooltip.microphone.enable}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <IconButton
                    testId="toggleVideoButton"
                    onClick={updateStreamVideo}
                    variant={isUsingVideo ? "default" : "destructive"}
                    className="h-10 w-10 rounded-full"
                    icon={isUsingVideo ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isUsingVideo ? videoCallText.page.meet.tooltip.video.disable : videoCallText.page.meet.tooltip.video.enable}</p>
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
                  <p>{isSharingScreen ? videoCallText.page.meet.tooltip.shareScreen.stop : videoCallText.page.meet.tooltip.shareScreen.start}</p>
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
                  <p>{videoCallText.page.meet.chat.title}</p>
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
                  <p>{videoCallText.page.meet.tooltip.left}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <span className="text-xs text-muted-foreground">ID: {userData.id?.slice(-6)}</span>
          </div>
        </footer>

        {/* Chat panel - Slide in from right */}
        {isChatOpen && (
          <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l bg-background shadow-xl md:max-w-xs">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b p-4">
                <h3 className="font-semibold">{videoCallText.page.meet.chat.title}</h3>
                <button className="rounded-full p-1 hover:bg-muted" onClick={() => setIsChatOpen(false)}>
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1">
                <Chat />
              </div>
            </div>
          </aside>
        )}
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

      <MenuComponent visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} position="right">
        <MenuItem icon={<Copy className="h-4 w-4" />} text={videoCallText.page.meet.menu.copyId} onClick={handleCopyMeetId} />
        <MenuItem icon={<Edit className="h-4 w-4" />} text={videoCallText.page.meet.menu.editName} onClick={handleRenameMeet} />
        <MenuItem icon={<MessageSquare className="h-4 w-4" />} text={videoCallText.page.meet.menu.openChat} onClick={handleOpenChat} />
        {!isEmpty(otherUserData) && (
          <MenuItem
            icon={<UserX className="h-4 w-4" />}
            text={videoCallText.page.meet.menu.removeUser.replace("{{ user }}", otherUserData.name)}
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
