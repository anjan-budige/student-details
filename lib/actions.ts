import { mockResults } from './data';
import type { SearchResult } from '@/types';

export async function searchUsers(formData: FormData): Promise<SearchResult[]> {
  'use server';
  
  const rollNo = formData.get('rollNo') as string;
  const admissionYear = formData.get('admissionYear') as string;
  const currentYear = formData.get('currentYear') as string;

  const filtered = mockResults.filter(result => {
    if (rollNo && !result.rollNo.toLowerCase().includes(rollNo.toLowerCase())) return false;
    if (admissionYear && result.admissionYear !== admissionYear) return false;
    if (currentYear && result.currentYear !== currentYear) return false;
    return true;
  });

  return filtered;
}