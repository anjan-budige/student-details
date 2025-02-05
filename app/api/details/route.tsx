// /api/details/route.ts
import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studyingYear = searchParams.get("studyingYear");
    const academicYear = searchParams.get("academicYear");
    const rollNo = searchParams.get("rollNo");

    if (!studyingYear || !academicYear || !rollNo) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const yearText = studyingYear === "1st" ? "First" : "Second";
    const yearNumber = studyingYear === "1st" ? "1" : "2";
    const url = `https://tgbie.cgg.gov.in/ResultMemorandum.do?actionpart=getBieResult${yearText}YearGen&property%28pass_year%29=${academicYear}&year=${yearNumber}&category=G&property%28month%29=3&hallticket_no=${rollNo}`;

    console.log("Constructed URL:", url);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 50000);


    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36", // Use a consistent, modern User-Agent
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
        // Log more details about the failed response
        console.error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
        const errorText = await response.text(); // Get the error response body
        console.error("Error response body:", errorText);

        return NextResponse.json(
            { error: `HTTP error! status: ${response.status}`, details: errorText }, // Include error details in the response
            { status: response.status }
        );
    }

    const html = await response.text();
    //return NextResponse.json({ data: html});  //FOR DEBUG: Return raw HTML, remove cheerio

    const $ = cheerio.load(html);
    const printPage = $("#print_page").html();

    if (!printPage) {
      return NextResponse.json({ error: "No results found" }, { status: 404 });
    }

    console.log("printPage content length:", printPage.length); // Log the length of the extracted content
    return NextResponse.json({ data: printPage });

  } catch (error) {
    console.error("Error fetching details:", error);

    let errorMessage = "Failed to fetch student details";
    let statusCode = 500;

    // Use type guards and optional chaining for safer error handling
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        errorMessage = "Request timed out after 50 seconds";
        statusCode = 504;
      } else if (error.name === 'TypeError' && error.message?.includes('fetch failed')) {
            // More robust way to access cause and message
            const cause = (error as any).cause; // Cast to 'any' to bypass type checking temporarily
            const causeMessage = cause && typeof cause === 'object' && 'message' in cause ? cause.message : undefined;
            errorMessage = `Fetch failed: ${causeMessage || error.message || 'Unknown cause'}`;
            statusCode = 500;
        }
    } else {
        // Handle cases where 'error' is not an Error instance (e.g., a string, object, etc.)
        errorMessage = `An unexpected error occurred: ${String(error)}`;
    }


    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
