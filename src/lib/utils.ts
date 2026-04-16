import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('en-IN').format(value);
}

export function getAbsoluteUrl(path = '') {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dkenterprise.example.com';
  return new URL(path, siteUrl).toString();
}
