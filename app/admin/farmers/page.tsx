import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import FarmersClient from './FarmersClient';
// Force TS to re-evaluate this file

export const metadata = {
    title: 'Farmer KYC Management | Admin | Yogam Organic Farms',
};

export default async function AdminFarmersPage() {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== 'ADMIN') {
        redirect('/');
    }

    // Fetch users who have started or completed KYC
    const farmers = await prisma.user.findMany({
        where: {
            kycStatus: {
                not: 'UNVERIFIED'
            }
        },
        orderBy: {
            updatedAt: 'desc'
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            kycStatus: true,
            isVerifiedFarmer: true,
            aadharNumber: true,
            aadharImage: true,
            farmAddress: true,
            organicCertificate: true,
            farmVideo: true,
            createdAt: true
        }
    });

    return (
        <div className="flex-1 overflow-y-auto bg-background min-h-screen">
            <div className="p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-foreground tracking-tight">Farmer KYC Applications</h1>
                        <p className="text-muted-foreground mt-1">Review organic certificates, videos, and approve farmer accounts.</p>
                    </div>
                </div>

                <FarmersClient initialFarmers={farmers} />
            </div>
        </div>
    );
}
