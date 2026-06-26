"use client";

import { useState } from "react";
import { Loader2, MapPin, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { INDIAN_STATES } from "@/components/ui/IndianStates";
import Link from "next/link";

interface CheckoutAddressFormProps {
    onSubmit: (data: any) => Promise<void> | void;
}

export function CheckoutAddressForm({ onSubmit }: CheckoutAddressFormProps) {
    const { success, error } = useToast();
    const [loading, setLoading] = useState(false);
    const [locating, setLocating] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        street: "",
        apartment: "",
        city: "",
        state: "",
        zip: "",
        phone: "",
        saveInfo: true,
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
                    const res = await fetch(`/api/geocode?lat=${latitude}&lon=${longitude}`);
                    const data = await res.json();

                    if (data && data.address) {
                        const addr = data.address;
                        const streetParts = [
                            addr.house_number,
                            addr.building,
                            addr.road,
                            addr.street,
                            addr.suburb || addr.neighbourhood || addr.residential
                        ].filter(Boolean);

                        const detectedCity = addr.city || addr.town || addr.village || addr.county || addr.state_district || "";
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

        // Validation
        if (!/^\d{6}$/.test(formData.zip.replace(/\s/g, ''))) {
            error("Please enter a valid 6-digit Pincode.");
            return;
        }
        if (!/^\+?(\d{10,13})$/.test(formData.phone.replace(/[\s-]/g, ''))) {
            error("Please enter a valid phone number.");
            return;
        }

        setLoading(true);
        // Simulate API call or just proceed
        await new Promise(r => setTimeout(r, 500));
        await onSubmit(formData);
        setLoading(false);
    };

    return (
        <form className="flex flex-col gap-6 bg-surface border border-border p-6 sm:p-8 rounded-3xl shadow-sm" onSubmit={handleSubmit}>
            {/* Header / Get Location */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Shipping Address</h2>
                    <p className="text-muted-foreground text-sm mt-1">Where should we send your organic essentials?</p>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleLocation}
                    disabled={locating}
                    className="text-primary border-primary/30 hover:bg-primary/10 hover:text-primary rounded-full px-4"
                >
                    {locating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <MapPin className="w-4 h-4 mr-2" />}
                    Get Location
                </Button>
            </div>

            {/* Name Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <label className="flex flex-col flex-1">
                    <span className="text-sm font-semibold text-foreground mb-1.5">First name</span>
                    <input
                        className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                        placeholder="Sage"
                        required
                        type="text"
                        value={formData.firstName}
                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    />
                </label>
                <label className="flex flex-col flex-1">
                    <span className="text-sm font-semibold text-foreground mb-1.5">Last name</span>
                    <input
                        className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                        placeholder="Gardener"
                        required
                        type="text"
                        value={formData.lastName}
                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    />
                </label>
            </div>

            {/* Address Row */}
            <label className="flex flex-col flex-1">
                <span className="text-sm font-semibold text-foreground mb-1.5">Address</span>
                <input
                    className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                    placeholder="123 Green Earth Way"
                    required
                    type="text"
                    value={formData.street}
                    onChange={e => setFormData({ ...formData, street: e.target.value })}
                />
            </label>

            {/* Apartment Row */}
            <label className="flex flex-col flex-1">
                <span className="text-sm font-semibold text-foreground mb-1.5">Apartment, suite, etc. (optional)</span>
                <input
                    className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                    placeholder="Apt 4B"
                    type="text"
                    value={formData.apartment}
                    onChange={e => setFormData({ ...formData, apartment: e.target.value })}
                />
            </label>

            {/* City State Zip Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex flex-col flex-1">
                    <span className="text-sm font-semibold text-foreground mb-1.5">City / District</span>
                    <input
                        className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                        placeholder="Chennai"
                        required
                        type="text"
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                    />
                </label>
                <label className="flex flex-col flex-1">
                    <span className="text-sm font-semibold text-foreground mb-1.5">State</span>
                    <div className="relative">
                        <select
                            className="w-full h-12 px-4 appearance-none rounded-xl bg-background border border-border text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none cursor-pointer"
                            value={formData.state}
                            onChange={e => setFormData({ ...formData, state: e.target.value })}
                            required
                        >
                            <option value="">Select State...</option>
                            {INDIAN_STATES.map(st => (
                                <option key={st} value={st}>{st}</option>
                            ))}
                        </select>
                    </div>
                </label>
                <label className="flex flex-col flex-1">
                    <span className="text-sm font-semibold text-foreground mb-1.5">Pincode</span>
                    <input
                        className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                        placeholder="600001"
                        required
                        type="text"
                        maxLength={6}
                        value={formData.zip}
                        onChange={e => setFormData({ ...formData, zip: e.target.value.replace(/\D/g, '') })}
                    />
                </label>
            </div>

            {/* Phone Row */}
            <label className="flex flex-col flex-1">
                <div className="flex justify-between mb-1.5">
                    <span className="text-sm font-semibold text-foreground">Phone</span>
                </div>
                <input
                    className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                    placeholder="+91 98765 43210"
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
            </label>

            {/* Checkbox */}
            <div className="flex items-center gap-3 pt-2">
                <div className="relative flex items-center">
                    <input
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-lg border border-border bg-background checked:border-primary checked:bg-primary transition-all"
                        id="save-info"
                        type="checkbox"
                        checked={formData.saveInfo}
                        onChange={e => setFormData({ ...formData, saveInfo: e.target.checked })}
                    />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-foreground opacity-0 pointer-events-none peer-checked:opacity-100 font-bold">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
                <label className="text-sm font-medium text-foreground cursor-pointer select-none" htmlFor="save-info">Save this information for next time</label>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-border">
                <Link href="/shop" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium text-sm">
                    <ArrowLeft className="w-4 h-4" />
                    Return to Cart
                </Link>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto h-12 px-8 bg-primary hover:opacity-90 text-primary-foreground font-extrabold rounded-full transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-50 text-sm"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>
                        Continue to Payment
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>}
                </button>
            </div>
        </form>
    );
}
