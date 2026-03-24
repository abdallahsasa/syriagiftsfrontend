"use client";

import React, { useState, useEffect } from 'react';
import Header from "@/components/Header";
import { Bell, Calendar, Gift, Plus, Clock, Trash2, X } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { api, Reminder } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";

export default function RemindersPage() {
    const { t } = useLanguage();
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    
    // Form state
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [occasionType, setOccasionType] = useState('Birthday');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }
        if (user) {
            fetchReminders();
        }
    }, [user, authLoading]);

    const fetchReminders = async () => {
        try {
            const data = await api.getReminders();
            setReminders(data);
        } catch (err) {
            console.error('Failed to fetch reminders:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddReminder = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.addReminder({ name, date, occasion_type: occasionType });
            setShowModal(false);
            setName('');
            setDate('');
            fetchReminders();
        } catch (err) {
            alert('Failed to add reminder');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Delete this reminder?')) {
            try {
                await api.deleteReminder(id);
                fetchReminders();
            } catch (err) {
                alert('Failed to delete');
            }
        }
    };

    const upcomingOccasions = [
        { name: "Mother's Day", date: "March 21, 2026", icon: "💐", daysLeft: 4 },
        { name: "Ramadan Starts", date: "March 28, 2026", icon: "🌙", daysLeft: 11 },
        { name: "Eid al-Fitr", date: "April 28, 2026", icon: "🎉", daysLeft: 42 },
    ];

    if (authLoading || loading) {
        return <div className="min-h-screen bg-cream flex items-center justify-center font-black text-text-muted uppercase tracking-widest">Loading...</div>;
    }

    return (
        <main className="flex-grow bg-[#FCF9F6] min-h-screen">
            <Header />
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bell className="w-10 h-10 text-accent" />
                    </div>
                    <h1 className="text-3xl font-black text-text-main mb-2 tracking-tight uppercase">{t('reminders')}</h1>
                    <p className="text-text-muted font-bold text-sm">Never miss an occasion — Gifts Syria will remind you!</p>
                </div>

                {/* Add Reminder CTA */}
                <div className="bg-white border-2 border-primary/5 rounded-[32px] p-8 mb-12 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
                    <div className="flex items-center gap-6">
                        <div className="bg-primary/10 p-4 rounded-2xl shadow-sm">
                            <Gift className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-black text-text-main uppercase tracking-tight">Set a Personal Reminder</h3>
                            <p className="text-text-muted text-sm font-bold">Birthdays, Anniversaries, or Special Dates</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="bg-primary text-white font-black px-8 py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center gap-2 whitespace-nowrap"
                    >
                        <Plus size={16} /> Add Reminder
                    </button>
                </div>

                {/* My Reminders Section */}
                <div className="mb-12">
                    <h2 className="text-lg font-black text-text-main mb-6 uppercase tracking-widest flex items-center gap-2">
                        <Calendar size={18} className="text-accent" />
                        My Reminders
                    </h2>
                    
                    {reminders.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {reminders.map((rem) => (
                                <div key={rem.id} className="bg-white p-5 rounded-2xl border border-accent/10 shadow-sm flex items-center justify-between group hover:border-primary/20 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-cream rounded-xl flex items-center justify-center font-black text-primary">
                                            {rem.occasion_type === 'Birthday' ? '🎂' : '💝'}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-text-main text-sm uppercase">{rem.name}</h4>
                                            <p className="text-[10px] font-black text-text-muted uppercase tracking-wider">{new Date(rem.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(rem.id)}
                                        className="p-2 text-text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-[32px] border border-dashed border-accent/20 p-12 text-center">
                            <Bell className="w-12 h-12 text-cream mx-auto mb-4" />
                            <h3 className="font-black text-text-muted text-sm uppercase tracking-widest mb-2">No personal reminders</h3>
                            <p className="text-text-muted/60 text-xs font-bold mb-6">Your special dates will appear here</p>
                            <button 
                                onClick={() => setShowModal(true)}
                                className="text-primary font-black text-xs uppercase tracking-widest underline decoration-2 underline-offset-4"
                            >
                                Create your first reminder
                            </button>
                        </div>
                    )}
                </div>

                {/* Upcoming Occasions in Syria */}
                <h2 className="text-lg font-black text-text-main mb-6 uppercase tracking-widest">Syria Holidays</h2>
                <div className="space-y-3 mb-8">
                    {upcomingOccasions.map((occ, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-2xl shadow-sm border border-accent/5 p-5 flex items-center justify-between hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-3xl">{occ.icon}</span>
                                <div>
                                    <h3 className="font-black text-text-main text-sm uppercase tracking-tight">{occ.name}</h3>
                                    <div className="flex items-center gap-1.5 text-text-muted text-[10px] font-black uppercase tracking-wider">
                                        <Calendar size={12} className="text-accent" />
                                        {occ.date}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="bg-primary/5 text-primary font-black text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-1 uppercase tracking-widest">
                                    <Clock size={12} /> {occ.daysLeft} days
                                </span>
                                <button className="bg-primary text-white font-black text-[10px] px-5 py-2.5 rounded-xl hover:bg-primary-dark transition-all uppercase tracking-widest shadow-md active:scale-95">
                                    Shop Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Reminder Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-text-main/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="bg-white w-full max-w-md rounded-[32px] relative z-10 shadow-2xl p-8 border border-white">
                        <button 
                            onClick={() => setShowModal(false)}
                            className="absolute right-6 top-6 text-text-muted hover:text-text-main transition-colors"
                        >
                            <X size={24} />
                        </button>
                        
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-black text-text-main uppercase tracking-tight">New Reminder</h2>
                            <p className="text-text-muted text-sm font-bold">We'll notify you 3 days before</p>
                        </div>

                        <form onSubmit={handleAddReminder} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 pl-1">What's the occasion?</label>
                                <input 
                                    type="text" 
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Maya's Birthday"
                                    className="w-full bg-cream/30 border-2 border-transparent focus:border-accent/40 rounded-2xl py-4 px-5 text-sm font-bold focus:outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 pl-1">When?</label>
                                    <input 
                                        type="date" 
                                        required
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full bg-cream/30 border-2 border-transparent focus:border-accent/40 rounded-2xl py-4 px-4 text-sm font-bold focus:outline-none transition-all uppercase"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 pl-1">Type</label>
                                    <select 
                                        value={occasionType}
                                        onChange={(e) => setOccasionType(e.target.value)}
                                        className="w-full bg-cream/30 border-2 border-transparent focus:border-accent/40 rounded-2xl py-4 px-4 text-sm font-bold focus:outline-none transition-all appearance-none"
                                    >
                                        <option value="Birthday">Birthday</option>
                                        <option value="Anniversary">Anniversary</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all uppercase tracking-widest text-xs disabled:opacity-50"
                            >
                                {isSubmitting ? 'Adding...' : 'Save Reminder'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
