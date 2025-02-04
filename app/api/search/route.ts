import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { validateSearchParams } from "@/lib/search/validation";
import { buildSearchUrl } from "@/lib/search/url";
import {
  parseNameSearchResults,
  parseRollNoSearchResult,
} from "@/lib/search/parser";
import type {
  SearchFormData,
  ApiResponse,
  SearchResult,
} from "@/lib/search/types";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const searchFormData: SearchFormData = {
      name: formData.get("name") as string | null,
      rollNo: formData.get("rollNo") as string | null,
      studyingYear: formData.get("studyingYear") as "1st" | "2nd" | null,
      admissionYear: formData.get("admissionYear") as string | null,
    };

    const params = validateSearchParams(searchFormData);
    if (!params) {
      return NextResponse.json<ApiResponse<never>>({
        error: "Missing required fields",
        status: 400,
      });
    }

    const url = buildSearchUrl(params);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const results = params.name
      ? parseNameSearchResults($)
      : parseRollNoSearchResult($, params.rollNo!);

    if (results.length === 0) {
      return NextResponse.json<ApiResponse<never>>({
        error: "No results found",
        status: 404,
      });
    }

    return NextResponse.json<ApiResponse<SearchResult[]>>({
      data: results.map((result) => ({
        ...result,
        academicYear: searchFormData.admissionYear,
        studyingYear: searchFormData.studyingYear,
      })),
      status: 200,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json<ApiResponse<never>>({
      error:
        "Failed to fetch results. Please check your search criteria and try again.",
      status: 500,
    });
  }
}
