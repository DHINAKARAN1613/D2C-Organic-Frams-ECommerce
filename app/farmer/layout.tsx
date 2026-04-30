import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import FarmerLayoutClient from '@/components/farmer/FarmerLayoutClient';

export default async function FarmerLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'FARMER') {
        redirect('/auth/signin');
    }

    return <FarmerLayoutClient>{children}</FarmerLayoutClient>;
}
