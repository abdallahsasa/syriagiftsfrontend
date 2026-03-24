"use client";

import React from 'react';
import { ShoppingCart, Search, User, MapPin, Bell, HelpCircle, Briefcase, Globe, Star, ChevronDown, Menu, X, LogOut, Settings, Heart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCurrency } from '@/lib/CurrencyContext';
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { useCart } from '@/lib/CartContext';
import { api, Category } from '@/lib/api';

const Header = () => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const { currency, setCurrency } = useCurrency();
    const { lang, setLang, t } = useLanguage();
    const { user, logout: authLogout } = useAuth();
    const { cartCount } = useCart();
    const router = useRouter();
    const [categories, setCategories] = React.useState<any[]>([]);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await api.getCategories();
                // We want to show only top-level categories in the header for now
                // Filter out the "Occasions" categories if they are marked as featured or based on slug
                // Or just show all if that's what's preferred.
                // For now let's just show active categories that are NOT featured (occasions tend to be featured)
                // Actually, let's keep it simple: show all active categories, limited to top ones.
                setCategories(data.filter(c => !c.parent_id).slice(0, 10));
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        };
        fetchCategories();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/category/all?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleLogout = async () => {
        try {
            await api.logout();
            authLogout();
            router.push('/');
        } catch (err) {
            console.error('Logout failed:', err);
            authLogout();
            router.push('/');
        }
    };

    const toggleLang = () => {
        setLang(lang === 'en' ? 'ar' : 'en');
    };

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
            {/* Top Info Bar */}
            <div className="bg-gray-50 border-b border-gray-100 py-2 px-4 hidden lg:block">
                <div className="max-w-[1400px] mx-auto flex justify-between items-center text-[10px] font-sans font-black text-gray-500 uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer">
                            <MapPin size={12} className="text-accent" />
                            {t('deliver_to')}
                        </div>
                        <div className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer">
                            <Briefcase size={12} />
                            {t('corporate_gifts')}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer">
                            {t('call_us')}
                        </div>

                        {/* Currency Selector */}
                        <div className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer border-l border-gray-200 pl-4">
                            <span className="text-gray-400 capitalize">{t('currency')}</span>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value as 'USD' | 'SYP')}
                                className="bg-transparent border-none p-0 focus:ring-0 cursor-pointer font-black text-gray-700"
                            >
                                <option value="USD">USD</option>
                                <option value="SYP">SYP</option>
                            </select>
                        </div>

                        {/* Language Toggle Button */}
                        <button
                            onClick={toggleLang}
                            className="flex items-center gap-1.5 border-l border-gray-200 pl-4 hover:text-primary transition-all cursor-pointer group"
                            title={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
                        >
                            <Globe size={14} className="text-accent group-hover:rotate-45 transition-transform" />
                            <span className={`font-black text-[11px] ${lang === 'en' ? 'text-primary' : 'text-gray-400'}`}>EN</span>
                            <span className="text-gray-300">|</span>
                            <span className={`font-black text-[11px] ${lang === 'ar' ? 'text-primary' : 'text-gray-400'}`}>عربي</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Header Component */}
            <div className="max-w-[1400px] mx-auto px-4 py-4 flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-12">
                <div className="flex items-center justify-between w-full lg:w-auto gap-4">
                    <div className="flex items-center gap-3 lg:hidden">
                        <button 
                            onClick={() => setIsMenuOpen(true)}
                            className="p-2 -ml-2 text-gray-600 hover:text-primary transition-colors"
                        >
                            <Menu size={26} />
                        </button>
                    </div>

                    <Link href="/" className="flex items-center gap-1.5 group">
                        <div className="bg-primary text-white p-1.5 rounded-xl group-hover:bg-primary-dark transition-all duration-300 shadow-sm">
                            <span className="text-xl">🎁</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-serif font-black text-gray-900 tracking-tighter leading-none italic">
                                Gifts<span className="text-primary not-italic">Syria</span>
                            </span>
                            <span className="text-[8px] font-sans font-black text-accent uppercase tracking-[0.3em] leading-none mt-1">Premium Delivery</span>
                        </div>
                    </Link>

                    {/* Mobile Cart/Account - Simplified */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <Link href="/account" className="p-2 text-gray-600">
                            <User size={22} />
                        </Link>
                        <Link href="/checkout" className="relative p-2 text-gray-600">
                            <ShoppingCart size={22} />
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 bg-primary text-white text-[8px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-full ring-2 ring-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="w-full lg:flex-grow max-w-2xl relative group">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('search_placeholder')}
                        className="w-full pl-6 pr-14 py-4 bg-gray-50/50 border-2 border-transparent focus:border-accent/20 rounded-2xl focus:outline-none focus:bg-white transition-all text-sm font-sans font-medium text-gray-900 placeholder-gray-400"
                    />
                    <button type="submit" className="absolute right-0 top-0 h-full px-5 text-text-muted hover:text-primary transition-colors">
                        <Search className="w-5 h-5" />
                    </button>
                </form>

                {/* Action Icons Section */}
                <div className="hidden lg:flex items-center gap-6 lg:gap-10">
                    <Link href="/reminders" className="flex flex-col items-center gap-1 group">
                        <div className="p-2.5 rounded-xl group-hover:bg-accent/10 transition-colors">
                            <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-text-main group-hover:text-primary transition-colors" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted group-hover:text-text-main transition-colors">{t('reminders')}</span>
                    </Link>
                    <Link href="/help" className="flex flex-col items-center gap-1 group">
                        <div className="p-2.5 rounded-xl group-hover:bg-accent/10 transition-colors">
                            <HelpCircle className="w-5 h-5 lg:w-6 lg:h-6 text-text-main group-hover:text-primary transition-colors" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted group-hover:text-text-main transition-colors tracking-tight">{t('help')}</span>
                    </Link>
                    
                    {user ? (
                        <Link href="/account" className="flex flex-col items-center gap-1 group">
                            <div className="p-2.5 bg-accent/5 rounded-xl group-hover:bg-accent/10 transition-colors border border-accent/10">
                                <User className="w-5 h-5 lg:w-6 lg:h-6 text-primary transition-colors" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary truncate max-w-[60px]">{user.name.split(' ')[0]}</span>
                        </Link>
                    ) : (
                        <Link href="/login" className="flex flex-col items-center gap-1 group">
                            <div className="p-2.5 rounded-xl group-hover:bg-accent/10 transition-colors">
                                <User className="w-5 h-5 lg:w-6 lg:h-6 text-text-main group-hover:text-primary transition-colors" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted group-hover:text-text-main transition-colors">{t('account')}</span>
                        </Link>
                    )}

                        <Link href="/checkout" className="flex flex-col items-center gap-1 group relative">
                            <div className="p-2.5 rounded-xl bg-primary shadow-lg shadow-primary/20 group-hover:bg-primary-dark transition-all group-hover:scale-105">
                                <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted group-hover:text-text-main transition-colors">{t('cart')}</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-primary text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-accent/20">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                </div>
            </div>

            {/* Mobile Drawer Overlay */}
            <div className={`fixed inset-0 z-[60] lg:hidden transition-all duration-500 ${isMenuOpen ? 'visible' : 'invisible'}`}>
                {/* Backdrop */}
                <div 
                    className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsMenuOpen(false)}
                ></div>
                
                {/* Drawer Content */}
                <div className={`absolute top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    {/* Drawer Header */}
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-lg">🎁</div>
                            <span className="font-serif font-black text-xl italic tracking-tighter">Menu</span>
                        </div>
                        <button 
                            onClick={() => setIsMenuOpen(false)}
                            className="p-2 text-gray-400 hover:text-primary transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Drawer Scrollable Area */}
                    <div className="flex-grow overflow-y-auto py-4 px-6 space-y-8">
                        {/* Essential Config */}
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={toggleLang}
                                className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 rounded-xl border border-gray-100 font-sans font-black text-[10px] uppercase tracking-widest text-gray-600"
                            >
                                <Globe size={14} className="text-accent" />
                                {lang === 'en' ? 'العربية' : 'English'}
                            </button>
                            <div className="relative">
                                <select
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value as 'USD' | 'SYP')}
                                    className="w-full h-full py-3 px-4 bg-gray-50 rounded-xl border border-gray-100 font-sans font-black text-[10px] uppercase tracking-widest text-gray-600 appearance-none text-center"
                                >
                                    <option value="USD">USD ($)</option>
                                    <option value="SYP">SYP (S£)</option>
                                </select>
                                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Navigation Categories */}
                        <div className="space-y-4">
                            <h4 className="text-[9px] font-sans font-black text-accent uppercase tracking-[0.3em] border-b border-accent/10 pb-2">Collections</h4>
                            <div className="grid gap-2">
                                {categories.map((cat: any) => (
                                    <Link 
                                        key={cat.id}
                                        href={`/category/${cat.slug}`}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-between p-4 bg-gray-50 hover:bg-primary/5 rounded-2xl transition-all group"
                                    >
                                        <span className="font-sans font-black text-[11px] uppercase tracking-widest text-gray-700 group-hover:text-primary">{cat.name}</span>
                                        <ChevronDown size={14} className="text-gray-300 group-hover:text-primary -rotate-90" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Secondary Links */}
                        <div className="space-y-4">
                            <h4 className="text-[9px] font-sans font-black text-gray-400 uppercase tracking-[0.3em] border-b border-gray-100 pb-2">Experience</h4>
                            <div className="grid gap-4 pl-2">
                                <Link href="/reminders" className="flex items-center gap-3 text-xs font-black text-gray-500 hover:text-primary transition-colors">
                                    <Bell size={16} /> <span>Reminders</span>
                                </Link>
                                <Link href="/help" className="flex items-center gap-3 text-xs font-black text-gray-500 hover:text-primary transition-colors">
                                    <HelpCircle size={16} /> <span>Help & Support</span>
                                </Link>
                                <Link href="/corporate" className="flex items-center gap-3 text-xs font-black text-gray-500 hover:text-primary transition-colors">
                                    <Briefcase size={16} /> <span>Corporate Gifting</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Drawer Footer */}
                    <div className="p-6 bg-gray-50 border-t border-gray-100">
                        {user ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-black text-sm">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-gray-900">{user.name}</span>
                                        <span className="text-[9px] text-gray-500 uppercase tracking-widest">Global Member</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 py-4 bg-white border border-gray-200 rounded-xl font-sans font-black text-[10px] uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                                >
                                    <LogOut size={14} /> Log out
                                </button>
                            </div>
                        ) : (
                            <Link 
                                href="/login" 
                                onClick={() => setIsMenuOpen(false)}
                                className="w-full flex items-center justify-center py-4 bg-primary text-white rounded-xl font-sans font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Sign in to Account
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation Menu (Desktop Only) */}
            <nav className="border-t border-accent/20 bg-white py-1 hidden lg:block">
                <div className="max-w-[1400px] mx-auto px-4">
                    <ul className="flex items-center flex-wrap gap-x-6 gap-y-2 lg:gap-x-10 py-1.5 justify-start lg:justify-center">
                        {categories.map((cat: any) => {
                            const isPremium = cat.slug.includes('premium');
                            const isNew = cat.slug.includes('ramadan') || cat.slug.includes('women');
                            return (
                                <li key={cat.id}>
                                    <Link
                                        href={`/category/${cat.slug}`}
                                        className={`text-[10px] lg:text-[11px] font-sans font-black uppercase tracking-[0.25em] transition-all duration-300 relative py-2 flex items-center gap-2 group
                                            ${isPremium ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
                                    >
                                        <span className="relative">
                                            {cat.name}
                                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                                        </span>
                                        {isNew && (
                                            <span className="bg-primary text-[7px] text-white px-2 py-0.5 rounded-full font-sans font-black animate-pulse shadow-sm">
                                                NEW
                                            </span>
                                        )}
                                        {isPremium && <Star size={12} className="text-accent fill-accent group-hover:rotate-12 transition-transform" />}
                                        <ChevronDown size={14} className="opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all" />
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Header;
