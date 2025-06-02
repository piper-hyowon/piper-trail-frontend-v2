export const BLOG_CATEGORIES = [
    {path: '/tech', name: 'tech', icon: '💻', description: 'Technology posts'},
    {path: '/food', name: 'food', icon: '🍔', description: 'Food'},
];

export const STATIC_PAGES = [
    {path: '/', name: 'home', icon: '🏠', description: 'Home'},
    {path: '/about', name: 'about', icon: '👤', description: 'About me'},
    {path: '/projects', name: 'projects', icon: '🚀', description: 'My projects'},
];

export const INTERACTIVE_PAGES = [
    {path: '/postcards', name: 'postcards', icon: '💌', description: 'Visitor guestbook'}
];

export const ALL_CATEGORIES = [
    ...BLOG_CATEGORIES,
    ...STATIC_PAGES,
    ...INTERACTIVE_PAGES
];

export const ALL_CATEGORY_NAMES = ALL_CATEGORIES.map(cat => cat.name);

export const getCategoryName = (category: string): string => {
    switch (category) {
        case 'tech':
            return 'Tech';
        case 'food':
            return 'Food';
        default:
            return category.charAt(0).toUpperCase() + category.slice(1);
    }
};