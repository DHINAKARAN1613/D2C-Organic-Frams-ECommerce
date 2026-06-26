import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ShieldCheck, Clock, XCircle, TrendingUp } from 'lucide-react';
import KYCForm from './KYCForm';
import OTPVerification from './OTPVerification';
import FarmerKYCClient from '@/components/farmer/FarmerKYCClient';

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

    const successRate = user.isVerifiedFarmer ? 99 : (user.kycStatus === 'VERIFIED' ? 95 : 85);

    return <FarmerKYCClient user={user} successRate={successRate} />;
}
