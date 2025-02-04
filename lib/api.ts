import type { SearchParams, SearchResult, ApiErrorResponse, ApiSuccessResponse } from '@/types';

export async function fetchSearchResults(formData: FormData): Promise<SearchResult[]> {
  try {
    const response = await fetch('/api/search', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json() as ApiErrorResponse;
      throw new Error(errorData.error || 'Failed to fetch results');
    }

    const data = await response.json() as SearchResult[];
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred');
  }
}