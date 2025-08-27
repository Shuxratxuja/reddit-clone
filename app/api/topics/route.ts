import { NextResponse } from 'next/server'
import { db } from '@/db'

export async function GET() {
    try {
        const topics = await db.topic.findMany({
            include: {
                _count: {
                    select: {
                        posts: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return NextResponse.json(topics)
    } catch (error) {
        console.error('Error fetching topics:', error)
        return NextResponse.json({ error: 'Failed to fetch topics' }, { status: 500 })
    }
}
