import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';

import prisma from '@/lib/prisma';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/auth/signin');
    }

    const lowStockCount = await prisma.product.count({
        where: { stock: { lt: 10 } }
    });

    return <AdminLayoutClient lowStockCount={lowStockCount}>{children}</AdminLayoutClient>;
}
