"use client";

import { useState, useEffect } from "react";
import { Loader2, ArrowLeft, Lock, ShieldCheck } from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface CheckoutPaymentFormProps {
    onBack: () => void;
    onSubmit: (paymentId: string) => Promise<{success: boolean, error?: string}>;
    total: number;
}

export function CheckoutPaymentForm({ onBack, onSubmit, total }: CheckoutPaymentFormProps) {
    const { success, error } = useToast();
    const [loading, setLoading] = useState(false);

    // Load Razorpay Script
    useEffect(() => {
        const loadScript = () => {
            if (document.getElementById("razorpay-script")) return;
            const script = document.createElement("script");
            script.id = "razorpay-script";
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            document.body.appendChild(script);
        };
        loadScript();
    }, []);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Create order on backend
            const orderRes = await fetch('/api/checkout/razorpay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: total })
            });

            const orderData = await orderRes.json();

            if (!orderRes.ok) {
                throw new Error(orderData.error || "Failed to create payment order");
            }

            // 2. Initialize Razorpay options
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock", // Fallback for dev without keys
                amount: orderData.amount,
                currency: orderData.currency || "INR",
                name: "Yogam Organic Farms",
                description: "Purchase from Yogam Organic Farms",
                order_id: orderData.id,
                handler: async function (response: any) {
                    try {
                        // 3. Verify Payment
                        const verifyRes = await fetch('/api/checkout/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });

                        const verifyData = await verifyRes.json();
                        
                        if (verifyData.verified) {
                            const result = await onSubmit(response.razorpay_payment_id || response.razorpay_order_id);
                            if (result.success) {
                                success("Payment processed successfully!");
                            } else {
                                error(result.error || "Failed to process order.");
                                setLoading(false);
                            }
                        } else {
                            error("Payment verification failed. Please contact support.");
                            setLoading(false);
                        }
                    } catch (err: any) {
                        console.error("Verification or submission error:", err);
                        error(err.message || "Payment verification failed.");
                        setLoading(false);
                    }
                },
                prefill: {
                    name: "Customer", // This can be dynamically populated from context later
                    email: "customer@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#30e87a"
                },
                modal: {
                    ondismiss: function() {
                        setLoading(false);
                    }
                }
            };

            // If we're using mock endpoints (no keys), we can simulate a success
            if (orderData.id.startsWith("order_mock_")) {
                const result = await onSubmit(`pay_mock_${Date.now()}`);
                if (result.success) {
                    success("Payment processed via mock gateway!");
                } else {
                    error(result.error || "Failed to process order.");
                    setLoading(false);
                }
            } else {
                const rzp = new (window as any).Razorpay(options);
                rzp.on('payment.failed', function (response: any) {
                    error(response.error.description);
                    setLoading(false);
                });
                rzp.open();
            }

        } catch (err: any) {
            console.error("Payment initiation failed:", err);
            error(err.message || "Payment initiation failed. Please try again.");
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
                        100% Encrypted via Razorpay
                    </p>
                </div>
            </div>

            {/* Total Amount Display */}
            <div className="bg-[#30e87a]/10 border border-[#30e87a]/20 px-6 py-4 rounded-xl flex justify-between items-center">
                <span className="text-[#9db8a8] font-medium">Amount to Pay</span>
                <span className="text-2xl font-bold text-white tracking-tight">₹{total.toFixed(2)}</span>
            </div>

            <div className="bg-[#1c2e24]/50 border border-[#30e87a]/20 p-6 rounded-xl space-y-5 relative overflow-hidden flex flex-col items-center justify-center min-h-[200px]">
                 <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <Lock className="w-32 h-32" />
                </div>
                
                <p className="text-[#9db8a8] text-center max-w-md relative z-10">
                    You will be securely redirected to Razorpay to complete your payment. All major credit cards, UPI, and net banking are supported.
                </p>
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
                            Pay ₹{total.toFixed(2)}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
