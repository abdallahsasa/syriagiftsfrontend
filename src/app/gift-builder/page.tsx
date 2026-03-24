"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';
import { Plus, Check, Gift } from 'lucide-react';

const GiftBuilder = () => {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const options = [
        { id: 'flowers', name: 'Fresh Flowers', icon: '🌸', price: 45 },
        { id: 'cake', name: 'Luxury Cake', icon: '🎂', price: 35 },
        { id: 'chocolates', name: 'Artisan Chocolates', icon: '🍫', price: 25 },
        { id: 'balloons', name: 'Festive Balloons', icon: '🎈', price: 15 },
        { id: 'perfume', name: 'Premium Perfume', icon: '✨', price: 60 },
    ];

    const toggleItem = (id: string) => {
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const totalPrice = selectedItems.reduce((acc, id) => {
        const item = options.find(o => o.id === id);
        return acc + (item?.price || 0);
    }, 0) + 10; // Extra $10 for the Gift Box itself

    return (
        <main className="min-h-screen bg-gray-50/50">
            <Header />

            <div className="max-w-5xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-gray-800 mb-4 tracking-tighter uppercase italic">
                        Build Your <span className="text-primary italic">Custom Gift Box</span>
                    </h1>
                    <p className="text-gray-500 font-medium max-w-lg mx-auto leading-relaxed">
                        Create a unique surprise for your loved ones in Damascus. Add their favorites and we'll wrap it beautifully.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Options Grid */}
                    <div className="md:col-span-2 grid grid-cols-2 gap-4">
                        {options.map((option) => (
                            <div
                                key={option.id}
                                onClick={() => toggleItem(option.id)}
                                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-3 bg-white shadow-sm ${selectedItems.includes(option.id)
                                        ? 'border-primary ring-1 ring-primary/20 bg-primary/5'
                                        : 'border-white hover:border-accent group'
                                    }`}
                            >
                                <span className="text-3xl group-hover:scale-125 transition-transform">{option.icon}</span>
                                <span className="font-bold text-gray-800">{option.name}</span>
                                <span className="text-primary font-black">$ {option.price}</span>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${selectedItems.includes(option.id) ? 'bg-primary text-white' : 'bg-gray-100 text-transparent'
                                    }`}>
                                    <Check size={14} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Checkout/Summary */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl h-fit border border-gray-100 sticky top-40">
                        <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
                            <Gift size={24} className="text-accent" />
                            Box Summary
                        </h3>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm font-semibold text-gray-500">
                                <span>Gift Packaging</span>
                                <span>$ 10</span>
                            </div>
                            {selectedItems.map(id => {
                                const item = options.find(o => o.id === id);
                                return (
                                    <div key={id} className="flex justify-between text-sm font-bold text-gray-800">
                                        <span>{item?.name}</span>
                                        <span>$ {item?.price}</span>
                                    </div>
                                );
                            })}
                            <div className="pt-4 border-t border-dashed border-gray-200 flex justify-between">
                                <span className="text-lg font-black text-gray-800">Total Price</span>
                                <span className="text-2xl font-black text-primary">$ {totalPrice}</span>
                            </div>
                        </div>

                        <button
                            disabled={selectedItems.length === 0}
                            className="w-full bg-primary text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:grayscale disabled:opacity-50"
                        >
                            Add Box to Cart
                        </button>
                        <p className="mt-4 text-[10px] text-center text-gray-400 font-bold uppercase tracking-tighter">
                            FREE PREMIUM WRAPPING INCLUDED
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default GiftBuilder;
