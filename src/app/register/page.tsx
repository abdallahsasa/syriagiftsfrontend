"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { User, Mail, Lock, UserPlus, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== passwordConfirmation) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const data = await api.register({
                name,
                email,
                password,
                password_confirmation: passwordConfirmation
            });
            login(data.access_token, data.user);
            router.push('/account');
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-cream">
            <Header />
            <div className="max-w-md mx-auto px-4 py-16">
                <div className="bg-white p-8 rounded-[32px] shadow-xl border border-accent/10">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <UserPlus className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-black text-text-main tracking-tight uppercase">Join Us</h1>
                        <p className="text-text-muted font-bold text-sm">Register a new account</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-xs font-bold mb-6 text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 pl-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-cream/30 border-2 border-transparent focus:border-accent/40 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none transition-all placeholder:text-text-muted/50"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 pl-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-cream/30 border-2 border-transparent focus:border-accent/40 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none transition-all placeholder:text-text-muted/50"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 pl-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-cream/30 border-2 border-transparent focus:border-accent/40 rounded-2xl py-4 pl-12 pr-12 text-sm font-bold focus:outline-none transition-all placeholder:text-text-muted/50"
                                    placeholder="At least 8 characters"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 pl-1">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    className="w-full bg-cream/30 border-2 border-transparent focus:border-accent/40 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none transition-all placeholder:text-text-muted/50"
                                    placeholder="Repeat your password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all uppercase tracking-widest text-xs disabled:opacity-50"
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-cream text-center">
                        <p className="text-sm font-black text-text-muted uppercase tracking-tighter">
                            Already have an account?{' '}
                            <Link href="/login" className="text-primary hover:text-primary-dark transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
