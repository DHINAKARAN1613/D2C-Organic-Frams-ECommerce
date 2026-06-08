import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ShieldCheck, Clock, XCircle } from 'lucide-react';
import KYCForm from './KYCForm';
import OTPVerification from './OTPVerification';

export const metadata = {
    title: 'Verification | Yogam Organic Farms',
};

export default async function FarmerKYCPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { kycStatus: true, aadharNumber: true, isVerifiedFarmer: true, email: true, phone: true, emailVerified: true, phoneVerified: true }
    });

    if (!user) return null;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">Identity Verification</h1>
                <p className="text-[#9db8a8] mt-2">Submit your KYC documents to start selling on Yogam Organic Farms.</p>
            </div>

            {user.kycStatus === 'VERIFIED' || user.isVerifiedFarmer ? (
                <div className="bg-[#30e87a]/10 border border-[#30e87a]/30 rounded-2xl p-8 text-center flex flex-col items-center">
                    <div className="size-16 bg-[#30e87a]/20 rounded-full flex items-center justify-center mb-4">
                        <ShieldCheck className="w-8 h-8 text-[#30e87a]" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">You are Verified!</h2>
                    <p className="text-[#9db8a8]">Your identity has been successfully verified. You have full access to add and manage products.</p>
                </div>
            ) : user.kycStatus === 'PENDING' ? (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-8 text-center flex flex-col items-center">
                    <div className="size-16 bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
                        <Clock className="w-8 h-8 text-amber-500" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Verification Pending</h2>
                    <p className="text-[#9db8a8]">Your documents have been submitted and are currently under review by our team. This usually takes 24-48 hours.</p>
                </div>
            ) : (
                <div className="bg-[#1c2e24] border border-[#2d4035] rounded-2xl p-6 md:p-8">
                    {user.kycStatus === 'REJECTED' && (
                        <div className="mb-8 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-red-400 font-bold">Verification Rejected</h3>
                                <p className="text-sm text-red-400/80 mt-1">Your previous submission was rejected. Please ensure the documents are clear and the details match exactly.</p>
                            </div>
                        </div>
                    )}
                    
                    {(!user.emailVerified || !user.phoneVerified) ? (
                        <>
                            <h2 className="text-xl font-bold text-white mb-6">Step 1: Contact Verification</h2>
                            <OTPVerification user={user} />
                        </>
                    ) : (
                        <>
                            <h2 className="text-xl font-bold text-white mb-6">Step 2: Submit Documents</h2>
                            <KYCForm />
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
