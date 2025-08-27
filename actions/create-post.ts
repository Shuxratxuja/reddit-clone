'use server'

import { z } from 'zod'
import { auth } from '@/auth'
import { db } from '@/db'

const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(300, 'Title must be less than 300 characters'),
  content: z.string().min(1, 'Content is required').max(40000, 'Content must be less than 40000 characters'),
  topicId: z.string().min(1, 'Topic is required'),
})

export async function createPost(prevState: any, formData: FormData) {
  const session = await auth()

  if (!session?.user) {
    return { error: { _form: ['You must be signed in to create a post'] } }
  }

  const result = createPostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    topicId: formData.get('topicId'),
  })

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  try {
    const post = await db.post.create({
      data: {
        title: result.data.title,
        content: result.data.content,
        topicId: result.data.topicId,
        userId: session.user.id!,
      },
      include: {
        user: true,
        topic: true,
      },
    })

    return { success: true, post }
  } catch (error) {
    return { error: { _form: ['Failed to create post'] } }
  }
}
