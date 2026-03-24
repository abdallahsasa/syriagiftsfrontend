"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';
import { useAuth } from '@/lib/AuthContext';
import { Settings, User, Mail, Shield, Save, Key } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const { user, loading: authLoading, updateUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    React.useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        // Mocking update for now, ideally calls api.updateMe
        setTimeout(() => {
            if (user) {
                updateUser({ ...user, name, email });
                alert("Profile updated successfully!");
            }
            setIsSaving(false);
        }, 1000);
    };

    if (authLoading) return <div className="min-h-screen bg-cream flex items-center justify-center font-black text-text-muted uppercase tracking-widest">Loading...</div>;

    return (
        <main className="min-h-screen bg-gray-50/50 pb-20">
            <Header />
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="mb-12">
                    <h1 className="text-3xl font-black text-text-main tracking-tight uppercase italic flex items-center gap-3">
                        <Settings className="text-primary" />
                        Account <span className="text-primary italic">Settings</span>
                    </h1>
                    <p className="text-text-muted font-bold text-sm tracking-tight mt-1">Manage your account preferences and security</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Navigation sidebar */}
                    <div className="lg:col-span-1 space-y-2">
                        <button className="w-full text-left p-5 bg-white rounded-2xl shadow-sm border-2 border-primary/20 flex items-center gap-4 transition-all group">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                <User size={20} />
                            </div>
                            <span className="font-black text-text-main text-xs uppercase tracking-widest">Profile Details</span>
                        </button>
                        <button className="w-full text-left p-5 bg-white rounded-2xl shadow-sm border-2 border-transparent hover:border-accent/10 flex items-center gap-4 transition-all group opacity-50">
                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors">
                                <Key size={20} />
                            </div>
                            <span className="font-black text-gray-400 text-xs uppercase tracking-widest">Change Password</span>
                        </button>
                        <button className="w-full text-left p-5 bg-white rounded-2xl shadow-sm border-2 border-transparent hover:border-accent/10 flex items-center gap-4 transition-all group opacity-50">
                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors">
                                <Shield size={20} />
                            </div>
                            <span className="font-black text-gray-400 text-xs uppercase tracking-widest">Privacy & Data</span>
                        </button>
                    </div>

                    {/* Main Settings Form */}
                    <div className="lg:col-span-2">
                        <section className="bg-white p-8 lg:p-10 rounded-[40px] shadow-xl border border-accent/5">
                            <h2 className="text-xl font-black text-text-main mb-8 uppercase tracking-tight flex items-center gap-3">
                                Profile Information
                                <div className="h-0.5 flex-grow bg-cream rounded-full mt-1 ml-2"></div>
                            </h2>
                            <form onSubmit={handleUpdateProfile} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Display Name</label>
                                    <div className="relative">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/50" />
                                        <input 
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            type="text" 
                                            className="w-full p-5 bg-cream/30 border-2 border-transparent focus:border-accent/30 rounded-3xl focus:outline-none focus:bg-white transition-all text-sm font-bold text-gray-700" 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/50" />
                                        <input 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            type="email" 
                                            className="w-full p-5 bg-cream/30 border-2 border-transparent focus:border-accent/30 rounded-3xl focus:outline-none focus:bg-white transition-all text-sm font-bold text-gray-700" 
                                        />
                                    </div>
                                </div>
                                <div className="pt-6">
                                    <button 
                                        disabled={isSaving}
                                        className="w-full bg-primary text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isSaving ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                Save Profile
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
