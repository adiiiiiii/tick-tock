import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function getStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'COMPLETED':
      return 'bg-green-100 text-green-800';
    case 'INCOMPLETE':
      return 'bg-yellow-100 text-yellow-800';
    case 'MISSING':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getStatusBadgeText(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}
