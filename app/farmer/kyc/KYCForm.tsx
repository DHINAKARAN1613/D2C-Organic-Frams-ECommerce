'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Upload, ShieldCheck } from 'lucide-react';

export default function KYCForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const aadharNumber = formData.get('aadharNumber') as string;
        const aadharImage = formData.get('aadharImage') as string;
        const farmAddress = formData.get('farmAddress') as string;
        const organicCertificate = formData.get('organicCertificate') as string;
        const farmVideo = formData.get('farmVideo') as string;

        try {
            const res = await fetch('/api/farmer/kyc', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ aadharNumber, aadharImage, farmAddress, organicCertificate, farmVideo })
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Failed to submit KYC');
            }

            router.refresh();
        } catch (err: any) {
            setError(err.message);
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-xs font-semibold text-[#9db8a8] uppercase mb-1">Aadhar Number</label>
                <input
                    name="aadharNumber"
                    required
                    pattern="\d{12}"
                    maxLength={12}
                    title="12 digit Aadhar Number"
                    className="w-full bg-[#112117] border border-[#2d4035] rounded-lg p-3 text-white focus:outline-none focus:border-[#30e87a]"
                    placeholder="xxxx xxxx xxxx"
                />
            </div>

            <div>
                <label className="block text-xs font-semibold text-[#9db8a8] uppercase mb-1">Upload Aadhar Card Image</label>
                <div className="space-y-3">
                    <input
                        type="file"
                        accept="image/*"
                        required
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            setIsLoading(true);
                            const formData = new FormData();
                            formData.append('file', file);

                            try {
                                const res = await fetch('/api/upload', { method: 'POST', body: formData });
                                const data = await res.json();
                                if (data.success) {
                                    const input = document.getElementsByName('aadharImage')[0] as HTMLInputElement;
                                    if (input) input.value = data.url;
                                } else {
                                    setError('Failed to upload image');
                                }
                            } catch (err) {
                                setError('Failed to upload image');
                            } finally {
                                setIsLoading(false);
                            }
                        }}
                        className="block w-full text-sm text-[#9db8a8] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#30e87a]/10 file:text-[#30e87a] hover:file:bg-[#30e87a]/20"
                    />
                    <input
                        name="aadharImage"
                        required
                        readOnly
                        className="w-full bg-[#112117] border border-[#2d4035] rounded-lg p-3 text-[#9db8a8] focus:outline-none text-sm"
                        placeholder="Image URL will appear here after upload"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-[#9db8a8] uppercase mb-1">Farm / Operating Address</label>
                <textarea
                    name="farmAddress"
                    required
                    rows={3}
                    className="w-full bg-[#112117] border border-[#2d4035] rounded-lg p-3 text-white focus:outline-none focus:border-[#30e87a] resize-none"
                    placeholder="Enter the full address of your farm"
                />
            </div>

            <div>
                <label className="block text-xs font-semibold text-[#9db8a8] uppercase mb-1">Organic Certificate (NPOP/PGS-India)</label>
                <div className="space-y-3">
                    <input
                        type="file"
                        accept="image/*,application/pdf"
                        required
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            setIsLoading(true);
                            const formData = new FormData();
                            formData.append('file', file);

                            try {
                                const res = await fetch('/api/upload', { method: 'POST', body: formData });
                                const data = await res.json();
                                if (data.success) {
                                    const input = document.getElementsByName('organicCertificate')[0] as HTMLInputElement;
                                    if (input) input.value = data.url;
                                } else {
                                    setError('Failed to upload certificate');
                                }
                            } catch (err) {
                                setError('Failed to upload certificate');
                            } finally {
                                setIsLoading(false);
                            }
                        }}
                        className="block w-full text-sm text-[#9db8a8] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#30e87a]/10 file:text-[#30e87a] hover:file:bg-[#30e87a]/20"
                    />
                    <input
                        name="organicCertificate"
                        required
                        readOnly
                        className="w-full bg-[#112117] border border-[#2d4035] rounded-lg p-3 text-[#9db8a8] focus:outline-none text-sm"
                        placeholder="Certificate URL will appear here after upload"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-[#9db8a8] uppercase mb-1">Geo-Tagged Farm Walkthrough Video</label>
                <div className="space-y-3">
                    <input
                        type="file"
                        accept="video/*"
                        capture="environment"
                        required
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            setIsLoading(true);
                            const formData = new FormData();
                            formData.append('file', file);

                            try {
                                const res = await fetch('/api/upload', { method: 'POST', body: formData });
                                const data = await res.json();
                                if (data.success) {
                                    const input = document.getElementsByName('farmVideo')[0] as HTMLInputElement;
                                    if (input) input.value = data.url;
                                } else {
                                    setError('Failed to upload video');
                                }
                            } catch (err) {
                                setError('Failed to upload video');
                            } finally {
                                setIsLoading(false);
                            }
                        }}
                        className="block w-full text-sm text-[#9db8a8] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#30e87a]/10 file:text-[#30e87a] hover:file:bg-[#30e87a]/20"
                    />
                    <input
                        name="farmVideo"
                        required
                        readOnly
                        className="w-full bg-[#112117] border border-[#2d4035] rounded-lg p-3 text-[#9db8a8] focus:outline-none text-sm"
                        placeholder="Video URL will appear here after upload"
                    />
                    <p className="text-xs text-[#9db8a8]">Please capture a live, uncut 1-2 minute video of your farm and fertilizer storage.</p>
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg bg-[#30e87a] text-[#112117] font-bold hover:bg-[#2bd970] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#30e87a]/20"
            >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                Submit for Verification
            </button>
        </form>
    );
}
