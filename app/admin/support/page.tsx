"use client";

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Send, Loader2, MessageSquare, User as UserIcon, Search } from 'lucide-react';
import { getImageUrl } from '@/lib/imageUtils';

export default function AdminSupportPage() {
    const { data: session } = useSession();
    const [sessions, setSessions] = useState<any[]>([]);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [selectedSession, setSelectedSession] = useState<any>(null);
    
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [loadingSessions, setLoadingSessions] = useState(true);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch all chat sessions (Inbox list)
    const fetchSessions = async () => {
        try {
            const res = await fetch('/api/admin/chat');
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

    // Fetch messages for selected session
    const fetchSelectedSession = async () => {
        if (!selectedSessionId) return;
        try {
            const res = await fetch(`/api/admin/chat/${selectedSessionId}`);
            if (res.ok) {
                const data = await res.json();
                setSelectedSession(data);
            }
        } catch (error) {
            console.error("Failed to fetch selected session", error);
        }
    };

    // Polling effects
    useEffect(() => {
        fetchSessions();
        const interval = setInterval(fetchSessions, 5000); // Update inbox every 5s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (selectedSessionId) {
            fetchSelectedSession();
            const interval = setInterval(fetchSelectedSession, 3000); // Update active chat every 3s
            return () => clearInterval(interval);
        }
    }, [selectedSessionId]);

    // Auto scroll chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedSession?.messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || sending || !selectedSessionId) return;

        setSending(true);
        
        // Optimistic UI update
        const optimisticMessage = {
            id: 'temp-' + Date.now(),
            content: input,
            senderId: session?.user?.id,
            createdAt: new Date().toISOString(),
        };
        
        setSelectedSession((prev: any) => ({
            ...prev,
            messages: [...(prev?.messages || []), optimisticMessage]
        }));
        setInput('');

        try {
            const res = await fetch(`/api/admin/chat/${selectedSessionId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: optimisticMessage.content })
            });
            if (res.ok) {
                fetchSelectedSession();
                fetchSessions(); // Update inbox timestamps
            }
        } catch (error) {
            console.error("Failed to send message", error);
        } finally {
            setSending(false);
        }
    };

    if (loadingSessions) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#30e87a] animate-spin" />
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-8rem)] bg-[#1c2e24] border border-[#2d4035] rounded-2xl overflow-hidden flex shadow-xl">
            {/* Left Sidebar - Inbox */}
            <div className="w-80 border-r border-[#2d4035] flex flex-col bg-[#112117]/50">
                <div className="p-4 border-b border-[#2d4035]">
                    <h2 className="text-xl font-bold text-white mb-4">Support Inbox</h2>
                    <div className="relative">
                        <Search className="w-4 h-4 text-[#9db8a8] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text" 
                            placeholder="Search customers..."
                            className="w-full bg-[#112117] border border-[#2d4035] rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#30e87a]"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {sessions.length === 0 ? (
                        <div className="p-8 text-center text-[#9db8a8]">
                            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No active support chats.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#2d4035]">
                            {sessions.map((chat) => (
                                <button
                                    key={chat.id}
                                    onClick={() => setSelectedSessionId(chat.id)}
                                    className={`w-full text-left p-4 hover:bg-[#1c2e24] transition-colors ${selectedSessionId === chat.id ? 'bg-[#1c2e24] border-l-4 border-[#30e87a]' : 'border-l-4 border-transparent'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-[#112117] border border-[#2d4035] flex items-center justify-center overflow-hidden shrink-0">
                                            {getImageUrl(chat.user?.image) ? (
                                                <img src={getImageUrl(chat.user.image)!} alt="User" className="w-full h-full object-cover" />
                                            ) : (
                                                <UserIcon className="w-5 h-5 text-[#9db8a8]" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <p className="text-sm font-bold text-white truncate">{chat.user?.name || 'Guest User'}</p>
                                                <span className="text-[10px] text-[#9db8a8]">
                                                    {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-xs text-[#9db8a8] truncate">
                                                {chat.messages?.[0]?.content || 'Started a new chat'}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Side - Chat Window */}
            <div className="flex-1 flex flex-col bg-[#0d1a12]">
                {selectedSessionId && selectedSession ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 bg-[#1c2e24] border-b border-[#2d4035] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-full bg-[#112117] border border-[#2d4035] flex items-center justify-center overflow-hidden shrink-0">
                                    {getImageUrl(selectedSession.user?.image) ? (
                                        <img src={getImageUrl(selectedSession.user.image)!} alt="User" className="w-full h-full object-cover" />
                                    ) : (
                                        <UserIcon className="w-5 h-5 text-[#9db8a8]" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{selectedSession.user?.name || 'Guest User'}</h3>
                                    <p className="text-xs text-[#9db8a8]">{selectedSession.user?.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {selectedSession.messages?.map((msg: any) => {
                                const isMe = msg.senderId === session?.user?.id;
                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-sm ${
                                            isMe 
                                                ? 'bg-[#30e87a] text-[#112117] rounded-br-none' 
                                                : 'bg-[#1c2e24] border border-[#2d4035] text-white rounded-bl-none'
                                        }`}>
                                            <p className="text-sm leading-relaxed">{msg.content}</p>
                                            <p className={`text-[10px] mt-2 text-right font-medium ${isMe ? 'text-[#112117]/60' : 'text-[#5c7a68]'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-[#1c2e24] border-t border-[#2d4035]">
                            <form onSubmit={handleSend} className="relative flex items-center max-w-4xl mx-auto">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your reply to customer..."
                                    className="w-full bg-[#112117] border border-[#2d4035] rounded-full pl-6 pr-14 py-4 text-sm text-white placeholder-[#9db8a8] focus:outline-none focus:border-[#30e87a] transition-colors shadow-inner"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || sending}
                                    className="absolute right-2 p-3 bg-[#30e87a] text-[#112117] rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#25c464] transition-colors shadow-lg"
                                >
                                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-[#9db8a8]">
                        <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                        <h3 className="text-xl font-bold text-white mb-2">Support Inbox</h3>
                        <p className="max-w-xs text-center text-sm">Select a customer conversation from the left sidebar to start messaging.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
