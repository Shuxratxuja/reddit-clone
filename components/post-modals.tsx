'use client'

import { Link } from "@heroui/link";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from '@heroui/modal'
import * as action from '@/actions'
import { createPost } from '@/actions/create-post'
import { Button } from "@heroui/button";
import { Plus } from "lucide-react";
import { Input } from "@heroui/input";
import React, { useActionState, useImperativeHandle, forwardRef, useEffect, useState } from "react";

export interface PostModalsRef {
    openCreatePost: () => void
    openCreateTopic: () => void
}

interface Topic {
    id: string
    slug: string
    description: string
}

const PostModals = forwardRef<PostModalsRef>((props, ref) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isPostOpen, onOpen: onPostOpen, onOpenChange: onPostOpenChange } = useDisclosure();
    const [state, actions] = useActionState(action.createTopic, { error: {} })
    const [postState, postActions] = useActionState(createPost, { error: {} })
    const [topics, setTopics] = useState<Topic[]>([])

    // Fetch topics from database
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
            }
        }
        fetchTopics()
    }, [])

    useImperativeHandle(ref, () => ({
        openCreatePost: onPostOpen,
        openCreateTopic: onOpen,
    }))

    // Close modals on successful submission
    useEffect(() => {
        if (state.success) {
            onOpenChange(false)
            // Refresh topics list
            window.location.reload()
        }
    }, [state.success, onOpenChange])

    useEffect(() => {
        if (postState.success) {
            onPostOpenChange(false)
            // Redirect to the new post
            if (postState.post) {
                window.location.href = `/post/${postState.post.id}`
            }
        }
    }, [postState.success, postState.post, onPostOpenChange])

    return (
        <>
            {/* Create Topic Modal */}
            <Modal backdrop='blur' isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Create Community</ModalHeader>
                            <form action={actions}>
                                <ModalBody>
                                    <Input
                                        name="name"
                                        isInvalid={(state.error.name?.length ?? 0) > 0}
                                        labelPlacement="outside"
                                        label="Community name"
                                        placeholder="Enter community name..."
                                        variant="bordered"
                                    />
                                    <Input
                                        isInvalid={(state.error.description?.length ?? 0) > 0}
                                        name="description"
                                        labelPlacement="outside"
                                        label="Description"
                                        placeholder="Enter community description"
                                        type="text"
                                        variant="bordered"
                                    />

                                    {state.error.name && (
                                        <div className="p-3 border-red-500 bg-red-200 rounded-md">
                                            <p className="text-sm text-red-700">{state.error.name.join(', ')}</p>
                                        </div>
                                    )}

                                    {state.error.description && (
                                        <div className="p-3 border-red-500 bg-red-200 rounded-md">
                                            <p className="text-sm text-red-700">{state.error.description.join(', ')}</p>
                                        </div>
                                    )}

                                    {state.error._form && (
                                        <div className="p-3 border-red-500 bg-red-200 rounded-md">
                                            <p className="text-sm text-red-700">{state.error._form.join(', ')}</p>
                                        </div>
                                    )}

                                    {state.success && (
                                        <div className="p-3 border-green-500 bg-green-200 rounded-md">
                                            <p className="text-sm text-green-700">Community created successfully!</p>
                                        </div>
                                    )}
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="flat" onPress={onClose}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" color="primary" onPress={onClose}>
                                        Create Community
                                    </Button>
                                </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Create Post Modal */}
            <Modal backdrop='blur' isOpen={isPostOpen} placement="top-center" onOpenChange={onPostOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Create Post</ModalHeader>
                            <form action={postActions}>
                                <ModalBody>
                                    <Input
                                        name="title"
                                        isInvalid={((postState.error as any)?.title?.length ?? 0) > 0}
                                        labelPlacement="outside"
                                        label="Title"
                                        placeholder="Enter post title..."
                                        variant="bordered"
                                    />
                                    <textarea
                                        name="content"
                                        className={`w-full p-3 border rounded-lg resize-none ${((postState.error as any)?.content?.length ?? 0) > 0 ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        rows={6}
                                        placeholder="What's on your mind?"
                                    />
                                    <select
                                        name="topicId"
                                        className={`w-full p-3 border rounded-lg ${((postState.error as any)?.topicId?.length ?? 0) > 0 ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">Select a community</option>
                                        {topics.map((topic) => (
                                            <option key={topic.id} value={topic.id}>
                                                r/{topic.slug}
                                            </option>
                                        ))}
                                    </select>

                                    {(postState.error as any)?._form && (
                                        <div className="p-3 border-red-500 bg-red-200 rounded-md">
                                            <p className="text-sm text-red-700">{(postState.error as any)._form.join(', ')}</p>
                                        </div>
                                    )}

                                    {(postState.error as any)?.title && (
                                        <div className="p-3 border-red-500 bg-red-200 rounded-md">
                                            <p className="text-sm text-red-700">{(postState.error as any).title.join(', ')}</p>
                                        </div>
                                    )}

                                    {(postState.error as any)?.content && (
                                        <div className="p-3 border-red-500 bg-red-200 rounded-md">
                                            <p className="text-sm text-red-700">{(postState.error as any).content.join(', ')}</p>
                                        </div>
                                    )}

                                    {(postState.error as any)?.topicId && (
                                        <div className="p-3 border-red-500 bg-red-200 rounded-md">
                                            <p className="text-sm text-red-700">{(postState.error as any).topicId.join(', ')}</p>
                                        </div>
                                    )}

                                    {postState.success && (
                                        <div className="p-3 border-green-500 bg-green-200 rounded-md">
                                            <p className="text-sm text-green-700">Post created successfully!</p>
                                        </div>
                                    )}
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="flat" onPress={onClose}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" color="primary" onPress={onClose}>
                                        Create Post
                                    </Button>
                                </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
})

PostModals.displayName = 'PostModals'

export default PostModals
