'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from './ui/Button';
import { LogOut, User, Package, LayoutDashboard } from 'lucide-react';
import { Avatar } from './ui/Avatar';
import Link from 'next/link';

export function UserNav() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return (
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
        );
    }

    if (session?.user) {
        return (
            <div className="flex items-center gap-2">
                {(session.user as any).role === 'ADMIN' || session.user.email === 'admin@example.com' ? (
                    <Link href="/admin">
                        <Button variant="ghost" size="sm" className="hidden sm:flex text-amber-600 hover:text-amber-700 hover:bg-amber-50" title="Admin Dashboard">
                            <LayoutDashboard className="h-4 w-4 mr-2" />
                            Admin
                        </Button>
                    </Link>
                ) : null}
                {(session.user as any).role === 'FARMER' && (
                    <Link href="/farmer">
                        <Button variant="ghost" size="sm" className="hidden sm:flex text-primary font-bold hover:bg-primary/10" title="Farmer Dashboard">
                            <LayoutDashboard className="h-4 w-4 mr-1.5" />
                            Farmer
                        </Button>
                    </Link>
                )}
                <Link href="/profile/orders">
                    <Button variant="ghost" size="sm" className="flex text-current font-bold hover:bg-muted/30" title="My Orders">
                        <Package className="h-4 w-4 sm:mr-1.5" />
                        <span className="hidden sm:inline">Orders</span>
                    </Button>
                </Link>

                <Link href="/profile" title="My Account">
                    <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-transparent hover:border-green-500 transition-all cursor-pointer">
                        <Avatar
                            src={session.user.image}
                            alt={session.user.name}
                        />
                    </div>
                </Link>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut()}
                    className="text-xs text-muted-foreground hover:text-red-500"
                    title="Sign Out"
                >
                    <LogOut className="h-4 w-4" />
                    <span className="sr-only">Sign Out</span>
                </Button>
            </div>
        );
    }

    return (
        <Button variant="primary" size="sm" onClick={() => signIn()}>
            Sign In
        </Button>
    );
}
