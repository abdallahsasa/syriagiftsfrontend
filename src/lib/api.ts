const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const BACKEND_URL = API_BASE.replace('/api', '');

export const getStorageUrl = (path: string | null) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${BACKEND_URL}/storage/${path}`;
};

export interface Banner {
    id: number;
    title: { en: string; ar: string };
    subtitle: { en: string; ar: string };
    cta_text: { en: string; ar: string };
    image_url: string;
    link_url: string;
    type: 'hero' | 'side';
    is_active: boolean;
    sort_order: number;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    image: string;
    old_price: number | null;
    category_id: number;
    vendor_id: number;
    is_express: boolean;
    is_active: boolean;
    category?: Category;
    vendor?: Vendor;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string | null;
    image: string | null;
    is_active: boolean;
    is_featured: boolean;
    parent_id: number | null;
    sort_order: number;
    products_count?: number;
    products?: Product[];
}

export interface Vendor {
    id: number;
    name: string;
    slug: string;
    logo: string | null;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
}

export interface HomepageData {
    featured: Product[];
    express: Product[];
    categories: Category[];
    featured_categories: Category[];
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
}

export interface AuthResponse {
    user: User;
    access_token: string;
    token_type: string;
}

export interface Reminder {
    id: number;
    user_id: number;
    name: string;
    date: string;
    occasion_type: string | null;
}

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    const headers = new Headers(options.headers || {});
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
        cache: 'no-store',
    });

    if (res.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
    }

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${res.status}`);
    }
    return res.json();
}

export const api = {
    getHomepage: () => apiFetch<HomepageData>('/homepage'),

    getProducts: (params?: { category?: string; search?: string; express?: boolean }) => {
        const sp = new URLSearchParams();
        if (params?.category) sp.set('category', params.category);
        if (params?.search) sp.set('search', params.search);
        if (params?.express) sp.set('express', '1');
        const qs = sp.toString();
        return apiFetch<PaginatedResponse<Product>>(`/products${qs ? `?${qs}` : ''}`);
    },

    getProduct: (slug: string) => apiFetch<Product>(`/products/${slug}`),

    getCategories: () => apiFetch<Category[]>('/categories'),

    getCategoryProducts: (slug: string) =>
        apiFetch<{ category: Category; products: PaginatedResponse<Product> }>(`/categories/${slug}`),

    getBanners: () => apiFetch<Banner[]>('/banners'),

    // Auth
    login: (credentials: any) => apiFetch<AuthResponse>('/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    }),

    register: (details: any) => apiFetch<AuthResponse>('/register', {
        method: 'POST',
        body: JSON.stringify(details)
    }),

    getMe: () => apiFetch<User>('/me'),

    logout: () => apiFetch<{ message: string }>('/logout', { method: 'POST' }),

    // Reminders
    getReminders: () => apiFetch<Reminder[]>('/reminders'),

    addReminder: (data: any) => apiFetch<Reminder>('/reminders', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    deleteReminder: (id: number) => apiFetch<{ message: string }>(`/reminders/${id}`, {
        method: 'DELETE'
    }),

    // Cart
    getCart: () => apiFetch<any[]>('/cart'),
    addToCart: (product_id: number, quantity: number, options?: any) => 
        apiFetch<any>('/cart', { 
            method: 'POST', 
            body: JSON.stringify({ product_id, quantity, options }) 
        }),
    updateCartItem: (id: number, quantity: number) => 
        apiFetch<any>(`/cart/${id}`, { 
            method: 'PUT', 
            body: JSON.stringify({ quantity }) 
        }),
    removeFromCart: (id: number) => apiFetch<any>(`/cart/${id}`, { 
        method: 'DELETE' 
    }),
    clearCart: () => apiFetch<any>('/cart/clear', { 
        method: 'POST' 
    }),

    // Districts
    getDistricts: () => apiFetch<any[]>('/districts'),

    // Orders
    createOrder: (data: any) => apiFetch<any>('/orders', { 
        method: 'POST', 
        body: JSON.stringify(data) 
    }),
    getOrders: () => apiFetch<any[]>('/orders'),
    getOrder: (id: number) => apiFetch<any>(`/orders/${id}`),
};
