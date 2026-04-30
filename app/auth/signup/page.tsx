'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';

export default function SignUpPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [isFarmer, setIsFarmer] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('role') === 'farmer') {
                setIsFarmer(true);
            }
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!agreed) {
            alert("Please agree to the Terms and Privacy Policy.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: isFarmer ? 'FARMER' : 'USER'
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            // Success
            alert("Account created successfully! Redirecting to login...");
            router.push('/auth/signin');
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 50,
                damping: 20,
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 70, damping: 20 }
        }
    };

    return (
        <div className="flex-grow w-full flex items-center justify-center relative py-20 px-4 min-h-screen bg-background overflow-hidden">
            {/* Background Decorations - Darker & Subtler */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3], rotate: [0, 10, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-150px] left-[-150px] w-[700px] h-[700px] bg-primary/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.5, 0.2], rotate: [0, -15, 0] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-[-150px] right-[-150px] w-[700px] h-[700px] bg-primary/10 rounded-full blur-[120px]"
                />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 w-full max-w-lg bg-surface/90 backdrop-blur-md rounded-3xl shadow-2xl border border-border p-8 md:p-12"
            >
                {/* Header Icon */}
                <motion.div variants={itemVariants} className="flex justify-center mb-8">
                    <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6, type: "spring" }}
                        className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-lg shadow-primary/10"
                    >
                        <User className="w-8 h-8" />
                    </motion.div>
                </motion.div>

                <motion.div variants={itemVariants} className="text-center mb-10">
                    <h1 className="text-4xl font-display font-bold text-foreground mb-3 tracking-tight">Create Account</h1>
                    <p className="text-muted-foreground text-base font-light">Join our community for a sustainable lifestyle.</p>
                </motion.div>

                <form className="space-y-6" onSubmit={handleSubmit}>

                    {/* Full Name */}
                    <motion.div variants={itemVariants} className="space-y-2">
                        <label className="block text-sm font-bold text-foreground ml-1" htmlFor="name">Full Name</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                <User className="w-5 h-5 relative z-10" />
                            </div>
                            <input
                                className="block w-full pl-11 pr-4 py-4 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm font-medium"
                                id="name"
                                placeholder="Jane Apple"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                    </motion.div>

                    {/* Email */}
                    <motion.div variants={itemVariants} className="space-y-2">
                        <label className="block text-sm font-bold text-foreground ml-1" htmlFor="email">Email Address</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                <Mail className="w-5 h-5 relative z-10" />
                            </div>
                            <input
                                className="block w-full pl-11 pr-4 py-4 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm font-medium"
                                id="email"
                                placeholder="name@example.com"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    </motion.div>

                    {/* Password */}
                    <motion.div variants={itemVariants} className="space-y-2">
                        <label className="block text-sm font-bold text-foreground ml-1" htmlFor="password">Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                <Lock className="w-5 h-5 relative z-10" />
                            </div>
                            <input
                                className="block w-full pl-11 pr-4 py-4 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm font-medium"
                                id="password"
                                placeholder="••••••••"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    </motion.div>

                    {/* Confirm Password */}
                    <motion.div variants={itemVariants} className="space-y-2">
                        <label className="block text-sm font-bold text-foreground ml-1" htmlFor="confirmPassword">Confirm Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                <CheckCircle2 className="w-5 h-5 relative z-10" />
                            </div>
                            <input
                                className="block w-full pl-11 pr-4 py-4 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm font-medium"
                                id="confirmPassword"
                                placeholder="••••••••"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                            />
                        </div>
                    </motion.div>

                    {/* Register as Farmer */}
                    <motion.div variants={itemVariants} className="flex items-center gap-3 ml-1">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                id="isFarmer"
                                checked={isFarmer}
                                onChange={(e) => setIsFarmer(e.target.checked)}
                                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-border bg-background checked:border-primary checked:bg-primary transition-all"
                            />
                            <CheckCircle2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary-foreground opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                        </div>
                        <label htmlFor="isFarmer" className="text-sm text-foreground cursor-pointer select-none font-medium">
                            I want to sell my products as a <span className="font-bold text-primary">Farmer</span>
                        </label>
                    </motion.div>

                    {/* Terms */}
                    <motion.div variants={itemVariants} className="flex items-center gap-3 ml-1">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-border bg-background checked:border-primary checked:bg-primary transition-all"
                            />
                            <CheckCircle2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary-foreground opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                        </div>
                        <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer select-none">
                            I agree to the <a href="#" className="font-bold text-foreground hover:text-primary hover:underline transition-colors">Terms of Service</a> and <a href="#" className="font-bold text-foreground hover:text-primary hover:underline transition-colors">Privacy Policy</a>.
                        </label>
                    </motion.div>

                    {/* Submit */}
                    <motion.button
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-primary hover:bg-[#25c465] text-primary-foreground font-bold text-lg py-4 rounded-xl transition-all shadow-[0_4px_20px_-5px_rgba(48,232,122,0.4)] flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed group"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="animate-spin w-6 h-6" /> : 'Create Account'}
                        {!isLoading && <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />}
                    </motion.button>
                </form>

                <motion.div variants={itemVariants} className="mt-8 pt-8 border-t border-border text-center">
                    <p className="text-base text-muted-foreground">
                        Already have an account?{' '}
                        <Link className="font-bold text-foreground hover:text-primary transition-colors inline-flex items-center gap-1" href="/auth/signin">
                            Sign In
                        </Link>
                    </p>
                </motion.div>
            </motion.div>
            <div className="absolute bottom-8 text-center text-xs text-muted-foreground opacity-40 uppercase tracking-widest font-medium">
                <span className="mx-3">Secure Sign Up</span> • <span className="mx-3">256-bit Encryption</span>
            </div>
        </div>
    );
}
