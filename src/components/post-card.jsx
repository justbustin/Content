import { useState } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Edit, Trash2 } from 'lucide-react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function PostCard({
  post,
  onEdit,
  onReschedule,
  onDelete
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedPost, setEditedPost] = useState(post)

  const handleSave = () => {
    onEdit(post.id, editedPost)
    setIsEditing(false)
  }

  const handleReschedule = (e) => {
    const newDate = new Date(e.target.value)
    onReschedule(post.id, newDate)
  }

  return (
    (<Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            {isEditing ? (
              <Textarea
                value={editedPost.content}
                onChange={(e) => setEditedPost({ ...editedPost, content: e.target.value })}
                className="w-full mb-4" />
            ) : (
              <p className="text-lg mb-4">{post.content}</p>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Calendar className="w-4 h-4" />
              <span>{post.scheduledDate.toLocaleDateString()}</span>
              <Clock className="w-4 h-4 ml-2" />
              <span>{post.scheduledDate.toLocaleTimeString()}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.platforms.map((platform) => (
                <span
                  key={platform}
                  className="px-2 py-1 bg-primary text-primary-foreground rounded-full text-xs">
                  {platform}
                </span>
              ))}
            </div>
          </div>
          {post.media.length > 0 && (
            <div className="flex gap-2 overflow-x-auto">
              {post.media.map((media, index) => (
                <Image
                  key={index}
                  src={media}
                  alt={`Post media ${index + 1}`}
                  width={150}
                  height={150}
                  className="rounded-md object-cover" />
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 p-6">
        {isEditing ? (
          <>
            <Button onClick={handleSave}>Save</Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Reschedule
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Reschedule Post</DialogTitle>
                  <DialogDescription>
                    Choose a new date and time for your post.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Date
                    </Label>
                    <Input
                      id="date"
                      type="datetime-local"
                      value={post.scheduledDate.toISOString().slice(0, 16)}
                      onChange={handleReschedule}
                      className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="destructive" onClick={() => onDelete(post.id)}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </>
        )}
      </CardFooter>
    </Card>)
  );
}

