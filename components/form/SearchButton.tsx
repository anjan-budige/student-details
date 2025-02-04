'use client';

import { Search } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/Button';

export function SearchButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button type="submit" disabled={pending}>
      <Search className="w-4 h-4" />
      {pending ? 'Searching...' : 'Search'}
    </Button>
  );
}