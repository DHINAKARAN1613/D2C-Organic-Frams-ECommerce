'use client';

import { useState } from 'react';
import { BadgeCheck, Loader2, X, Clock, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export function VerifyFarmerButton({ user }: { user: any }) {
    const router = useRouter();
    const [status, setStatus] = useState(user.kycStatus);
    const [isVerified, setIsVerified] = useState(user.isVerifiedFarmer);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    async function handleAction(action: 'APPROVE' | 'REJECT') {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/farmers/${user.id}/verify`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }),
            });
            if (res.ok) {
                const data = await res.json();
                setStatus(data.user.kycStatus);
                setIsVerified(data.user.isVerifiedFarmer);
                setIsModalOpen(false);
                router.refresh();
            }
        } finally {
            setLoading(false);
        }
    }

    if (status === 'VERIFIED') {
        return (
            <button
                disabled
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-amber-500/10 text-amber-400 border border-amber-500/30"
            >
                <BadgeCheck className="w-3 h-3" /> Verified
            </button>
        );
    }

    if (status === 'PENDING') {
        return (
            <>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)] animate-pulse"
                >
                    <Clock className="w-3 h-3" /> Review KYC
                </button>

                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-[#1c2e24] border border-[#2d4035] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                            >
                                <div className="p-6 border-b border-[#2d4035] flex items-center justify-between shrink-0">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-blue-400" /> Review KYC Submission
                                    </h3>
                                    <button onClick={() => setIsModalOpen(false)} className="text-[#9db8a8] hover:text-white transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="p-6 overflow-y-auto space-y-6">
                                    <div className="flex gap-4 items-center">
                                        <div className="size-12 rounded-full overflow-hidden bg-black shrink-0">
                                            <img src={user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-lg">{user.name}</p>
                                            <p className="text-sm text-[#9db8a8]">{user.email}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-[#9db8a8] uppercase mb-1">Aadhar Number</label>
                                        <div className="bg-[#112117] border border-[#2d4035] p-3 rounded-lg text-white font-mono tracking-widest text-lg">
                                            {user.aadharNumber || 'N/A'}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-[#9db8a8] uppercase mb-1">Farm Address</label>
                                        <div className="bg-[#112117] border border-[#2d4035] p-3 rounded-lg text-white">
                                            {user.farmAddress || 'N/A'}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-[#9db8a8] uppercase mb-1">Aadhar Card Image</label>
                                        <div className="bg-[#112117] border border-[#2d4035] p-2 rounded-lg flex justify-center">
                                            {user.aadharImage ? (
                                                <img src={user.aadharImage} alt="Aadhar Card" className="max-h-64 object-contain rounded" />
                                            ) : (
                                                <p className="text-[#9db8a8] py-8">No image provided.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 border-t border-[#2d4035] flex justify-end gap-3 shrink-0">
                                    <button 
                                        onClick={() => handleAction('REJECT')} 
                                        disabled={loading}
                                        className="px-6 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 font-bold transition-colors disabled:opacity-50"
                                    >
                                        Reject
                                    </button>
                                    <button 
                                        onClick={() => handleAction('APPROVE')} 
                                        disabled={loading}
                                        className="px-6 py-2 rounded-lg bg-[#30e87a] text-[#112117] hover:bg-[#2bd970] font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                        Approve & Verify
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </>
        );
    }

    // Default state: UNVERIFIED or REJECTED. Admin can still manually force verify if needed, 
    // or just show that they haven't submitted KYC.
    return (
        <button
            disabled
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-gray-500/10 text-gray-400 border border-gray-500/30 opacity-50 cursor-not-allowed"
            title="Waiting for farmer to submit KYC"
        >
            <BadgeCheck className="w-3 h-3" /> Unverified
        </button>
    );
}
