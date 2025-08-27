import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Create sample topics
    const programmingTopic = await prisma.topic.upsert({
        where: { slug: 'programming' },
        update: {},
        create: {
            slug: 'programming',
            description: 'A place for all things programming',
        },
    })

    const javascriptTopic = await prisma.topic.upsert({
        where: { slug: 'javascript' },
        update: {},
        create: {
            slug: 'javascript',
            description: 'JavaScript community',
        },
    })

    const reactTopic = await prisma.topic.upsert({
        where: { slug: 'react' },
        update: {},
        create: {
            slug: 'react',
            description: 'React.js community',
        },
    })

    // Create a sample user if it doesn't exist
    const user = await prisma.user.upsert({
        where: { email: 'test@example.com' },
        update: {},
        create: {
            email: 'test@example.com',
            name: 'TestUser',
            image: 'https://avatars.githubusercontent.com/u/200636864?v=4',
        },
    })

    // Create sample posts
    const post1 = await prisma.post.upsert({
        where: { id: 'sample-post-1' },
        update: {},
        create: {
            id: 'sample-post-1',
            title: 'Implement charts in our application',
            content: 'We need to add beautiful charts to visualize our data. Looking for recommendations on the best charting libraries for React. I\'ve been looking at Chart.js, Recharts, and Victory. What are your experiences with these libraries?',
            userId: user.id,
            topicId: programmingTopic.id,
        },
    })

    const post2 = await prisma.post.upsert({
        where: { id: 'sample-post-2' },
        update: {},
        create: {
            id: 'sample-post-2',
            title: 'What\'s your favorite programming language and why?',
            content: 'I\'ve been coding for a few years now and I\'m curious to hear what languages other developers prefer and their reasoning behind it. Personally, I love TypeScript for its type safety and JavaScript for its flexibility.',
            userId: user.id,
            topicId: programmingTopic.id,
        },
    })

    const post3 = await prisma.post.upsert({
        where: { id: 'sample-post-3' },
        update: {},
        create: {
            id: 'sample-post-3',
            title: 'Just finished my first React project!',
            content: 'After months of learning, I finally completed my first React application. It\'s a simple todo app but I\'m proud of it! The journey from understanding components to hooks was challenging but rewarding.',
            userId: user.id,
            topicId: reactTopic.id,
        },
    })

    // Create sample comments
    await prisma.comment.upsert({
        where: { id: 'sample-comment-1' },
        update: {},
        create: {
            id: 'sample-comment-1',
            content: 'Great question! I\'ve used Chart.js and it\'s really easy to get started with. The documentation is excellent.',
            postId: post1.id,
            userId: user.id,
        },
    })

    await prisma.comment.upsert({
        where: { id: 'sample-comment-2' },
        update: {},
        create: {
            id: 'sample-comment-2',
            content: 'I prefer Recharts for React projects. It\'s more React-native and the API is very intuitive.',
            postId: post1.id,
            userId: user.id,
        },
    })

    await prisma.comment.upsert({
        where: { id: 'sample-comment-3' },
        update: {},
        create: {
            id: 'sample-comment-3',
            content: 'Congratulations on your first React project! What was the most challenging part?',
            postId: post3.id,
            userId: user.id,
        },
    })

    console.log('Database seeded successfully!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
