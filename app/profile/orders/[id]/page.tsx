import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft, Package, MapPin, Calendar, CreditCard, ChevronRight, ClipboardList, PackageSearch, Truck, CheckCircle2, XCircle } from 'lucide-react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imageUtils';

export default async function OrderDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/api/auth/signin');
    }

    const order = await prisma.order.findUnique({
        where: {
            id: params.id,
        },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    });

    if (!order) {
        notFound();
    }

    // Security check: Ensure order belongs to logged-in user
    if (order.userId !== session.user.id) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
                <p className="text-[#9db8a8]">You are not authorized to view this order.</p>
                <Link href="/profile/orders" className="text-[#30e87a] mt-4 inline-block hover:underline">
                    Return to orders
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <Link href="/profile/orders" className="inline-flex items-center text-[#9db8a8] hover:text-[#30e87a] transition-colors mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Order History
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                            Order #{order.id.slice(-8)}
                        </h1>
                        <p className="text-[#9db8a8] text-sm mt-1">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>
                    <div className={`px-4 py-2 rounded-full font-bold text-sm inline-flex items-center gap-2
                        ${order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-500' :
                            order.status === 'SHIPPED' ? 'bg-blue-500/10 text-blue-500' :
                                order.status === 'PROCESSING' ? 'bg-purple-500/10 text-purple-500' :
                                    'bg-yellow-500/10 text-yellow-500'
                        }`}
                    >
                        <Package className="w-4 h-4" />
                        {order.status}
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Main Content: Items & Tracking */}
                <div className="md:col-span-2 space-y-6">
                    {/* Order Tracking Timeline */}
                    <div className="bg-[#1c2e24] border border-[#2d4035] rounded-2xl p-6 md:p-8">
                        <h2 className="font-bold text-white mb-8 text-lg">Track Order</h2>
                        
                        {order.status === 'CANCELLED' ? (
                            <div className="flex flex-col items-center justify-center py-6 text-red-500">
                                <XCircle className="w-12 h-12 mb-3 opacity-80" />
                                <h3 className="text-xl font-bold">Order Cancelled</h3>
                                <p className="text-sm text-red-400/80 mt-1">This order has been cancelled and will not be delivered.</p>
                            </div>
                        ) : (
                            <div className="relative">
                                {/* Horizontal Line Background (Desktop) */}
                                <div className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-1 bg-[#2d4035] rounded-full z-0">
                                    <div className="h-full bg-[#30e87a] transition-all duration-500 rounded-full" style={{ width: `${(Math.min(Math.max(0, ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].indexOf(order.status)), 3) / 3) * 100}%` }}></div>
                                </div>
                                {/* Vertical Line Background (Mobile) */}
                                <div className="md:hidden absolute top-[24px] bottom-[24px] left-[22px] w-1 bg-[#2d4035] rounded-full z-0">
                                    <div className="w-full bg-[#30e87a] transition-all duration-500 rounded-full" style={{ height: `${(Math.min(Math.max(0, ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].indexOf(order.status)), 3) / 3) * 100}%` }}></div>
                                </div>

                                <div className="flex flex-col md:flex-row justify-between relative z-10 gap-8 md:gap-0">
                                    {[
                                        { id: 'PENDING', label: 'Order Placed', icon: ClipboardList, desc: 'We have received your order' },
                                        { id: 'PROCESSING', label: 'Processing', icon: PackageSearch, desc: 'Your order is being prepared' },
                                        { id: 'SHIPPED', label: 'Shipped', icon: Truck, desc: 'Your order is on the way' },
                                        { id: 'DELIVERED', label: 'Delivered', icon: CheckCircle2, desc: 'Order has been delivered' }
                                    ].map((step, index, arr) => {
                                        // Determine status progression
                                        const statusFlow = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
                                        const currentStatusIndex = Math.max(0, statusFlow.indexOf(order.status));
                                        
                                        const isCompleted = index < currentStatusIndex;
                                        const isCurrent = index === currentStatusIndex;
                                        const isUpcoming = index > currentStatusIndex;

                                        return (
                                            <div key={step.id} className="flex md:flex-col items-center md:w-1/4 gap-4 md:gap-3 group">

                                                {/* Icon Circle */}
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 transition-all duration-300
                                                    ${isCompleted ? 'bg-[#30e87a] border-[#1c2e24] text-[#112117] shadow-[0_0_15px_rgba(48,232,122,0.4)]' : 
                                                      isCurrent ? 'bg-[#112117] border-[#30e87a] text-[#30e87a] shadow-[0_0_10px_rgba(48,232,122,0.2)]' : 
                                                      'bg-[#112117] border-[#2d4035] text-[#9db8a8]'}`}
                                                >
                                                    <step.icon className={`w-5 h-5 ${isCurrent && 'animate-pulse'}`} />
                                                </div>

                                                {/* Label and Description */}
                                                <div className="md:text-center flex flex-col md:items-center">
                                                    <h3 className={`font-bold text-sm md:text-base ${isCompleted || isCurrent ? 'text-white' : 'text-[#9db8a8]'}`}>
                                                        {step.label}
                                                    </h3>
                                                    <p className={`text-xs mt-0.5 ${isCompleted || isCurrent ? 'text-[#30e87a]' : 'text-[#5c7a68]'}`}>
                                                        {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
                                                    </p>
                                                    <p className="hidden md:block text-xs text-[#9db8a8] mt-1 max-w-[120px] mx-auto text-center leading-tight">
                                                        {step.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Payment Pending Alert */}
                    {(order.status === 'PENDING_PAYMENT' || order.status === 'PENDING') && (
                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6">
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                <div className="bg-white p-3 rounded-xl border border-[#2d4035] shadow-sm shrink-0">
                                    {/* Using a static QR code generator for demo purposes */}
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=yogamfarms@upi&pn=YogamOrganicFarms&am=${order.total}&cu=INR`}
                                        alt="Payment QR Code"
                                        className="w-32 h-32 object-contain"
                                    />
                                </div>
                                <div className="space-y-2 text-center md:text-left">
                                    <h3 className="text-xl font-bold text-orange-500 flex items-center justify-center md:justify-start gap-2">
                                        <CreditCard className="w-5 h-5 animate-pulse" />
                                        Payment Pending
                                    </h3>
                                    <p className="text-[#9db8a8] text-sm leading-relaxed">
                                        Your order is reserved! Please scan the QR code to complete the payment of <strong className="text-white">₹{order.total.toFixed(2)}</strong>.
                                    </p>
                                    <p className="text-xs font-semibold text-orange-400">
                                        Status will update automatically after admin verification.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-[#1c2e24] border border-[#2d4035] rounded-2xl overflow-hidden">
                        <div className="p-4 border-b border-[#2d4035] bg-[#112117]/50">
                            <h2 className="font-bold text-white">Items in your order</h2>
                        </div>
                        <div className="divide-y divide-[#2d4035]">
                            {order.items.map((item) => (
                                <div key={item.id} className="p-4 flex gap-4 hover:bg-[#253b30] transition-colors">
                                    <div className="h-20 w-20 bg-[#112117] rounded-lg relative overflow-hidden shrink-0 border border-[#2d4035]">
                                        {getImageUrl(item.product.images) ? (
                                            <Image
                                                src={getImageUrl(item.product.images)!}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[#9db8a8]">
                                                <Package className="w-8 h-8" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-white">{item.product.name}</h3>
                                        <p className="text-sm text-[#9db8a8]">Unit: {item.product.unit}</p>
                                        <div className="mt-2 flex items-center justify-between">
                                            <span className="text-sm text-[#9db8a8]">Qty: <span className="text-white font-medium">{item.quantity}</span></span>
                                            <span className="font-bold text-white">₹{item.price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-[#112117]/30 border-t border-[#2d4035] flex justify-between items-center">
                            <span className="text-[#9db8a8]">Total Amount</span>
                            <span className="text-xl font-bold text-[#30e87a]">₹{order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Details */}
                <div className="space-y-6">
                    {/* Shipping Address */}
                    <div className="bg-[#1c2e24] border border-[#2d4035] rounded-2xl p-6">
                        <h2 className="font-bold text-white mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-[#30e87a]" />
                            Shipping Details
                        </h2>
                        <div className="text-[#9db8a8] text-sm space-y-1">
                            <p className="text-white font-medium">{order.shippingName}</p>
                            <p>{order.shippingStreet}</p>
                            <p>{order.shippingCity}, {order.shippingState} {order.shippingZip}</p>
                            <p className="mt-2 text-white">{order.shippingPhone}</p>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-[#1c2e24] border border-[#2d4035] rounded-2xl p-6">
                        <h2 className="font-bold text-white mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-[#30e87a]" />
                            Payment Info
                        </h2>
                        <div className="space-y-3 text-sm">
                            {(order as any).paymentId && (
                                <div className="flex justify-between items-start text-[#9db8a8] border-b border-[#2d4035] pb-2 mb-2 gap-4">
                                    <span className="shrink-0">Transaction ID</span>
                                    <span className="font-mono text-xs text-white bg-[#112117] px-2 py-0.5 rounded break-all text-right">{(order as any).paymentId}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-[#9db8a8]">
                                <span>Subtotal</span>
                                <span>₹{order.total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-[#9db8a8]">
                                <span>Shipping</span>
                                <span className="text-[#30e87a]">Free</span>
                            </div>
                            <div className="pt-3 border-t border-[#2d4035] flex justify-between font-bold text-white text-lg">
                                <span>Total</span>
                                <span>₹{order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
