"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import { ChevronRight, Filter, Zap } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api, Product } from '@/lib/api';

const CategoryPage = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    const slug = params?.slug as string;
    const searchQuery = searchParams.get('search');

    const [expressOnly, setExpressOnly] = useState(false);
    const [sortBy, setSortBy] = useState('featured');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoryName, setCategoryName] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                if (searchQuery) {
                    const data = await api.getProducts({ search: searchQuery });
                    setProducts(data.data || []);
                    setCategoryName(`Search Results for "${searchQuery}"`);
                } else if (slug === 'all') {
                    const data = await api.getProducts({});
                    setProducts(data.data || []);
                    setCategoryName('All Gifts');
                } else {
                    const data = await api.getCategoryProducts(slug);
                    setProducts(data.products?.data || []);
                    setCategoryName(data.category?.name || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
                }
            } catch (err) {
                console.error('Failed to load products:', err);
                // Fallback: show the slug as category name with empty products
                setCategoryName(slug?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Category');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [slug, searchQuery]);

    const filteredProducts = useMemo(() => {
        let list = [...products];

        if (expressOnly) {
            list = list.filter(p => p.is_express);
        }

        if (sortBy === 'price-low') list.sort((a, b) => a.price - b.price);
        if (sortBy === 'price-high') list.sort((a, b) => b.price - a.price);

        return list;
    }, [products, expressOnly, sortBy]);

    return (
        <main className="min-h-screen bg-gray-50/50">
            <Header />

            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-100 py-3">
                <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-gray-800">{categoryName}</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar / Filters */}
                    <aside className="w-full md:w-80 space-y-10">
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 transition-all hover:shadow-md">
                            <h4 className="font-serif font-black text-gray-900 mb-8 flex items-center gap-3 uppercase text-[10px] tracking-[0.4em] italic">
                                <Filter className="w-3.5 h-3.5 text-primary" />
                                Filter <span className="text-accent not-italic">Selection</span>
                            </h4>

                            <div className="space-y-10">
                                <div className="group/section">
                                    <label className="text-[9px] font-sans font-black text-gray-400 uppercase tracking-[0.3em] mb-5 block group-hover/section:text-primary transition-colors">Delivery Speed</label>
                                    <button
                                        onClick={() => setExpressOnly(!expressOnly)}
                                        className={`w-full flex items-center justify-between py-4 px-5 rounded-2xl border transition-all duration-300 ${expressOnly ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'bg-gray-50/50 border-gray-100 text-gray-500 hover:border-accent/30'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Zap className={`w-4 h-4 transition-transform duration-500 ${expressOnly ? 'fill-primary scale-110' : 'group-hover:scale-110'}`} />
                                            <span className="text-xs font-black uppercase tracking-widest">60-Min Express</span>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${expressOnly ? 'border-primary bg-primary scale-110' : 'border-gray-200'}`}>
                                            {expressOnly && (
                                                <div className="w-2 h-2 bg-white rounded-full animate-in zoom-in" />
                                            )}
                                        </div>
                                    </button>
                                </div>

                                <div className="group/section">
                                    <label className="text-[9px] font-sans font-black text-gray-400 uppercase tracking-[0.3em] mb-5 block group-hover/section:text-primary transition-colors">Sort Selection</label>
                                    <div className="relative">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-4 px-5 text-xs font-black uppercase tracking-widest text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="featured">Featured First</option>
                                            <option value="price-low">Price: Low to High</option>
                                            <option value="price-high">Price: High to Low</option>
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                                            <ChevronRight className="w-4 h-4 rotate-90" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Banner Section - More Spacious */}
                        <div className="bg-[#1F1D1C] text-white rounded-[2rem] p-8 overflow-hidden relative group cursor-pointer shadow-xl shadow-gray-200/50 hover:-translate-y-1 transition-all duration-500">
                            {/* Premium textures & gradients */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32 transition-all duration-700 group-hover:bg-primary/30"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>
                            
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center gap-2 mb-8">
                                    <span className="w-8 h-[1px] bg-accent/40"></span>
                                    <h5 className="font-sans font-black text-[9px] uppercase tracking-[0.4em] text-accent">Special Offer</h5>
                                </div>
                                <h4 className="text-2xl font-serif font-black italic leading-tight mb-8 tracking-tighter">
                                    Ramadan <span className="text-accent not-italic">Kareem</span> Specials
                                </h4>
                                <div className="mt-auto">
                                    <button className="w-full bg-white text-[#1F1D1C] py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-primary hover:text-white transition-all duration-300">
                                        Explore Collection
                                    </button>
                                </div>
                            </div>
                            <span className="absolute -bottom-8 -right-8 text-9xl opacity-10 transform -rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-700">🌙</span>
                        </div>
                    </aside>

                    {/* Product Listing */}
                    <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-16">
                            <div className="space-y-2">
                                <h1 className="text-4xl lg:text-5xl font-serif font-black text-gray-950 tracking-tight uppercase italic">{categoryName}</h1>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-1 bg-accent rounded-full"></div>
                                    <p className="text-[10px] font-sans font-black text-gray-400 uppercase tracking-[0.3em]">
                                        {loading ? 'Optimizing Selection...' : `${filteredProducts.length} Curated Gifts`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
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
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map((p) => (
                                    <ProductCard
                                        key={p.id}
                                        id={p.id}
                                        name={p.name}
                                        price={p.price}
                                        image={p.image}
                                        isExpress={p.is_express}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-gray-100">
                                <div className="text-6xl mb-6">🔍</div>
                                <h2 className="text-xl font-black text-gray-800 mb-2">No matching gifts found</h2>
                                <p className="text-gray-400 font-medium max-w-xs mx-auto mb-8">Try adjusting your filters or search for something else.</p>
                                <button
                                    onClick={() => { setExpressOnly(false); setSortBy('featured'); }}
                                    className="bg-primary text-white px-8 py-3 rounded-full font-black uppercase tracking-wider shadow-lg"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CategoryPage;
