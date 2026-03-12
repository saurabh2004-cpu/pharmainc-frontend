"use client"

import React from 'react'
import { PostedJobsTab } from '../_components/PostedJobsTab'

const PostedJobsPage = () => {
    return (
        <div className="min-h-screen bg-white w-full">
            <div className="px-2 py-6 bg-white w-full">
                <PostedJobsTab />
            </div>
        </div>
    )
}

export default PostedJobsPage
