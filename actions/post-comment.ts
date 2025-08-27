'use server'

import { z } from 'zod'
import { auth } from '@/auth'
import { db } from '@/db'
import { revalidatePath } from 'next/cache'

const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment is required').max(10000, 'Comment must be less than 10000 characters'),
  postId: z.string().min(1, 'Post ID is required'),
  parentId: z.string().optional(), // For nested comments
})

const editCommentSchema = z.object({
  content: z.string().min(1, 'Comment is required').max(10000, 'Comment must be less than 10000 characters'),
  commentId: z.string().min(1, 'Comment ID is required'),
})

const deleteCommentSchema = z.object({
  commentId: z.string().min(1, 'Comment ID is required'),
})

export async function createComment(prevState: any, formData: FormData) {
  const session = await auth()

  if (!session?.user) {
    return { error: { _form: ['You must be signed in to comment'] } }
  }

  const action = formData.get('action')

  // Handle edit action
  if (action === 'edit') {
    const result = editCommentSchema.safeParse({
      content: formData.get('content'),
      commentId: formData.get('commentId'),
    })

    if (!result.success) {
      return { error: result.error.flatten().fieldErrors }
    }

    try {
      // Check if user owns the comment
      const existingComment = await db.comment.findUnique({
        where: { id: result.data.commentId },
        include: { user: true, post: true }
      })

      if (!existingComment) {
        return { error: { _form: ['Comment not found'] } }
      }

      if (existingComment.user.id !== session.user.id) {
        return { error: { _form: ['You can only edit your own comments'] } }
      }

      const comment = await db.comment.update({
        where: { id: result.data.commentId },
        data: {
          content: result.data.content,
        },
        include: {
          user: true,
        },
      })

      // Revalidate the post page
      revalidatePath(`/post/${existingComment.post.id}`)
      revalidatePath('/')

      return { success: true, comment }
    } catch (error) {
      return { error: { _form: ['Failed to edit comment'] } }
    }
  }

  // Handle delete action
  if (action === 'delete') {
    const result = deleteCommentSchema.safeParse({
      commentId: formData.get('commentId'),
    })

    if (!result.success) {
      return { error: result.error.flatten().fieldErrors }
    }

    try {
      // Check if user owns the comment
      const existingComment = await db.comment.findUnique({
        where: { id: result.data.commentId },
        include: { user: true, post: true }
      })

      if (!existingComment) {
        return { error: { _form: ['Comment not found'] } }
      }

      if (existingComment.user.id !== session.user.id) {
        return { error: { _form: ['You can only delete your own comments'] } }
      }

      await db.comment.delete({
        where: { id: result.data.commentId },
      })

      // Revalidate the post page
      revalidatePath(`/post/${existingComment.post.id}`)
      revalidatePath('/')

      return { success: true, deleted: true }
    } catch (error) {
      return { error: { _form: ['Failed to delete comment'] } }
    }
  }

  // Handle create action (default)
  const result = createCommentSchema.safeParse({
    content: formData.get('content'),
    postId: formData.get('postId'),
    parentId: formData.get('parentId') || undefined,
  })

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  try {
    const comment = await db.comment.create({
      data: {
        content: result.data.content,
        postId: result.data.postId,
        parentId: result.data.parentId,
        userId: session.user.id!,
      },
      include: {
        user: true,
        children: {
          include: {
            user: true,
          },
        },
      },
    })

    // Revalidate the post page
    revalidatePath(`/post/${result.data.postId}`)
    revalidatePath('/')

    return { success: true, comment }
  } catch (error) {
    return { error: { _form: ['Failed to create comment'] } }
  }
}