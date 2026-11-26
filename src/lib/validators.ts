export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
export const isPhone = (v: string) => /^\+?[0-9]{9,15}$/.test(v.replace(/[\s-]/g, ''));
export const isBlank = (v: string) => v.trim().length === 0;
