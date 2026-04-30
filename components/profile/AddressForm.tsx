"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { MapPin, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { INDIAN_STATES } from "@/components/ui/IndianStates";

export function AddressForm({ onSuccess }: { onSuccess?: () => void }) {
    const router = useRouter();
    const { success, error } = useToast();
    const [loading, setLoading] = useState(false);
    const [locating, setLocating] = useState(false);

    const [formData, setFormData] = useState({
        name: "", // Home, Work
        street: "",
        city: "",
        state: "",
        zip: "",
        phone: "",
        isDefault: false,
        lat: null as number | null,
        lng: null as number | null,
    });

    const handleLocation = () => {
        if (!navigator.geolocation) {
            error("Geolocation is not supported by your browser");
            return;
        }

        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setFormData(prev => ({ ...prev, lat: latitude, lng: longitude }));

                try {
                    // Reverse Geocode using OpenStreetMap (Nominatim) via API route to avoid 403 Forbidden
                    const res = await fetch(`/api/geocode?lat=${latitude}&lon=${longitude}`);
                    const data = await res.json();

                    if (data && data.address) {
                        const addr = data.address;
                        // Better street construction for India
                        const streetParts = [
                            addr.house_number,
                            addr.building,
                            addr.road,
                            addr.street,
                            addr.suburb || addr.neighbourhood || addr.residential
                        ].filter(Boolean);

                        // Intelligent City Mapping
                        const detectedCity = addr.city || addr.town || addr.village || addr.county || addr.state_district || "";

                        // normalize state name if possible
                        const detectedState = addr.state || "";

                        setFormData(prev => ({
                            ...prev,
                            street: streetParts.join(", "),
                            city: detectedCity,
                            state: detectedState,
                            zip: addr.postcode || "",
                            lat: latitude,
                            lng: longitude
                        }));
                        success("Location detected successfully!");
                    }
                } catch (err) {
                    console.error("Geocoding error:", err);
                    error("Found coordinates, but couldn't get address details.");
                } finally {
                    setLocating(false);
                }
            },
            (err) => {
                console.error("Geolocation error:", err);
                error("Unable to retrieve your location.");
                setLocating(false);
            }
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic Validation
        if (!/^\d{6}$/.test(formData.zip.replace(/\s/g, ''))) {
            error("Please enter a valid 6-digit Pincode.");
            return;
        }
        if (!/^\+?(\d{10,13})$/.test(formData.phone.replace(/[\s-]/g, ''))) {
            error("Please enter a valid phone number.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/user/addresses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to save");

            success("Address saved successfully!");
            setFormData({
                name: "", street: "", city: "", state: "", zip: "", phone: "",
                isDefault: false, lat: null, lng: null
            });
            onSuccess?.();
            router.refresh();
        } catch (err) {
            error("Failed to save address.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-[#1c2e24] p-6 rounded-2xl border border-[#2d4035]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-white">Add New Address</h3>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleLocation}
                    disabled={locating}
                    className="text-[#30e87a] border-[#30e87a]/20 hover:bg-[#30e87a]/10 hover:text-[#30e87a]"
                >
                    {locating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <MapPin className="w-4 h-4 mr-2" />}
                    Get My Location
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-[#9db8a8]">Label (e.g. Home)</label>
                    <input
                        required
                        type="text"
                        placeholder="Home, Work..."
                        className="w-full rounded-xl border border-[#2d4035] bg-[#112117] px-4 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#30e87a] placeholder-[#5c6e63]"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-[#9db8a8]">Phone Number</label>
                    <input
                        required
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="w-full rounded-xl border border-[#2d4035] bg-[#112117] px-4 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#30e87a] placeholder-[#5c6e63]"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1 text-[#9db8a8]">Street Address</label>
                <input
                    required
                    type="text"
                    placeholder="Flat No, Building, Street"
                    className="w-full rounded-xl border border-[#2d4035] bg-[#112117] px-4 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#30e87a] placeholder-[#5c6e63]"
                    value={formData.street}
                    onChange={e => setFormData({ ...formData, street: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-[#9db8a8]">City / District</label>
                    <input
                        required
                        type="text"
                        placeholder="Chennai"
                        className="w-full rounded-xl border border-[#2d4035] bg-[#112117] px-4 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#30e87a] placeholder-[#5c6e63]"
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-[#9db8a8]">State</label>
                    <select
                        required
                        className="w-full rounded-xl border border-[#2d4035] bg-[#112117] px-4 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#30e87a] appearance-none"
                        value={formData.state}
                        onChange={e => setFormData({ ...formData, state: e.target.value })}
                    >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map(st => (
                            <option key={st} value={st}>{st}</option>
                        ))}
                    </select>
                </div>
                <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium mb-1 text-[#9db8a8]">Pincode</label>
                    <input
                        required
                        type="text"
                        placeholder="600001"
                        maxLength={6}
                        className="w-full rounded-xl border border-[#2d4035] bg-[#112117] px-4 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#30e87a] placeholder-[#5c6e63]"
                        value={formData.zip}
                        onChange={e => {
                            const val = e.target.value.replace(/\D/g, ''); // Numeric only
                            setFormData({ ...formData, zip: val });
                        }}
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="isDefault"
                    className="rounded border-[#2d4035] bg-[#112117] text-[#30e87a] focus:ring-[#30e87a]"
                    checked={formData.isDefault}
                    onChange={e => setFormData({ ...formData, isDefault: e.target.checked })}
                />
                <label htmlFor="isDefault" className="text-sm font-medium text-[#9db8a8]">Set as default address</label>
            </div>

            <Button type="submit" variant="primary" disabled={loading} className="w-full bg-[#30e87a] text-[#112117] hover:bg-[#30e87a]/90 font-bold">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Save Address
            </Button>
        </form>
    );
}
