"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShieldCheck, XCircle, Clock, Eye, CheckCircle2, FileText, Video, MapPin, Loader2, PlayCircle } from 'lucide-react';
import { getImageUrl } from '@/lib/imageUtils';

export default function FarmersClient({ initialFarmers }: { initialFarmers: any[] }) {
    const [farmers, setFarmers] = useState(initialFarmers);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('ALL');
    const [processingId, setProcessingId] = useState<string | null>(null);
    const router = useRouter();

    const filteredFarmers = farmers.filter(f => {
        const matchesSearch = (f.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
                              (f.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                              (f.phone || '').includes(searchQuery);
        const matchesFilter = filter === 'ALL' || f.kycStatus === filter;
        return matchesSearch && matchesFilter;
    });

    const handleAction = async (farmerId: string, action: 'APPROVE' | 'REJECT') => {
        if (!confirm(`Are you sure you want to ${action} this farmer?`)) return;
        
        setProcessingId(farmerId);
        try {
            const res = await fetch('/api/admin/farmers', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ farmerId, action })
            });

            if (res.ok) {
                const data = await res.json();
                setFarmers(prev => prev.map(f => f.id === farmerId ? data.user : f));
                router.refresh();
            } else {
                alert('Failed to process action');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between bg-surface p-4 rounded-2xl border border-border">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search farmers by name, email or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
                    {['ALL', 'PENDING', 'VERIFIED', 'REJECTED'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-background border border-border text-muted-foreground hover:text-foreground'}`}
                        >
                            {f === 'ALL' ? 'All Applications' : f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-6">
                {filteredFarmers.length === 0 ? (
                    <div className="text-center py-12 bg-surface rounded-2xl border border-border">
                        <ShieldCheck className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-20" />
                        <p className="text-muted-foreground font-medium">No farmers found matching your criteria.</p>
                    </div>
                ) : (
                    filteredFarmers.map((farmer) => (
                        <div key={farmer.id} className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row border-b border-border">
                                {/* Header / Profile Info */}
                                <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-border bg-background/50">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-12 rounded-full bg-surface border border-border overflow-hidden shrink-0">
                                                <img src={getImageUrl(farmer.image) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${farmer.id}`} alt="Farmer" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-foreground">{farmer.name || 'Anonymous Farmer'}</h3>
                                                <p className="text-xs text-muted-foreground">{farmer.email}</p>
                                                <p className="text-xs text-muted-foreground">{farmer.phone || 'No phone'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 space-y-3">
                                        <div className="flex items-start gap-2 text-sm">
                                            <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground">{farmer.farmAddress || 'No address provided'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Status:</span>
                                            {farmer.kycStatus === 'VERIFIED' && <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> VERIFIED</span>}
                                            {farmer.kycStatus === 'PENDING' && <span className="bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> PENDING</span>}
                                            {farmer.kycStatus === 'REJECTED' && <span className="bg-red-500/20 text-red-500 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1"><XCircle className="w-3 h-3" /> REJECTED</span>}
                                        </div>
                                    </div>
                                </div>

                                {/* Documents Info */}
                                <div className="p-6 md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Aadhar Number</p>
                                            <p className="font-mono text-sm text-foreground bg-background px-3 py-2 rounded-lg border border-border inline-block">{farmer.aadharNumber || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Aadhar Image</p>
                                            {farmer.aadharImage ? (
                                                <a href={getImageUrl(farmer.aadharImage)!} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline bg-primary/5 w-max px-3 py-2 rounded-lg border border-primary/20">
                                                    <Eye className="w-4 h-4" /> View Aadhar ID
                                                </a>
                                            ) : <span className="text-sm text-muted-foreground">Not uploaded</span>}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Organic Certificate</p>
                                            {farmer.organicCertificate ? (
                                                <a href={getImageUrl(farmer.organicCertificate)!} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-blue-400 hover:underline bg-blue-500/10 w-max px-3 py-2 rounded-lg border border-blue-500/20">
                                                    <FileText className="w-4 h-4" /> View Certificate
                                                </a>
                                            ) : <span className="text-sm text-amber-500">Missing Certificate</span>}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Geo-Tagged Video</p>
                                            {farmer.farmVideo ? (
                                                <a href={getImageUrl(farmer.farmVideo)!} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-purple-400 hover:underline bg-purple-500/10 w-max px-3 py-2 rounded-lg border border-purple-500/20">
                                                    <PlayCircle className="w-4 h-4" /> Watch Farm Video
                                                </a>
                                            ) : <span className="text-sm text-amber-500">Missing Video</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            {farmer.kycStatus === 'PENDING' && (
                                <div className="p-4 bg-background border-t border-border flex items-center justify-end gap-3">
                                    <button 
                                        onClick={() => handleAction(farmer.id, 'REJECT')}
                                        disabled={processingId === farmer.id}
                                        className="px-4 py-2 text-sm font-bold text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors border border-transparent hover:border-red-500/30 disabled:opacity-50"
                                    >
                                        Reject Application
                                    </button>
                                    <button 
                                        onClick={() => handleAction(farmer.id, 'APPROVE')}
                                        disabled={processingId === farmer.id}
                                        className="px-4 py-2 text-sm font-bold text-background bg-primary hover:bg-[#25c464] rounded-lg transition-colors shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {processingId === farmer.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                                        Approve as Verified Organic
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
