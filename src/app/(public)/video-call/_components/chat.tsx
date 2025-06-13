"use client"

import type * as React from "react"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Send, X } from "lucide-react"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { IconButton } from "./icon-button"
import { cn } from "@/lib/utils"

interface ChatProps {
  visible: boolean
  onClose: () => void
  socketRef: React.MutableRefObject<any>
  otherUserData: {
    id: string
  }
}

export function Chat({ visible, onClose, socketRef, otherUserData }: ChatProps) {
  const { t } = useTranslation()
  const [chatMessage, setChatMessage] = useState<string>("")

  const isEmpty = (obj: any) => {
    return !obj || Object.keys(obj).length === 0
  }

  const isLink = (text: string) => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i",
    )
    return pattern.test(text)
  }

  const handleAddMessage = (message: string, side: "left" | "right") => {
    const chatContent = document.getElementById("chat-content")

    if (chatContent) {
      const isMessageLink = isLink(message)
      const element = document.createElement(isMessageLink ? "a" : "p")

      if (isMessageLink) {
        element.setAttribute("href", message)
        element.setAttribute("target", "_blank")
      }

      element.className = cn(
        "mb-2 max-w-[80%] rounded-lg px-3 py-2 text-sm",
        side === "left"
          ? "self-start bg-secondary text-secondary-foreground"
          : "self-end bg-primary text-primary-foreground",
        isMessageLink && "underline",
      )
      element.append(message)

      chatContent.append(element)
      chatContent.scrollTop = chatContent.scrollHeight
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatMessage.trim()) return

    socketRef.current.emit("send-message", {
      to: otherUserData.id,
      message: chatMessage,
    })
    handleAddMessage(chatMessage, "right")
    setChatMessage("")
  }

  useEffect(() => {
    const socket = socketRef

    if (socket.current) {
      socket.current.on("received-message", (message: string) => {
        handleAddMessage(message, "left")
      })
    }

    return () => {
      if (socket.current) socket.current.off("received-message")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isEmpty(otherUserData)) {
      const chatContent = document.getElementById("chat-content")
      if (!chatContent) return

      while (chatContent.firstChild) {
        chatContent.removeChild(chatContent.firstChild)
      }
    }
  }, [otherUserData])

  return (
    <Sheet open={visible} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" data-testid="chat" className="flex flex-col p-0">
        <SheetHeader className="border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <SheetTitle>{t("page.meet.chat.title")}</SheetTitle>
            <IconButton onClick={onClose} icon={<X className="h-4 w-4" />} />
          </div>
        </SheetHeader>
        <div id="chat-content" className="flex flex-1 flex-col overflow-y-auto p-4"></div>
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 border-t p-4">
          <Input
            data-testid="chatMessage"
            placeholder={t("inputPlaceholder.sendMessage")}
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" data-testid="sendChatMessage" disabled={!chatMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
