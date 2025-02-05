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

    // Set timeout of 30 seconds (30000ms)
    const timeoutMs = 30000;
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), timeoutMs)
    );

    // Fetch data with timeout handling
    const fetchPromise = fetch(url, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    const response = await Promise.race([fetchPromise, timeoutPromise]);

    if (!(response instanceof Response) || !response.ok) {
      const errorText = response instanceof Response ? await response.text() : "No response received";
      console.error(`HTTP error! status: ${response instanceof Response ? response.status : "Unknown"}`, errorText);
      return NextResponse.json(
        { error: `HTTP error! status: ${response instanceof Response ? response.status : "Unknown"}`, details: errorText },
        { status: response instanceof Response ? response.status : 500 }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const printPage = $("#print_page").html();

    if (!printPage) {
      return NextResponse.json({ error: "No results found" }, { status: 404 });
    }

    console.log("printPage content length:", printPage.length);
    return NextResponse.json({ data: printPage });

  } catch (error) {
    console.error("Error fetching details:", error);

    let errorMessage = "Failed to fetch student details";
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes("Request timed out")) {
        errorMessage = "Request timed out after 30 seconds";
        statusCode = 504;
      } else if (error.message.includes("fetch failed")) {
        errorMessage = `Fetch failed: ${error.message}`;
      }
    } else {
      errorMessage = `An unexpected error occurred: ${String(error)}`;
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
