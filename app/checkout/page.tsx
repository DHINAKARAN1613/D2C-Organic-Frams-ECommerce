'use client';

import {
    Leaf,
    ShoppingCart,
    Truck,
    CreditCard,
    HelpCircle,
    Lock,
    User,
    Home,
    ChevronDown,
    Info,
    Check,
    ArrowLeft,
    ArrowRight,
    Wallet,
    Landmark
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { CheckoutAddressForm } from '@/components/checkout/CheckoutAddressForm';
import { CheckoutPaymentForm } from '@/components/checkout/CheckoutPaymentForm';

export default function CheckoutPage() {
    const { items, subtotal } = useCart();

    // Checkout Steps: "shipping" -> "payment" -> "success"
    const [step, setStep] = useState<"shipping" | "payment">("shipping");

    // Saved Address Data from Step 1
    const [savedAddress, setSavedAddress] = useState<any>(null);

    // Calculate Tax and Total
    const taxRate = 0.08; // 8% example tax
    const shippingCost = 0; // Calculated at next step (or free)
    const taxes = subtotal * taxRate;
    const total = subtotal + taxes + shippingCost;

    const handleAddressSubmit = (addressData: any) => {
        setSavedAddress(addressData);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStep("payment");
    };

    const handleBackToShipping = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStep("shipping");
    };

    const handlePaymentSubmit = async (paymentId: string) => {
        try {
            const payload = {
                items: items.map(i => ({ ...i, image: i.image })),
                address: {
                    name: `${savedAddress.firstName} ${savedAddress.lastName}`,
                    street: savedAddress.street,
                    city: savedAddress.city,
                    state: savedAddress.state,
                    zip: savedAddress.zip,
                    phone: savedAddress.phone,
                    location: savedAddress.lat ? `${savedAddress.lat},${savedAddress.lng}` : null
                },
                total,
                paymentId
            };

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                if (res.status === 401) {
                    window.location.href = '/api/auth/signin?callbackUrl=/checkout';
                    return { success: false, error: 'Unauthorized' };
                }
                const errorText = await res.text();
                return { success: false, error: errorText || 'Failed to create order' };
            }

            const order = await res.json();
            window.location.href = `/profile/orders/${order.id}`;
            return { success: true };
        } catch (error: any) {
            console.error('Checkout error:', error);
            return { success: false, error: error.message || 'Failed to process order. Please try again.' };
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans bg-[#112117] text-[#e8ebe9]">
            {/* Navbar */}
            <header className="sticky top-0 z-50 w-full border-b border-[#2d4035] bg-[#112117]/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        {/* Logo */}
                        <Link href="/" className="relative flex items-center gap-2 group">
                            {/* Ambient Glow */}
                            <div className="absolute inset-0 -z-10 blur-xl bg-[#30e87a]/30 rounded-full opacity-50 animate-pulse"></div>

                            <div className="relative size-10 rounded-xl bg-[#112117]/80 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-lg group-hover:border-[#30e87a]/50 transition-colors">
                                <Leaf className="w-6 h-6 text-yellow-500 fill-yellow-500/20" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-white leading-none tracking-tight drop-shadow-md">Yogam</span>
                                <span className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 tracking-widest drop-shadow-sm">Organic Farms</span>
                            </div>
                        </Link>

                        {/* Step Indicator (Desktop) */}
                        <div className="hidden md:flex items-center space-x-2 text-sm font-medium">
                            <Link href="/shop" className="flex items-center text-[#9db8a8] hover:text-[#30e87a] transition-colors">
                                <ShoppingCart className="mr-1 w-4 h-4" />
                                Cart
                            </Link>
                            <span className="text-[#2d4035]">/</span>
                            <button
                                onClick={() => step === 'payment' && setStep('shipping')}
                                className={`flex items-center transition-colors ${step === 'shipping' ? 'text-[#30e87a]' : 'text-[#9db8a8] hover:text-[#30e87a] cursor-pointer'}`}>
                                <Truck className={`mr-1 w-4 h-4 ${step === 'shipping' ? 'fill-current' : ''}`} />
                                Shipping
                            </button>
                            <span className="text-[#2d4035]">/</span>
                            <div className={`flex items-center transition-colors ${step === 'payment' ? 'text-[#30e87a]' : 'text-[#9db8a8] opacity-50'}`}>
                                <CreditCard className={`mr-1 w-4 h-4 ${step === 'payment' ? 'fill-current' : ''}`} />
                                Payment
                            </div>
                        </div>

                        {/* User/Cart Actions */}
                        <div className="flex items-center gap-3">
                            <button className="flex items-center justify-center size-10 rounded-full hover:bg-[#1c2e24] transition-colors text-[#e8ebe9]">
                                <HelpCircle className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1c2e24] border border-[#2d4035] rounded-full">
                                <Lock className="w-3 h-3 text-green-500" />
                                <span className="text-xs font-semibold text-[#9db8a8] uppercase tracking-wider">Secure Checkout</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex justify-center py-8 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

                    {/* Left Column: Form */}
                    <div className="lg:col-span-7 flex flex-col gap-8">
                        {/* Breadcrumbs (Mobile only) */}
                        <div className="lg:hidden flex flex-wrap gap-2 text-sm mb-4">
                            <span className="text-[#9db8a8]">Cart</span>
                            <span className="text-[#9db8a8]">/</span>
                            <span className={step === 'shipping' ? "text-[#30e87a] font-medium" : "text-[#9db8a8]"}>Shipping</span>
                            <span className="text-[#9db8a8]">/</span>
                            <span className={step === 'payment' ? "text-[#30e87a] font-medium" : "text-[#9db8a8] opacity-50"}>Payment</span>
                        </div>

                        {step === "shipping" ? (
                            <CheckoutAddressForm onSubmit={handleAddressSubmit} />
                        ) : (
                                <CheckoutPaymentForm
                                    onBack={handleBackToShipping}
                                    onSubmit={handlePaymentSubmit}
                                    total={total}
                                />
                        )}
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        <div className="sticky top-24 bg-[#1c2e24] border border-[#2d4035] rounded-xl p-6 shadow-sm">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center justify-between">
                                Order Summary
                                <span className="text-sm font-normal text-[#9db8a8]">{items.reduce((acc, item) => acc + item.quantity, 0)} items</span>
                            </h3>

                            {/* Cart Items */}
                            <div className="flex flex-col gap-4 mb-6 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.length === 0 ? (
                                    <p className="text-[#9db8a8] text-center py-4">Your cart is empty.</p>
                                ) : (
                                    items.map((item) => (
                                        <div key={item.id} className="flex gap-4 items-start">
                                            <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-white/5 relative border border-[#2d4035]">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <span className="absolute top-0 right-0 bg-[#30e87a] text-[#112117] text-xs font-bold px-1.5 py-0.5 rounded-bl-lg">x{item.quantity}</span>
                                            </div>
                                            <div className="flex flex-col flex-1">
                                                <h4 className="text-white font-semibold">{item.name}</h4>
                                                <p className="text-xs text-[#9db8a8]">{item.category}</p>
                                                <p className="text-sm font-bold text-white mt-1">₹{item.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Discount Code */}
                            <div className="flex gap-2 mb-6">
                                <input className="flex-1 h-10 px-3 rounded-lg bg-[#112117] border border-[#2d4035] text-sm text-white focus:ring-1 focus:ring-[#30e87a] focus:border-[#30e87a] outline-none" placeholder="Gift card or discount code" type="text" />
                                <button className="h-10 px-4 rounded-lg bg-[#2d4035]/50 hover:bg-[#2d4035] text-white text-sm font-medium transition-colors border border-[#2d4035]">Apply</button>
                            </div>

                            {/* Cost Breakdown */}
                            <div className="flex flex-col gap-3 py-6 border-t border-[#2d4035]">
                                <div className="flex justify-between text-sm text-[#9db8a8]">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-white">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-[#9db8a8]">
                                    <span>Shipping</span>
                                    <span className="text-xs font-medium bg-[#30e87a]/20 text-[#30e87a] px-2 py-0.5 rounded">Calculated at next step</span>
                                </div>
                                <div className="flex justify-between text-sm text-[#9db8a8]">
                                    <span>Taxes (estimated 8%)</span>
                                    <span className="font-medium text-white">₹{taxes.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-end pt-4 border-t border-[#2d4035]">
                                <div className="flex flex-col">
                                    <span className="text-sm text-[#9db8a8]">Total</span>
                                    <span className="text-xs text-[#9db8a8]">Including ₹{taxes.toFixed(2)} in taxes</span>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm text-[#9db8a8] uppercase font-semibold">INR</span>
                                    <span className="text-2xl font-bold text-white tracking-tight">₹{total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
                            <div className="h-8 w-12 bg-[#1c2e24] rounded flex items-center justify-center border border-white/10">
                                <CreditCard className="w-5 h-5 text-white" />
                            </div>
                            <div className="h-8 w-12 bg-[#1c2e24] rounded flex items-center justify-center border border-white/10">
                                <Wallet className="w-5 h-5 text-white" />
                            </div>
                            <div className="h-8 w-12 bg-[#1c2e24] rounded flex items-center justify-center border border-white/10">
                                <Landmark className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-auto py-8 border-t border-[#2d4035] bg-[#112117]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-[#9db8a8]">© 2024 Yogam Organic Farms. All rights reserved.</p>
                    <div className="flex gap-6 text-sm text-[#9db8a8]">
                        <Link href="#" className="hover:text-[#30e87a] transition-colors">Refund Policy</Link>
                        <Link href="#" className="hover:text-[#30e87a] transition-colors">Shipping Policy</Link>
                        <Link href="#" className="hover:text-[#30e87a] transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-[#30e87a] transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
