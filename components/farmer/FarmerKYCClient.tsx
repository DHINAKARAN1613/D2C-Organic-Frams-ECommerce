'use client';

import { ShieldCheck, Clock, XCircle, TrendingUp } from 'lucide-react';
import KYCForm from '@/app/farmer/kyc/KYCForm';
import OTPVerification from '@/app/farmer/kyc/OTPVerification';
import { useLanguage } from '@/context/LanguageContext';

interface FarmerKYCClientProps {
    user: any;
    successRate: number;
}

export default function FarmerKYCClient({ user, successRate }: FarmerKYCClientProps) {
    const { t } = useLanguage();

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground tracking-tight">{t.identityVerification}</h1>
                <p className="text-muted-foreground font-medium mt-2">{t.submitKycDesc}</p>
            </div>

            {user.kycStatus === 'VERIFIED' || user.isVerifiedFarmer ? (
                <div className="bg-primary/10 border border-primary/30 rounded-2xl p-8 text-center flex flex-col items-center shadow-sm">
                    <div className="size-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 shadow-md">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">{t.youAreVerified}</h2>
                    <p className="text-muted-foreground font-medium max-w-md mx-auto mb-6">{t.verifiedDesc}</p>
                    
                    <div className="bg-surface border border-border rounded-xl p-4 flex flex-col items-center min-w-[250px] shadow-sm">
                        <div className="flex items-center gap-2 text-primary mb-1 font-bold">
                            <TrendingUp className="w-5 h-5" />
                            <span className="text-lg">{successRate}% {t.successRate}</span>
                        </div>
                        <p className="text-xs font-semibold text-muted-foreground">{t.visibleToBuyers}</p>
                    </div>
                </div>
            ) : user.kycStatus === 'PENDING' ? (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-8 text-center flex flex-col items-center shadow-sm">
                    <div className="size-16 bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
                        <Clock className="w-8 h-8 text-amber-500" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2">{t.verificationPendingTitle}</h2>
                    <p className="text-muted-foreground font-medium">{t.verificationPendingDesc}</p>
                </div>
            ) : (
                <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-md">
                    {user.kycStatus === 'REJECTED' && (
                        <div className="mb-8 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-red-500 font-bold">{t.verificationRejectedTitle}</h3>
                                <p className="text-sm text-red-500/80 mt-1 font-medium">{t.verificationRejectedDesc}</p>
                            </div>
                        </div>
                    )}
                    
                    <div className="flex items-center mb-8 relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full z-0 overflow-hidden">
                            <div className={`h-full bg-primary transition-all duration-500 ${(user.emailVerified && user.phoneVerified) ? 'w-full' : 'w-1/2'}`} />
                        </div>
                        <div className="flex justify-between w-full relative z-10">
                            <div className="flex flex-col items-center gap-2">
                                <div className="size-10 rounded-full flex items-center justify-center font-bold text-sm border-4 border-surface bg-primary text-primary-foreground shadow-sm">
                                    {(user.emailVerified && user.phoneVerified) ? <ShieldCheck className="w-5 h-5" /> : '1'}
                                </div>
                                <span className={`text-xs font-bold ${(user.emailVerified && user.phoneVerified) ? 'text-primary' : 'text-foreground'}`}>{t.stepContact}</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className={`size-10 rounded-full flex items-center justify-center font-bold text-sm border-4 border-surface transition-colors shadow-sm ${(user.emailVerified && user.phoneVerified) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                    2
                                </div>
                                <span className={`text-xs font-bold ${(user.emailVerified && user.phoneVerified) ? 'text-foreground' : 'text-muted-foreground'}`}>{t.stepDocuments}</span>
                            </div>
                        </div>
                    </div>

                    {(!user.emailVerified || !user.phoneVerified) ? (
                        <OTPVerification user={user} />
                    ) : (
                        <KYCForm />
                    )}
                </div>
            )}
        </div>
    );
}
