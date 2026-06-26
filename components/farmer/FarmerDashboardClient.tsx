'use client';

import { Package, TrendingUp } from 'lucide-react';
import WeatherWidget from '@/components/farmer/WeatherWidget';
import { useLanguage } from '@/context/LanguageContext';

interface FarmerDashboardClientProps {
    userName: string;
    productsCount: number;
}

export default function FarmerDashboardClient({ userName, productsCount }: FarmerDashboardClientProps) {
    const { t } = useLanguage();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-foreground tracking-tight">{t.welcomeBack}, {userName}!</h2>
                <p className="text-muted-foreground font-medium">{t.farmOverview}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-surface p-6 rounded-2xl border border-border shadow-md">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                            <Package className="w-6 h-6 text-blue-500" />
                        </div>
                    </div>
                    <p className="text-muted-foreground text-sm font-semibold mb-1">{t.yourProducts}</p>
                    <h3 className="text-3xl font-black text-foreground">{productsCount}</h3>
                </div>

                <div className="bg-surface p-6 rounded-2xl border border-border shadow-md">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-500/10 rounded-xl">
                            <TrendingUp className="w-6 h-6 text-green-500" />
                        </div>
                    </div>
                    <p className="text-muted-foreground text-sm font-semibold mb-1">{t.totalSales}</p>
                    <h3 className="text-3xl font-black text-foreground">₹0</h3>
                    <p className="text-xs font-medium text-muted-foreground mt-1">{t.featureComingSoon}</p>
                </div>
            </div>

            {/* Weather & Tools Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2">
                    <WeatherWidget />
                </div>
            </div>
        </div>
    );
}
