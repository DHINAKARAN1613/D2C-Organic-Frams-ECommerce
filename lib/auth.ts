import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // 1. Check Hardcoded Users (Dev/Admin)
                if (credentials?.email === "admin@example.com" && credentials?.password === "admin") {
                    return {
                        id: "admin-user-id",
                        name: "Admin User",
                        email: "admin@example.com",
                        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
                        role: "ADMIN"
                    };
                }

                if (credentials?.email === "demo@example.com" && credentials?.password === "demo") {
                    return {
                        id: "demo-user-id",
                        name: "Demo User",
                        email: "demo@example.com",
                        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
                        role: "USER"
                    };
                }

                // 2. Check Database Users
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user || !user.password) return null;

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordValid) return null;

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`,
                    role: user.role,
                    isVerifiedFarmer: user.isVerifiedFarmer
                };
            },
        }),
    ],
    callbacks: {
        session: async ({ session, token }) => {
            if (session?.user && token) {
                session.user.id = token.sub as string;
                session.user.role = token.role;
                (session.user as any).isVerifiedFarmer = token.isVerifiedFarmer;
            }
            return session;
        },
        jwt: async ({ token, user }) => {
            if (user) {
                token.sub = user.id;
                token.role = user.role;
                token.isVerifiedFarmer = (user as any).isVerifiedFarmer;
            }
            return token;
        }
    },
    session: {
        strategy: "jwt", // Use JWT for simple demo/credentials without DB complexity for the demo user
    },

    theme: {
        colorScheme: 'light',
    },
    pages: {
        signIn: '/auth/signin',
    },
    secret: process.env.NEXTAUTH_SECRET || "super-secret-random-string-123",
};
