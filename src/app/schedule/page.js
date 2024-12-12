import ScheduledPosts from '@/components/scheduled-posts'

export default function ScheduledPostsPage() {
  return (
    (<div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Scheduled Posts</h1>
      <ScheduledPosts />
    </div>)
  );
}

