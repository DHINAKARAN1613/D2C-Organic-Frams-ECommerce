"use client";

import { useState } from "react";
import { Loader2, ArrowLeft, Lock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface CheckoutPaymentFormProps {
    onBack: () => void;
    onSubmit: (paymentId: string) => Promise<void>;
}

export function CheckoutPaymentForm({ onBack, onSubmit }: CheckoutPaymentFormProps) {
    const { success, error } = useToast();
    const [loading, setLoading] = useState(false);

    // Controlled inputs for a more realistic feel
    const [cardName, setCardName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    const formatExpiry = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
        }
        return v;
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (cardNumber.replace(/\s/g, '').length < 16) {
            error("Please enter a valid 16-digit card number.");
            return;
        }
        if (expiry.length < 5) {
            error("Please enter a valid expiry date (MM/YY).");
            return;
        }
        if (cvv.length < 3) {
            error("Please enter a valid CVV.");
            return;
        }

        setLoading(true);
        try {
            // Simulate Payment Gateway Processing Delay
            await new Promise(r => setTimeout(r, 2000));

            // Randomly Generate a Mock Transaction ID (simulating Stripe/Razorpay)
            const mockTransactionId = `txn_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;

            success("Payment processed securely!");
            await onSubmit(mockTransactionId);
        } catch (err) {
            error("Payment processing failed. Please try again.");
            setLoading(false);
        }
    };

    return (
        <form className="flex flex-col gap-6" onSubmit={handlePayment}>
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-1">Secure Payment</h2>
                    <p className="text-[#9db8a8] text-sm flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4 text-[#30e87a]" />
                        Encrypted and secure via NextAuth & SSL
                    </p>
                </div>
            </div>

            <div className="bg-[#1c2e24]/50 border border-[#30e87a]/20 p-6 rounded-xl space-y-5 relative overflow-hidden">
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <Lock className="w-32 h-32" />
                </div>

                {/* Name on Card */}
                <label className="flex flex-col flex-1 relative z-10">
                    <span className="text-sm font-medium text-white mb-2">Name on Card</span>
                    <input
                        className="w-full h-12 px-4 rounded-xl bg-[#131f18] border border-[#2d4035] text-white placeholder-[#9db8a8]/50 focus:ring-2 focus:ring-[#30e87a] focus:border-[#30e87a] transition-all outline-none"
                        placeholder="John Doe"
                        required
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                    />
                </label>

                {/* Card Number */}
                <label className="flex flex-col flex-1 relative z-10">
                    <span className="text-sm font-medium text-white mb-2">Card Number</span>
                    <div className="relative">
                        <input
                            className="w-full h-12 px-4 pl-12 rounded-xl bg-[#131f18] border border-[#2d4035] text-white placeholder-[#9db8a8]/50 focus:ring-2 focus:ring-[#30e87a] focus:border-[#30e87a] transition-all outline-none font-mono tracking-widest"
                            placeholder="0000 0000 0000 0000"
                            required
                            type="text"
                            maxLength={19}
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9db8a8]">
                            {/* Generic Credit Card Icon SVG */}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="5" width="20" height="14" rx="2" />
                                <line x1="2" y1="10" x2="22" y2="10" />
                            </svg>
                        </div>
                    </div>
                </label>

                <div className="grid grid-cols-2 gap-4 relative z-10">
                    {/* Expiry */}
                    <label className="flex flex-col flex-1">
                        <span className="text-sm font-medium text-white mb-2">Expiry Date</span>
                        <input
                            className="w-full h-12 px-4 rounded-xl bg-[#131f18] border border-[#2d4035] text-white placeholder-[#9db8a8]/50 focus:ring-2 focus:ring-[#30e87a] focus:border-[#30e87a] transition-all outline-none font-mono"
                            placeholder="MM/YY"
                            required
                            type="text"
                            maxLength={5}
                            value={expiry}
                            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        />
                    </label>

                    {/* CVV */}
                    <label className="flex flex-col flex-1">
                        <span className="text-sm font-medium text-white mb-2">CVV</span>
                        <input
                            className="w-full h-12 px-4 rounded-xl bg-[#131f18] border border-[#2d4035] text-white placeholder-[#9db8a8]/50 focus:ring-2 focus:ring-[#30e87a] focus:border-[#30e87a] transition-all outline-none font-mono"
                            placeholder="123"
                            required
                            type="password"
                            maxLength={4}
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        />
                    </label>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-[#2d4035]">
                <button
                    type="button"
                    onClick={onBack}
                    disabled={loading}
                    className="flex items-center gap-2 text-[#9db8a8] hover:text-white transition-colors font-medium disabled:opacity-50"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Shipping
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto h-12 px-8 bg-[#30e87a] hover:bg-[#25c464] text-[#112117] font-bold rounded-full transition-all shadow-lg shadow-[#30e87a]/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing Securely...
                        </>
                    ) : (
                        <>
                            <Lock className="w-4 h-4" />
                            Pay Now
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
