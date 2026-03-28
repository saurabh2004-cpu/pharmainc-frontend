import React from 'react'
import { CheckCircle2, ShoppingCart, RefreshCw, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Package } from '@/lib/api/types'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface PackageCardProps {
    pkg: Package;
    onPurchase: (pkg: Package) => void;
    isLoading: boolean;
    isDisabled: boolean;
    isPopular?: boolean;
}

const PackageCard: React.FC<PackageCardProps> = ({
    pkg,
    onPurchase,
    isLoading,
    isDisabled,
    isPopular = false
}) => {
    // Generate some mock features based on package name/credits
    const features = [
        `${pkg.credits.toLocaleString()} Credits`,
        "No Expiry Date on Credits",
        "Instant Activation",

    ];

    const pricePerCredit = (pkg.price / pkg.credits).toFixed(2);

    return (
        <motion.div
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={cn(
                "relative group bg-white rounded-[2.5rem] border transition-all duration-700 flex flex-col h-full overflow-hidden",
                isPopular
                    ? "border-[#169BA4]/40 shadow-[0_20px_50px_rgba(22,155,164,0.15)]"
                    : "border-gray-100 hover:border-[#169BA4]/30 hover:shadow-[0_20px_40px_-10px_rgba(35,63,100,0.1)]"
            )}
        >
            {/* Background Glow for Popular Card */}
            {isPopular && (
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#169BA4]/5 rounded-full blur-3xl" />
            )}

            {/* Ribbon */}
            {/* {isPopular && (
                <motion.div 
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="absolute top-0 right-0 overflow-hidden w-40 h-40 pointer-events-none z-10"
                >
                    <div className="absolute top-8 -right-12 bg-gradient-to-r from-[#169BA4] to-[#233F64] text-white text-[11px] font-black py-2 w-48 text-center rotate-45 shadow-xl uppercase tracking-[0.2em] transition-transform duration-500 group-hover:scale-110">
                        Most Popular
                    </div>
                </motion.div>
            )} */}

            {/* Top Section */}
            <div className="p-8 pb-4 text-center relative">
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={cn(
                        "inline-flex items-center justify-center p-3 rounded-[1.2rem] mb-6 transition-all duration-500",
                        isPopular ? "bg-[#169BA4] text-white shadow-lg shadow-[#169BA4]/10" : "bg-[#233F64]/5 text-[#233F64]"
                    )}
                >
                    <Zap className={cn("w-6 h-6", isPopular ? "fill-white" : "fill-none")} />
                </motion.div>

                <h3 className="text-xl font-black text-[#169BA4] mb-1 uppercase tracking-tight">{pkg.name}</h3>
                <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="h-px w-3 bg-gray-200" />
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">{pkg.credits.toLocaleString()} Credits</p>
                    <span className="h-px w-3 bg-gray-200" />
                </div>

                <div className="flex items-baseline justify-center">
                    <span className="text-2xl font-bold text-gray-900 mr-1">₹</span>
                    <span className="text-5xl font-black text-gray-900 tracking-tighter">
                        {pkg.price.toLocaleString()}
                    </span>
                </div>
                <div className="mt-2 flex flex-col items-center">
                    <p className="text-xs font-bold text-[#169BA4]">₹{pricePerCredit} / credit</p>
                    <p className="text-[9px] font-medium text-gray-400 uppercase mt-0.5">One-time payment</p>
                </div>
            </div>


            {/* Divider Decoration */}
            <div className="px-8 mb-6">
                <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: isPopular ? '100%' : '60%' }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            isPopular ? "bg-gradient-to-r from-[#169BA4] via-[#169BA4] to-[#233F64]" : "bg-gray-200"
                        )}
                    />
                </div>
            </div>

            {/* Body Section */}
            <div className="flex-1 px-8 pb-8">
                <ul className="space-y-4">
                    {features.map((feature, i) => (
                        <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-3 group/item cursor-default"
                        >
                            <div className={cn(
                                "flex-shrink-0 p-0.5 rounded-full transition-all duration-300 group-hover/item:scale-110 group-hover/item:bg-[#169BA4]/20",
                                isPopular ? "bg-[#169BA4]/10 text-[#169BA4]" : "bg-gray-100 text-gray-400"
                            )}>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[14px] text-gray-600 font-semibold group-hover/item:text-gray-900 transition-colors">
                                {feature}
                            </span>
                        </motion.li>
                    ))}
                </ul>
            </div>

            {/* Action Section */}
            <div className="p-8 pt-0 mt-auto">
                <Button
                    onClick={() => onPurchase(pkg)}
                    disabled={isDisabled}
                    className={cn(
                        "w-full h-14 rounded-[1.2rem] font-black text-base transition-all duration-500 shadow-xl relative overflow-hidden group/btn",
                        "bg-white text-[#233F64] border-2 border-[#233F64]/10 hover:border-[#169BA4] hover:text-white"
                    )}
                >
                    <div className="absolute inset-0 bg-[#169BA4] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />

                    <div className="relative z-10 flex items-center justify-center gap-2">
                        {isLoading ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <ShoppingCart className="w-4 h-4 transition-transform duration-300 group-hover/btn:scale-110" />
                                <span>Get Started</span>
                            </>
                        )}
                    </div>
                </Button>
                <p className="text-center text-[9px] text-gray-400 font-bold uppercase mt-3 tracking-widest">Secure Checkout (SSL)</p>
            </div>

        </motion.div>
    )
}

export default PackageCard
