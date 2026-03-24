"use client";

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();

    return (
        <footer className="bg-gray-950 pt-20 pb-10">
            <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12">
                <div className="space-y-8">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-primary text-white p-2 rounded-xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
                            <span className="text-2xl">🎁</span>
                        </div>
                        <h2 className="text-2xl font-serif font-black text-white italic tracking-tighter">
                            Gifts<span className="text-primary not-italic">Syria</span>
                        </h2>
                    </Link>
                    <p className="text-gray-500 font-sans font-medium text-sm leading-relaxed max-w-xs">
                        {t('footer_desc')}
                    </p>
                    <div className="flex gap-4">
                        {[
                            { Icon: Facebook, href: "#" },
                            { Icon: Instagram, href: "#" },
                            { Icon: Twitter, href: "#" },
                            { Icon: Youtube, href: "#" },
                        ].map((social, i) => (
                            <a
                                key={i}
                                href={social.href}
                                className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-accent transition-all duration-300 group cursor-pointer border border-gray-800 hover:border-accent hover:scale-110"
                            >
                                <social.Icon size={18} className="text-gray-400 group-hover:text-white transition-colors" />
                            </a>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="text-[11px] font-sans font-black mb-10 text-accent uppercase tracking-[0.25em]">{t('quick_links')}</h4>
                    <ul className="space-y-5 text-gray-500 font-sans font-black text-[11px] uppercase tracking-widest">
                        <li className="hover:text-white transition-all hover:translate-x-1"><Link href="/category/gift-packages">{t('gift_packages')}</Link></li>
                        <li className="hover:text-white transition-all hover:translate-x-1"><Link href="/category/flowers">{t('flowers_bouquets')}</Link></li>
                        <li className="hover:text-white transition-all hover:translate-x-1"><Link href="/category/cakes-sweets">{t('cakes_sweets')}</Link></li>
                        <li className="hover:text-white transition-all hover:translate-x-1"><Link href="/category/express-gifts">{t('express_gifts')}</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-[11px] font-sans font-black mb-10 text-accent uppercase tracking-[0.25em]">{t('customer_care')}</h4>
                    <ul className="space-y-5 text-gray-500 font-sans font-black text-[11px] uppercase tracking-widest">
                        <li className="hover:text-white transition-all hover:translate-x-1"><Link href="/track-order">{t('track_order')}</Link></li>
                        <li className="hover:text-white transition-all hover:translate-x-1"><Link href="/contact">{t('contact_us')}</Link></li>
                        <li className="hover:text-white transition-all hover:translate-x-1"><Link href="/delivery-zones">{t('delivery_zones')}</Link></li>
                        <li className="hover:text-white transition-all hover:translate-x-1"><Link href="/faqs">{t('faqs')}</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-[11px] font-sans font-black mb-10 text-accent uppercase tracking-[0.25em]">{t('newsletter')}</h4>
                    <p className="text-gray-500 font-sans font-medium text-sm mb-8 leading-relaxed">{t('newsletter_desc')}</p>
                    <div className="flex bg-gray-900/50 p-2 rounded-2xl border border-gray-900 focus-within:border-accent/40 transition-all group overflow-hidden">
                        <input type="email" placeholder={t('your_email')} className="bg-transparent border-none px-4 py-2 w-full focus:ring-0 text-white font-sans text-sm placeholder-gray-600" />
                        <button className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-sans font-black text-[10px] uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95">{t('join')}</button>
                    </div>
                </div>
            </div>
            <div className="max-w-[1400px] mx-auto px-4 mt-20 pt-10 border-t border-gray-900/50 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-gray-600 text-[10px] font-sans font-black tracking-[0.3em] uppercase">
                    &copy; 2026 GIFTS SYRIA. ALL RIGHTS RESERVED.
                </div>
                <div className="flex items-center gap-8 text-[9px] font-sans font-black text-gray-600 uppercase tracking-widest">
                    <Link href="/privacy" className="hover:text-gray-400 transition-colors tracking-[0.2em]">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-gray-400 transition-colors tracking-[0.2em]">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
