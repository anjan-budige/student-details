import type { ApiResponse, SearchResult } from "./types";

export async function fetchSearchResults(
  formData: FormData
): Promise<SearchResult[]> {
  try {
    const response = await fetch("/api/search", {
      method: "POST",
      body: formData,
    });

    const data = (await response.json()) as ApiResponse<SearchResult[]>;

    if (!response.ok || data.error) {
      throw new Error(data.error || "Failed to fetch results");
    }

    return data.data || [];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
}
