"use client"

import React, { useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { Users, FileText, Clock, CheckCircle, MoreHorizontal, TrendingUp, Briefcase } from 'lucide-react'
import { MetricCard } from './MetricCard'
import { ChartCard } from './ChartCard'
import { candidateTrendsData, candidateEngagementData, weeklyComparisonData, engagementMetricsData, responseDistributionData } from './data'
import { useInstitutionStore } from '@/store'

// Helper function to format response time in human-readable format
const formatResponseTime = (hours: number): string => {
  if (hours === 0) return '0h'
  if (hours < 24) return `${hours.toFixed(1)}h`

  const days = Math.floor(hours / 24)
  const remainingHours = hours % 24

  if (remainingHours === 0) {
    return `${days}d`
  }
  return `${days}d ${remainingHours.toFixed(0)}h`
}

// Helper function to format large numbers with commas
const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US')
}

export const CandidateEngagementTab = () => {
  const { currentInstitution, instituteStats, loading, error, fetchInstituteStats } = useInstitutionStore()

  useEffect(() => {
    fetchInstituteStats()
  }, [fetchInstituteStats])

  // Transform API data for charts
  const hasStats = instituteStats && !loading

  const transformedTrends = hasStats && instituteStats.trends && instituteStats.trends.length > 0
    ? instituteStats.trends.map(trend => ({
      name: new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      views: trend.views,
      applications: trend.applications,
    }))
    : candidateTrendsData

  const transformedWeekly = hasStats && instituteStats.weeklyComparison && instituteStats.weeklyComparison.length > 0
    ? instituteStats.weeklyComparison.map(week => ({
      period: week.week,
      engagement: week.engagement,
    }))
    : weeklyComparisonData

  const transformedEngagement = hasStats ? [
    { metric: 'Total Jobs', current: instituteStats.totals.totalJobs, previous: 0 },
    { metric: 'Profile Views', current: instituteStats.totals.totalInstituteProfileViews, previous: 0 },
    { metric: 'Total Applications', current: instituteStats.totals.totalApplications, previous: 0 }
  ] : engagementMetricsData

  const transformedResponseDistribution = hasStats && instituteStats.responseDistribution && Object.keys(instituteStats.responseDistribution).length > 0
    ? Object.entries(instituteStats.responseDistribution).map(([key, value]) => ({
      name: key,
      pending: key.toLowerCase().includes('pending') ? value : 0,
      accepted: key.toLowerCase().includes('accept') || key.toLowerCase().includes('hired') ? value : 0,
      rejected: key.toLowerCase().includes('reject') ? value : 0
    }))
    : responseDistributionData

  // Skeleton component for loading state
  const MetricCardSkeleton = () => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <Skeleton className="h-4 w-32 mb-4" />
      <Skeleton className="h-8 w-20 mb-2" />
      <Skeleton className="h-3 w-24" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Candidate Engagement</h2>
          <p className="text-sm text-gray-600">
            {loading ? 'Loading statistics...' : 'Overall statistics for all jobs posted by your institute'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="daily">
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && !instituteStats ? (
          <>
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </>
        ) : (
          <>
            <MetricCard
              title="Total Jobs Posted"
              value={instituteStats?.totals?.totalJobs != null ? formatNumber(instituteStats.totals.totalJobs) : '0'}
              change={instituteStats?.totals?.totalJobs != null && instituteStats.totals.totalJobs > 0 ? `${formatNumber(instituteStats.totals.totalJobs)} active` : 'No jobs posted yet'}
              trend="up"
              icon={Briefcase}
            />
            <MetricCard
              title="Institute Profile Views"
              value={instituteStats?.totals?.totalInstituteProfileViews != null ? formatNumber(instituteStats.totals.totalInstituteProfileViews) : '0'}
              change="Profile page views"
              trend="up"
              icon={Users}
            />
            <MetricCard
              title="Total Applications"
              value={instituteStats?.totals?.totalApplications != null ? formatNumber(instituteStats.totals.totalApplications) : '0'}
              change="Across all jobs"
              trend="up"
              icon={FileText}
            />
            <MetricCard
              title="Average Response Rate"
              value={instituteStats?.totals?.averageResponseRate != null ? `${instituteStats.totals.averageResponseRate.toFixed(1)}%` : '0%'}
              change="Application responses"
              trend="up"
              icon={CheckCircle}
            />
            <MetricCard
              title="Avg Response Time"
              value={instituteStats?.totals?.averageResponseTimeHours != null ? formatResponseTime(instituteStats.totals.averageResponseTimeHours) : '0h'}
              change={instituteStats?.totals?.averageResponseTimeHours != null && instituteStats.totals.averageResponseTimeHours < 24 ? 'Hours to respond' : 'Time to respond'}
              trend="down"
              icon={Clock}
            />
            <MetricCard
              title="Conversion Rate"
              value={instituteStats?.totals?.conversionRate != null ? `${instituteStats.totals.conversionRate.toFixed(1)}%` : '0%'}
              change="Views to applications"
              trend="up"
              icon={TrendingUp}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Candidate Engagement Trends"
          subtitle={hasStats && transformedTrends.length > 0 ? "Views and applications over time" : "No trend data available yet"}
          actions={
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          }
        >
          {loading && !instituteStats ? (
            <div className="flex items-center justify-center h-[300px]">
              <Skeleton className="h-[280px] w-full" />
            </div>
          ) : hasStats && transformedTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={transformedTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Bar dataKey="views" fill="#3b82f6" name="Views" />
                <Bar dataKey="applications" fill="#10b981" name="Applications" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              <div className="text-center">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No trend data available</p>
              </div>
            </div>
          )}
        </ChartCard>

        <ChartCard
          title="Response Distribution"
          subtitle={hasStats && responseDistributionData.length > 0 ? "Breakdown of candidate responses" : "No response data available yet"}
          actions={
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          }
        >
          {loading && !instituteStats ? (
            <div className="flex items-center justify-center h-[300px]">
              <Skeleton className="h-[280px] w-full" />
            </div>
          ) : hasStats && transformedResponseDistribution.length > 0 && Object.keys(instituteStats.responseDistribution || {}).length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={transformedResponseDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Bar dataKey="pending" fill="#3b82f6" name="Pending" />
                <Bar dataKey="accepted" fill="#10b981" name="Accepted" />
                <Bar dataKey="rejected" fill="#f59e0b" name="Rejected" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No response data available</p>
              </div>
            </div>
          )}
        </ChartCard>

        <ChartCard
          title="Weekly Comparison"
          subtitle={hasStats && transformedWeekly.length > 0 ? "Candidate engagement over time" : "No weekly data available yet"}
          actions={
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">Day</Badge>
              <Badge variant="outline" className="text-xs">Week</Badge>
              <Badge variant="default" className="text-xs">Month</Badge>
            </div>
          }
        >
          {loading && !instituteStats ? (
            <div className="flex items-center justify-center h-[300px]">
              <Skeleton className="h-[280px] w-full" />
            </div>
          ) : hasStats && transformedWeekly.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={transformedWeekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="period" fontSize={12} />
                <YAxis fontSize={12} />
                <Bar dataKey="engagement" fill="#3b82f6" name="Engagement" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              <div className="text-center">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No weekly data available</p>
              </div>
            </div>
          )}
        </ChartCard>

        <ChartCard
          title="Engagement Metrics"
          subtitle="Key performance indicators"
          actions={
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          }
        >
          {loading && !instituteStats ? (
            <div className="flex items-center justify-center h-[300px]">
              <Skeleton className="h-[280px] w-full" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={transformedEngagement}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="metric" fontSize={12} />
                <YAxis fontSize={12} />
                <Area type="monotone" dataKey="current" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </div>
  )
}
