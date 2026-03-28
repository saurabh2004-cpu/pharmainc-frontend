"use client"

import React, { useEffect, useState } from 'react'
import { useInstitutionStore } from '@/store'
import { getCreditsHistoryByInstituteId } from '@/lib/api/services/institute'
import { getTransactionsByInstituteId, getAllPackages, createTransaction } from '@/lib/api/services/transactions'
import { Transaction, Package } from '@/lib/api/types'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button'
import { ArrowLeft, CreditCard, History, Package as PackageIcon, RefreshCw, ShoppingCart, CheckCircle2, ArrowUpRight, ArrowDownRight, ChevronLeft, ChevronRight } from 'lucide-react'

import Link from 'next/link'
import { format } from 'date-fns'
import { toast } from 'sonner'
import PackageCard from '@/components/credit-history/PackageCard'
import { motion, AnimatePresence } from 'framer-motion'



const CreditHistoryPage = () => {
    const { currentInstitution, fetchCurrentInstitution } = useInstitutionStore()
    const [history, setHistory] = useState<any[]>([])
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [packages, setPackages] = useState<Package[]>([])

    const [loadingHistory, setLoadingHistory] = useState(true)
    const [loadingTransactions, setLoadingTransactions] = useState(true)
    const [loadingPackages, setLoadingPackages] = useState(true)

    const [purchaseLoadingId, setPurchaseLoadingId] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState('history')
    const scrollRef = React.useRef<HTMLDivElement>(null)

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
        }
    }


    useEffect(() => {
        if (!currentInstitution) {
            fetchCurrentInstitution()
        }
    }, [currentInstitution, fetchCurrentInstitution])

    useEffect(() => {
        if (currentInstitution?.id) {
            fetchAllData()
        }
    }, [currentInstitution?.id])

    const fetchAllData = () => {
        fetchHistory()
        fetchTransactions()
        fetchPackages()
    }

    const fetchHistory = async () => {
        if (!currentInstitution?.id) return
        setLoadingHistory(true)
        try {
            const data = await getCreditsHistoryByInstituteId(currentInstitution.id)
            const rawData = Array.isArray(data) ? data : data.data || []
            // Secondary sort on frontend to be 100% sure
            const sortedData = [...rawData].sort((a, b) => 
                new Date(b.created_at || b.createdAt).getTime() - new Date(a.created_at || a.createdAt).getTime()
            )
            setHistory(sortedData)
        } catch (error) {

            console.error("Failed to fetch history", error)
            toast.error("Failed to load credits history")
        } finally {
            setLoadingHistory(false)
        }
    }

    const fetchTransactions = async () => {
        if (!currentInstitution?.id) return
        setLoadingTransactions(true)
        try {
            const data = await getTransactionsByInstituteId()
            const sortedData = (data || []).sort((a, b) => 
                new Date(b.createdAt || b.created_at || 0).getTime() - new Date(a.createdAt || a.created_at || 0).getTime()
            )
            setTransactions(sortedData)
        } catch (error) {

            console.error("Failed to fetch transactions", error)
            toast.error("Failed to load purchase transactions")
        } finally {
            setLoadingTransactions(false)
        }
    }

    const fetchPackages = async () => {
        setLoadingPackages(true)
        try {
            const data = await getAllPackages()
            setPackages(data || [])
        } catch (error) {
            console.error("Failed to fetch packages", error)
            toast.error("Failed to load available packages")
        } finally {
            setLoadingPackages(false)
        }
    }

    const handlePurchase = async (pkg: Package) => {
        setPurchaseLoadingId(pkg.id)
        try {
            await createTransaction(pkg.id, pkg.price)
            toast.success(`Successfully purchased ${pkg.name}!`, {
                description: `${pkg.credits} credits have been added to your account.`,
            })
            // Refresh all data
            fetchAllData()
            fetchCurrentInstitution() // Updates the credit balance in UI
        } catch (error) {
            console.error("Purchase failed", error)
            toast.error("Purchase failed", {
                description: "There was an error processing your transaction. Please try again."
            })
        } finally {
            setPurchaseLoadingId(null)
        }
    }

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
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Credits & Billing</h1>
                            <p className="text-gray-500 mt-1">Track your credits and purchase new packages</p>
                        </div>
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-xl">
                                <History className="w-6 h-6 text-[#169BA4]" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Transactions</p>
                                <p className="text-2xl font-bold text-gray-900">{loadingTransactions ? "--" : transactions.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <Tabs defaultValue="history" className="space-y-6" onValueChange={setActiveTab}>
                    <TabsList className="bg-white border border-gray-200 p-1 h-12 rounded-xl shadow-sm overflow-x-auto inline-flex whitespace-nowrap">
                        <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-[#169BA4] data-[state=active]:text-white transition-all px-6">
                            <CreditCard className="w-4 h-4 mr-2" /> Credits History
                        </TabsTrigger>
                        <TabsTrigger value="transactions" className="rounded-lg data-[state=active]:bg-[#169BA4] data-[state=active]:text-white transition-all px-6">
                            <RefreshCw className="w-4 h-4 mr-2" /> Purchase Transactions
                        </TabsTrigger>
                        <TabsTrigger value="packages" className="rounded-lg data-[state=active]:bg-[#169BA4] data-[state=active]:text-white transition-all px-6">
                            <PackageIcon className="w-4 h-4 mr-2" /> Buy Packages
                        </TabsTrigger>
                    </TabsList>

                    {/* 1. Credits History Content (Logs of all debits/credits) */}
                    <TabsContent value="history">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                    <History className="w-5 h-5 text-[#169BA4]" /> Credits Activity Logs
                                </h2>
                                <Button variant="ghost" size="sm" onClick={fetchHistory} disabled={loadingHistory}>
                                    <RefreshCw className={`w-4 h-4 mr-2 ${loadingHistory ? 'animate-spin' : ''}`} /> Refresh
                                </Button>
                            </div>

                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                                            <TableHead className="font-semibold text-gray-900 py-4 px-6">Date & Time</TableHead>
                                            <TableHead className="font-semibold text-gray-900 py-4">Action</TableHead>
                                            <TableHead className="font-semibold text-gray-900 py-4">Type</TableHead>
                                            <TableHead className="font-semibold text-gray-900 py-4 text-right">Credits</TableHead>
                                            <TableHead className="font-semibold text-gray-900 py-4 text-right pr-6">Current Balance</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loadingHistory ? (
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
                                            history.map((t) => {
                                                const isDebit = t.type?.toLowerCase() === 'debit'
                                                const amount = isDebit ? t.cost : t.purchasedCredits
                                                const actionLabel = t.action?.split('_').map((word: string) =>
                                                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                                                ).join(' ') || 'Transaction'

                                                return (
                                                    <TableRow key={t.id || t._id} className="hover:bg-gray-50/50 transition-colors group">
                                                        <TableCell className="px-6 py-4 text-gray-600">
                                                            {format(new Date(t.createdAt || t.created_at), 'MMM dd, yyyy • hh:mm a')}
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
                                                            {t.currentCredits ?? 0}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-72 text-center text-gray-400">
                                                    No history found
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </TabsContent>

                    {/* 2. Purchase Transactions Content */}
                    <TabsContent value="transactions">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-[#169BA4]" /> Package Purchase History
                                </h2>
                                <Button variant="ghost" size="sm" onClick={fetchTransactions} disabled={loadingTransactions}>
                                    <RefreshCw className={`w-4 h-4 mr-2 ${loadingTransactions ? 'animate-spin' : ''}`} /> Refresh
                                </Button>
                            </div>

                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                                            <TableHead className="font-semibold text-gray-900 py-4 px-6">Date & Time</TableHead>
                                            <TableHead className="font-semibold text-gray-900 py-4">Package Name</TableHead>
                                            <TableHead className="font-semibold text-gray-900 py-4 text-right">Credits</TableHead>
                                            <TableHead className="font-semibold text-gray-900 py-4 text-right pr-6">Price Paid</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loadingTransactions ? (
                                            Array(4).fill(0).map((_, i) => (
                                                <TableRow key={i} className="animate-pulse">
                                                    <TableCell className="px-6 py-4"><Skeleton className="h-5 w-32" /></TableCell>
                                                    <TableCell className="py-4"><Skeleton className="h-5 w-40" /></TableCell>
                                                    <TableCell className="text-right py-4"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                                                    <TableCell className="text-right pr-6 py-4"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                                                </TableRow>
                                            ))
                                        ) : transactions.length > 0 ? (
                                            transactions.map((t) => (
                                                <TableRow key={t.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <TableCell className="px-6 py-4 text-gray-600">
                                                        {format(new Date(t.createdAt), 'MMM dd, yyyy • hh:mm a')}
                                                    </TableCell>
                                                    <TableCell className="py-4 font-medium text-gray-900">
                                                        {t.package?.name || 'Custom Package'}
                                                    </TableCell>
                                                    <TableCell className="text-right py-4 font-bold text-emerald-600">
                                                        +{t.package?.credits || 0} Credits
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6 py-4 font-semibold text-gray-700">
                                                        ₹{t.amount?.toLocaleString()}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={4} className="h-72 text-center text-gray-400">
                                                    No purchases found
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </TabsContent>

                    {/* 3. Packages Content */}
                    <TabsContent value="packages">
                        <div className="space-y-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Choose Your Credit Pack</h2>
                                    <p className="text-gray-500 mt-1">Select a package that best fits your institution's needs</p>
                                </div>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={fetchPackages} 
                                    disabled={loadingPackages}
                                    className="bg-white border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl px-4 h-10 transition-all font-semibold"
                                >
                                    <RefreshCw className={`w-4 h-4 mr-2 ${loadingPackages ? 'animate-spin' : ''}`} /> 
                                    Sync Packages
                                </Button>
                            </div>

                            {loadingPackages ? (
                                <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="min-w-[300px] md:min-w-[350px] snap-center bg-white rounded-[2rem] border border-gray-100 p-6 h-[500px] animate-pulse relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 -mr-12 -mt-12 rounded-full" />
                                            <div className="w-16 h-16 bg-gray-100 rounded-2xl mx-auto mb-8" />
                                            <div className="h-6 bg-gray-100 rounded-full w-3/4 mx-auto mb-4" />
                                            <div className="h-10 bg-gray-100 rounded-full w-1/2 mx-auto mb-8" />
                                            <div className="space-y-4">
                                                {[1, 2, 3, 4].map(j => (
                                                    <div key={j} className="h-3.5 bg-gray-50 rounded-full w-full" />
                                                ))}
                                            </div>
                                            <div className="mt-auto pt-8">
                                                <div className="h-14 bg-gray-100 rounded-xl w-full" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : packages.length > 0 ? (
                                <div className="relative group/scroll px-4 md:px-0">
                                    {/* Desktop Navigation Buttons */}
                                    <div className="absolute top-1/2 -left-4 md:-left-6 -translate-y-1/2 z-20 hidden md:block">
                                        <Button 
                                            variant="outline" 
                                            size="icon" 
                                            onClick={() => scroll('left')}
                                            className="w-12 h-12 rounded-full bg-white shadow-xl border-gray-100 hover:bg-[#169BA4] hover:text-white transition-all duration-300"
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </Button>
                                    </div>
                                    <div className="absolute top-1/2 -right-4 md:-right-6 -translate-y-1/2 z-20 hidden md:block">
                                        <Button 
                                            variant="outline" 
                                            size="icon" 
                                            onClick={() => scroll('right')}
                                            className="w-12 h-12 rounded-full bg-white shadow-xl border-gray-100 hover:bg-[#169BA4] hover:text-white transition-all duration-300"
                                        >
                                            <ChevronRight className="w-6 h-6" />
                                        </Button>
                                    </div>

                                    <div 
                                        ref={scrollRef}
                                        className="flex gap-8 overflow-x-auto pb-12 pt-4 snap-x no-scrollbar scroll-smooth"
                                    >
                                        <AnimatePresence mode="popLayout">
                                            {packages.map((pkg, index) => (
                                                <motion.div
                                                    key={pkg.id}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    whileInView={{ opacity: 1, scale: 1 }}
                                                    viewport={{ margin: "0px -10% 0px -10%" }}
                                                    transition={{ 
                                                        delay: index * 0.1, 
                                                        duration: 0.5
                                                    }}
                                                    className="min-w-[300px] md:min-w-[350px] lg:min-w-[380px] snap-center py-4"
                                                >

                                                    <PackageCard
                                                        pkg={pkg}
                                                        onPurchase={handlePurchase}
                                                        isLoading={purchaseLoadingId === pkg.id}
                                                        isDisabled={purchaseLoadingId !== null}
                                                        isPopular={index === 1 || pkg.name.toLowerCase().includes('standard')}
                                                    />
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>

                                    
                                    {/* Scroll Indicator Hint */}
                                    <div className="flex justify-center gap-2 mt-2 md:hidden">
                                        {packages.map((_, i) => (
                                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                                        ))}
                                    </div>
                                    
                                    <style jsx global>{`
                                        .no-scrollbar::-webkit-scrollbar {
                                            display: none;
                                        }
                                        .no-scrollbar {
                                            -ms-overflow-style: none;
                                            scrollbar-width: none;
                                        }
                                    `}</style>
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl border border-gray-200 p-20 text-center space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-full w-fit mx-auto">
                                        <PackageIcon className="w-10 h-10 text-gray-300" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">No Packages Found</h3>
                                        <p className="text-gray-500">We couldn't find any available credit packages at the moment.</p>
                                    </div>
                                    <Button onClick={fetchPackages} variant="outline" className="mt-4">
                                        Try Refreshing
                                    </Button>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default CreditHistoryPage
