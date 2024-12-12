'use client';
import { useState } from 'react'
import PostCard from './post-card'
import { Button } from '@/components/ui/button'

const initialPosts = [
  {
    id: '1',
    content: 'Exciting news coming soon! Stay tuned for our big announcement. #ComingSoon #ExcitingTimes',
    scheduledDate: new Date('2023-06-15T10:00:00'),
    platforms: ['Twitter', 'Facebook'],
    media: ['/a.avif'],
  },
  {
    id: '2',
    content: 'Check out our latest blog post on "10 Tips for Effective Social Media Management" - Link in bio!',
    scheduledDate: new Date('2023-06-16T14:30:00'),
    platforms: ['Instagram', 'LinkedIn'],
    media: ['/a.avif', '/a.avif'],
  },
  {
    id: '3',
    content: 'Join us for our upcoming webinar on "Mastering Social Media Strategy" - Register now!',
    scheduledDate: new Date('2023-06-17T11:00:00'),
    platforms: ['Facebook', 'LinkedIn', 'Twitter'],
    media: [],
  },
]

export default function ScheduledPosts() {
  const [posts, setPosts] = useState(initialPosts)

  const handleEdit = (id, updatedPost) => {
    setPosts(posts.map(post => post.id === id ? updatedPost : post))
  }

  const handleReschedule = (id, newDate) => {
    setPosts(
      posts.map(post => post.id === id ? { ...post, scheduledDate: newDate } : post)
    )
  }

  const handleDelete = (id) => {
    setPosts(posts.filter(post => post.id !== id))
  }

  return (
    (<div className="space-y-6">
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          onEdit={handleEdit}
          onReschedule={handleReschedule}
          onDelete={handleDelete} />
      ))}
      <Button className="w-full">Create New Post</Button>
    </div>)
  );
}

