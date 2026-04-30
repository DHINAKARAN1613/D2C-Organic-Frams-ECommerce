'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Loader2, User, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export function SignInButtons() {
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleLogin = async (provider: string, options?: any) => {
        setIsLoading(provider);
        try {
            await signIn(provider, { callbackUrl: '/', ...options });
        } catch (error) {
            console.error('Login failed:', error);
            setIsLoading(null);
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4 w-full"
        >
            <motion.div variants={item}>
                <Button
                    variant="outline"
                    className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border-gray-200 relative overflow-hidden group"
                    onClick={() => handleLogin('google')}
                    disabled={!!isLoading}
                >
                    {isLoading === 'google' ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                        <div className="flex items-center justify-center gap-3">
                            <svg className="h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                            </svg>
                            <span className="font-medium">Sign in with Google</span>
                        </div>
                    )}
                </Button>
            </motion.div>

            <motion.div variants={item} className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
            </motion.div>

            <motion.div variants={item}>
                <div className="grid grid-cols-2 gap-4">
                    <Button
                        className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
                        onClick={() => handleLogin('credentials', {
                            email: 'demo@example.com',
                            password: 'demo'
                        })}
                        disabled={!!isLoading}
                    >
                        {isLoading === 'credentials' ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <User className="h-5 w-5" />
                                <span className="font-bold">Customer</span>
                            </div>
                        )}
                    </Button>

                    <Button
                        className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white shadow-lg shadow-gray-900/20"
                        onClick={() => handleLogin('credentials', {
                            email: 'admin@example.com',
                            password: 'admin'
                        })}
                        disabled={!!isLoading}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <Lock className="h-5 w-5" />
                            <span className="font-bold">Admin Access</span>
                        </div>
                    </Button>
                </div>
                <p className="text-xs text-center text-muted-foreground mt-2">
                    Select a role to continue.
                </p>
            </motion.div>
        </motion.div>
    );
}
