'use client';

import { useState } from 'react';
import { BadgeCheck, Loader2, X } from 'lucide-react';

export function VerifyFarmerButton({ userId, isVerified }: { userId: string; isVerified: boolean }) {
    const [verified, setVerified] = useState(isVerified);
    const [loading, setLoading] = useState(false);

    async function toggle() {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/farmers/${userId}/verify`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ verified: !verified }),
            });
            if (res.ok) setVerified(v => !v);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={toggle}
            disabled={loading}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${
                verified
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30'
                    : 'bg-[#30e87a]/10 text-[#30e87a] border border-[#30e87a]/30 hover:bg-[#30e87a]/20'
            }`}
        >
            {loading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
            ) : verified ? (
                <><BadgeCheck className="w-3 h-3" /> Verified</>
            ) : (
                <><BadgeCheck className="w-3 h-3" /> Verify</>
            )}
        </button>
    );
}
