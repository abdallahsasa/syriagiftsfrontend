"use client";

import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { useLanguage } from '@/lib/LanguageContext';
import { api, Product } from '@/lib/api';

interface ProductCarouselProps {
    title: string;
    categorySlug?: string;
    initialProducts?: Product[];
}

const ProductCarousel = ({ title, categorySlug, initialProducts }: ProductCarouselProps) => {
    const { t } = useLanguage();
    const [products, setProducts] = useState<Product[]>(initialProducts || []);
    const [loading, setLoading] = useState(!initialProducts);

    useEffect(() => {
        if (initialProducts) return;
        const fetchProducts = async () => {
            try {
                if (categorySlug) {
                    const data = await api.getProducts({ category: categorySlug });
                    setProducts(data.data?.slice(0, 5) || []);
                } else {
                    const data = await api.getHomepage();
                    setProducts(data.featured?.slice(0, 5) || []);
                }
            } catch (err) {
                console.error('Failed to load products:', err);
                // Fallback to empty
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [categorySlug]);

    // Show skeleton while loading
    if (loading) {
        return (
            <section className="py-12 bg-cream/30">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col gap-2 mb-10">
                        <h2 className="text-3xl lg:text-4xl font-serif font-black text-gray-900 italic tracking-tight">{title}</h2>
                        <div className="w-16 h-1 bg-accent rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                                <div className="aspect-square bg-gray-100" />
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                                    <div className="h-6 bg-gray-100 rounded w-1/3 mt-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) return null;

    return (
        <section className="py-12 bg-cream/30">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between mb-12 border-b border-accent/10 pb-6">
                    <div className="space-y-1">
                        <h2 className="text-3xl lg:text-4xl font-serif font-black text-gray-950 italic tracking-tight">{title}</h2>
                        <p className="text-[10px] font-sans font-black text-primary uppercase tracking-[0.3em]">Curated Selection</p>
                    </div>
                    <button className="text-[10px] font-sans font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 pb-1 hover:text-primary hover:border-primary transition-all duration-300 group flex items-center gap-2">
                        {t('view_all')}
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            price={product.price}
                            image={product.image}
                            oldPrice={product.old_price}
                            isExpress={product.is_express}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductCarousel;
