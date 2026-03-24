"use client";

import React from 'react';
import Header from '@/components/Header';
import { CreditCard, Truck, MapPin, Calendar, Lock, ShoppingCart, Trash2, ChevronRight } from 'lucide-react';
import { useCurrency } from '@/lib/CurrencyContext';
import { useLanguage } from '@/lib/LanguageContext';
import { useCart } from '@/lib/CartContext';
import { api, getStorageUrl } from '@/lib/api';
import { useRouter } from 'next/navigation';

const Checkout = () => {
    const { t } = useLanguage();
    const { formatPrice } = useCurrency();
    const { cartItems, cartCount, removeFromCart, updateQuantity, clearCart, loading } = useCart();
    const router = useRouter();

    const [formData, setFormData] = React.useState({
        recipient_name: '',
        recipient_phone: '',
        district_id: '',
        delivery_address: '',
        delivery_date: '',
        message_card: '',
    });

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [districts, setDistricts] = React.useState<any[]>([]);

    React.useEffect(() => {
        const fetchDistricts = async () => {
            try {
                const data = await api.getDistricts();
                setDistricts(data);
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, district_id: data[0].id.toString() }));
                }
            } catch (err) {
                console.error("Failed to fetch districts:", err);
            }
        };
        fetchDistricts();
    }, []);

    const subtotal = cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
    const deliveryFee = 10; // Fixed fee for now
    const total = subtotal + deliveryFee;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.createOrder({
                ...formData,
                subtotal,
                delivery_fee: deliveryFee,
                total,
                items: cartItems.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unit_price: item.product?.price || 0,
                    total_price: (item.product?.price || 0) * item.quantity,
                })),
            });
            await clearCart();
            alert("Order placed successfully!");
            router.push('/account');
        } catch (err) {
            console.error("Order failed:", err);
            alert("Failed to place order. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (cartCount === 0) {
        return (
            <main className="min-h-screen bg-cream">
                <Header />
                <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-6">
                    <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8">
                        <ShoppingCart size={40} />
                    </div>
                    <h1 className="text-4xl font-black text-gray-800 tracking-tighter uppercase italic">Your Cart is <span className="text-primary italic">Empty</span></h1>
                    <p className="text-gray-500 font-bold max-w-md mx-auto">Looks like you haven't added any gifts yet. Browse our collections to find something special!</p>
                    <button 
                        onClick={() => router.push('/')}
                        className="bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-transform inline-block"
                    >
                        Start Shopping
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#FDFBF9]">
            <Header />

            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="flex flex-col lg:flex-row gap-8 xl:gap-14">
                    {/* Left side: Cart Items & Forms */}
                    <div className="flex-grow space-y-12">
                        <div className="flex flex-col gap-2 mb-4">
                            <h1 className="text-4xl lg:text-5xl font-serif font-black text-gray-900 tracking-tight">
                                Secure <span className="text-primary italic">Checkout</span>
                            </h1>
                            <div className="w-20 h-1 bg-accent rounded-full"></div>
                        </div>

                        {/* Cart Items Summary */}
                        <section className="bg-white p-8 lg:p-14 rounded-[2.5rem] shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-gray-100/60 transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.06)]">
                            <h2 className="text-xl font-sans font-black text-gray-900 mb-12 flex items-center gap-4 uppercase tracking-[0.2em]">
                                <span className="bg-primary/5 p-3 rounded-2xl flex items-center justify-center">
                                    <ShoppingCart className="text-primary w-5 h-5" />
                                </span>
                                <span>Your Selection</span>
                                <span className="text-primary font-serif italic text-2xl lowercase font-medium opacity-60">({cartCount} items)</span>
                            </h2>
                            <div className="space-y-12">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex flex-col sm:flex-row gap-8 pb-12 border-b border-gray-100 last:border-0 last:pb-0 group">
                                        <div className="w-full sm:w-36 h-44 sm:h-36 rounded-[2rem] overflow-hidden bg-gray-50 flex-shrink-0 relative">
                                            <img 
                                                src={getStorageUrl(item.product?.image || null)} 
                                                alt={item.product?.name} 
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                            />
                                            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[2rem]"></div>
                                        </div>
                                        
                                        <div className="flex-grow flex flex-col justify-between py-1">
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="space-y-2">
                                                    <h3 className="text-xl font-serif font-black text-gray-900 group-hover:text-primary transition-colors duration-300">{item.product?.name}</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="text-[9px] font-sans font-black text-primary/60 uppercase tracking-[0.15em] bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                                                            {item.product?.category?.name || 'Gift Item'}
                                                        </span>
                                                        {item.product?.is_express && (
                                                            <span className="text-[9px] font-sans font-black text-accent font-black uppercase tracking-[0.15em] bg-accent/10 px-3 py-1 rounded-full border border-accent/20 flex items-center gap-1">
                                                                Express
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-3 text-gray-300 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all duration-300"
                                                    title="Remove"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>

                                            <div className="flex flex-wrap justify-between items-center gap-6 mt-8">
                                                <div className="flex items-center bg-gray-50/60 rounded-xl p-1 border border-gray-100/50 group-hover:border-accent/20 transition-all duration-500">
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                        className="w-9 h-9 flex items-center justify-center font-black text-gray-400 hover:text-primary hover:bg-white rounded-lg transition-all duration-300"
                                                    >-</button>
                                                    <span className="w-10 text-center text-[12px] font-sans font-black text-gray-950">{item.quantity}</span>
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-9 h-9 flex items-center justify-center font-black text-gray-400 hover:text-primary hover:bg-white rounded-lg transition-all duration-300"
                                                    >+</button>
                                                </div>
                                                
                                                <div className="text-right">
                                                    <div className="text-2xl font-serif font-black text-gray-900 tracking-tight">
                                                        {formatPrice((item.product?.price || 0) * item.quantity)}
                                                    </div>
                                                    {item.quantity > 1 && (
                                                        <p className="text-[10px] font-sans font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                            {formatPrice(item.product?.price || 0)} <span className="opacity-50">per unit</span>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <form onSubmit={handleSubmit} className="space-y-12 pb-32">
                            {/* Recipient Details */}
                            <section className="bg-white p-8 lg:p-14 rounded-[2.5rem] shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-gray-100/60">
                                <div className="flex items-center gap-4 mb-12">
                                    <div className="p-3 bg-primary/5 rounded-2xl">
                                        <Truck className="text-primary w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl font-sans font-black text-gray-900 uppercase tracking-[0.2em]">Delivery Details</h2>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-sans font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Recipient's Full Name</label>
                                        <input 
                                            name="recipient_name"
                                            required
                                            value={formData.recipient_name}
                                            onChange={handleChange}
                                            type="text" 
                                            className="w-full p-6 bg-gray-50/50 border border-gray-100 focus:border-accent focus:bg-white rounded-[1.5rem] focus:outline-none transition-all duration-300 text-[15px] font-sans font-bold text-gray-800 placeholder:text-gray-300 placeholder:font-medium" 
                                            placeholder="e.g. Abdullah Al-Saleh" 
                                        />
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-sans font-black text-gray-400 uppercase tracking-[0.2em] ml-1">WhatsApp Contact (Syria)</label>
                                        <div className="relative group">
                                            <input 
                                                name="recipient_phone"
                                                required
                                                value={formData.recipient_phone}
                                                onChange={handleChange}
                                                type="tel" 
                                                className="w-full p-6 bg-gray-50/50 border border-gray-100 focus:border-accent focus:bg-white rounded-[1.5rem] focus:outline-none transition-all duration-300 text-[15px] font-sans font-bold text-gray-800 placeholder:text-gray-300" 
                                                placeholder="+963 9-- --- ---" 
                                            />
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-1.5 items-center bg-green-50 px-3 py-1 rounded-full border border-green-100">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                                <span className="text-[8px] font-sans font-black text-green-600 uppercase tracking-tighter">Live Verification</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-4">
                                        <label className="text-[10px] font-sans font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Damascus District</label>
                                        <div className="relative group">
                                            <select 
                                                name="district_id"
                                                value={formData.district_id}
                                                onChange={handleChange}
                                                className="w-full p-6 bg-gray-50/50 border border-gray-100 focus:border-accent focus:bg-white rounded-[1.5rem] focus:outline-none transition-all duration-300 text-[15px] font-sans font-black text-gray-800 appearance-none cursor-pointer"
                                            >
                                                {districts.map(d => (
                                                    <option key={d.id} value={d.id}>{d.name}</option>
                                                ))}
                                            </select>
                                            <MapPin className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-primary transition-colors pointer-events-none" size={18} />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-4">
                                        <label className="text-[10px] font-sans font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Complete Delivery Address</label>
                                        <textarea 
                                            name="delivery_address"
                                            required
                                            value={formData.delivery_address}
                                            onChange={handleChange}
                                            rows={3} 
                                            className="w-full p-6 bg-gray-50/50 border border-gray-100 focus:border-accent focus:bg-white rounded-[1.5rem] focus:outline-none transition-all duration-300 text-[15px] font-sans font-bold text-gray-800 resize-none placeholder:text-gray-300" 
                                            placeholder="Street, Building, Landmark... Detail helps our courier deliver faster!" 
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-sans font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Scheduled Date</label>
                                        <div className="relative group">
                                            <input 
                                                name="delivery_date"
                                                required
                                                value={formData.delivery_date}
                                                onChange={handleChange}
                                                type="date" 
                                                className="w-full p-6 bg-gray-50/50 border border-gray-100 focus:border-accent focus:bg-white rounded-[1.5rem] focus:outline-none transition-all duration-300 text-[15px] font-sans font-black text-gray-800" 
                                            />
                                            <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={18} />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-sans font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Personal Message Card</label>
                                        <input 
                                            name="message_card"
                                            value={formData.message_card}
                                            onChange={handleChange}
                                            type="text" 
                                            className="w-full p-6 bg-gray-50/50 border border-gray-100 focus:border-accent focus:bg-white rounded-[1.5rem] focus:outline-none transition-all duration-300 text-[15px] font-sans font-bold text-gray-800 placeholder:text-gray-300" 
                                            placeholder="Write a heartfelt note..." 
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Payment Method */}
                            <section className="bg-white p-8 lg:p-14 rounded-[2.5rem] shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-gray-100/60">
                                <div className="flex items-center gap-4 mb-12">
                                    <div className="p-3 bg-primary/5 rounded-2xl">
                                        <CreditCard className="text-primary w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl font-sans font-black text-gray-900 uppercase tracking-[0.2em]">Payment Selection</h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="relative group cursor-pointer overflow-hidden rounded-[2rem] border-2 border-primary bg-primary/[0.02]">
                                        <div className="p-8 flex items-center justify-between">
                                            <div className="flex items-center gap-8">
                                                <div className="bg-white p-4 rounded-2xl shadow-sm group-hover:scale-105 transition-transform duration-500">
                                                    <CreditCard className="text-primary w-6 h-6" />
                                                </div>
                                                <div>
                                                    <span className="text-lg font-serif font-black text-gray-900 block mb-1">Global Card Gateway</span>
                                                    <div className="flex gap-2">
                                                        <span className="bg-white px-2 py-0.5 rounded border border-gray-100 text-[8px] font-black uppercase text-gray-400">Visa</span>
                                                        <span className="bg-white px-2 py-0.5 rounded border border-gray-100 text-[8px] font-black uppercase text-gray-400">Mastercard</span>
                                                        <span className="bg-white px-2 py-0.5 rounded border border-gray-100 text-[8px] font-black uppercase text-gray-400">Amex</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center p-1 bg-white">
                                                <div className="w-full h-full bg-primary rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative group cursor-not-allowed opacity-40 rounded-[2rem] border-2 border-gray-100 bg-gray-50/50 grayscale transition-all">
                                        <div className="p-8 flex items-center justify-between">
                                            <div className="flex items-center gap-8">
                                                <div className="bg-white p-4 rounded-2xl">
                                                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="w-6 h-6" alt="PayPal" />
                                                </div>
                                                <div>
                                                    <span className="text-lg font-serif font-black text-gray-400 block mb-1">PayPal Checkout</span>
                                                    <span className="text-[10px] font-sans font-black text-primary uppercase tracking-widest">Coming Early 2026</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 p-5 bg-accent/5 rounded-2xl border border-accent/10 flex items-start gap-4">
                                    <div className="bg-white p-2 rounded-lg shadow-sm mt-0.5">
                                        <Lock size={14} className="text-accent" />
                                    </div>
                                    <p className="text-[12px] font-sans font-bold text-gray-600 leading-relaxed italic">
                                        Your payment is secured by industry-leading AES-256 encryption. We utilize advanced fraud prevention protocols to keep your data safe.
                                    </p>
                                </div>
                            </section>

                            {/* Submit Button for Mobile Only */}
                            <div className="lg:hidden pb-12">
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-primary text-white py-7 rounded-[2.5rem] font-sans font-black uppercase tracking-[0.25em] shadow-2xl hover:bg-primary-dark transition-all flex items-center justify-center gap-4"
                                >
                                    {isSubmitting ? (
                                        <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>Place Gift Order • {formatPrice(total)}</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right side: Sidebar Summary */}
                    <aside className="w-full lg:w-[420px] lg:sticky lg:top-32 h-fit">
                        <div className="bg-[#1F1D1C] text-white p-10 lg:p-12 rounded-[4rem] shadow-[0_35px_60px_-15px_rgba(31,29,28,0.3)] space-y-12 relative overflow-hidden group">
                            {/* Premium textures & gradients */}
                            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[100px] -mr-40 -mt-40 transition-all duration-700 group-hover:bg-primary/30"></div>
                            <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-[100px] -ml-40 -mb-40"></div>
                            
                            <div className="relative">
                                <div className="flex items-center justify-between mb-16">
                                    <h3 className="text-2xl font-serif font-black uppercase tracking-[0.2em] text-white/90 italic">Order <span className="text-accent not-italic">Summary</span></h3>
                                    <div className="px-4 py-1.5 bg-white/5 rounded-full border border-white/10 text-[9px] font-sans font-black uppercase tracking-[0.2em] text-white/50">
                                        Global Pay
                                    </div>
                                </div>
                                
                                <div className="space-y-8">
                                    <div className="flex justify-between items-center group/item">
                                        <span className="text-[11px] font-sans font-black uppercase tracking-[0.2em] text-white/30 group-hover/item:text-white/60 transition-colors">Selection Total</span>
                                        <span className="text-xl font-serif font-black tracking-tighter text-white/90">{formatPrice(subtotal)}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center group/item">
                                        <div className="space-y-1">
                                            <span className="text-[11px] font-sans font-black uppercase tracking-[0.2em] text-white/30 group-hover/item:text-white/60 transition-colors">Premium Logistics</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[8px] font-sans font-black text-accent uppercase tracking-widest bg-accent/10 px-2 py-0.5 rounded-sm">Secured Delivery</span>
                                            </div>
                                        </div>
                                        <span className="text-xl font-serif font-black tracking-tighter text-white/90">{formatPrice(deliveryFee)}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center group/item opacity-60">
                                        <span className="text-[11px] font-sans font-black uppercase tracking-[0.2em] text-white/30 group-hover/item:text-white/60 transition-colors">Local Tax & Duty</span>
                                        <span className="text-xs font-sans font-black uppercase tracking-widest text-accent">Waived</span>
                                    </div>
                                    
                                    <div className="pt-8 mt-10 border-t border-white/5 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-sans font-black uppercase tracking-[0.2em] text-accent/80 leading-none mb-1">Total Payable</span>
                                                <span className="text-[8px] font-sans font-bold text-white/20 uppercase tracking-widest italic">Encrypted Securely</span>
                                            </div>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-sm font-serif font-black text-white/60 mb-2">$</span>
                                                <span className="text-4xl font-serif font-black italic tracking-tighter text-white">{formatPrice(total).replace('$', '').replace('S£', '').split('.')[0]}</span>
                                                <span className="text-lg font-serif font-black text-white/20 italic">.{formatPrice(total).split('.')[1] || '00'}</span>
                                            </div>
                                        </div>
                                        
                                        <button 
                                            onClick={() => {
                                                const form = document.querySelector('form');
                                                if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                                            }}
                                            disabled={isSubmitting}
                                            className="w-full bg-primary text-white py-5 rounded-2xl font-sans font-black uppercase tracking-[0.2em] shadow-[0_15px_35px_rgba(198,40,74,0.3)] hover:shadow-[0_15px_45px_rgba(198,40,74,0.5)] hover:-translate-y-1 transition-all duration-500 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed group relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                            <span className="relative z-10 flex items-center justify-center gap-3">
                                                {isSubmitting ? (
                                                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <>Pay Securely <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                                                )}
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-12 pt-10 border-t border-white/5 space-y-8 relative">
                                    <div className="flex items-center gap-4 text-[9px] uppercase font-serif font-bold tracking-[0.4em] text-white/20">
                                        <div className="flex-grow h-[1px] bg-white/5"></div>
                                        Secure Transfer
                                        <div className="flex-grow h-[1px] bg-white/5"></div>
                                    </div>
                                    <div className="flex flex-wrap justify-between items-center gap-6 opacity-20 grayscale transition-all duration-700 group-hover:opacity-40 group-hover:grayscale-0">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3 shadow-sm" alt="Visa" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-5" alt="Mastercard" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-5" alt="Paypal" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" className="h-5" alt="Stripe" />
                                    </div>
                                    <div className="flex items-center justify-center gap-3 text-[9px] font-sans font-black text-white/10 uppercase tracking-[0.3em]">
                                        <Lock size={12} />
                                        256-Bit AES Encryption
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
};

export default Checkout;
