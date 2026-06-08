import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { User, ShieldCheck, Mail, Calendar, Key, UserCircle } from 'lucide-react';

export const metadata = {
    title: 'Admin Profile | Yogam Organic Farms',
};

export default async function AdminProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/auth/signin');
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (!user) {
        redirect('/auth/signin');
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="border-b border-[#2d4035] pb-6">
                <h2 className="text-3xl font-bold text-white">Admin Profile</h2>
                <p className="text-[#9db8a8]">Manage your personal information and security settings.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-[#1c2e24] border border-[#2d4035] rounded-2xl p-6 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-24 bg-[#30e87a]/10"></div>
                        <div className="relative mx-auto size-24 rounded-full bg-[#112117] border-4 border-[#1c2e24] flex items-center justify-center overflow-hidden mb-4 mt-6 z-10 shadow-xl">
                            {user.image ? (
                                <img src={user.image} alt={user.name || "Admin"} className="w-full h-full object-cover" />
                            ) : (
                                <UserCircle className="w-12 h-12 text-[#9db8a8]" />
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-white">{user.name || 'Admin User'}</h3>
                        <p className="text-sm text-[#30e87a] font-medium tracking-wide uppercase mt-1 flex items-center justify-center gap-1">
                            <ShieldCheck className="w-4 h-4" />
                            {user.role}
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-[#1c2e24] border border-[#2d4035] rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-3 text-[#9db8a8]">
                            <Mail className="w-5 h-5 text-[#5c7a68]" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-[#5c7a68] uppercase tracking-wider font-semibold">Email</p>
                                <p className="text-sm text-white truncate">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-[#9db8a8]">
                            <Calendar className="w-5 h-5 text-[#5c7a68]" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-[#5c7a68] uppercase tracking-wider font-semibold">Joined</p>
                                <p className="text-sm text-white">{new Date(user.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-[#9db8a8]">
                            <Key className="w-5 h-5 text-[#5c7a68]" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-[#5c7a68] uppercase tracking-wider font-semibold">Authentication</p>
                                <p className="text-sm text-white">{user.password ? 'Credentials' : 'OAuth / Google'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="md:col-span-2">
                    <div className="bg-[#1c2e24] border border-[#2d4035] rounded-2xl p-6 md:p-8">
                        <h3 className="text-xl font-bold text-white mb-6">Personal Information</h3>
                        
                        <form className="space-y-6 relative">
                            {/* Disabled overlay for demo */}
                            <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-[1px] bg-[#112117]/20 rounded-xl">
                                <div className="bg-[#112117] border border-[#2d4035] px-4 py-2 rounded-lg text-sm text-[#30e87a] font-medium shadow-xl">
                                    Editing disabled in demo mode
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#9db8a8]">Full Name</label>
                                    <input 
                                        type="text" 
                                        disabled
                                        defaultValue={user.name || ''} 
                                        className="w-full bg-[#112117] border border-[#2d4035] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#30e87a] transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#9db8a8]">Email Address</label>
                                    <input 
                                        type="email" 
                                        disabled
                                        defaultValue={user.email || ''} 
                                        className="w-full bg-[#112117]/50 border border-[#2d4035] rounded-xl px-4 py-3 text-[#9db8a8] cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#9db8a8]">Profile Image URL</label>
                                <input 
                                    type="text" 
                                    disabled
                                    defaultValue={user.image || ''} 
                                    className="w-full bg-[#112117] border border-[#2d4035] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#30e87a] transition-colors"
                                />
                                <p className="text-xs text-[#5c7a68] mt-1">Provide a valid image URL (e.g., from DiceBear or Cloudinary).</p>
                            </div>

                            <div className="pt-4 border-t border-[#2d4035] flex justify-end">
                                <button type="button" disabled className="px-6 py-2.5 bg-[#30e87a] text-[#112117] font-bold rounded-xl opacity-50 cursor-not-allowed">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
