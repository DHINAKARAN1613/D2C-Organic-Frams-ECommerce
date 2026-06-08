"use client";

import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Loader2, User } from 'lucide-react';
import { useSession } from 'next-auth/react';


export function CustomerChatWidget() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [chatSessionId, setChatSessionId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Show for everyone except admins
    const isAdmin = session?.user && (session.user as any).role === 'ADMIN';
    const isGuest = !session?.user;
    const canFetch = !isAdmin && !isGuest;

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/chat');
            if (res.ok) {
                const data = await res.json();
                if (data.id) {
                    setChatSessionId(data.id);
                }
                if (data.messages) {
                    setMessages(data.messages);
                }
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        }
    };

    // Initial fetch when opened
    useEffect(() => {
        if (isOpen && canFetch && !chatSessionId) {
            fetchMessages();
        }
    }, [isOpen, canFetch, chatSessionId]);

    // Open-Source Real-Time Synchronization (Short Polling)
    useEffect(() => {
        if (!chatSessionId || !isOpen) return;

        const interval = setInterval(() => {
            fetchMessages();
        }, 2000); // Fetch every 2 seconds

        return () => clearInterval(interval);
    }, [chatSessionId, isOpen]);

    // Auto scroll to bottom
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || sending) return;

        setSending(true);
        const optimisticMessage = {
            id: 'temp-' + Date.now(),
            content: input,
            senderId: session?.user?.id,
            createdAt: new Date().toISOString(),
        };
        
        setMessages(prev => [...prev, optimisticMessage]);
        setInput('');

        try {
            await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: optimisticMessage.content })
            });
            // We don't need to refetch here because Pusher will push the new message
        } catch (error) {
            console.error("Failed to send message", error);
            // Optionally remove optimistic message on failure
        } finally {
            setSending(false);
        }
    };

    if (isAdmin) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-[#112117] border border-[#2d4035] rounded-2xl shadow-2xl w-[350px] h-[500px] mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
                    {/* Header */}
                    <div className="bg-[#1c2e24] p-4 border-b border-[#2d4035] flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#30e87a]/10 flex items-center justify-center border border-[#30e87a]/20">
                                <span className="text-[#30e87a] font-bold text-lg">Y</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-white leading-tight">Yogam Support</h3>
                                <p className="text-xs text-[#30e87a] flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-[#30e87a] animate-pulse"></span>
                                    Online
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="text-[#9db8a8] hover:text-white transition-colors p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0d1a12]">
                        {isGuest ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-50 p-4">
                                <User className="w-12 h-12 text-[#9db8a8]" />
                                <p className="text-[#9db8a8] text-sm">Please log in to chat with our support team.</p>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-50">
                                <MessageSquare className="w-12 h-12 text-[#9db8a8]" />
                                <p className="text-[#9db8a8] text-sm max-w-[200px]">Send a message and an admin will reply shortly.</p>
                            </div>
                        ) : (
                            messages.map((msg) => {
                                const isMe = msg.senderId === session?.user?.id;
                                const isBot = msg.isBot;
                                return (
                                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        {!isMe && (
                                            <span className="text-[10px] text-[#9db8a8] mb-1 ml-1 flex items-center gap-1">
                                                {isBot ? '🤖 Yogam AI' : '👤 Support Agent'}
                                            </span>
                                        )}
                                        <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                                            isMe 
                                                ? 'bg-[#30e87a] text-[#112117] rounded-br-none' 
                                                : isBot 
                                                    ? 'bg-[#1c2e24] border border-[#30e87a]/30 text-white rounded-bl-none'
                                                    : 'bg-[#1c2e24] border border-[#2d4035] text-white rounded-bl-none'
                                        }`}>
                                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                            <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-[#112117]/60' : 'text-[#9db8a8]'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-[#1c2e24] border-t border-[#2d4035]">
                        <form onSubmit={handleSend} className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={isGuest ? "Log in to chat..." : "Type a message..."}
                                disabled={isGuest}
                                className="w-full bg-[#112117] border border-[#2d4035] rounded-full pl-4 pr-12 py-3 text-sm text-white placeholder-[#9db8a8] focus:outline-none focus:border-[#30e87a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || sending || isGuest}
                                className="absolute right-2 p-2 bg-[#30e87a] text-[#112117] rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#25c464] transition-colors"
                            >
                                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-105 active:scale-95 ${
                    isOpen ? 'bg-[#1c2e24] border border-[#2d4035] text-white' : 'bg-[#30e87a] text-[#112117]'
                }`}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </button>
        </div>
    );
}
