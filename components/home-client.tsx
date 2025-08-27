'use client'

import { useRef } from 'react'
import Sidebar from './sidebar'
import PostModals, { PostModalsRef } from './post-modals'

export default function HomeClient() {
    const modalsRef = useRef<PostModalsRef>(null)

    const handleCreatePost = () => {
        modalsRef.current?.openCreatePost()
    }

    const handleCreateTopic = () => {
        modalsRef.current?.openCreateTopic()
    }

    return (
        <>
            {/* Sidebar with modal triggers */}
            <div className="lg:col-span-1">
                <Sidebar
                    onCreatePost={handleCreatePost}
                    onCreateTopic={handleCreateTopic}
                />
            </div>

            {/* Modals */}
            <PostModals ref={modalsRef} />
        </>
    )
}
