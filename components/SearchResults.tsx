"use client";

import { UserCircle } from "lucide-react";
import { useState, useEffect } from "react";
import type { SearchResult } from "@/lib/search/types";
import { fetchSearchResults } from "@/lib/search/api";
import { useSearchParams } from "next/navigation"; // To handle query params

interface SearchState {
  data: SearchResult[];
  error: string | null;
  isLoading: boolean;
}

export function SearchResults() {
  const [state, setState] = useState<SearchState>({
    data: [],
    error: null,
    isLoading: false,
  });

  useEffect(() => {
    const handleSearch = async (formData: FormData) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const getnew = await fetchSearchResults(formData);
        setState({ data: getnew, error: null, isLoading: false });
      } catch (error) {
        setState({
          data: [],
          error:
            error instanceof Error
              ? error.message
              : "An error occurred while fetching data.",
          isLoading: false,
        });
      }
    };

    const form = document.querySelector("form");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        await handleSearch(formData);
      });
    }

    return () => {
      if (form) {
        form.removeEventListener("submit", () => {});
      }
    };
  }, []);

  if (state.isLoading) {
    return (
      <div className="mt-6 bg-white p-8 rounded-xl shadow-lg text-center">
        <div className="max-w-md mx-auto">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading results...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="mt-6 bg-white p-8 rounded-xl shadow-lg text-center">
        <div className="max-w-md mx-auto">
          <div className="text-red-500 mb-2">⚠️</div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Error</h3>
          <p className="mt-2 text-gray-500">{state.error}</p>
        </div>
      </div>
    );
  }

  if (state.data.length === 0) {
    return (
      <div className="mt-6 bg-white p-8 rounded-xl shadow-lg text-center">
        <div className="max-w-md mx-auto">
          <UserCircle className="w-16 h-16 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No results found
          </h3>
          <p className="mt-2 text-gray-500">
            Try adjusting your search criteria or try a different search term
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                S.No
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Roll Number
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Studying Year
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Academic Year
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {state.data.map((getnew) => (
              <tr
                key={getnew.rollNo}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getnew.sno}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <UserCircle className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {getnew.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getnew.rollNo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getnew.studyingYear} Year
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getnew.academicYear}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() =>
                      window.open(
                        `/details?studyingYear=${getnew.studyingYear}&academicYear=${getnew.academicYear}&rollNo=${getnew.rollNo}`,
                        "_blank"
                      )
                    }
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
