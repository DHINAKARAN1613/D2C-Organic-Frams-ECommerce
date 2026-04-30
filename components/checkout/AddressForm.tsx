'use client';

import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useState, useEffect } from 'react';

// ... (interface remains same) ->
interface AddressFormProps {
    onSubmit: (address: any) => void;
    isSubmitting: boolean;
}

export function AddressForm({ onSubmit, isSubmitting }: AddressFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        location: '',
    });
    const [isValidatingZip, setIsValidatingZip] = useState(false);

    useEffect(() => {
        if (formData.zip.length === 6) {
            const fetchAddress = async () => {
                setIsValidatingZip(true);
                try {
                    const response = await fetch(`https://api.postalpincode.in/pincode/${formData.zip}`);
                    const data = await response.json();

                    if (data && data[0].Status === 'Success') {
                        const postOffice = data[0].PostOffice[0];
                        setFormData(prev => ({
                            ...prev,
                            city: postOffice.District,
                            state: postOffice.State
                        }));
                    }
                } catch (error) {
                    console.error("Failed to fetch address details", error);
                } finally {
                    setIsValidatingZip(false);
                }
            };
            fetchAddress();
        }
    }, [formData.zip]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Shipping Address</h3>
                <div className="grid grid-cols-1 gap-4">
                    <Input
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        name="street"
                        placeholder="Street Address"
                        value={formData.street}
                        onChange={handleChange}
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <Input
                                name="zip"
                                placeholder="ZIP / Pincode"
                                value={formData.zip}
                                onChange={handleChange}
                                required
                                maxLength={6}
                            />
                            {isValidatingZip && (
                                <span className="absolute right-3 top-2.5 text-xs text-blue-500 animate-pulse font-medium">
                                    Fetching...
                                </span>
                            )}
                        </div>
                        <Input
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            name="city"
                            placeholder="City"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            name="state"
                            placeholder="State"
                            value={formData.state}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <Input
                        name="location"
                        placeholder="Google Maps Location Link / Landmark (Optional)"
                        value={(formData as any).location || ''}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="pt-4">
                <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
                <div className="p-6 border rounded-xl bg-white dark:bg-zinc-900 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 border-b pb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        <h4 className="font-bold text-lg">Secure UPI Payment</h4>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
                        <div className="bg-white p-3 rounded-xl border-2 border-dashed border-gray-200 shadow-sm relative group">
                            {/* Overlay to guide user focus */}
                            <div className="absolute inset-0 border-2 border-green-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            <img
                                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=example@upi&pn=YogamOrganicFarms"
                                alt="Payment QR Code"
                                className="w-48 h-48 object-contain"
                            />
                            <p className="text-[10px] text-center mt-2 text-muted-foreground uppercase tracking-widest font-semibold">Scan to Pay</p>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                                <h5 className="font-semibold text-blue-900 dark:text-blue-300 text-sm mb-2">How to Pay:</h5>
                                <ol className="list-decimal list-inside text-sm text-blue-800 dark:text-blue-400 space-y-2">
                                    <li>Open any UPI App (GPay, PhonePe, Paytm).</li>
                                    <li>Scan the QR code shown here.</li>
                                    <li>Complete the payment.</li>
                                </ol>
                            </div>

                            <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                <input
                                    type="checkbox"
                                    className="mt-1 w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                                    checked={(formData as any).paymentConfirmed || false}
                                    onChange={(e) => setFormData(prev => ({ ...prev, paymentConfirmed: e.target.checked } as any))}
                                />
                                <div className="text-sm">
                                    <span className="font-bold block text-foreground">I have made the payment</span>
                                    <span className="text-muted-foreground">Check this box after you have successfully transferred the amount to enable order placement.</span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <Button
                type="submit"
                className="w-full h-12 text-lg font-bold"
                size="lg"
                disabled={isSubmitting || !(formData as any).paymentConfirmed}
            >
                {isSubmitting ? 'Verifying & Placing Order...' : 'Place Order Now'}
            </Button>
        </form>
    );
}
