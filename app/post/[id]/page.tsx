import { notFound } from 'next/navigation'
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { ArrowUp, ArrowDown, MessageCircle, Share, Bookmark } from "lucide-react";
import { Image } from "@heroui/image";
import { Link } from "@heroui/link";
import { db } from '@/db';
import { auth } from '@/auth';
import CommentForm from '@/components/comment-form';
import Comment from '@/components/comment';

interface PostPageProps {
  params: Promise<{
    id: string
  }>
}

async function getPost(id: string) {
  try {
    const post = await db.post.findUnique({
      where: { id },
      include: {
        user: true,
        topic: true,
        comments: {
          where: {
            parentId: null,
          },
          include: {
            user: true,
            children: {
              include: {
                user: true,
                children: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })
    return post
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params
  const post = await getPost(id)
  const session = await auth()

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Post */}
        <Card className="mb-6">
          <CardBody className="p-6">
            {/* Post Header */}
            <div className="flex items-start space-x-3 mb-4">
              <Image
                src={post.user.image || ''}
                alt={post.user.name || 'User'}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {post.user.name || 'Anonymous'}
                  </span>
                  <span className="text-gray-500">•</span>
                  <Link href={`/r/${post.topic.slug}`} className="text-blue-600 hover:underline">
                    r/{post.topic.slug}
                  </Link>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {post.title}
              </h1>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>
            </div>

            {/* Post Actions */}
            <div className="flex items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <Button variant="light" size="sm" className="text-gray-500">
                  <ArrowUp size={16} />
                </Button>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  42
                </span>
                <Button variant="light" size="sm" className="text-gray-500">
                  <ArrowDown size={16} />
                </Button>
              </div>

              <Button variant="light" size="sm" className="text-gray-500">
                <MessageCircle size={16} className="mr-2" />
                {post.comments.length} Comments
              </Button>

              <Button variant="light" size="sm" className="text-gray-500">
                <Share size={16} className="mr-2" />
                Share
              </Button>

              <Button variant="light" size="sm" className="text-gray-500">
                <Bookmark size={16} className="mr-2" />
                Save
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Comment Form */}
        {session?.user && (
          <Card className="mb-6">
            <CardBody className="p-6">
              <CommentForm
                postId={post.id}
                userName={session.user.name || undefined}
              />
            </CardBody>
          </Card>
        )}

        {/* Comments */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {post.comments.length} Comments
          </h3>

          {post.comments.length === 0 ? (
            <Card>
              <CardBody className="p-6 text-center">
                <p className="text-gray-500">No comments yet. Be the first to comment!</p>
              </CardBody>
            </Card>
          ) : (
            post.comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={{
                  id: comment.id,
                  content: comment.content,
                  author: comment.user.name || 'Anonymous',
                  authorImage: comment.user.image || undefined,
                  createdAt: new Date(comment.createdAt).toLocaleDateString(),
                  votes: 0, // This should come from a votes table
                  children: comment.children.map((child) => ({
                    id: child.id,
                    content: child.content,
                    author: child.user.name || 'Anonymous',
                    authorImage: child.user.image || undefined,
                    createdAt: new Date(child.createdAt).toLocaleDateString(),
                    votes: 0,
                    children: child.children.map((grandChild) => ({
                      id: grandChild.id,
                      content: grandChild.content,
                      author: grandChild.user.name || 'Anonymous',
                      authorImage: grandChild.user.image || undefined,
                      createdAt: new Date(grandChild.createdAt).toLocaleDateString(),
                      votes: 0,
                      children: [],
                    })),
                  })),
                }}
                postId={post.id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}