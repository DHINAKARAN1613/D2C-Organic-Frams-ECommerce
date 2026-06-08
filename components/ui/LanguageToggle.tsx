'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Languages } from 'lucide-react';
import { motion } from 'framer-motion';

export function LanguageToggle() {
    const { language, setLanguage, t } = useLanguage();

    const toggleLanguage = (e: React.MouseEvent) => {
        e.preventDefault();
        setLanguage(language === 'en' ? 'ta' : 'en');
    };

    return (
        <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background border border-border hover:bg-primary/10 hover:border-primary/50 transition-all cursor-pointer group z-50 relative shadow-sm"
            title={t.language}
        >
            <Languages className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <div className="flex font-bold text-xs items-center">
                <span className={`${language === 'en' ? 'text-primary drop-shadow-sm scale-110' : 'text-muted-foreground'} transition-all`}>EN</span>
                <span className="mx-1 text-muted-foreground/30">/</span>
                <span className={`${language === 'ta' ? 'text-[#ff7a00] drop-shadow-sm scale-110' : 'text-muted-foreground'} transition-all`}>TA</span>
            </div>
        </button>
    );
}
