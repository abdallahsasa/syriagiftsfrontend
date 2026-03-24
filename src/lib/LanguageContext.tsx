"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

type Lang = 'en' | 'ar';

interface LanguageContextType {
    lang: Lang;
    setLang: (l: Lang) => void;
    t: (key: string) => string;
    dir: 'ltr' | 'rtl';
}

const translations: Record<string, Record<Lang, string>> = {
    // Top bar
    'deliver_to': { en: 'Deliver to: Damascus', ar: 'التوصيل إلى: دمشق' },
    'corporate_gifts': { en: 'Corporate Gifts', ar: 'هدايا الشركات' },
    'call_us': { en: 'Call Us: +963 11 9876', ar: 'اتصل بنا: +963 11 9876' },
    'currency': { en: 'Currency:', ar: 'العملة:' },

    // Nav items
    "women's_day": { en: "Women's Day", ar: 'يوم المرأة' },
    'ramadan': { en: 'Ramadan', ar: 'رمضان' },
    'premium': { en: 'Premium', ar: 'فاخر' },
    'birthday': { en: 'Birthday', ar: 'عيد ميلاد' },
    'anniversary': { en: 'Anniversary', ar: 'ذكرى سنوية' },
    'gift_sets': { en: 'Gift Sets', ar: 'أطقم هدايا' },
    'flowers': { en: 'Flowers', ar: 'زهور' },
    'cakes': { en: 'Cakes', ar: 'كيك' },
    'hampers': { en: 'Hampers', ar: 'سلال هدايا' },
    'more_gifts': { en: 'More Gifts', ar: 'المزيد من الهدايا' },

    // Header actions
    'reminders': { en: 'Reminders', ar: 'تذكيرات' },
    'help': { en: 'Help', ar: 'مساعدة' },
    'account': { en: 'Account', ar: 'حسابي' },
    'cart': { en: 'Cart', ar: 'السلة' },
    'search_placeholder': { en: 'Search flowers, cakes, gifts etc.', ar: 'ابحث عن زهور، كيك، هدايا...' },

    // Hero
    'order_now': { en: 'Order Now', ar: 'اطلب الآن' },
    'shop_collection': { en: 'Shop Collection', ar: 'تسوق المجموعة' },

    // Banner
    'need_it_fast': { en: 'Need it fast?', ar: 'تحتاجها بسرعة؟' },
    'express_desc': { en: 'Get 60-minute express delivery in selected Damascus districts.', ar: 'احصل على توصيل سريع خلال 60 دقيقة في مناطق مختارة من دمشق.' },
    'explore_express': { en: 'Explore Express Gifts', ar: 'استكشف الهدايا السريعة' },

    // Leading text
    'leading_title': { en: 'Leading Florist for Gifts and Flower Delivery in Damascus, Syria', ar: 'أفضل متجر للهدايا وتوصيل الزهور في دمشق، سوريا' },
    'leading_desc': { en: "Experience Cadeaux Corner - Syria's most trusted online flower and gift delivery brand. From luxury bouquets to decadent cakes, we bring your love to Damascus with premium quality and 60-minute express delivery.", ar: 'جرّب كادو كورنر - العلامة التجارية الأكثر ثقة في سوريا لتوصيل الزهور والهدايا عبر الإنترنت. من باقات الزهور الفاخرة إلى الكيك اللذيذ، نوصل حبك إلى دمشق بجودة عالية وتوصيل سريع خلال 60 دقيقة.' },
    'read_more': { en: 'Read More..', ar: 'اقرأ المزيد..' },

    // Sections
    'shop_by_occasions': { en: 'Shop By Occasions', ar: 'تسوق حسب المناسبة' },

    // Trust
    'handpicked_partners': { en: 'Handpicked Partners', ar: 'شركاء مختارون' },
    'handpicked_desc': { en: 'We only work with the top-rated local shops in Damascus.', ar: 'نعمل فقط مع أفضل المحلات المحليّة في دمشق.' },
    '60min_delivery': { en: '60-Min Delivery', ar: 'توصيل خلال 60 دقيقة' },
    '60min_desc': { en: 'Swift delivery to Mazzeh, Malki, Kafr Souseh and more.', ar: 'توصيل سريع إلى المزة، المالكي، كفرسوسة والمزيد.' },
    'secure_payment': { en: 'Secure Payment', ar: 'دفع آمن' },
    'secure_desc': { en: 'Pay securely with any international credit or debit card.', ar: 'ادفع بأمان بأي بطاقة ائتمان أو خصم دولية.' },
    'satisfaction': { en: 'Satisfaction Guaranteed', ar: 'رضا مضمون' },
    'satisfaction_desc': { en: 'Your loved ones will receive the gift exactly as pictured.', ar: 'سيستلم أحباؤك الهدية تماماً كما تظهر في الصورة.' },

    // Footer
    'footer_desc': { en: "The premier gifting destination for Syrians abroad. Send love, cakes, and flowers to Damascus with ease and trust.", ar: 'الوجهة الأولى للهدايا للسوريين في الخارج. أرسل الحب والكيك والزهور إلى دمشق بسهولة وثقة.' },
    'quick_links': { en: 'Quick Links', ar: 'روابط سريعة' },
    'gift_packages': { en: 'Gift Packages', ar: 'طرود الهدايا' },
    'flowers_bouquets': { en: 'Flowers & Bouquets', ar: 'زهور وباقات' },
    'cakes_sweets': { en: 'Cakes & Sweets', ar: 'كيك وحلويات' },
    'express_gifts': { en: 'Express Gifts', ar: 'هدايا سريعة' },
    'customer_care': { en: 'Customer Care', ar: 'خدمة العملاء' },
    'track_order': { en: 'Track Order', ar: 'تتبع الطلب' },
    'contact_us': { en: 'Contact Us', ar: 'اتصل بنا' },
    'delivery_zones': { en: 'Delivery Zones', ar: 'مناطق التوصيل' },
    'faqs': { en: 'FAQs', ar: 'الأسئلة الشائعة' },
    'newsletter': { en: 'Newsletter', ar: 'النشرة الإخبارية' },
    'newsletter_desc': { en: 'Stay updated with our latest offers and new Damascus partners.', ar: 'ابقَ على اطلاع بأحدث عروضنا وشركائنا الجدد في دمشق.' },
    'your_email': { en: 'Your email', ar: 'بريدك الإلكتروني' },
    'join': { en: 'Join', ar: 'اشترك' },

    // Quick links section
    '60_mins': { en: '60 mins', ar: '60 دقيقة' },
    'chocolates': { en: 'Chocolates', ar: 'شوكولاتة' },
    'gift_hampers': { en: 'Gift Hampers', ar: 'سلال هدايا' },
    'branded_gifts': { en: 'Branded Gifts', ar: 'هدايا ماركات' },
    'personalised': { en: 'Personalised', ar: 'مخصصة' },

    // Occasions
    'romance': { en: 'Romance', ar: 'رومانسية' },
    'thank_you': { en: 'Thank You', ar: 'شكراً' },
    'get_well': { en: 'Get Well', ar: 'سلامتك' },
    'new_born': { en: 'New Born', ar: 'مولود جديد' },
    'congratulations': { en: 'Congratulations', ar: 'مبروك' },

    // Product carousel
    'view_all': { en: 'View All', ar: 'عرض الكل' },

    // Loyalty
    'syria_gold': { en: 'Syria Gold', ar: 'سوريا جولد' },

    // SEO Homepage section
    'seo_title': { en: 'Premium Gifting Service in Damascus, Syria', ar: 'خدمة الهدايا المميزة في دمشق، سوريا' },
    'seo_desc_1': { en: 'Cadeaux Corner is your primary destination for sending love to Damascus. We specialize in high-quality flowers, artisanal cakes, and curated gift boxes that bridge the distance between you and your loved ones.', ar: 'كادو كورنر هو وجهتكم الأولى لإرسال الحب إلى دمشق. نحن متخصصون في الزهور عالية الجودة، الكيك المصنوع يدوياً، وصناديق الهدايا المختارة التي تقرب المسافات بينكم وبين أحبائكم.' },
    'seo_desc_2': { en: 'Our 60-minute express delivery ensures that your surprises arrive fresh and on time in districts like Mazzeh, Malki, and Abu Rummaneh. Each gift is handpicked and delivered with the utmost care by our local experts.', ar: 'خدمة التوصيل السريع خلال 60 دقيقة لدينا تضمن وصول مفاجآتكم طازجة وفي وقتها في مناطق مثل المزة، المالكي، وأبو رمانة. يتم اختيار كل هدية بعناية وتسليمها بمنتهى الاهتمام من قبل خبرائنا المحليين.' },
    'seo_desc_3': { en: "Whether it's a birthday celebration, an anniversary, or just a simple 'thinking of you', our platform offers a seamless international payment experience and guaranteed satisfaction for every order.", ar: 'سواء كان ذلك احتفالاً بعيد ميلاد، أو ذكرى سنوية، أو مجرد تعبير عن الاهتمام، توفر منصتنا تجربة دفع دولية سلسة وضمان الرضا عن كل طلب.' },
};

const LanguageContext = createContext<LanguageContextType>({
    lang: 'en',
    setLang: () => {},
    t: (key) => key,
    dir: 'ltr',
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [lang, setLang] = useState<Lang>('en');

    const t = useCallback(
        (key: string) => {
            const entry = translations[key];
            if (!entry) return key;
            return entry[lang] || key;
        },
        [lang]
    );

    const dir = lang === 'ar' ? 'rtl' : 'ltr';

    return (
        <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
            {children}
        </LanguageContext.Provider>
    );
};
