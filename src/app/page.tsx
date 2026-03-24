"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Occasions from "@/components/Occasions";
import ProductCarousel from "@/components/ProductCarousel";
import QuickLinks from "@/components/QuickLinks";
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

import { api, HomepageData } from '@/lib/api';
import React, { useEffect, useState } from 'react';

export default function Home() {
    const { t } = useLanguage();
    const [homeData, setHomeData] = useState<HomepageData | null>(null);

    useEffect(() => {
        api.getHomepage().then(setHomeData).catch(console.error);
    }, []);

    return (
        <main className="flex-grow bg-cream">
            <Header />
            <Hero />
            <QuickLinks />

            {/* Leading Text Banner */}
            <section className="max-w-[1400px] mx-auto px-4 py-20 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-primary/0 to-primary/20"></div>
                <h1 className="text-3xl lg:text-5xl font-serif font-black text-gray-900 mb-8 tracking-tight italic">
                    {t('leading_title').split(' ').map((word: string, i: number) => i === 0 ? <span key={i} className="text-primary not-italic">{word} </span> : word + ' ')}
                </h1>
                <p className="text-sm lg:text-lg text-gray-500 font-sans font-medium max-w-3xl mx-auto leading-relaxed">
                    {t('leading_desc')}
                    <span className="text-secondary hover:text-primary cursor-pointer font-black border-b border-secondary/20 ml-2 transition-all duration-300 uppercase text-[10px] tracking-[0.2em]">{t('read_more')}</span>
                </p>
            </section>

            {/* Feature Banner */}
            <section className="max-w-[1400px] mx-auto px-4 pb-16">
                <Link href="/category/express-gifts">
                    <div className="bg-white border border-accent/10 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.06)] transition-all duration-700 hover:border-accent group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <div className="flex items-center gap-8 relative z-10">
                            <div className="bg-[#FAF7F5] p-6 rounded-3xl group-hover:scale-110 transition-transform duration-500 shadow-inner">
                                <span className="text-5xl">🚀</span>
                            </div>
                            <div>
                                <h3 className="text-3xl font-serif font-black text-primary mb-2 tracking-tight italic">{t('need_it_fast')}</h3>
                                <p className="text-gray-400 font-sans font-black uppercase text-[10px] tracking-[0.25em]">{t('express_desc')}</p>
                            </div>
                        </div>
                        <button className="bg-primary text-white font-sans font-black px-14 py-5 rounded-2xl shadow-[0_15px_30px_rgba(198,40,74,0.3)] hover:shadow-[0_15px_30px_rgba(198,40,74,0.5)] hover:-translate-y-1 active:scale-95 transition-all uppercase tracking-[0.2em] text-[11px] relative z-10">
                            {t('explore_express')}
                        </button>
                    </div>
                </Link>
            </section>

            {/* SEO Content Section */}
            <section className="bg-white py-24 mb-16 overflow-hidden border-y border-accent/10">
                <div className="max-w-[1400px] mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-primary/5 rounded-[40px] transform rotate-2 group-hover:rotate-0 transition-transform duration-700"></div>
                            <img
                                src="/images/damascus_gifting_seo_banner.png"
                                alt="Premium Gifting Damascus"
                                className="relative rounded-[32px] shadow-2xl w-full h-[500px] object-cover"
                            />
                            <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-gray-100/50 max-w-[200px] animate-bounce-subtle">
                                <div className="text-3xl mb-2">✨</div>
                                <div className="text-xs font-black text-gray-800 uppercase tracking-tighter leading-tight">
                                    Quality Guaranteed by Local Experts
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-10">
                            <div className="space-y-4">
                                <h2 className="text-4xl lg:text-5xl font-serif font-black text-gray-950 leading-[1.1] tracking-tight italic">
                                    {t('seo_title')}
                                </h2>
                                <div className="w-24 h-1.5 bg-accent rounded-full mb-8 transition-all duration-700 group-hover:w-32"></div>
                            </div>

                            <div className="space-y-8 text-gray-500 font-sans font-medium leading-relaxed lg:text-lg">
                                <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-black first-letter:text-primary first-letter:mr-3 first-letter:float-left">{t('seo_desc_1')}</p>
                                <p className="text-gray-900 font-serif font-bold border-l-4 border-accent pl-8 py-2 italic text-xl bg-accent/[0.03] rounded-r-2xl shadow-sm">
                                    {t('seo_desc_2')}
                                </p>
                                <p className="opacity-80">{t('seo_desc_3')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dynamic Collection Sections */}
            {homeData?.featured_categories.map((category) => (
                <section key={category.id} className="py-4 last:mb-12">
                    <ProductCarousel
                        title={category.name}
                        categorySlug={category.slug}
                        initialProducts={category.products}
                    />
                </section>
            ))}

            <Occasions />

            {/* Trust Section */}
            <section className="py-20 bg-cream/50 border-t border-accent/10">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
                    {[
                        { icon: "💝", titleKey: "handpicked_partners", descKey: "handpicked_desc" },
                        { icon: "🏎️", titleKey: "60min_delivery", descKey: "60min_desc" },
                        { icon: "💳", titleKey: "secure_payment", descKey: "secure_desc" },
                        { icon: "✨", titleKey: "satisfaction", descKey: "satisfaction_desc" },
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center group">
                            <div className="text-5xl mb-6 transition-transform group-hover:scale-110 duration-500 drop-shadow-sm">{item.icon}</div>
                            <h4 className="text-lg font-black text-text-main mb-3 uppercase tracking-tight">{t(item.titleKey)}</h4>
                            <p className="text-sm text-text-muted font-bold leading-relaxed">{t(item.descKey)}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
