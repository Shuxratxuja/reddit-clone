import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { TrendingUp, Clock, Flame, Star } from "lucide-react";
import PostCard from "@/components/post-card";
import HomeClient from "@/components/home-client";
import { db } from '@/db';

const sortOptions = [
  { id: 'hot', label: 'Hot', icon: Flame },
  { id: 'new', label: 'New', icon: Clock },
  { id: 'top', label: 'Top', icon: TrendingUp },
  { id: 'rising', label: 'Rising', icon: Star },
]

async function getPosts() {
  try {
    const posts = await db.post.findMany({
      include: {
        user: true,
        topic: true,
        comments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    })
    return posts
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export default async function Home() {
  const posts = await getPosts()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Sort Options */}
            <Card className="mb-4">
              <CardBody className="p-0">
                <div className="flex items-center border-b border-gray-200 dark:border-gray-700">
                  {sortOptions.map((option) => (
                    <Button
                      key={option.id}
                      variant="light"
                      className="flex items-center gap-2 px-4 py-3 rounded-none border-b-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <option.icon size={16} />
                      {option.label}
                    </Button>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Posts */}
            <div className="space-y-4">
              {posts.length === 0 ? (
                <Card>
                  <CardBody className="p-6 text-center">
                    <p className="text-gray-500">No posts yet. Be the first to create a post!</p>
                  </CardBody>
                </Card>
              ) : (
                posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={{
                      id: post.id,
                      title: post.title,
                      content: post.content,
                      author: post.user.name || 'Anonymous',
                      authorImage: post.user.image || undefined,
                      topic: post.topic.slug,
                      votes: 42, // This should come from a votes table
                      comments: post.comments.length,
                      createdAt: new Date(post.createdAt).toLocaleDateString(),
                    }}
                  />
                ))
              )}
            </div>
          </div>

          {/* Client-side sidebar and modals */}
          <HomeClient />
        </div>
      </div>
    </div>
  );
}
