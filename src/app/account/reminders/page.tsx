"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { api, Reminder } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { Calendar, Trash2, Plus, Bell, Clock, Gift } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RemindersPage() {
    const { user, loading: authLoading } = useAuth();
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newOccasion, setNewOccasion] = useState('Birthday');
    const router = useRouter();

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
            console.error("Failed to fetch reminders:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.addReminder({ name: newName, date: newDate, occasion_type: newOccasion });
            setNewName('');
            setNewDate('');
            setIsAdding(false);
            fetchReminders();
        } catch (err) {
            console.error("Failed to add reminder:", err);
            alert("Failed to add reminder");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this reminder?")) return;
        try {
            await api.deleteReminder(id);
            fetchReminders();
        } catch (err) {
            console.error("Failed to delete reminder:", err);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50/50 pb-20">
            <Header />
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-3xl font-black text-text-main tracking-tight uppercase italic flex items-center gap-3">
                            <Bell className="text-primary" />
                            My <span className="text-primary italic">Reminders</span>
                        </h1>
                        <p className="text-text-muted font-bold text-sm tracking-tight mt-1">Never miss a special occasion again</p>
                    </div>
                    <button 
                        onClick={() => setIsAdding(!isAdding)}
                        className="bg-primary text-white p-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2"
                    >
                        {isAdding ? <Clock /> : <Plus />}
                        <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">{isAdding ? 'Cancel' : 'Add Reminder'}</span>
                    </button>
                </div>

                {isAdding && (
                    <div className="bg-white p-8 rounded-[32px] shadow-xl border border-accent/10 mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Person's Name</label>
                                <input 
                                    required
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    type="text" 
                                    className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-accent/30 rounded-2xl focus:outline-none focus:bg-white transition-all text-sm font-bold text-gray-700" 
                                    placeholder="e.g. Mama" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Date</label>
                                <input 
                                    required
                                    value={newDate}
                                    onChange={(e) => setNewDate(e.target.value)}
                                    type="date" 
                                    className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-accent/30 rounded-2xl focus:outline-none focus:bg-white transition-all text-sm font-bold text-gray-700" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Occasion</label>
                                <select 
                                    value={newOccasion}
                                    onChange={(e) => setNewOccasion(e.target.value)}
                                    className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-accent/30 rounded-2xl focus:outline-none focus:bg-white transition-all text-sm font-black text-gray-700 appearance-none cursor-pointer"
                                >
                                    <option>Birthday</option>
                                    <option>Anniversary</option>
                                    <option>Valentine's Day</option>
                                    <option>Mother's Day</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="md:col-span-3">
                                <button className="w-full bg-elegant-green text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-elegant-green/20 hover:scale-[1.01] transition-all">
                                    Save Reminder
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reminders.length === 0 ? (
                        <div className="md:col-span-2 text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Bell className="text-gray-300" />
                            </div>
                            <p className="text-text-muted font-bold text-sm">No reminders set yet. Start adding your loved ones' special dates!</p>
                        </div>
                    ) : (
                        reminders.map((reminder) => (
                            <div key={reminder.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                        <Gift size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-text-main text-base uppercase tracking-tight leading-tight">{reminder.name}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest bg-accent/10 text-accent px-2 py-0.5 rounded-md">
                                                {reminder.occasion_type}
                                            </span>
                                            <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-text-muted">
                                                <Calendar size={10} />
                                                {new Date(reminder.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleDelete(reminder.id)}
                                    className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
