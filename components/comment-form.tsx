'use client'

import { useActionState } from 'react'
import { Button } from '@heroui/button'
import { createComment } from '@/actions/post-comment'
import { useRef, useEffect } from 'react'

interface CommentFormProps {
    postId: string
    userName?: string
}

export default function CommentForm({ postId, userName }: CommentFormProps) {
    const [commentState, commentAction] = useActionState(createComment, { error: {} })
    const formRef = useRef<HTMLFormElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // Clear form on successful submission
    useEffect(() => {
        if (commentState.success && formRef.current) {
            formRef.current.reset()
            if (textareaRef.current) {
                textareaRef.current.value = ''
            }
            // Refresh the page to show new comment
            window.location.reload()
        }
    }, [commentState.success])

    const handleSubmit = (formData: FormData) => {
        formData.append('postId', postId)
        commentAction(formData)
    }

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Comment as {userName || 'Anonymous'}
            </h3>

            <form ref={formRef} action={handleSubmit}>
                <textarea
                    ref={textareaRef}
                    name="content"
                    className={`w-full p-3 border rounded-lg resize-none ${((commentState.error as any)?.content?.length ?? 0) > 0
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                        }`}
                    rows={4}
                    placeholder="What are your thoughts?"
                    required
                />

                <div className="flex justify-end mt-3">
                    <Button
                        type="submit"
                        color="primary"
                    >
                        Comment
                    </Button>
                </div>

                {(commentState.error as any)?._form && (
                    <div className="mt-3 p-3 border-red-500 bg-red-200 rounded-md">
                        <p className="text-sm text-red-700">
                            {(commentState.error as any)._form.join(', ')}
                        </p>
                    </div>
                )}

                {(commentState.error as any)?.content && (
                    <div className="mt-3 p-3 border-red-500 bg-red-200 rounded-md">
                        <p className="text-sm text-red-700">
                            {(commentState.error as any).content.join(', ')}
                        </p>
                    </div>
                )}

                {commentState.success && (
                    <div className="mt-3 p-3 border-green-500 bg-green-200 rounded-md">
                        <p className="text-sm text-green-700">
                            Comment posted successfully!
                        </p>
                    </div>
                )}
            </form>
        </div>
    )
}
