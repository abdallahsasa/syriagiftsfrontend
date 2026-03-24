"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { api, Banner, getStorageUrl } from '@/lib/api';
import { useLanguage } from '@/lib/LanguageContext';

const Hero = () => {
    const { lang } = useLanguage();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getBanners()
            .then(data => {
                setBanners(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch banners:', err);
                setLoading(false);
            });
    }, []);

    const mainSlides = banners.filter(b => b.type === 'hero');
    const sideBanners = banners.filter(b => b.type === 'side').slice(0, 2);

    useEffect(() => {
        if (mainSlides.length === 0) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % mainSlides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [mainSlides.length]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % mainSlides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + mainSlides.length) % mainSlides.length);

    if (loading) {
        return (
            <div className="max-w-[1400px] mx-auto px-4 py-4 lg:py-6">
                <div className="h-[300px] lg:h-[500px] bg-gray-100 rounded-2xl animate-pulse" />
            </div>
        );
    }

    if (banners.length === 0) return null;

    return (
        <section className="max-w-[1400px] mx-auto px-4 py-4 lg:py-6">
            <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[500px]">
                {/* Main Slider (2/3 or 1/1 on mobile) */}
                <div className="w-full lg:w-2/3 relative rounded-2xl overflow-hidden group shadow-md aspect-[16/9] lg:aspect-auto h-auto lg:h-full">
                    {mainSlides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <img
                                src={getStorageUrl(slide.image_url)}
                                alt={slide.title[lang]}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 lg:from-black/60 to-transparent flex items-center px-6 lg:px-16">
                                <div className="max-w-md animate-fadeIn">
                                    <h2 className="text-3xl lg:text-5xl font-serif font-black text-white mb-4 lg:mb-6 leading-[1.1] tracking-tight italic">
                                        {slide.title[lang]}
                                    </h2>
                                    <p className="text-sm lg:text-lg text-white/80 mb-8 lg:mb-10 font-sans font-medium leading-relaxed max-w-sm">
                                        {slide.subtitle[lang]}
                                    </p>
                                    <Link
                                        href={slide.link_url || '#'}
                                        className="inline-flex items-center bg-primary text-white px-8 py-3 lg:px-10 lg:py-5 rounded-2xl font-sans font-black uppercase tracking-[0.2em] shadow-[0_15px_30px_rgba(198,40,74,0.3)] hover:shadow-[0_15px_30px_rgba(198,40,74,0.5)] hover:-translate-y-1 active:scale-95 transition-all text-xs lg:text-[11px] relative overflow-hidden group/btn"
                                    >
                                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                                        <span className="relative z-10">{slide.cta_text[lang]}</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Controls */}
                    {mainSlides.length > 1 && (
                        <>
                            <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white opacity-0 group-hover:opacity-100 transition-all lg:flex hidden">
                                <ChevronLeft size={24} />
                            </button>
                            <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white opacity-0 group-hover:opacity-100 transition-all lg:flex hidden">
                                <ChevronRight size={24} />
                            </button>

                            {/* Dots */}
                            <div className="absolute bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 lg:gap-2 z-10">
                                {mainSlides.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentSlide(idx)}
                                        className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full transition-all ${idx === currentSlide ? 'bg-white w-5 lg:w-6' : 'bg-white/50'}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Side Banners (1/3) - Hidden on mobile */}
                <div className="hidden lg:flex lg:w-1/3 flex-col gap-4">
                    {sideBanners.map((banner) => (
                        <div key={banner.id} className="h-1/2 relative rounded-2xl overflow-hidden shadow-md group">
                            <img
                                src={getStorageUrl(banner.image_url)}
                                alt={banner.title[lang]}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-6">
                                <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-white/20 transform group-hover:-translate-y-2 transition-transform duration-500">
                                    <h3 className="text-xl font-serif font-black text-gray-900 mb-1 italic leading-tight">{banner.title[lang]}</h3>
                                    <p className="text-[10px] font-sans font-black text-gray-400 mb-5 uppercase tracking-[0.2em]">{banner.subtitle[lang]}</p>
                                    <Link href={banner.link_url || '#'} className="inline-block bg-primary text-white px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest shadow-md hover:bg-primary-dark transition-colors">
                                        {banner.cta_text[lang]}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;
