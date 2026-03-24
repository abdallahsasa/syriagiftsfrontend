"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

const QuickLinks = () => {
    const { t } = useLanguage();

    const links = [
        { key: "60_mins", icon: "⏰", color: "bg-orange-50", link: "/category/express-gifts" },
        { key: "birthday", icon: "🎂", color: "bg-pink-50", link: "/category/birthday" },
        { key: "anniversary", icon: "💍", color: "bg-red-50", link: "/category/anniversary" },
        { key: "flowers", icon: "💐", color: "bg-green-50", link: "/category/flowers" },
        { key: "ramadan", icon: "🌙", color: "bg-blue-50", link: "/category/ramadan" },
        { key: "gift_sets", icon: "🎁", color: "bg-purple-50", link: "/category/gift-sets" },
        { key: "cakes", icon: "🍰", color: "bg-yellow-50", link: "/category/cakes" },
        { key: "chocolates", icon: "🍫", color: "bg-amber-50", link: "/category/chocolates" },
        { key: "gift_hampers", icon: "🧺", color: "bg-teal-50", link: "/category/hampers" },
        { key: "branded_gifts", icon: "🏷️", color: "bg-indigo-50", link: "/category/branded" },
        { key: "personalised", icon: "🖼️", color: "bg-rose-50", link: "/category/personalised" },
    ];

    return (
        <section className="max-w-[1400px] mx-auto px-4 py-8 overflow-x-auto no-scrollbar">
            <div className="flex justify-between gap-4 min-w-max lg:min-w-0">
                {links.map((item, idx) => (
                    <Link
                        key={idx}
                        href={item.link}
                        className="flex flex-col items-center gap-3 group transition-transform hover:-translate-y-1"
                    >
                        <div className={`w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-2xl flex items-center justify-center text-3xl lg:text-4xl shadow-sm border border-accent/10 group-hover:bg-accent/10 transition-all duration-300`}>
                            {item.icon}
                        </div>
                        <span className="text-[9px] lg:text-[10px] font-sans font-black text-gray-400 uppercase tracking-[0.15em] text-center group-hover:text-primary transition-all duration-300 max-w-[80px] leading-tight">
                            {t(item.key)}
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default QuickLinks;
