import NextLink from 'next/link'
import { Button } from '@heroui/button'
import { Card, CardBody, CardFooter } from '@heroui/card'
import { ArrowUpIcon, ArrowDownIcon, MessageCircleIcon, ShareIcon, BookmarkIcon } from 'lucide-react'
import Image from 'next/image'

interface PostCardProps {
  post?: {
    id: string
    title: string
    content: string
    author: string
    authorImage?: string
    topic: string
    votes: number
    comments: number
    createdAt: string
    image?: string
  }
}

export default function PostCard({ post }: PostCardProps) {
  const defaultPost = {
    id: '1',
    title: 'Implement charts in our application',
    content: 'We need to add beautiful charts to visualize our data. Looking for recommendations on the best charting libraries for React.',
    author: 'John Doe',
    authorImage: 'https://avatars.githubusercontent.com/u/200636864?v=4',
    topic: 'programming',
    votes: 42,
    comments: 8,
    createdAt: '2 hours ago',
    image: undefined
  }

  const postData = post || defaultPost

  return (
    <Card className="w-full mb-3 hover:border-gray-300 transition-colors">
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
              {postData.votes}
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
          <div className="flex-1 p-3">
            {/* Topic and Author */}
            <div className="flex items-center gap-2 mb-2">
              <NextLink
                href={`/r/${postData.topic}`}
                className="text-xs font-semibold text-gray-500 hover:underline"
              >
                r/{postData.topic}
              </NextLink>
              <span className="text-gray-400">•</span>
              <span className="text-xs text-gray-500">Posted by</span>
              <div className="flex items-center gap-1">
                <Image
                  src={postData.authorImage || ''}
                  alt={postData.author}
                  width={16}
                  height={16}
                  className="rounded-full"
                />
                <NextLink
                  href={`/u/${postData.author}`}
                  className="text-xs text-gray-500 hover:underline"
                >
                  u/{postData.author}
                </NextLink>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-xs text-gray-500">{postData.createdAt}</span>
            </div>

            {/* Title */}
            <NextLink href={`/post/${postData.id}`}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 mb-2 cursor-pointer">
                {postData.title}
              </h3>
            </NextLink>

            {/* Content */}
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-3">
              {postData.content}
            </p>

            {/* Image (if exists) */}
            {postData.image && (
              <div className="mb-3">
                <Image
                  src={postData.image}
                  alt="Post image"
                  width={400}
                  height={300}
                  className="rounded-lg max-h-96 object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </CardBody>

      {/* Footer Actions */}
      <CardFooter className="px-3 py-2 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center gap-4">
          <NextLink href={`/post/${postData.id}`}>
            <Button
              variant="light"
              size="sm"
              startContent={<MessageCircleIcon size={16} />}
              className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              {postData.comments} Comments
            </Button>
          </NextLink>
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
  )
}