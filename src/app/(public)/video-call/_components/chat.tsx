"use client"

import { useState, useEffect, useRef } from "react"
import { Send } from "lucide-react"

import { Button } from "./ui-button"
import useMeetContext from "../contexts/MeetContext"
import { cn } from "@/lib/utils"
import { videoCallText } from "../utils/text"

interface Message {
  id: string
  text: string
  isMine: boolean
  timestamp: Date
}

export function Chat() {
  const { socketRef, userData, otherUserData } = useMeetContext()
  
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (!inputValue.trim() || !socketRef.current) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isMine: true,
      timestamp: new Date(),
    }

    setMessages([...messages, newMessage])
    socketRef.current.emit("send-message", {
      to: otherUserData.id,
      message: inputValue,
    })
    setInputValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Listen for incoming messages
  useEffect(() => {
    if (!socketRef.current) return

    const handleReceivedMessage = (message: string) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        isMine: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, newMessage])
    }

    socketRef.current.on("received-message", handleReceivedMessage)

    return () => {
      socketRef.current?.off("received-message", handleReceivedMessage)
    }
  }, [socketRef])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="flex h-full flex-col">
      <div className="px-4 py-2 text-center border-b">
        <h3 className="font-medium">{videoCallText.page.meet.chat.title}</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            No messages yet
          </p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex w-full",
                message.isMine ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[75%] rounded-lg px-3 py-2 text-sm",
                  message.isMine
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p>{message.text}</p>
                <span className="mt-1 block text-right text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-2">
        <div className="flex items-center gap-2">
          <textarea
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder={videoCallText.inputPlaceholder.sendMessage}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <Button
            className="h-10 w-10 rounded-full p-0"
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
