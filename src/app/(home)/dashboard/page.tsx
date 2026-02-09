"use client"

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  CandidateEngagementTab,
  PostedJobsTab,
  ComingSoonTab,
  DashboardHeader
} from './_components'
import { DraftConfirmationModal } from '@/components/DraftConfirmationModal'
import { useJobPostingStore } from '@/store'
import { Button } from '@/components/ui/button'

const DashboardContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState(tab || 'overview')
  const [showDraftModal, setShowDraftModal] = useState(false)

  const { currentDraft, clearDraft } = useJobPostingStore()

  useEffect(() => {
    if (tab) {
      setActiveTab(tab)
    }
  }, [tab])

  const handlePostJobClick = (e: React.MouseEvent) => {
    e.preventDefault()

    const hasMeaningfulDraft = currentDraft && (
      currentDraft.title ||
      currentDraft.description ||
      currentDraft.jobType ||
      (currentDraft.skills && currentDraft.skills.length > 0)
    );

    if (hasMeaningfulDraft) {
      // Has meaningful draft data
      setShowDraftModal(true)
    } else {
      // No draft, go directly
      router.push('/dashboard/post-job')
    }
  }

  const handleContinueDraft = () => {
    setShowDraftModal(false)
    router.push('/dashboard/post-job')
  }

  const handleStartFresh = () => {
    clearDraft()
    setShowDraftModal(false)
    router.push('/dashboard/post-job')
  }

  return (
    <div className="min-h-screen bg-white w-full">
      {/* <DashboardHeader /> */}

      <div className="px-8 py-6 bg-white w-full">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Institute Dashboard</h1>
            <p className="text-gray-600">Track your hiring metrics</p>
          </div>
          <Button
            onClick={handlePostJobClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Post a Job
          </Button>
        </div>

        <DraftConfirmationModal
          open={showDraftModal}
          onOpenChange={setShowDraftModal}
          onContinue={handleContinueDraft}
          onStartFresh={handleStartFresh}
          draftInfo={{
            lastSaved: currentDraft?.lastSaved,
            title: currentDraft?.title,
          }}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 w-full justify-start">
            <TabsTrigger value="overview" className="px-4 py-2">
              Overview
            </TabsTrigger>
            <TabsTrigger value="posted-jobs" className="px-4 py-2">
              Posted Jobs
            </TabsTrigger>
            <TabsTrigger value="coming-soon" className="px-4 py-2">
              Coming Soon
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 w-full px-2">
            <CandidateEngagementTab />
          </TabsContent>

          <TabsContent value="posted-jobs" className="space-y-6 w-full px-2">
            <PostedJobsTab />
          </TabsContent>

          <TabsContent value="coming-soon" className="space-y-6 w-full px-2">
            <ComingSoonTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

const DashboardPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white w-full flex items-center justify-center">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}

export default DashboardPage