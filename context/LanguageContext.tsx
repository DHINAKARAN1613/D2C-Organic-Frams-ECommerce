'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { en, Translations } from '@/translations/en';
import { ta } from '@/translations/ta';

type Language = 'en' | 'ta';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const dictionaries = {
    en,
    ta
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Load language from localStorage if it exists
        const savedLang = localStorage.getItem('yogam_lang') as Language;
        if (savedLang && (savedLang === 'en' || savedLang === 'ta')) {
            setLanguageState(savedLang);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('yogam_lang', lang);
    };

    // Before mounting, we default to English to match server render.
    // However, if the toggle relies on 'language', we should still provide it.
    // The safest way to avoid hydration mismatch is to not render children until mounted,
    // or just let it mismatch and fix it. Let's just return children.
    const t = dictionaries[language];

    // If we want to strictly prevent hydration errors on language switch, we could return null until mounted,
    // but that breaks SEO. We'll just let it hydrate with 'en' and switch to 'ta' immediately.
    
    return (
        <LanguageContext.Provider value={{ language: mounted ? language : 'en', setLanguage, t: mounted ? t : dictionaries.en }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
