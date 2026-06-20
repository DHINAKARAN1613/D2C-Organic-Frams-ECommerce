'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Mail, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function OTPVerification({ user }: { user: any }) {
    const router = useRouter();
    const { success, error: toastError } = useToast();
    
    const [emailStatus, setEmailStatus] = useState<'IDLE' | 'SENDING' | 'SENT' | 'VERIFYING'>(user.emailVerified ? 'IDLE' : 'IDLE');
    const [phoneStatus, setPhoneStatus] = useState<'IDLE' | 'SENDING' | 'SENT' | 'VERIFYING'>(user.phoneVerified ? 'IDLE' : 'IDLE');
    
    const [emailCode, setEmailCode] = useState('');
    const [phoneCode, setPhoneCode] = useState('');
    
    const [inputPhone, setInputPhone] = useState(user.phone || '');
    const [isSavingPhone, setIsSavingPhone] = useState(false);

    const [error, setError] = useState('');

    async function handleSavePhone() {
        if (!inputPhone) return;
        setIsSavingPhone(true);
        setError('');
        try {
            const res = await fetch('/api/profile/phone', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: inputPhone })
            });
            if (!res.ok) throw new Error('Failed to save phone number');
            router.refresh(); // Will update the user object passed as prop
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSavingPhone(false);
        }
    }

    async function handleSendOTP(type: 'EMAIL' | 'PHONE') {
        const setStatus = type === 'EMAIL' ? setEmailStatus : setPhoneStatus;
        setStatus('SENDING');
        setError('');
        try {
            const res = await fetch('/api/otp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type })
            });
            if (!res.ok) throw new Error(await res.text());
            
            const data = await res.json();
            setStatus('SENT');
            
            if (data.devCode) {
                if (type === 'EMAIL') setEmailCode(data.devCode);
                else setPhoneCode(data.devCode);
                success(`[DEV MODE] OTP Auto-filled: ${data.devCode}`);
            } else {
                success('OTP Sent! Check the server terminal to see the simulated dispatch.');
            }
        } catch (err: any) {
            setError(err.message);
            setStatus('IDLE');
        }
    }

    async function handleVerifyOTP(type: 'EMAIL' | 'PHONE') {
        const code = type === 'EMAIL' ? emailCode : phoneCode;
        const setStatus = type === 'EMAIL' ? setEmailStatus : setPhoneStatus;
        
        if (!code || code.length !== 6) {
            setError('Please enter a 6-digit code');
            return;
        }

        setStatus('VERIFYING');
        setError('');
        
        try {
            const res = await fetch('/api/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, code })
            });
            if (!res.ok) throw new Error(await res.text());
            
            setStatus('IDLE'); // Reset status
            router.refresh(); // This will trigger the parent server component to re-fetch emailVerified/phoneVerified
        } catch (err: any) {
            setError(err.message);
            setStatus('SENT'); // Go back to sent state so they can try typing again
        }
    }

    return (
        <div className="space-y-6">
            <div className="bg-blue-500/10 border border-blue-500/30 text-blue-400 p-4 rounded-xl text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>To ensure platform security, you must verify both your Email and Phone Number before you can submit your Aadhar documents.</p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* EMAIL VERIFICATION SECTION */}
            <div className="bg-[#112117] border border-[#2d4035] p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#1c2e24] rounded-lg">
                        <Mail className="w-5 h-5 text-[#9db8a8]" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">Email Address</p>
                        <p className="text-xs text-[#9db8a8]">{user.email}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {user.emailVerified ? (
                        <div className="flex items-center gap-2 text-[#30e87a] text-sm font-bold bg-[#30e87a]/10 px-3 py-1.5 rounded-lg border border-[#30e87a]/20">
                            <CheckCircle2 className="w-4 h-4" /> Verified
                        </div>
                    ) : emailStatus === 'SENT' ? (
                        <div className="flex gap-2 w-full md:w-auto">
                            <input 
                                value={emailCode}
                                onChange={e => setEmailCode(e.target.value)}
                                placeholder="6-digit code"
                                maxLength={6}
                                className="w-32 bg-[#1c2e24] border border-[#2d4035] rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#30e87a]"
                            />
                            <button 
                                onClick={() => handleVerifyOTP('EMAIL')}
                                className="bg-[#30e87a] text-[#112117] px-4 py-1.5 rounded-lg font-bold text-sm hover:bg-[#2bd970] transition-colors whitespace-nowrap"
                            >
                                Verify
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => handleSendOTP('EMAIL')}
                            disabled={emailStatus === 'SENDING' || emailStatus === 'VERIFYING'}
                            className="bg-[#1c2e24] text-white border border-[#2d4035] px-4 py-1.5 rounded-lg font-bold text-sm hover:bg-[#2d4035] transition-colors flex items-center gap-2 w-full md:w-auto justify-center"
                        >
                            {emailStatus === 'SENDING' && <Loader2 className="w-3 h-3 animate-spin" />}
                            Send OTP
                        </button>
                    )}
                </div>
            </div>

            {/* PHONE VERIFICATION SECTION */}
            <div className="bg-[#112117] border border-[#2d4035] p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#1c2e24] rounded-lg">
                        <Phone className="w-5 h-5 text-[#9db8a8]" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">Phone Number</p>
                        {user.phone ? (
                            <p className="text-xs text-[#9db8a8]">{user.phone}</p>
                        ) : (
                            <p className="text-xs text-amber-500">Not provided</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {user.phoneVerified ? (
                        <div className="flex items-center gap-2 text-[#30e87a] text-sm font-bold bg-[#30e87a]/10 px-3 py-1.5 rounded-lg border border-[#30e87a]/20">
                            <CheckCircle2 className="w-4 h-4" /> Verified
                        </div>
                    ) : !user.phone ? (
                        <div className="flex gap-2 w-full md:w-auto">
                            <input 
                                value={inputPhone}
                                onChange={e => setInputPhone(e.target.value)}
                                placeholder="+91 9876543210"
                                className="w-36 bg-[#1c2e24] border border-[#2d4035] rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#30e87a]"
                            />
                            <button 
                                onClick={handleSavePhone}
                                disabled={isSavingPhone}
                                className="bg-[#1c2e24] text-white border border-[#2d4035] px-4 py-1.5 rounded-lg font-bold text-sm hover:bg-[#2d4035] transition-colors flex items-center gap-2"
                            >
                                {isSavingPhone ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Save'}
                            </button>
                        </div>
                    ) : phoneStatus === 'SENT' ? (
                        <div className="flex gap-2 w-full md:w-auto">
                            <input 
                                value={phoneCode}
                                onChange={e => setPhoneCode(e.target.value)}
                                placeholder="6-digit code"
                                maxLength={6}
                                className="w-32 bg-[#1c2e24] border border-[#2d4035] rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#30e87a]"
                            />
                            <button 
                                onClick={() => handleVerifyOTP('PHONE')}
                                className="bg-[#30e87a] text-[#112117] px-4 py-1.5 rounded-lg font-bold text-sm hover:bg-[#2bd970] transition-colors whitespace-nowrap"
                            >
                                Verify
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => handleSendOTP('PHONE')}
                            disabled={phoneStatus === 'SENDING' || phoneStatus === 'VERIFYING'}
                            className="bg-[#1c2e24] text-white border border-[#2d4035] px-4 py-1.5 rounded-lg font-bold text-sm hover:bg-[#2d4035] transition-colors flex items-center gap-2 w-full md:w-auto justify-center"
                        >
                            {phoneStatus === 'SENDING' && <Loader2 className="w-3 h-3 animate-spin" />}
                            Send OTP
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
