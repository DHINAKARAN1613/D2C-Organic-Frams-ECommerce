import { Settings } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="border-b border-[#2d4035] pb-6">
                <h2 className="text-3xl font-bold text-white">Settings</h2>
                <p className="text-[#9db8a8]">Manage store configuration and preferences.</p>
            </div>

            <div className="bg-[#1c2e24] border border-[#2d4035] rounded-2xl p-8 space-y-8 opacity-50 pointer-events-none">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-white">General Settings</h3>
                            <p className="text-sm text-[#9db8a8]">Store name, email, and currency</p>
                        </div>
                        <div className="h-6 w-12 bg-[#2d4035] rounded-full relative">
                            <div className="absolute top-1 left-1 size-4 bg-[#5c6e63] rounded-full"></div>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-white">Notifications</h3>
                            <p className="text-sm text-[#9db8a8]">Email alerts for new orders</p>
                        </div>
                        <div className="h-6 w-12 bg-[#30e87a] rounded-full relative">
                            <div className="absolute top-1 right-1 size-4 bg-[#112117] rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
            <p className="text-center text-sm text-[#5c6e63]">Settings module is under development.</p>
        </div>
    );
}
