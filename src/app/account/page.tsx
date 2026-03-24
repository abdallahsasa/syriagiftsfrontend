"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { User, ShoppingBag, Heart, MapPin, Settings, LogOut } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";

export default function AccountPage() {
    const { t } = useLanguage();
    const { user, logout, loading } = useAuth();
    const router = useRouter();

    const menuItems = [
        { icon: <ShoppingBag className="w-5 h-5" />, label: "My Orders", desc: "Track and manage your orders", href: "/account/orders" },
        { icon: <Heart className="w-5 h-5" />, label: "Wishlist", desc: "Your saved items", href: "/account/wishlist" },
        { icon: <MapPin className="w-5 h-5" />, label: "Addresses", desc: "Manage delivery addresses", href: "/account/addresses" },
        { icon: <Settings className="w-5 h-5" />, label: "Settings", desc: "Update profile & preferences", href: "/account/settings" },
    ];

    if (loading) {
        return <div className="min-h-screen bg-cream flex items-center justify-center font-black text-text-muted uppercase tracking-widest">Loading...</div>;
    }

    return (
        <main className="flex-grow bg-[#FCF9F6] min-h-screen">
            <Header />
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 relative group">
                        <User className="w-10 h-10 text-primary" />
                        {user && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-elegant-green text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            </div>
                        )}
                    </div>
                    {user ? (
                        <>
                            <h1 className="text-3xl font-black text-text-main mb-1 tracking-tight">Marhaba, {user.name}!</h1>
                            <p className="text-text-muted font-bold text-sm tracking-tight">{user.email}</p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-3xl font-black text-text-main mb-2">My Account</h1>
                            <p className="text-text-muted font-medium">Manage your orders, addresses & preferences</p>
                        </>
                    )}
                </div>

                {user ? (
                    /* Authenticated State */
                    <div className="mb-12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            {menuItems.map((item, idx) => (
                                <Link
                                    key={idx}
                                    href={item.href}
                                    className="bg-white rounded-2xl shadow-sm border border-accent/5 p-6 flex items-center gap-4 hover:shadow-md hover:-translate-y-1 transition-all group"
                                >
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-text-main text-sm uppercase tracking-tight">{item.label}</h3>
                                        <p className="text-text-muted text-xs font-bold">{item.desc}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <button
                            onClick={() => {
                                logout();
                                router.push('/');
                            }}
                            className="w-full bg-white border-2 border-primary/10 text-primary font-black px-8 py-4 rounded-2xl hover:bg-primary/5 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                        >
                            <LogOut size={16} /> Sign Out
                        </button>
                    </div>
                ) : (
                    /* Login / Register Card (Unauthenticated) */
                    <div className="bg-white rounded-[32px] shadow-xl border border-accent/10 p-10 mb-8 text-center max-w-lg mx-auto">
                        <h2 className="text-2xl font-black text-text-main mb-3 tracking-tight uppercase">Welcome to Gifts Syria</h2>
                        <p className="text-text-muted font-bold text-sm mb-8">Sign in to track orders and manage your premium gifting experience</p>
                        <div className="flex flex-col gap-3">
                            <Link
                                href="/login"
                                className="bg-primary text-white font-black px-8 py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                className="bg-cream text-primary font-black px-8 py-4 rounded-2xl hover:bg-accent/10 transition-all uppercase tracking-widest text-xs"
                            >
                                Create Account
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
