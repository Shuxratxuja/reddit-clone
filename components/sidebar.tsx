'use client'

import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { Plus } from "lucide-react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { useEffect, useState } from "react";

interface Topic {
    id: string
    slug: string
    description: string
    createdAt: string
    _count?: {
        posts: number
    }
}

interface SidebarProps {
    onCreatePost: () => void
    onCreateTopic: () => void
}

export default function Sidebar({ onCreatePost, onCreateTopic }: SidebarProps) {
    const [topics, setTopics] = useState<Topic[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await fetch('/api/topics')
                if (response.ok) {
                    const data = await response.json()
                    setTopics(data)
                }
            } catch (error) {
                console.error('Error fetching topics:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchTopics()
    }, [])

    return (
        <div className="space-y-4">
            {/* Create Post */}
            <Card>
                <CardBody className="p-4">
                    <Button
                        onPress={onCreatePost}
                        color="primary"
                        className="w-full"
                        startContent={<Plus size={16} />}
                    >
                        Create Post
                    </Button>
                </CardBody>
            </Card>

            {/* Communities */}
            <Card>
                <CardHeader className="pb-2">
                    <h3 className="text-lg font-semibold">Popular Communities</h3>
                </CardHeader>
                <CardBody className="p-0">
                    {loading ? (
                        <div className="p-4 text-center">
                            <p className="text-gray-500">Loading communities...</p>
                        </div>
                    ) : topics.length === 0 ? (
                        <div className="p-4 text-center">
                            <p className="text-gray-500">No communities yet</p>
                            <Button
                                size="sm"
                                variant="light"
                                onPress={onCreateTopic}
                                className="mt-2"
                            >
                                Create first community
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {topics.slice(0, 5).map((topic) => (
                                <div key={topic.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <Link
                                        href={`/r/${topic.slug}`}
                                        className="flex items-center justify-between"
                                    >
                                        <div>
                                            <div className="font-semibold text-gray-900 dark:text-gray-100">
                                                r/{topic.slug}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {topic._count?.posts || 0} posts
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* About */}
            <Card>
                <CardHeader className="pb-2">
                    <h3 className="text-lg font-semibold">About Reddit Clone</h3>
                </CardHeader>
                <CardBody>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        A Reddit-like platform built with Next.js, Prisma, and HeroUI.
                        Share, discuss, and discover content with communities.
                    </p>
                </CardBody>
            </Card>
        </div>
    )
}
