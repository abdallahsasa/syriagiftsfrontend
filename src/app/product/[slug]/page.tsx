"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Star, Zap, Calendar, Heart, MessageSquare, Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import { api, Product, getStorageUrl } from '@/lib/api';
import { useCurrency } from '@/lib/CurrencyContext';
import { useCart } from '@/lib/CartContext';
import { useRouter } from 'next/navigation';

const ProductDetail = () => {
    const params = useParams();
    const slug = params?.slug as string;
    const { formatPrice } = useCurrency();
    const { addToCart } = useCart();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");

    const handleAddToCart = async (redirect = false) => {
        if (!product || isAdding) return;
        setIsAdding(true);
        try {
            await addToCart(product.id, 1, null, product);
            if (redirect) {
                router.push('/checkout');
            }
        } catch (err) {
            console.error("Failed to add to cart:", err);
        } finally {
            setIsAdding(false);
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await api.getProduct(slug);
                setProduct(data);
            } catch (err) {
                console.error('Failed to load product:', err);
            } finally {
                setLoading(false);
            }
        };
        if (slug) fetchProduct();
    }, [slug]);

    const addOns = [
        { name: "Heart Balloon", price: 15, icon: "🎈" },
        { name: "Small Teddy Bear", price: 25, icon: "🧸" },
        { name: "Birthday Card", price: 5, icon: "✉️" },
    ];

    if (loading) {
        return (
            <main className="min-h-screen bg-white">
                <Header />
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 animate-pulse">
                        <div className="aspect-square rounded-3xl bg-gray-100" />
                        <div className="space-y-6">
                            <div className="h-8 bg-gray-100 rounded w-3/4" />
                            <div className="h-12 bg-gray-100 rounded w-1/3" />
                            <div className="h-24 bg-gray-100 rounded" />
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="min-h-screen bg-white">
                <Header />
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <div className="text-6xl mb-6">🔍</div>
                    <h2 className="text-2xl font-black text-gray-800 mb-2">Product not found</h2>
                    <p className="text-gray-400 font-medium">This product may no longer be available.</p>
                </div>
            </main>
        );
    }

    const productImage = getStorageUrl(product.image);

    return (
        <main className="min-h-screen bg-white">
            <Header />

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-square rounded-3xl overflow-hidden border border-gray-100 shadow-xl">
                            <img src={productImage} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {/* Info & Options */}
                    <div className="flex flex-col">
                        <div className="mb-6">
                            {product.is_express && (
                                <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest mb-4">
                                    <Zap size={14} className="fill-primary" />
                                    60-Min Express Delivery Available
                                </div>
                            )}
                            <h1 className="text-4xl lg:text-5xl font-serif font-black text-gray-800 mb-6 tracking-tight italic uppercase">{product.name}</h1>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-6">
                                    <span className="text-5xl font-serif font-black text-primary tracking-tighter italic">{formatPrice(product.price)}</span>
                                    {product.old_price && product.old_price > product.price && (
                                        <div className="flex flex-col -space-y-1">
                                            <span className="text-xl text-gray-300 line-through font-serif font-black italic">{formatPrice(product.old_price)}</span>
                                            <span className="text-[10px] font-sans font-black text-accent uppercase tracking-widest bg-accent/10 px-2 py-0.5 rounded shadow-sm">
                                                SAVE {Math.round(((product.old_price - product.price) / product.old_price) * 100)}%
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 bg-accent/10 w-fit px-3 py-1 rounded-full border border-accent/20">
                                    <Star size={14} className="text-accent fill-accent" />
                                    <span className="text-sm font-bold text-gray-700">4.9 (128 Reviews)</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-500 font-sans font-medium leading-relaxed mb-12 border-l-4 border-accent pl-8 py-6 bg-[#FAF7F5] rounded-r-[2rem] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] italic text-lg">
                            {product.description}
                        </p>

                        {/* Delivery Details */}
                        <div className="space-y-8 mb-10">
                            <div className="bg-white p-6 rounded-2xl space-y-4 border border-accent/10 shadow-sm">
                                <h4 className="font-sans font-black text-gray-900 flex items-center gap-4 uppercase text-[11px] tracking-[0.25em] mb-6">
                                    <div className="p-2 bg-primary/5 rounded-lg">
                                        <Calendar size={18} className="text-primary" />
                                    </div>
                                    Select Delivery Date
                                </h4>
                                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                                    {['Today', 'Tomorrow', '14 Mar', '15 Mar', '16 Mar'].map((date) => (
                                        <button
                                            key={date}
                                            onClick={() => setSelectedDate(date)}
                                            className={`px-6 py-3 rounded-xl font-bold border-2 transition-all whitespace-nowrap ${selectedDate === date ? 'border-primary bg-primary text-white shadow-lg' : 'bg-white border-white hover:border-accent'
                                                }`}
                                        >
                                            {date}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Message Card */}
                            <div className="space-y-6">
                                <h4 className="font-sans font-black text-gray-900 flex items-center gap-4 uppercase text-[11px] tracking-[0.25em]">
                                    <div className="p-2 bg-primary/5 rounded-lg">
                                        <MessageSquare size={18} className="text-primary" />
                                    </div>
                                    Add a Message Card
                                </h4>
                                <textarea
                                    placeholder="Write your heartfelt message here..."
                                    className="w-full p-8 border border-gray-100 bg-[#FAF7F5] rounded-[2rem] focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all text-sm font-sans font-medium shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] resize-none"
                                    rows={4}
                                />
                            </div>

                            {/* Add-ons */}
                            <div className="space-y-6">
                                <h4 className="font-sans font-black text-gray-900 flex items-center gap-4 uppercase text-[11px] tracking-[0.25em]">
                                    <div className="p-2 bg-primary/5 rounded-lg">
                                        <Plus size={18} className="text-primary" />
                                    </div>
                                    Make it Extra Special
                                </h4>
                                <div className="flex gap-4">
                                    {addOns.map((addon) => (
                                        <div key={addon.name} className="flex-1 bg-white border border-accent/10 p-4 rounded-2xl text-center group cursor-pointer hover:shadow-lg transition-all hover:border-accent">
                                            <span className="text-2xl mb-2 block group-hover:scale-125 transition-transform">{addon.icon}</span>
                                            <p className="text-[10px] font-black text-text-muted uppercase mb-1">{addon.name}</p>
                                            <p className="text-xs font-black text-primary">{formatPrice(addon.price)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-6 sticky bottom-4 z-40">
                            <button 
                                onClick={() => handleAddToCart(true)}
                                disabled={isAdding}
                                className="flex-grow bg-primary text-white py-6 rounded-[2rem] font-sans font-black uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(198,40,74,0.3)] hover:shadow-[0_20px_50px_rgba(198,40,74,0.5)] hover:-translate-y-1.5 active:scale-95 transition-all flex items-center justify-center gap-4 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                <span className="relative z-10 flex items-center gap-4 text-[11px]">
                                    {isAdding ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Send to Damascus"}
                                </span>
                            </button>
                            <button 
                                onClick={() => handleAddToCart(false)}
                                disabled={isAdding}
                                className="bg-white border text-primary px-10 py-6 rounded-[2rem] font-sans font-black uppercase tracking-[0.2em] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center text-[10px] border-primary/20"
                            >
                                {isAdding ? <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : "Add to Cart"}
                            </button>
                            <button className="p-4 rounded-2xl border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all shadow-xl hidden sm:block">
                                <Heart size={24} className="hover:fill-current" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProductDetail;
