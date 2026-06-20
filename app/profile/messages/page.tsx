"use client";

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { Send, Loader2, MessageSquare, User as UserIcon, Search, Store } from 'lucide-react';
import { getImageUrl } from '@/lib/imageUtils';
import { useSearchParams, useRouter } from 'next/navigation';

function MessagesContent() {
    const { data: session } = useSession();
    const [sessions, setSessions] = useState<any[]>([]);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [selectedSession, setSelectedSession] = useState<any>(null);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [loadingSessions, setLoadingSessions] = useState(true);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();
    const router = useRouter();

    const fetchSessions = async () => {
        try {
            const res = await fetch('/api/messages');
            if (res.ok) {
                const data = await res.json();
                setSessions(data);
            }
        } catch (error) {
            console.error("Failed to fetch sessions", error);
        } finally {
            setLoadingSessions(false);
        }
    };

    const initFarmerChat = async (farmerId: string) => {
        try {
            const res = await fetch(`/api/messages?farmerId=${farmerId}`);
            if (res.ok) {
                const data = await res.json();
                setSelectedSessionId(data.sessionId);
                // Remove farmerId from URL to clean it up
                router.replace('/profile/messages');
            }
        } catch (error) {
            console.error("Failed to init chat", error);
        }
    };

    useEffect(() => {
        const farmerId = searchParams.get('farmerId');
        if (farmerId) {
            initFarmerChat(farmerId);
        }
    }, [searchParams]);

    const fetchSelectedSession = async () => {
        if (!selectedSessionId) return;
        try {
            const res = await fetch(`/api/messages/${selectedSessionId}`);
            if (res.ok) {
                const data = await res.json();
                setSelectedSession(data);
            }
        } catch (error) {
            console.error("Failed to fetch selected session", error);
        }
    };

    useEffect(() => {
        fetchSessions();
        const interval = setInterval(fetchSessions, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (selectedSessionId) {
            fetchSelectedSession();
            const interval = setInterval(fetchSelectedSession, 3000);
            return () => clearInterval(interval);
        }
    }, [selectedSessionId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedSession?.messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || sending || !selectedSessionId) return;
        setSending(true);
        const optimisticMessage = {
            id: 'temp-' + Date.now(),
            content: input,
            senderId: session?.user?.id,
            createdAt: new Date().toISOString(),
        };
        setSelectedSession((prev: any) => ({ ...prev, messages: [...(prev?.messages || []), optimisticMessage] }));
        setInput('');

        try {
            const res = await fetch(`/api/messages/${selectedSessionId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: optimisticMessage.content })
            });
            if (res.ok) {
                fetchSelectedSession();
                fetchSessions();
            }
        } catch (error) {
            console.error("Failed to send message", error);
        } finally {
            setSending(false);
        }
    };

    if (loadingSessions) {
        return <div className="flex h-[calc(100vh-10rem)] items-center justify-center"><Loader2 className="w-8 h-8 text-[#30e87a] animate-spin" /></div>;
    }

    return (
        <div className="h-[calc(100vh-10rem)] bg-[#1c2e24] border border-[#2d4035] rounded-2xl overflow-hidden flex shadow-xl">
            <div className="w-1/3 md:w-80 border-r border-[#2d4035] flex flex-col bg-[#112117]/50">
                <div className="p-4 border-b border-[#2d4035]">
                    <h2 className="text-lg font-bold text-white mb-4">Farmer Chats</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {sessions.length === 0 ? (
                        <div className="p-8 text-center text-[#9db8a8]">
                            <Store className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No chats with farmers yet.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#2d4035]">
                            {sessions.map((chat) => (
                                <button key={chat.id} onClick={() => setSelectedSessionId(chat.id)} className={`w-full text-left p-4 hover:bg-[#1c2e24] transition-colors ${selectedSessionId === chat.id ? 'bg-[#1c2e24] border-l-4 border-[#30e87a]' : 'border-l-4 border-transparent'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-[#112117] border border-[#2d4035] flex items-center justify-center overflow-hidden shrink-0">
                                            {getImageUrl(chat.farmer?.image) ? <img src={getImageUrl(chat.farmer.image)!} alt="Farmer" className="w-full h-full object-cover" /> : <UserIcon className="w-5 h-5 text-[#9db8a8]" />}
                                        </div>
                                        <div className="flex-1 min-w-0 hidden md:block">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <p className="text-sm font-bold text-white truncate">{chat.farmer?.name || 'Farmer'}</p>
                                            </div>
                                            <p className="text-xs text-[#9db8a8] truncate">{chat.messages?.[0]?.content || 'Started a new chat'}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 flex flex-col bg-[#0d1a12]">
                {selectedSessionId && selectedSession ? (
                    <>
                        <div className="p-4 bg-[#1c2e24] border-b border-[#2d4035] flex items-center gap-3">
                            <div className="size-10 rounded-full bg-[#112117] border border-[#2d4035] flex items-center justify-center overflow-hidden shrink-0">
                                {getImageUrl(selectedSession.farmer?.image) ? <img src={getImageUrl(selectedSession.farmer.image)!} alt="Farmer" className="w-full h-full object-cover" /> : <UserIcon className="w-5 h-5 text-[#9db8a8]" />}
                            </div>
                            <div><h3 className="font-bold text-white">{selectedSession.farmer?.name || 'Farmer'}</h3></div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                            {selectedSession.messages?.map((msg: any) => {
                                const isMe = msg.senderId === session?.user?.id;
                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 md:px-5 py-3 shadow-sm ${isMe ? 'bg-[#30e87a] text-[#112117] rounded-br-none' : 'bg-[#1c2e24] border border-[#2d4035] text-white rounded-bl-none'}`}>
                                            <p className="text-sm leading-relaxed">{msg.content}</p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-3 md:p-4 bg-[#1c2e24] border-t border-[#2d4035]">
                            <form onSubmit={handleSend} className="relative flex items-center max-w-4xl mx-auto">
                                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." className="w-full bg-[#112117] border border-[#2d4035] rounded-full pl-5 pr-14 py-3 md:py-4 text-sm text-white placeholder-[#9db8a8] focus:outline-none focus:border-[#30e87a] transition-colors shadow-inner" />
                                <button type="submit" disabled={!input.trim() || sending} className="absolute right-2 p-2 md:p-3 bg-[#30e87a] text-[#112117] rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#25c464] transition-colors shadow-lg">
                                    {sending ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : <Send className="w-4 h-4 md:w-5 md:h-5" />}
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-[#9db8a8]">
                        <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                        <h3 className="text-xl font-bold text-white mb-2">Farmer Inbox</h3>
                        <p className="max-w-xs text-center text-sm">Select a chat to start messaging.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function UserMessagesPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-white mb-6">Messages</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <MessagesContent />
            </Suspense>
        </div>
    );
}
