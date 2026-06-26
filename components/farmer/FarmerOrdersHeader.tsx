'use client';

import { useLanguage } from '@/context/LanguageContext';

export function FarmerOrdersHeader() {
    const { t } = useLanguage();

    return (
        <div className="border-b border-[#2d4035] pb-6">
            <h1 className="text-3xl font-bold text-white tracking-tight">{t.incomingOrders}</h1>
            <p className="text-[#9db8a8] mt-1">{t.manageOrdersDesc}</p>
        </div>
    );
}
