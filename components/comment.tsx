'use client'

import { useState, useRef, useEffect } from 'react'
import { useActionState } from 'react'
import { Button } from '@heroui/button'
import { Image } from '@heroui/image'
import { ArrowUp, ArrowDown, MessageCircle, MoreHorizontal, Edit, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { createComment } from '@/actions/post-comment'
import { auth } from '@/auth'
import { useSession } from 'next-auth/react'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown'
import { Popover, PopoverTrigger, PopoverContent } from '@heroui/popover'

interface CommentData {
    id: string
    content: string
    author: string
    authorImage?: string
    createdAt: string
    votes: number
    children: CommentData[]
}

interface CommentProps {
    comment: CommentData
    postId: string
    depth?: number
}

export default function Comment({ comment, postId, depth = 0 }: CommentProps) {
    const [isReplying, setIsReplying] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [showNestedComments, setShowNestedComments] = useState(false)
    const [commentState, commentAction] = useActionState(createComment, { error: {} })
    const formRef = useRef<HTMLFormElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const editTextareaRef = useRef<HTMLTextAreaElement>(null)
    const { data: session } = useSession()

    // Clear form on successful submission
    useEffect(() => {
        if (commentState.success && formRef.current) {
            formRef.current.reset()
            if (textareaRef.current) {
                textareaRef.current.value = ''
            }
            setIsReplying(false)
            setIsEditing(false)
            setIsDeleteOpen(false)
            // Page will be revalidated automatically
        }
    }, [commentState.success])

    const handleSubmit = (formData: FormData) => {
        formData.append('postId', postId)
        formData.append('parentId', comment.id)
        commentAction(formData)
    }

    const handleEdit = (formData: FormData) => {
        formData.append('commentId', comment.id)
        formData.append('action', 'edit')
        commentAction(formData)
    }

    const handleDelete = () => {
        const formData = new FormData()
        formData.append('commentId', comment.id)
        formData.append('action', 'delete')
        commentAction(formData)
    }

    const maxDepth = 5 // Maximum nesting depth
    const isOwner = session?.user?.name === comment.author
    const hasNestedComments = comment.children.length > 0

    return (
        <div className={`${depth > 0 ? 'ml-6 border-l-2 border-gray-200 dark:border-gray-700 pl-4' : ''}`}>
            <div className="flex space-x-3">
                {/* Vote buttons */}
                <div className="flex flex-col items-center space-y-1">
                    <Button variant="light" size="sm" className="text-gray-500 p-1">
                        <ArrowUp size={16} />
                    </Button>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {comment.votes}
                    </span>
                    <Button variant="light" size="sm" className="text-gray-500 p-1">
                        <ArrowDown size={16} />
                    </Button>
                </div>

                {/* Comment content */}
                <div className="flex-1">
                    {/* Comment header */}
                    <div className="flex items-center space-x-2 mb-2">
                        <Image
                            src={comment.authorImage || ''}
                            alt={comment.author}
                            width={24}
                            height={24}
                            className="rounded-full"
                        />
                        <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                            {comment.author}
                        </span>
                        <span className="text-gray-500 text-sm">•</span>
                        <span className="text-gray-500 text-sm">
                            {comment.createdAt}
                        </span>
                        {isOwner && (
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button variant="light" size="sm" className="text-gray-500 p-1">
                                        <MoreHorizontal size={14} />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Comment actions">
                                    <DropdownItem
                                        key="edit"
                                        startContent={<Edit size={14} />}
                                        onPress={() => setIsEditing(!isEditing)}
                                    >
                                        Edit
                                    </DropdownItem>
                                    <DropdownItem
                                        key="delete"
                                        startContent={<Trash2 size={14} />}
                                        className="text-danger"
                                        color="danger"
                                        onPress={() => setIsDeleteOpen(true)}
                                    >
                                        Delete
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        )}
                    </div>

                    {/* Comment text */}
                    {!isEditing ? (
                        <div className="mb-3">
                            <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">
                                {comment.content}
                            </p>
                        </div>
                    ) : (
                        <div className="mb-3">
                            <form action={handleEdit}>
                                <textarea
                                    ref={editTextareaRef}
                                    name="content"
                                    defaultValue={comment.content}
                                    className="w-full p-3 border rounded-lg resize-none text-sm border-gray-300 dark:border-gray-600"
                                    rows={3}
                                    required
                                />
                                <div className="flex justify-end space-x-2 mt-2">
                                    <Button
                                        variant="light"
                                        size="sm"
                                        onPress={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        color="primary"
                                        size="sm"
                                    >
                                        Save
                                    </Button>
                                </div>
                                {(commentState.error as any)?._form && (
                                    <div className="mt-2 p-2 border-red-500 bg-red-200 rounded-md">
                                        <p className="text-xs text-red-700">
                                            {(commentState.error as any)._form.join(', ')}
                                        </p>
                                    </div>
                                )}
                                {(commentState.error as any)?.content && (
                                    <div className="mt-2 p-2 border-red-500 bg-red-200 rounded-md">
                                        <p className="text-xs text-red-700">
                                            {(commentState.error as any).content.join(', ')}
                                        </p>
                                    </div>
                                )}
                            </form>
                        </div>
                    )}

                    {/* Comment actions */}
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="light"
                            size="sm"
                            className="text-gray-500"
                            onPress={() => setIsReplying(!isReplying)}
                        >
                            <MessageCircle size={14} className="mr-1" />
                            Reply
                        </Button>

                        {/* Toggle nested comments button */}
                        {hasNestedComments && (
                            <Button
                                variant="light"
                                size="sm"
                                className="text-gray-500"
                                onPress={() => setShowNestedComments(!showNestedComments)}
                            >
                                {showNestedComments ? (
                                    <>
                                        <ChevronDown size={14} className="mr-1" />
                                        Hide {comment.children.length} {comment.children.length === 1 ? 'reply' : 'replies'}
                                    </>
                                ) : (
                                    <>
                                        <ChevronRight size={14} className="mr-1" />
                                        Show {comment.children.length} {comment.children.length === 1 ? 'reply' : 'replies'}
                                    </>
                                )}
                            </Button>
                        )}
                    </div>

                    {/* Reply form */}
                    {isReplying && depth < maxDepth && (
                        <div className="mt-4">
                            <form ref={formRef} action={handleSubmit}>
                                <textarea
                                    ref={textareaRef}
                                    name="content"
                                    className={`w-full p-3 border rounded-lg resize-none text-sm ${((commentState.error as any)?.content?.length ?? 0) > 0
                                        ? 'border-red-500'
                                        : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                    rows={3}
                                    placeholder="What are your thoughts?"
                                    required
                                />

                                <div className="flex justify-end space-x-2 mt-2">
                                    <Button
                                        variant="light"
                                        size="sm"
                                        onPress={() => setIsReplying(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        color="primary"
                                        size="sm"
                                    >
                                        Reply
                                    </Button>
                                </div>

                                {(commentState.error as any)?._form && (
                                    <div className="mt-2 p-2 border-red-500 bg-red-200 rounded-md">
                                        <p className="text-xs text-red-700">
                                            {(commentState.error as any)._form.join(', ')}
                                        </p>
                                    </div>
                                )}

                                {(commentState.error as any)?.content && (
                                    <div className="mt-2 p-2 border-red-500 bg-red-200 rounded-md">
                                        <p className="text-xs text-red-700">
                                            {(commentState.error as any).content.join(', ')}
                                        </p>
                                    </div>
                                )}

                                {commentState.success && (
                                    <div className="mt-2 p-2 border-green-500 bg-green-200 rounded-md">
                                        <p className="text-xs text-green-700">
                                            Reply posted successfully!
                                        </p>
                                    </div>
                                )}
                            </form>
                        </div>
                    )}

                    {/* Nested comments */}
                    {hasNestedComments && showNestedComments && (
                        <div className="mt-4 space-y-4">
                            {comment.children.map((child) => (
                                <Comment
                                    key={child.id}
                                    comment={child}
                                    postId={postId}
                                    depth={depth + 1}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Popover */}
            <Popover isOpen={isDeleteOpen} onOpenChange={setIsDeleteOpen} placement="top">
                <PopoverTrigger>
                    <div className=""></div>
                </PopoverTrigger>
                <PopoverContent>
                    <div className="p-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                            Are you sure you want to delete this comment? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="light"
                                size="sm"
                                onPress={() => setIsDeleteOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="danger"
                                size="sm"
                                onPress={handleDelete}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
