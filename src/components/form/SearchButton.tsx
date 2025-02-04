'use client';

import { Search } from 'lucide-react';
import { useFormStatus } from 'react-dom';

export function SearchButton() {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Search className="w-4 h-4" />
      {pending ? 'Searching...' : 'Search'}
    </button>
  );
}