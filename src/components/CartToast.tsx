"use client";

import React from 'react';
import { useCart } from '@/lib/CartContext';
import { ShoppingBag, X, Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getStorageUrl } from '@/lib/api';

const CartToast = () => {
    const { notification, hideNotification } = useCart();
    const { visible, product } = notification;

    if (!visible) return null;

    return (
        <div className="fixed top-24 right-4 md:right-8 z-[100] animate-in fade-in slide-in-from-right duration-500">
            <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(198,40,74,0.15)] border border-primary/10 p-4 md:p-6 w-[340px] md:w-[400px] overflow-hidden relative group">
                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 h-1 bg-primary/20 w-full">
                    <div className="h-full bg-primary animate-progress-shrink" style={{ animationDuration: '5000ms' }} />
                </div>

                <div className="flex items-start gap-4">
                    {/* Status Icon */}
                    <div className="bg-green-500 text-white p-1 rounded-full shrink-0 animate-in zoom-in spin-in-90 delay-300">
                        <Check size={14} />
                    </div>

                    <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-sans font-black text-gray-900 text-[10px] uppercase tracking-[0.2em]">Item Added to Gifting Selection</h4>
                            <button onClick={hideNotification} className="text-gray-400 hover:text-primary transition-colors">
                                <X size={16} />
                            </button>
                        </div>

                        {product && (
                            <div className="flex gap-4 items-center mb-6 bg-gray-50/50 p-3 rounded-xl border border-gray-100/50">
                                <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 shadow-sm">
                                    <img 
                                        src={getStorageUrl(product.image)} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="font-serif font-black text-sm text-gray-800 tracking-tight truncate uppercase italic">{product.name}</span>
                                    <span className="text-[9px] font-sans font-black text-accent uppercase tracking-widest mt-0.5">Premium Damascus Series</span>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <Link 
                                href="/checkout" 
                                onClick={hideNotification}
                                className="flex-grow bg-primary text-white py-3.5 rounded-xl font-sans font-black text-[10px] uppercase tracking-widest text-center shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                Checkout Now <ArrowRight size={12} />
                            </Link>
                            <Link 
                                href="/cart"
                                onClick={hideNotification}
                                className="px-5 bg-gray-50 text-gray-600 py-3.5 rounded-xl font-sans font-black text-[10px] uppercase tracking-widest text-center border border-gray-100 hover:bg-white transition-all"
                            >
                                View Cart
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartToast;
