import { notFound } from 'next/navigation'
import { db } from '@/db'
import { Card, CardBody, CardFooter } from '@heroui/card'
import { Button } from '@heroui/button'
import { ArrowUpIcon, ArrowDownIcon, MessageCircleIcon, ShareIcon, BookmarkIcon } from 'lucide-react'
import Image from 'next/image'
import NextLink from 'next/link'
import Comment from '@/components/comment'
import CommentForm from '@/components/comment-form'
import { auth } from '@/auth'

interface PostPageProps {
  params: {
    id: string
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const session = await auth()
  const post = await db.post.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      topic: true,
      comments: {
        where: { parentId: null }, // Only top-level comments
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
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Post */}
        <Card className="mb-6">
          <CardBody className="p-0">
            <div className="flex">
              {/* Voting Section */}
              <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-900 px-2 py-3 rounded-l-lg">
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  className="text-gray-500 hover:text-orange-500"
                >
                  <ArrowUpIcon size={20} />
                </Button>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 my-1">
                  42
                </span>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  className="text-gray-500 hover:text-blue-500"
                >
                  <ArrowDownIcon size={20} />
                </Button>
              </div>

              {/* Content Section */}
              <div className="flex-1 p-6">
                {/* Topic and Author */}
                <div className="flex items-center gap-2 mb-4">
                  <NextLink
                    href={`/r/${post.topic.slug}`}
                    className="text-sm font-semibold text-gray-500 hover:underline"
                  >
                    r/{post.topic.slug}
                  </NextLink>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-500">Posted by</span>
                  <div className="flex items-center gap-1">
                    <Image
                      src={post.user.image || ''}
                      alt={post.user.name || ''}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <NextLink
                      href={`/u/${post.user.name}`}
                      className="text-sm text-gray-500 hover:underline"
                    >
                      u/{post.user.name}
                    </NextLink>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {post.title}
                </h1>

                {/* Content */}
                <div className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  {post.content}
                </div>
              </div>
            </div>
          </CardBody>

          {/* Footer Actions */}
          <CardFooter className="px-6 py-3 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center gap-4">
              <Button
                variant="light"
                size="sm"
                startContent={<MessageCircleIcon size={16} />}
                className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                {post.comments.length} Comments
              </Button>
              <Button
                variant="light"
                size="sm"
                startContent={<ShareIcon size={16} />}
                className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                Share
              </Button>
              <Button
                variant="light"
                size="sm"
                startContent={<BookmarkIcon size={16} />}
                className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                Save
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Comment Form */}
        <Card className="mb-6">
          <CardBody className="p-4">
            <CommentForm postId={post.id} userName={session?.user?.name || undefined} />
          </CardBody>
        </Card>

        {/* Comments */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Comments ({post.comments.length})
          </h2>

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
                  votes: 0,
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
