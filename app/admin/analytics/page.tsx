import { BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
            <div className="size-20 rounded-2xl bg-[#1c2e24] border border-[#2d4035] flex items-center justify-center shadow-2xl">
                <BarChart3 className="w-10 h-10 text-[#30e87a]" />
            </div>
            <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">Analytics Coming Soon</h2>
                <p className="text-[#9db8a8] max-w-md">
                    We are building advanced reporting tools to help you track your farm's performance in real-time.
                </p>
            </div>
        </div>
    );
}
