'use client'

import { useChat } from 'ai/react'
import { useState, useEffect, useRef } from 'react'
import { SendHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

export function Chat({ recommendations }) {
  const { messages, input, handleInputChange, handleSubmit } = useChat()
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const onSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) {
      setIsTyping(true)
      handleSubmit(e).then(() => setIsTyping(false))
    }
  }

  const badges = recommendations.map((recommendation) => (
    <Badge key={recommendation} variant="light" className="mr-2 mb-2">
      {recommendation}
    </Badge>
  ))

  return (
    <div className="flex flex-col h-[600px] w-full max-w-3xl mx-auto border rounded-lg overflow-hidden">
      <ScrollArea className="flex-1 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="text-left">
            <div className="inline-block p-2 rounded-lg bg-gray-200 text-gray-800">
              Typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </ScrollArea>
      <div className="p-4 border-t">{badges}</div>
      <form onSubmit={onSubmit} className="p-4 border-t">
        <div className="flex items-center">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 mr-2"
          />
          <Button type="submit" size="icon">
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}

