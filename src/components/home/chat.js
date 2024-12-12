"use client"; // Add this line at the top
import React from 'react';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area'
import { useRef, useEffect } from 'react';

import { SendHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export default function Chat({ recommendations=[], context, setTextArea }) {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  console.log('recommendations', recommendations)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputText.trim()) return;

    // Add user message to chat
    setMessages((prev) => [...prev, { text: inputText, sender: 'user' }]);
    setInputText(''); // Clear input

    try {
      // Send message to API
      console.log('context', context)
      const response = await fetch('/api/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "context": context }),
      });
     
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('data', data)
      const text = data.text.replace(/([""]+)/g, '"');
      const cleanedText = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanedText);
      console.log('parsed', parsed)
      setTextArea({...parsed});

      // Add API response to chat
      setMessages((prev) => [...prev, { text: parsed.Bot, sender: 'bot', profilePic: '/conti.png', username: 'Conti' }]);
    } catch (error) {
      console.error('Error submitting:', error);
      setMessages((prev) => [
        ...prev,

        { text: 'Something went wrong, please try again.', sender: 'bot', profilePic: '/conti.png', username: 'Conti' },
      ]);
    } finally {
      scrollToBottom();
    }
  };

  const badges = recommendations.ideas?.map((recommendation) => (
    <Badge
      key={recommendation}
      style={{ maxWidth: '350px' }}
      className="mr-2 mb-2 p-2 flex items-center"
      onClick={() => setInputText(recommendation)}
    >
      <span >{recommendation}</span>
    </Badge>
  )) ?? [];

  return (
    <div className="flex flex-col h-[500px] w-full max-w-3xl mx-auto border bg-white rounded-lg overflow-hidden">
      <ScrollArea className="flex-1 p-4">
      {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start ${message.sender === 'user' ? 'justify-end' : 'justify-start'} p-2`}
              >
                <div className="flex items-center">
                  {message.sender === 'bot' && (
                    <img
                      src={message.profilePic}
                      alt={message.username}
                      className="h-10 w-10 mx-2 rounded-full object-cover"
                    />
                  )}
                  <div className="flex flex-col">
                    <div
                      className={`p-3 rounded-lg ${message.sender === 'bot' ? 'bg-gray-100' : 'bg-black text-white'} max-w-[400px] break-words`}
                      style={{ overflow: 'auto' }}
                    >
                      <p>{message.text}</p>
                    </div>
                  </div>
                 
                </div>
                
                
              </div>
            ))}
        
        <div ref={messagesEndRef} />
      </ScrollArea>
      
      {!messages.length && badges.length > 0 && (
        <div className="p-4 items-center">
        <h2 className="text-lg font-bold mr-4">Post Ideas ✨</h2>
        <div className="flex flex-wrap">
          {badges}
        </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex items-center">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 mr-2"
          />
          <Button type="submit" size="icon">
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
