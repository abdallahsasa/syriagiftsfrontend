"use client";

import Header from "@/components/Header";
import { HelpCircle, MessageCircle, Phone, Mail, ChevronDown, ChevronUp, Search } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import React, { useState } from "react";

const faqs = [
    {
        q: "How does delivery work in Damascus?",
        a: "We partner with trusted local shops across Damascus. Once you place your order, the nearest partner prepares your gift and our delivery team brings it to your recipient's door. Express orders are delivered within 60 minutes in select districts."
    },
    {
        q: "Which areas do you deliver to?",
        a: "We currently deliver to Mazzeh, Malki, Kafr Souseh, Abu Rummaneh, Bab Touma, Sha'lan, Muhajirin, and surrounding areas. We're expanding to more districts every month."
    },
    {
        q: "Can I pay from outside Syria?",
        a: "Yes! We accept all major international credit and debit cards (Visa, Mastercard). Payment is processed securely in USD. You can also pay by bank transfer."
    },
    {
        q: "What if the recipient is not home?",
        a: "Our delivery team will call the recipient before delivery. If they're unavailable, we'll coordinate an alternative time or leave it with a trusted neighbor, per your instructions."
    },
    {
        q: "Can I add a message card?",
        a: "Absolutely! During checkout, you can add a personalized message card at no extra charge. We'll print it beautifully and include it with your gift."
    },
    {
        q: "What's your refund policy?",
        a: "If there's any issue with your order, contact us within 24 hours and we'll make it right — either with a replacement or a full refund. Your satisfaction is guaranteed."
    },
];

export default function HelpPage() {
    const { t } = useLanguage();
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredFaqs = faqs.filter(
        (f) =>
            f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.a.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="flex-grow bg-[#FCF9F6]">
            <Header />
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HelpCircle className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-800 mb-2">{t('help')}</h1>
                    <p className="text-gray-500 font-medium">We're here to help you send the perfect gift</p>
                </div>

                {/* Contact Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                    <a href="https://wa.me/96311009876" target="_blank" rel="noopener noreferrer" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md hover:-translate-y-1 transition-all group">
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-green-500 transition-colors">
                            <MessageCircle className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="font-black text-gray-800 text-sm mb-1">WhatsApp</h3>
                        <p className="text-gray-400 text-xs font-medium">Chat with us live</p>
                    </a>
                    <a href="tel:+963119876" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md hover:-translate-y-1 transition-all group">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-500 transition-colors">
                            <Phone className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="font-black text-gray-800 text-sm mb-1">Call Us</h3>
                        <p className="text-gray-400 text-xs font-medium">+963 11 9876</p>
                    </a>
                    <a href="mailto:support@syriagifts.com" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md hover:-translate-y-1 transition-all group">
                        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-500 transition-colors">
                            <Mail className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="font-black text-gray-800 text-sm mb-1">Email</h3>
                        <p className="text-gray-400 text-xs font-medium">support@syriagifts.com</p>
                    </a>
                </div>

                {/* FAQ Section */}
                <h2 className="text-lg font-black text-gray-800 mb-4 uppercase tracking-tight">Frequently Asked Questions</h2>

                {/* Search FAQ */}
                <div className="relative mb-6">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search FAQs..."
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-sm font-medium"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>

                <div className="space-y-3">
                    {filteredFaqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-bold text-gray-800 text-sm pr-4">{faq.q}</span>
                                {openFaq === idx ? (
                                    <ChevronUp className="w-4 h-4 text-primary flex-shrink-0" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                )}
                            </button>
                            {openFaq === idx && (
                                <div className="px-5 pb-5 border-t border-gray-50">
                                    <p className="text-gray-500 text-sm font-medium leading-relaxed pt-4">{faq.a}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
