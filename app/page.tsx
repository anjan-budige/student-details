import { SearchForm } from "@/components/SearchForm";
import { SearchResults } from "@/components/SearchResults";
import { searchUsers } from "@/lib/actions";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SearchForm />
        <SearchResults />
      </div>
    </div>
  );
}
