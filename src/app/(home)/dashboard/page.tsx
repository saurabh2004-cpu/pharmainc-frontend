"use client"

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  CandidateEngagementTab,
  PostedJobsTab,
  ComingSoonTab,
  DashboardHeader,
  InstituteVerificationModal
} from './_components'
import { DraftConfirmationModal } from '@/components/DraftConfirmationModal'
import { useJobPostingStore } from '@/store'
import { Button } from '@/components/ui/button'
import { getInstituteWallet, checkInstituteVerificationStatus } from '@/lib/api/services/institute'
import { getUserType } from '@/lib/api/utils'
import { toast } from 'sonner'

const DashboardContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState(tab || 'overview')
  const [showDraftModal, setShowDraftModal] = useState(false)
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [credits, setCredits] = useState<number | null>(null);
  const [loadingCredits, setLoadingCredits] = useState(true);
  const [checkingVerification, setCheckingVerification] = useState(false)

  const { currentDraft, clearDraft } = useJobPostingStore()

  useEffect(() => {
    if (tab) {
      setActiveTab(tab)
    }
  }, [tab])

  useEffect(() => {
    const fetchCredits = async () => {
      const userType = getUserType();
      if (userType !== 'INSTITUTE' && userType !== 'INSTITUTE') {
        setLoadingCredits(false);
        return;
      }

      try {
        const res: any = await getInstituteWallet();
        console.log("res credits", res)

        setCredits(res?.credits[0]?.credits ? res?.credits[0]?.credits : 0);
      } catch (error) {
        console.error("Failed to fetch credits", error);
        setCredits(0);
      } finally {
        setLoadingCredits(false);
      }
    };

    fetchCredits();
  }, []);

  const handlePostJobClick = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (checkingVerification) return;

    setCheckingVerification(true)
    try {
      const result = await checkInstituteVerificationStatus();
      if (!result.verified) {
        setShowVerificationModal(true);
        return;
      }

      const hasMeaningfulDraft = currentDraft && (
        currentDraft.title ||
        currentDraft.fullDescription ||
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
    } catch (error) {
      console.error("Failed to check verification status", error);
      toast.error("Failed to check verification status. Please try again.");
    } finally {
      setCheckingVerification(false)
    }
  }

  const handleContinueDraft = () => {
    setShowDraftModal(false)
    router.push('/dashboard/post-job')
  }

  const handleStartFresh = () => {
    clearDraft()
    localStorage.removeItem('job-draft-new')
    setShowDraftModal(false)
    router.push('/dashboard/post-job')
  }

  return (
    <div className="min-h-screen bg-white w-full">
      {/* <DashboardHeader /> */}

      <div className="px-2 py-6 bg-white w-full">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Institute Dashboard</h1>
            <p className="text-gray-600">Track your hiring metrics</p>
          </div>
          <div className="flex items-center gap-4">
            {(getUserType() === 'INSTITUTE' || getUserType() === 'INSTITUTE') && (
              <Link 
                href="/credit-history"
                className="px-4 py-2 rounded-md bg-muted text-sm font-semibold border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Credits: {loadingCredits ? "--" : credits}
              </Link>
            )}
            <Button
              onClick={handlePostJobClick}
              disabled={checkingVerification}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-70"
            >
              {checkingVerification ? "Checking..." : "Post a Job"}
            </Button>
          </div>
        </div>

        <InstituteVerificationModal
          isOpen={showVerificationModal}
          onClose={() => setShowVerificationModal(false)}
        />

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
            <CandidateEngagementTab credits={credits} loadingCredits={loadingCredits} />
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