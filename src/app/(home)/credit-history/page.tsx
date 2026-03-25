"use client"

import React, { useEffect, useState } from 'react'
import { useInstitutionStore } from '@/store'
import { getCreditsHistoryByInstituteId } from '@/lib/api/services/institute'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, CreditCard, ArrowUpRight, ArrowDownRight, History } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

const CreditHistoryPage = () => {
    const { currentInstitution, fetchCurrentInstitution } = useInstitutionStore()
    const [history, setHistory] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!currentInstitution) {
            fetchCurrentInstitution()
        }
    }, [currentInstitution, fetchCurrentInstitution])

    useEffect(() => {
        const fetchHistory = async () => {
            if (currentInstitution?.id) {
                try {
                    const data = await getCreditsHistoryByInstituteId(currentInstitution.id)
                    console.log("Credits History Data:", data)
                    // The API returns an array or an object with data
                    setHistory(Array.isArray(data) ? data : data.data || [])
                } catch (error) {
                    console.error("Failed to fetch credits history", error)
                } finally {
                    setLoading(false)
                }
            }
        }

        if (currentInstitution?.id) {
            fetchHistory()
        }
    }, [currentInstitution?.id])

    return (
        <div className="min-h-screen bg-gray-50/50 pb-12">
            <div className="px-2 mx-auto px-4 pt-8 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className="p-2.5 bg-white hover:bg-gray-100 rounded-xl border border-gray-200 shadow-sm transition-all group"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:-translate-x-0.5 transition-transform" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Credits History</h1>
                            <p className="text-gray-500 mt-1">Manage and track your institute's credit transactions</p>
                        </div>
                    </div>
                </div>

                {/* Stats Summary - Optional but adds premium feel */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-xl">
                                <History className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Transactions</p>
                                <p className="text-2xl font-bold text-gray-900">{loading ? "--" : history.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-white">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <CreditCard className="w-5 h-5 text-indigo-600" />
                            </div>
                            <h2 className="font-bold text-lg text-gray-900">Transaction Logs</h2>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                                    <TableHead className="font-semibold text-gray-900 py-4 px-6">Date & Time</TableHead>
                                    <TableHead className="font-semibold text-gray-900 py-4">Action</TableHead>
                                    <TableHead className="font-semibold text-gray-900 py-4">Type</TableHead>
                                    <TableHead className="font-semibold text-gray-900 py-4 text-right">Amount</TableHead>
                                    <TableHead className="font-semibold text-gray-900 py-4 text-right pr-6">Current Balance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array(6).fill(0).map((_, i) => (
                                        <TableRow key={i} className="animate-pulse">
                                            <TableCell className="px-6 py-4"><Skeleton className="h-5 w-32" /></TableCell>
                                            <TableCell className="py-4"><Skeleton className="h-5 w-40" /></TableCell>
                                            <TableCell className="py-4"><Skeleton className="h-7 w-20 rounded-full" /></TableCell>
                                            <TableCell className="text-right py-4"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                                            <TableCell className="text-right pr-6 py-4"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : history.length > 0 ? (
                                    history.map((transaction) => {
                                        const isDebit = transaction.type?.toLowerCase() === 'debit';
                                        const amount = isDebit ? transaction.cost : transaction.purchasedCredits;
                                        const actionLabel = transaction.action?.split('_').map((word: string) =>
                                            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                                        ).join(' ') || 'Transaction';

                                        return (
                                            <TableRow key={transaction._id || transaction.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <TableCell className="px-6 py-4 text-gray-600">
                                                    {format(new Date(transaction.createdAt || transaction.created_at), 'MMM dd, yyyy • hh:mm a')}
                                                </TableCell>
                                                <TableCell className="py-4 font-medium text-gray-900">
                                                    {actionLabel}
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    {isDebit ? (
                                                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-100 px-3 py-1 gap-1.5 font-semibold text-xs uppercase tracking-wider">
                                                            <ArrowDownRight className="w-3.5 h-3.5" /> Debit
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 px-3 py-1 gap-1.5 font-semibold text-xs uppercase tracking-wider">
                                                            <ArrowUpRight className="w-3.5 h-3.5" /> Credit
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className={`text-right py-4 font-bold ${isDebit ? 'text-red-600' : 'text-emerald-600'}`}>
                                                    {isDebit ? '-' : '+'}{amount ?? 0}
                                                </TableCell>
                                                <TableCell className="text-right pr-6 py-4 font-semibold text-gray-700">
                                                    {transaction.currentCredits ?? 0}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-72 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400 gap-4">
                                                <div className="p-4 bg-gray-50 rounded-full">
                                                    <CreditCard className="w-12 h-12 opacity-20" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-gray-900 font-semibold">No transactions found</p>
                                                    <p className="text-sm">Your credit activity will appear here once you start using the platform.</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreditHistoryPage
