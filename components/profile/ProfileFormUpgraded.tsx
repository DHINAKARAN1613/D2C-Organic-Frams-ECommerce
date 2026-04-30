'use client';

import { useState, useRef } from 'react';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Phone, FileText, Camera, Save, Loader2,
    CheckCircle2, ShieldCheck, Package, ShoppingBag,
    Upload, X, Leaf, Star, BadgeCheck
} from 'lucide-react';
import Image from 'next/image';

const PRESET_AVATARS = [
    { id: 'girl', src: 'https://avatar.iran.liara.run/public/girl' },
    { id: 'boy', src: 'https://avatar.iran.liara.run/public/boy' },
    { id: 'farmer', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Farmer&style=circle' },
    { id: 'nature', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nature&style=circle' },
    { id: 'leaf', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leaf&style=circle' },
    { id: 'organic', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Organic&style=circle' },
];

interface ProfileUser {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    phone: string | null;
    bio: string | null;
    role: string;
    isVerifiedFarmer: boolean;
    createdAt: Date;
    _count: { orders: number; products: number };
}

function RoleBadge({ role, isVerifiedFarmer }: { role: string; isVerifiedFarmer: boolean }) {
    if (isVerifiedFarmer) {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <BadgeCheck className="w-3.5 h-3.5" /> Verified Farmer
            </span>
        );
    }
    if (role === 'FARMER') {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#30e87a]/10 text-[#30e87a] border border-[#30e87a]/30">
                <Leaf className="w-3.5 h-3.5" /> Farmer
            </span>
        );
    }
    if (role === 'ADMIN') {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                <ShieldCheck className="w-3.5 h-3.5" /> Administrator
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Star className="w-3.5 h-3.5" /> Customer
        </span>
    );
}

export function ProfileFormUpgraded({ user }: { user: ProfileUser }) {
    const { success, error } = useToast();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [name, setName] = useState(user.name || '');
    const [phone, setPhone] = useState(user.phone || '');
    const [bio, setBio] = useState(user.bio || '');
    const [image, setImage] = useState(user.image || PRESET_AVATARS[0].src);
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileUpload = async (file: File) => {
        setUploading(true);
        // Show local preview immediately
        const localUrl = URL.createObjectURL(file);
        setPreviewUrl(localUrl);

        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.success) {
                setImage(data.url);
                setPreviewUrl(null);
            } else {
                error('Image upload failed');
                setPreviewUrl(null);
            }
        } catch {
            error('Image upload failed');
            setPreviewUrl(null);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone, bio, image }),
            });
            if (!res.ok) throw new Error();
            success('Profile updated successfully!');
            router.refresh();
        } catch {
            error('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    const joinDate = new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    const currentImage = previewUrl || image;

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Header Card */}
            <div className="bg-gradient-to-br from-[#1c2e24] to-[#112117] rounded-3xl border border-[#2d4035] overflow-hidden">
                {/* Banner */}
                <div className="h-24 bg-gradient-to-r from-[#30e87a]/20 via-[#2bd970]/10 to-transparent relative">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzMGU4N2EiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoLTZ2LTZoNnptMCAtMzR2NmgtNlYwaC02em0wIDE3djZoLTZ2LTZoNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
                </div>

                <div className="px-8 pb-8 -mt-12 flex flex-col sm:flex-row items-start sm:items-end gap-6">
                    {/* Avatar with Upload */}
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-2xl border-4 border-[#1c2e24] overflow-hidden bg-[#112117] shadow-2xl relative">
                            {currentImage && (
                                <Image src={currentImage} alt="Profile" fill className="object-cover" sizes="96px" unoptimized />
                            )}
                            {uploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
                                    <Loader2 className="w-6 h-6 text-[#30e87a] animate-spin" />
                                </div>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowAvatarPicker(v => !v)}
                            className="absolute -bottom-2 -right-2 size-8 bg-[#30e87a] rounded-xl flex items-center justify-center text-[#112117] hover:bg-[#25c465] transition-colors shadow-lg"
                        >
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex-1 min-w-0 pb-1">
                        <h2 className="text-2xl font-bold text-white truncate">{user.name || 'Your Name'}</h2>
                        <p className="text-[#9db8a8] text-sm">{user.email}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                            <RoleBadge role={user.role} isVerifiedFarmer={user.isVerifiedFarmer} />
                            <span className="text-[#9db8a8] text-xs">Joined {joinDate}</span>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4 pb-1">
                        <div className="text-center">
                            <div className="flex items-center gap-1 justify-center text-[#30e87a]">
                                <ShoppingBag className="w-4 h-4" />
                                <span className="text-xl font-bold">{user._count.orders}</span>
                            </div>
                            <p className="text-[#9db8a8] text-xs mt-0.5">Orders</p>
                        </div>
                        {(user.role === 'FARMER' || user.role === 'ADMIN') && (
                            <div className="text-center">
                                <div className="flex items-center gap-1 justify-center text-[#30e87a]">
                                    <Package className="w-4 h-4" />
                                    <span className="text-xl font-bold">{user._count.products}</span>
                                </div>
                                <p className="text-[#9db8a8] text-xs mt-0.5">Products</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Avatar Picker Panel */}
            <AnimatePresence>
                {showAvatarPicker && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-[#1c2e24] rounded-2xl border border-[#2d4035] p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-bold flex items-center gap-2"><Camera className="w-4 h-4 text-[#30e87a]" /> Choose Photo</h3>
                            <button type="button" onClick={() => setShowAvatarPicker(false)} className="text-[#9db8a8] hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Upload Own Photo */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-[#2d4035] hover:border-[#30e87a]/50 cursor-pointer transition-colors mb-4 group"
                        >
                            <div className="size-10 rounded-lg bg-[#30e87a]/10 flex items-center justify-center">
                                <Upload className="w-5 h-5 text-[#30e87a]" />
                            </div>
                            <div>
                                <p className="text-white text-sm font-semibold">Upload your photo</p>
                                <p className="text-[#9db8a8] text-xs">JPG, PNG, WEBP up to 5MB</p>
                            </div>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }}
                        />

                        {/* Preset Avatars */}
                        <p className="text-xs text-[#9db8a8] uppercase tracking-wider font-bold mb-3">Or pick an avatar</p>
                        <div className="grid grid-cols-6 gap-3">
                            {PRESET_AVATARS.map((av) => (
                                <button
                                    key={av.id}
                                    type="button"
                                    onClick={() => { setImage(av.src); setPreviewUrl(null); setShowAvatarPicker(false); }}
                                    className={`relative w-full aspect-square rounded-xl overflow-hidden border-2 transition-all ${image === av.src ? 'border-[#30e87a] shadow-lg shadow-[#30e87a]/20 scale-110' : 'border-[#2d4035] hover:border-[#30e87a]/50'}`}
                                >
                                    <Image src={av.src} alt={av.id} fill className="object-cover" sizes="60px" unoptimized />
                                    {image === av.src && (
                                        <div className="absolute bottom-0 right-0 size-5 bg-[#30e87a] rounded-tl-lg flex items-center justify-center">
                                            <CheckCircle2 className="w-3 h-3 text-[#112117]" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Verified Farmer Banner */}
            {user.role === 'FARMER' && !user.isVerifiedFarmer && (
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 flex items-start gap-4">
                    <div className="size-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                        <BadgeCheck className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                        <h4 className="text-amber-400 font-bold">Get Verified Farmer Badge</h4>
                        <p className="text-[#9db8a8] text-sm mt-1">Complete your profile with phone and bio, then contact support to apply for verification. Verified farmers get a gold badge on their products and appear higher in search results.</p>
                        <div className="flex flex-wrap gap-3 mt-3 text-xs font-semibold">
                            <span className={`flex items-center gap-1 ${phone ? 'text-[#30e87a]' : 'text-[#9db8a8]'}`}>
                                {phone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />} Phone number
                            </span>
                            <span className={`flex items-center gap-1 ${bio ? 'text-[#30e87a]' : 'text-[#9db8a8]'}`}>
                                {bio ? <CheckCircle2 className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />} Farm bio
                            </span>
                            <span className={`flex items-center gap-1 ${image !== PRESET_AVATARS[0].src ? 'text-[#30e87a]' : 'text-[#9db8a8]'}`}>
                                {image !== PRESET_AVATARS[0].src ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />} Profile photo
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {user.isVerifiedFarmer && (
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 flex items-center gap-4">
                    <BadgeCheck className="w-8 h-8 text-amber-400 shrink-0" />
                    <div>
                        <h4 className="text-amber-400 font-bold">You're a Verified Farmer 🎉</h4>
                        <p className="text-[#9db8a8] text-sm">Your products show a gold verified badge, helping customers trust your listings.</p>
                    </div>
                </div>
            )}

            {/* Edit Fields */}
            <div className="bg-[#1c2e24] rounded-3xl border border-[#2d4035] p-6 space-y-5">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-[#30e87a]" /> Personal Information
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-[#9db8a8] uppercase tracking-wider">
                            <User className="w-3.5 h-3.5" /> Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-[#112117] border border-[#2d4035] rounded-xl px-4 py-3 text-white placeholder:text-[#5c6e63] focus:outline-none focus:border-[#30e87a] transition-colors"
                            placeholder="Your full name"
                        />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-[#9db8a8] uppercase tracking-wider">
                            <Phone className="w-3.5 h-3.5" /> Phone Number
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-[#112117] border border-[#2d4035] rounded-xl px-4 py-3 text-white placeholder:text-[#5c6e63] focus:outline-none focus:border-[#30e87a] transition-colors"
                            placeholder="+91 98765 43210"
                        />
                    </div>
                </div>

                {/* Email (read-only) */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-[#9db8a8] uppercase tracking-wider">
                        <Mail className="w-3.5 h-3.5" /> Email Address
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2d4035] font-normal normal-case tracking-normal">Cannot be changed</span>
                    </label>
                    <div className="w-full bg-[#112117]/50 border border-[#2d4035]/50 rounded-xl px-4 py-3 text-[#9db8a8] cursor-not-allowed flex items-center gap-2">
                        <Mail className="w-4 h-4 shrink-0" />
                        {user.email}
                    </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-[#9db8a8] uppercase tracking-wider">
                        <FileText className="w-3.5 h-3.5" />
                        {user.role === 'FARMER' ? 'Farm Bio' : 'About Me'}
                    </label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        className="w-full bg-[#112117] border border-[#2d4035] rounded-xl px-4 py-3 text-white placeholder:text-[#5c6e63] focus:outline-none focus:border-[#30e87a] transition-colors resize-none"
                        placeholder={user.role === 'FARMER'
                            ? 'Tell customers about your farm — what you grow, your farming practices...'
                            : 'A short bio about yourself...'
                        }
                        maxLength={300}
                    />
                    <p className="text-right text-xs text-[#5c6e63]">{bio.length}/300</p>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <motion.button
                    type="submit"
                    disabled={loading || uploading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#30e87a] text-[#112117] font-bold hover:bg-[#25c465] transition-colors disabled:opacity-50 shadow-lg shadow-[#30e87a]/20"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </motion.button>
            </div>
        </form>
    );
}
