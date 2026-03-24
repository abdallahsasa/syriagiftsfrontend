"use client";

import React from 'react';
import { Star, Zap, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCurrency } from '@/lib/CurrencyContext';
import { useLanguage } from '@/lib/LanguageContext';
import { useCart } from '@/lib/CartContext';
import { getStorageUrl } from '@/lib/api';

interface ProductCardProps {
    id: number;
    name: string;
    price: number;
    image: string;
    oldPrice?: number | null;
    isExpress?: boolean;
    rating?: number;
    reviews?: number;
}

const ProductCard = ({ id, name, price, image, oldPrice, isExpress, rating = 4.8, reviews = 42 }: ProductCardProps) => {
    const { formatPrice } = useCurrency();
    const { t } = useLanguage();
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = React.useState(false);

    return (
        <Link
            href={`/product/${name.toLowerCase().replace(/ /g, '-').replace(/[()]/g, '')}`}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group border border-accent/10 flex flex-col h-full hover:-translate-y-2 hover:border-accent/40"
        >
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                <img
                    src={getStorageUrl(image)}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {isExpress && (
                        <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm border border-accent/10">
                            <Zap className="w-3.5 h-3.5 text-accent fill-accent" />
                            <span className="text-[9px] font-sans font-black text-primary uppercase tracking-[0.15em]">60 MIN</span>
                        </div>
                    )}
                    {oldPrice && oldPrice > price && (
                        <div className="bg-primary px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg shadow-primary/20">
                            <span className="text-[9px] font-sans font-black text-white uppercase tracking-[0.1em]">
                                {Math.round(((oldPrice - price) / oldPrice) * 100)}% OFF
                            </span>
                        </div>
                    )}
                </div>

                {/* Wishlist Button */}
                <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm">
                    <span className="text-sm">❤️</span>
                </button>
            </div>

            {/* Product Info */}
            <div className="p-4 flex flex-col flex-grow bg-white">
                <h3 className="text-sm font-sans font-black text-gray-900 mb-3 line-clamp-2 min-h-[40px] leading-tight group-hover:text-primary transition-colors uppercase tracking-tight">
                    {name}
                </h3>

                <div className="flex items-center gap-1 mb-4">
                    <Star className="w-3 h-3 text-accent fill-accent" />
                    <span className="text-[11px] font-black text-gray-800">{rating}</span>
                    <span className="text-[10px] font-bold text-gray-400">({reviews} Reviews)</span>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                             <span className="text-xl font-serif font-black text-primary tracking-tighter italic">{formatPrice(price)}</span>
                             {oldPrice && oldPrice > price && (
                                 <span className="text-xs text-gray-300 line-through font-serif font-black italic">
                                     {formatPrice(oldPrice)}
                                 </span>
                             )}
                        </div>
                    </div>
                    <button 
                        onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsAdding(true);
                            try {
                                const productData = { id, name, price, image, oldPrice, isExpress };
                                await addToCart(id, 1, null, productData as any);
                            } finally {
                                setIsAdding(false);
                            }
                        }}
                        disabled={isAdding}
                        className={`bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded-xl transition-all shadow-md group-hover:scale-105 active:scale-95 ${isAdding ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isAdding ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
