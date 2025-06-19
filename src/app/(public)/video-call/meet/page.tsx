'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import {
  Copy,
  Computer as Desktop,
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
  Users,
  X,
} from 'lucide-react';

import { Button } from '../_components/ui-button';
import { IconButton } from '../_components/icon-button';
import { RenameMeetModal } from '../_components/rename-meet-modal';
import { ReceivingCallModal } from '../_components/receiving-call-modal';
import { Chat } from '../_components/chat';
import { Menu as MenuComponent, MenuItem } from '../_components/menu';
import useMeetContext from '../contexts/MeetContext';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { videoCallText } from '../utils/text';
import { isEmpty } from '../utils/functions';

export default function Meet() {
  const router = useRouter();
  const {
    userVideoRef,
    peersVideoRefs,
    meetId,
    meetName,
    userData,
    peersData,
    callingOtherUserData,
    peersMuted,
    peersVideoStopped,
    isCallingUser,
    isReceivingMeetRequest,
    isSharingScreen,
    isUsingVideo,
    isUsingMicrophone,
    peersSharingScreen,
    getUserStream,
    cancelMeetRequest,
    removePeerFromMeet,
    leftMeet,
    updateStreamAudio,
    updateStreamVideo,
    updateScreenSharing,
    renameMeet,
    acceptMeetRequest,
    rejectMeetRequest,
  } = useMeetContext();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isRenameMeetModalVisible, setIsRenameMeetModalVisible] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [participantCount, setParticipantCount] = useState<number>(1);
  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(true);

  const handleCopyMeetId = async () => {
    try {
      setIsMenuOpen(false);
      const meetLink = `${window.location.origin}/video-call?meetId=${meetId}`;
      await navigator.clipboard.writeText(meetLink);
      toast(videoCallText.toastMessage.copiedMeetLink, {
        position: 'top-right',
        autoClose: 3000,
        type: 'success',
      });
    } catch (error) {
      console.error('Error copying meet link:', error);
      toast(videoCallText.toastMessage.errorWhileCopyingMeetLink, {
        position: 'top-right',
        autoClose: 3000,
        type: 'error',
      });
    }
  };

  const handleRenameMeet = () => {
    if (!userData.isHost) {
      toast('Only the host can rename the meeting', { type: 'error' });
      return;
    }
    setIsMenuOpen(false);
    setIsRenameMeetModalVisible(true);
  };

  const handleOpenChat = () => {
    setIsMenuOpen(false);
    setIsChatOpen(true);
  };

  const handleToggleFullScreen = () => {
    try {
      if (!document.fullscreenElement) {
        const mainElement = document.getElementById('video-container');
        if (mainElement) {
          mainElement.requestFullscreen();
          setIsFullScreen(true);
        }
      } else {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
      toast(videoCallText.toastMessage.fullscreenError, {
        position: 'top-right',
        type: 'error',
      });
    }
  };

  const handleShareMeeting = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: meetName || videoCallText.page.meet.title,
          text: videoCallText.page.meet.title,
          url: `${window.location.origin}/video-call?meetId=${meetId}`,
        });
      } else {
        handleCopyMeetId();
      }
    } catch (error) {
      console.error('Error sharing meeting:', error);
      handleCopyMeetId();
    }
  };

  useEffect(() => {
    if (isEmpty(userData)) {
      router.replace('/video-call?stopStream=true');
      return;
    }

    getUserStream().then(stream => {
      console.log("User stream initialized for self-view");
      if (stream && userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
        userVideoRef.current.muted = true;
      }
    });

    const otherPeersCount = Array.from(peersData.entries())
      .filter(([peerId]) => peerId !== userData.id)
      .length;
    setParticipantCount(otherPeersCount + 1);

    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [peersData, userData, getUserStream, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.innerWidth < 768) {
        setIsHeaderVisible(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        <title>{meetName ? `${meetName} | ` : ''}Meet - F-Career</title>
      </Head>

      {isReceivingMeetRequest && (
        <ReceivingCallModal
          visible={isReceivingMeetRequest}
          userName={callingOtherUserData.name}
          onAccept={() => acceptMeetRequest(callingOtherUserData.id)}
          onReject={() => rejectMeetRequest(callingOtherUserData.id)}
        />
      )}

      <div className="bg-background relative h-screen overflow-hidden">
        <header
          className={cn(
            'bg-background/95 fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-between border-b px-4 shadow-sm backdrop-blur-sm transition-transform duration-300',
            !isHeaderVisible && 'md:-translate-y-full',
          )}
          onMouseEnter={() => setIsHeaderVisible(true)}
        >
          <div className="flex items-center gap-2">
            <h2
              className="max-w-[200px] truncate text-lg font-medium md:max-w-md"
              title={meetName || videoCallText.page.meet.title}
            >
              {meetName || videoCallText.page.meet.title}
            </h2>
            {userData.isHost && (
              <IconButton
                testId="editMeetNameButton"
                onClick={handleRenameMeet}
                className="text-muted-foreground hover:text-primary"
                icon={<Edit className="h-4 w-4" />}
              />
            )}
            <div className="bg-muted/50 ml-4 flex items-center gap-1 rounded-full px-2 py-1 text-xs">
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

        <main
          id="video-container"
          className={cn(
            'flex h-full items-center justify-center p-8 transition-all duration-300',
            isHeaderVisible ? 'pt-24' : 'pt-8',
          )}
        >
          {isCallingUser && (
            <div
              data-testid="callingContent"
              className="flex flex-col items-center justify-center space-y-4 text-center"
            >
              <div className="bg-primary/20 h-20 w-20 animate-pulse rounded-full">
                <div className="border-primary h-full w-full animate-spin rounded-full border-4 border-t-transparent"></div>
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  Waiting for host approval...
                </h2>
                <p className="text-muted-foreground">
                  Your request to join this meeting is pending approval from the host.
                </p>
                <p className="text-muted-foreground mt-2">
                  <button
                    onClick={cancelMeetRequest}
                    className="text-primary hover:underline"
                  >
                    {videoCallText.page.meet.calling.messageLink}
                  </button>{' '}
                  {videoCallText.page.meet.calling.message}
                </p>
              </div>
            </div>
          )}
          {peersData.size === 0 ? (
            <div
              data-testid="emptyContent"
              className="flex flex-col items-center justify-center space-y-4 p-4 text-center"
            >
              <div className="bg-muted flex h-24 w-24 items-center justify-center rounded-full">
                <Users className="text-muted-foreground h-12 w-12" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {videoCallText.page.meet.empty.title}
                </h2>
                <p className="text-muted-foreground max-w-md">
                  {videoCallText.page.meet.empty.message}{' '}
                  <button
                    onClick={handleCopyMeetId}
                    className="text-primary hover:underline"
                  >
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
            <div className="grid h-full w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from(peersData.entries())
                .filter(([peerId]) => peerId !== userData.id)
                .map(([peerId, peerData]) => (
                <div
                  key={peerId}
                  className="border-muted relative h-full w-full overflow-hidden rounded-2xl border-4"
                >
                  <video
                    playsInline
                    autoPlay
                    ref={(el) => {
                      const ref = peersVideoRefs.get(peerId);
                      if (ref) {
                        ref.current = el;
                        if (el && el.srcObject && el.paused) {
                          el.play().catch(err => {
                            if (err.name !== 'AbortError') {
                              console.error(`Error playing video for peer ${peerId}:`, err);
                            }
                          });
                        }
                      }
                    }}
                    onLoadedMetadata={(e) => {
                      const videoElement = e.target as HTMLVideoElement;
                      if (videoElement.paused) {
                        videoElement.play().catch(err => {
                          if (err.name !== 'AbortError') {
                            console.error(`Error playing video for peer ${peerId}:`, err);
                          }
                        });
                      }
                    }}
                    className={cn(
                      'h-full w-full object-cover',
                      peersVideoStopped.get(peerId) && 'hidden',
                    )}
                  ></video>

                  {peersVideoStopped.get(peerId) && (
                    <div className="bg-muted flex h-full w-full items-center justify-center">
                      <UserCircle className="text-muted-foreground h-32 w-32" />
                    </div>
                  )}

                  <div className="bg-background/80 absolute bottom-4 left-4 flex items-center gap-2 rounded-md px-3 py-1.5 backdrop-blur-sm">
                    <span className="font-medium">{peerData.name || 'Participant'}</span>
                    {peersMuted.get(peerId) ? (
                      <MicOff className="text-destructive h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4 text-green-500" />
                    )}
                  </div>

                  {peersSharingScreen.get(peerId) && (
                    <div className="bg-background/80 absolute top-4 right-4 rounded-md px-3 py-1.5 backdrop-blur-sm">
                      <span className="text-sm">
                        {videoCallText.page.meet.screenShare}
                      </span>
                    </div>
                  )}

                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      className="bg-background/80 hover:bg-background rounded-md p-2 backdrop-blur-sm"
                      onClick={handleToggleFullScreen}
                    >
                      <Expand className="h-4 w-4" />
                    </button>

                    {userData.isHost && (
                      <button
                        className="bg-red-500/80 hover:bg-red-600 text-white rounded-md p-2 backdrop-blur-sm"
                        onClick={() => removePeerFromMeet(peerId)}
                      >
                        <UserX className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {isUsingVideo && (
          <div className="border-primary bg-background fixed right-4 bottom-20 z-40 h-32 w-24 overflow-hidden rounded-2xl border-4 shadow-lg transition-all duration-300 md:bottom-24 md:h-44 md:w-72">
            <video
              muted
              playsInline
              autoPlay
              ref={userVideoRef}
              onLoadedMetadata={(e) => {
                const videoElement = e.target as HTMLVideoElement;
                if (videoElement.paused) {
                  videoElement.play().catch(err => {
                    if (err.name !== 'AbortError') {
                      console.error("Error playing user video:", err);
                    }
                  });
                }
              }}
              className="h-full w-full object-cover"
              id="user-video"
            ></video>
            <div className="bg-background/80 absolute bottom-1 left-1 rounded px-1 py-0.5 text-xs backdrop-blur-sm">
              <span>{userData.name || 'You'}</span>
              {!isUsingMicrophone && (
                <MicOff className="text-destructive ml-1 inline h-2 w-2" />
              )}
            </div>
          </div>
        )}

        <footer className="bg-background/95 fixed right-0 bottom-0 left-0 z-50 flex h-16 items-center justify-between border-t px-4 backdrop-blur-sm">
          <div className="hidden md:block">
            <h3 className="text-lg font-medium">
              {meetName || videoCallText.page.meet.title}
            </h3>
          </div>

          <div className="flex items-center justify-center gap-4 md:absolute md:left-1/2 md:-translate-x-1/2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <IconButton
                    testId="toggleMicButton"
                    onClick={updateStreamAudio}
                    variant={isUsingMicrophone ? 'default' : 'destructive'}
                    className="h-10 w-10 rounded-full"
                    icon={
                      isUsingMicrophone ? (
                        <Mic className="h-5 w-5" />
                      ) : (
                        <MicOff className="h-5 w-5" />
                      )
                    }
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isUsingMicrophone
                      ? videoCallText.page.meet.tooltip.microphone.disable
                      : videoCallText.page.meet.tooltip.microphone.enable}
                  </p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <IconButton
                    testId="toggleVideoButton"
                    onClick={updateStreamVideo}
                    variant={isUsingVideo ? 'default' : 'destructive'}
                    className="h-10 w-10 rounded-full"
                    icon={
                      isUsingVideo ? (
                        <Video className="h-5 w-5" />
                      ) : (
                        <VideoOff className="h-5 w-5" />
                      )
                    }
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isUsingVideo
                      ? videoCallText.page.meet.tooltip.video.disable
                      : videoCallText.page.meet.tooltip.video.enable}
                  </p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <IconButton
                    testId="toggleScreen-sharingButton"
                    onClick={updateScreenSharing}
                    variant={isSharingScreen ? 'secondary' : 'default'}
                    className="h-10 w-10 rounded-full"
                    icon={<Desktop className="h-5 w-5" />}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isSharingScreen
                      ? videoCallText.page.meet.tooltip.shareScreen.stop
                      : videoCallText.page.meet.tooltip.shareScreen.start}
                  </p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <IconButton
                    testId="openChatButton"
                    onClick={() => setIsChatOpen(true)}
                    className={cn(
                      'h-10 w-10 rounded-full',
                      isChatOpen && 'bg-primary/20',
                    )}
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
            <span className="text-muted-foreground text-xs">
              ID: {meetId.slice(-6)}
            </span>
          </div>
        </footer>

        {isChatOpen && (
          <aside className="bg-background fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l shadow-xl md:max-w-xs">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b p-4">
                <h3 className="font-semibold">
                  {videoCallText.page.meet.chat.title}
                </h3>
                <button
                  className="hover:bg-muted rounded-full p-1"
                  onClick={() => setIsChatOpen(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1">
                <Chat />
              </div>
            </div>
          </aside>
        )}

        <RenameMeetModal
          visible={isRenameMeetModalVisible}
          defaultName={meetName}
          onClose={() => setIsRenameMeetModalVisible(false)}
          onSubmit={(newName) => {
            renameMeet(newName);
            setIsRenameMeetModalVisible(false);
          }}
        />

        <MenuComponent
          visible={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          position="right"
        >
          <MenuItem
            icon={<Copy className="h-4 w-4" />}
            text={videoCallText.page.meet.menu.copyId}
            onClick={handleCopyMeetId}
          />
          {userData.isHost && (
            <MenuItem
              icon={<Edit className="h-4 w-4" />}
              text={videoCallText.page.meet.menu.editName}
              onClick={handleRenameMeet}
            />
          )}
          <MenuItem
            icon={<MessageSquare className="h-4 w-4" />}
            text={videoCallText.page.meet.menu.openChat}
            onClick={handleOpenChat}
          />
          {Array.from(peersData.entries()).map(([peerId, peerData]) => (
            <MenuItem
              key={peerId}
              icon={<UserX className="h-4 w-4" />}
              text={videoCallText.page.meet.menu.removeUser.replace(
                '{{ user }}',
                peerData.name,
              )}
              onClick={() => {
                setIsMenuOpen(false);
                removePeerFromMeet(peerId);
              }}
              variant="destructive"
            />
          ))}
        </MenuComponent>
      </div>
    </>
  );
}