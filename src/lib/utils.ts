import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount)
}

export function formatCompactNumber(number: number | string | null | undefined) {
  if (number === undefined || number === null) return "";
  const num = Number(number);
  if (isNaN(num)) return "";
  const absNumber = Math.abs(num);
  
  if (absNumber >= 10000000) {
    return (num / 10000000).toFixed(1).replace(/\.0$/, "") + "Cr";
  } else if (absNumber >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M"; 
  } else if (absNumber >= 100000) {
    return (num / 100000).toFixed(1).replace(/\.0$/, "") + "L";
  } else if (absNumber >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  
  return num.toString();
}
