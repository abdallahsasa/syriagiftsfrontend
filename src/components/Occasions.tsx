"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import { api, Category, getStorageUrl } from '@/lib/api';

const Occasions = () => {
    const { t } = useLanguage();
    const [occasions, setOccasions] = React.useState<Category[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchOccasions = async () => {
            try {
                const data = await api.getHomepage();
                setOccasions(data.featured_categories);
            } catch (err) {
                console.error('Failed to fetch occasions:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOccasions();
    }, []);

    if (loading) return null;
    if (occasions.length === 0) return null;

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-3xl lg:text-5xl font-serif font-black text-gray-900 mb-6 italic tracking-tight">{t('shop_by_occasions')}</h2>
                <div className="w-20 h-1.5 bg-accent mx-auto mb-16 rounded-full" />

                <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                    {occasions.map((occ) => (
                        <Link
                            key={occ.id}
                            href={`/category/${occ.slug}`}
                            className="flex flex-col items-center group cursor-pointer"
                        >
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-transparent group-hover:border-accent transition-all p-1 shadow-md bg-white">
                                <img
                                    src={getStorageUrl(occ.image)}
                                    alt={occ.name}
                                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <span className="mt-6 text-[10px] md:text-[11px] font-sans font-black text-gray-500 group-hover:text-primary transition-colors tracking-[0.2em] text-center max-w-[120px] uppercase">
                                {occ.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Occasions;
