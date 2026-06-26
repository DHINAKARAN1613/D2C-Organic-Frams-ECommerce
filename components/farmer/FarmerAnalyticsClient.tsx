'use client';

import { IndianRupee, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import PriceChart from '@/components/farmer/PriceChart';
import { useLanguage } from '@/context/LanguageContext';

interface FarmerAnalyticsClientProps {
    totalEarnings: number;
    totalItemsSold: number;
    activeProducts: number;
    attentionNeeded: number;
    chartData: any[];
    maxSalesValue: number;
    totalProductsCount: number;
    lowStockProducts: number;
    outOfStockProducts: number;
}

export default function FarmerAnalyticsClient({
    totalEarnings,
    totalItemsSold,
    activeProducts,
    attentionNeeded,
    chartData,
    maxSalesValue,
    totalProductsCount,
    lowStockProducts,
    outOfStockProducts
}: FarmerAnalyticsClientProps) {
    const { t } = useLanguage();

    const metrics = [
        { title: t.totalEarnings, value: `₹${totalEarnings.toFixed(2)}`, icon: IndianRupee, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
        { title: t.itemsSold, value: totalItemsSold, icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
        { title: t.activeProductsCount, value: activeProducts, icon: Package, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
        { title: t.attentionNeeded, value: attentionNeeded, icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
    ];

    return (
        <div className="space-y-8">
            <div className="border-b border-border pb-6">
                <h1 className="text-3xl font-bold text-foreground tracking-tight">{t.farmAnalytics}</h1>
                <p className="text-muted-foreground font-medium mt-1">{t.trackSalesDesc}</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, i) => (
                    <div key={i} className="bg-surface border border-border rounded-2xl p-6 relative overflow-hidden group hover:border-primary/50 transition-colors shadow-md">
                        <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl ${metric.bg} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className={`p-3 rounded-xl ${metric.bg} ${metric.border} border`}>
                                <metric.icon className={`w-6 h-6 ${metric.color}`} />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold text-foreground tracking-tight">{metric.value}</h3>
                            <p className="text-muted-foreground font-semibold text-sm mt-1">{metric.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Earnings Chart */}
                <div className="lg:col-span-2 bg-surface border border-border rounded-2xl p-6 md:p-8 flex flex-col shadow-md">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-foreground">{t.earningsLast7Days}</h3>
                            <p className="text-sm font-medium text-muted-foreground">{t.dailyProgression}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-primary">
                                ₹{chartData.reduce((acc, curr) => acc + curr.value, 0).toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-extrabold">{t.weeklyTotal}</p>
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="flex-1 flex items-end gap-2 sm:gap-4 mt-auto min-h-[250px] relative">
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                            {[4, 3, 2, 1, 0].map(i => (
                                <div key={i} className="w-full border-t border-muted-foreground border-dashed"></div>
                            ))}
                        </div>

                        {chartData.map((data, i) => {
                            const heightPercentage = Math.max((data.value / maxSalesValue) * 100, 4);
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-3 relative z-10 group">
                                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-xs py-1 px-2 rounded whitespace-nowrap shadow-xl pointer-events-none font-bold">
                                        ₹{data.value.toFixed(2)}
                                    </div>
                                    <div className="w-full bg-muted rounded-t-lg relative overflow-hidden h-full flex items-end">
                                        <div 
                                            className="w-full bg-primary rounded-t-lg transition-all duration-1000 ease-out"
                                            style={{ height: `${heightPercentage}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-muted-foreground font-semibold">{data.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Inventory Health */}
                <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col shadow-md">
                    <h3 className="text-xl font-bold text-foreground mb-6">{t.inventoryHealth}</h3>
                    
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-2 font-semibold">
                                <span className="text-muted-foreground">{t.activeHealthy}</span>
                                <span className="text-emerald-500 font-bold">{activeProducts}</span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(activeProducts / Math.max(totalProductsCount, 1)) * 100}%` }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-2 font-semibold">
                                <span className="text-muted-foreground">{t.lowStock}</span>
                                <span className="text-orange-500 font-bold">{lowStockProducts}</span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500 rounded-full" style={{ width: `${(lowStockProducts / Math.max(totalProductsCount, 1)) * 100}%` }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-2 font-semibold">
                                <span className="text-muted-foreground">{t.outOfStock}</span>
                                <span className="text-red-500 font-bold">{outOfStockProducts}</span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-red-500 rounded-full" style={{ width: `${(outOfStockProducts / Math.max(totalProductsCount, 1)) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-6">
                        <Link href="/farmer/products" className="w-full block text-center bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-border rounded-xl py-3 text-sm font-bold transition-colors">
                            {t.manageInventory}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <PriceChart />
            </div>
        </div>
    );
}
