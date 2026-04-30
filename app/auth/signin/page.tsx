'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Loader2, User, ShieldCheck, Leaf } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';

export default function SignInPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading('credentials');
        try {
            const res = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                alert('Invalid credentials');
            } else {
                router.push(role === 'ADMIN' ? '/admin' : '/');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(null);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading('google');
        try {
            await signIn('google', { callbackUrl: '/' });
        } catch (error) {
            console.error(error);
            setIsLoading(null);
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
            {/* Brand Logo */}
            <div className="absolute top-6 left-6 z-20">
                <Link href="/" className="relative flex items-center gap-2 group">
                    <div className="absolute inset-0 -z-10 blur-xl bg-primary/30 rounded-full opacity-50 animate-pulse"></div>
                    <div className="relative size-10 rounded-xl bg-surface/80 backdrop-blur-sm border border-border flex items-center justify-center shadow-lg group-hover:border-primary/50 transition-colors">
                        <Leaf className="w-6 h-6 text-yellow-500 fill-yellow-500/20" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-foreground leading-none tracking-tight drop-shadow-md">Yogam</span>
                        <span className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 tracking-widest drop-shadow-sm">Organic Farms</span>
                    </div>
                </Link>
            </div>
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3], rotate: [0, 10, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-150px] left-[-150px] w-[700px] h-[700px] bg-primary/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.5, 0.2], rotate: [0, -15, 0] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-[-150px] right-[-150px] w-[700px] h-[700px] bg-orange-500/10 rounded-full blur-[120px]"
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
                        className={`size-16 rounded-2xl flex items-center justify-center transition-colors shadow-lg ${role === 'ADMIN' ? 'bg-orange-500/10 text-orange-500 shadow-orange-500/10' : 'bg-primary/10 text-primary shadow-primary/10'}`}
                    >
                        {role === 'ADMIN' ? <ShieldCheck className="w-8 h-8" /> : <User className="w-8 h-8" />}
                    </motion.div>
                </motion.div>

                <motion.div variants={itemVariants} className="text-center mb-8">
                    <h1 className="text-4xl font-display font-bold text-foreground mb-3 tracking-tight">Welcome Back</h1>
                    <p className="text-muted-foreground text-base font-light">Sign in to your {role === 'ADMIN' ? 'dashboard' : 'account'}.</p>
                </motion.div>

                {/* Role Switcher */}
                <motion.div variants={itemVariants} className="flex p-1 bg-background border border-border rounded-xl mb-8 relative">
                    <button
                        onClick={() => setRole('USER')}
                        type="button"
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${role === 'USER' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <User className="w-4 h-4" /> Customer
                    </button>
                    <button
                        onClick={() => setRole('ADMIN')}
                        type="button"
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${role === 'ADMIN' ? 'bg-orange-500 text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <ShieldCheck className="w-4 h-4" /> Admin
                    </button>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-4">
                    {/* Google Sign In */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGoogleSignIn}
                        type="button"
                        disabled={!!isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        {isLoading === 'google' ? <Loader2 className="animate-spin w-5 h-5" /> : (
                            <>
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                                <span>Sign in with Google</span>
                            </>
                        )}
                    </motion.button>

                    <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-border"></div>
                        <span className="flex-shrink-0 mx-4 text-xs text-muted-foreground uppercase tracking-widest">Or with email</span>
                        <div className="flex-grow border-t border-border"></div>
                    </div>
                </motion.div>

                <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
                    <motion.div variants={itemVariants} className="space-y-2">
                        <label className="block text-sm font-bold text-foreground ml-1" htmlFor="email">Email Address</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                <Mail className="w-5 h-5 relative z-10" />
                            </div>
                            <input
                                className="block w-full pl-11 pr-4 py-4 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm font-medium"
                                id="email"
                                placeholder="you@example.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className="space-y-2">
                        <div className="flex items-center justify-between ml-1">
                            <label className="block text-sm font-bold text-foreground" htmlFor="password">Password</label>
                            <a className="text-xs font-medium text-primary hover:text-green-400 transition-colors" href="#">Forgot Password?</a>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                <Lock className="w-5 h-5 relative z-10" />
                            </div>
                            <input
                                className="block w-full pl-11 pr-4 py-4 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm font-medium"
                                id="password"
                                placeholder="••••••••"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </motion.div>
                    <motion.button
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full font-bold text-lg py-4 rounded-xl transition-all shadow-[0_4px_20px_-5px_rgba(0,0,0,0.3)] flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed ${role === 'ADMIN' ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30' : 'bg-primary hover:bg-[#25c465] text-primary-foreground shadow-primary/30'}`}
                        type="submit"
                        disabled={!!isLoading}
                    >
                        {isLoading === 'credentials' ? <Loader2 className="animate-spin w-6 h-6" /> : (role === 'ADMIN' ? 'Admin Login' : 'Sign In')}
                        {!isLoading && <ArrowRight className="w-6 h-6" />}
                    </motion.button>
                </form>
                <div className="mt-8 pt-8 border-t border-border text-center">
                    <p className="text-sm text-muted-foreground">
                        New to Organic Essentials?{' '}
                        <Link className="font-bold text-foreground hover:text-primary transition-colors inline-flex items-center gap-1" href="/auth/signup">
                            Create account
                        </Link>
                    </p>
                </div>
            </motion.div>
            <div className="absolute bottom-8 text-center text-xs text-muted-foreground opacity-40 uppercase tracking-widest font-medium">
                <span className="mx-3">Secure Login</span> • <span className="mx-3">256-bit Encryption</span>
            </div>
        </div>
    );
}
