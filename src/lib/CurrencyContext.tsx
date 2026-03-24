"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

type CurrencyCode = 'USD' | 'SYP';

interface CurrencyContextType {
    currency: CurrencyCode;
    setCurrency: (c: CurrencyCode) => void;
    formatPrice: (priceInUSD: number) => string;
}

const RATES: Record<CurrencyCode, number> = {
    USD: 1,
    SYP: 13000, // approximate USD → SYP rate
};

const SYMBOLS: Record<CurrencyCode, string> = {
    USD: '$',
    SYP: 'S£',
};

const CurrencyContext = createContext<CurrencyContextType>({
    currency: 'USD',
    setCurrency: () => {},
    formatPrice: (p) => `$ ${p}`,
});

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
    const [currency, setCurrency] = useState<CurrencyCode>('USD');

    const formatPrice = useCallback(
        (priceInUSD: number) => {
            const converted = Math.round(priceInUSD * RATES[currency]);
            const symbol = SYMBOLS[currency];
            if (currency === 'SYP') {
                return `${symbol} ${converted.toLocaleString()}`;
            }
            return `${symbol} ${converted}`;
        },
        [currency]
    );

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
};
