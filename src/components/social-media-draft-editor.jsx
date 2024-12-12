"use client";
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Facebook, Twitter, Instagram, Linkedin, PenTool } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export function SocialMediaDraftEditor({ textArea, setPage, page, tokens }) {
  const [selectedPlatform, setSelectedPlatform] = useState("Facebook")
  const { toast } = useToast()

  const [platforms, setPlatforms] = useState([
    { name: "Facebook", icon: <Facebook className="h-5 w-5" />, enabled: true, text: textArea.Facebook ?? "" },
    { name: "Twitter", icon: <Twitter className="h-5 w-5" />, enabled: false, text: textArea.Twitter ?? ""},
    { name: "Instagram", icon: <Instagram className="h-5 w-5" />, enabled: false, text: textArea.Instagram ?? ""},
    { name: "LinkedIn", icon: <Linkedin className="h-5 w-5" />, enabled: false, text: textArea.LinkedIn ?? "" },
  ])

  const [postContent, setPostContent] = useState(platforms.find((p) => p.enabled).text)
  const [comment, setComment] = useState("")
  const [likes, setLikes] = useState(0)

  useEffect(() => {
    setPlatforms(
      platforms.map((p) => {
        const updatedPlatform = { ...p }
        updatedPlatform.text = textArea[p.name] ?? ""
        return updatedPlatform
      })
    )
  }, [textArea])

  useEffect(() => {
    setPostContent(platforms.find((p) => p.enabled).text)
  }, [platforms])

  const togglePlatform = (platform) => {
    const updatedPlatforms = [...platforms]
    updatedPlatforms.forEach((p) => p.enabled = p.name === platform)
    setPlatforms(updatedPlatforms)
    setSelectedPlatform(platform)
    setPostContent(updatedPlatforms.find((p) => p.enabled).text)
  }

  const updatePlatformText = (platform, text) => {
    const updatedPlatforms = [...platforms]
    const platformToUpdate = updatedPlatforms.find((p) => p.name === platform)
    platformToUpdate.text = text
    setPlatforms(updatedPlatforms)
  }

  const onPublish = async () => {
    if (page === 0) {
      setPage(1)

    }
    else {
      const data = await fetch('/api/linkedin/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "token": tokens.linkedin, 'post': platforms[3].text }),
      })
      const res = await data.json()
      toast({
        title: 'Linkedin Post',
        description: 'Completed!'
      })
    }
  }

  return (
    (<Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Draft Post Editor</h2>
          <div className="flex space-x-2">
            {platforms.map((platform) => (
              <Button
                key={platform.name}
                variant={platform.enabled ? "default" : "outline"}
                size="icon"
                onClick={() => togglePlatform(platform.name)}
                aria-label={`Toggle ${platform.name}`}>
                {platform.icon}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <Avatar>
            <AvatarImage src="/placeholder-avatar.jpg" alt="@justbustin.ai" />
            <AvatarFallback>JB</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">@justbustin.ai</p>
            <p className="text-sm text-gray-500">Draft Post</p>
          </div>
        </div>
        <Textarea
          value={postContent}
          onChange={(e) => {
            setPostContent(e.target.value)
            updatePlatformText(selectedPlatform, e.target.value)
          }}
          placeholder="What's on your mind?"
          className="min-h-[100px] mb-4" />
        <div className="flex flex-wrap gap-2 mb-4">
          {postContent.match(/#\w+/g)?.map((hashtag, index) => (
            <Badge key={index} variant="secondary">
              {hashtag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center space-x-4 mb-4">
          <Button variant="outline" size="sm" onClick={() => setLikes(likes + 1)}>
            👍 {likes}
          </Button>
          <span className="text-sm text-gray-500">0 comments</span>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add comment. Use '@' for mention."
            className="flex-grow" />
          <Button size="sm">
            <PenTool className="h-4 w-4 mr-2" />
            Comment
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={onPublish}>Publish</Button>
      </CardFooter>
    </Card>)
  );
}

