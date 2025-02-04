import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(request: Request) {
  try {
    // Extracting query parameters
    const { searchParams } = new URL(request.url);
    const studyingYear = searchParams.get("studyingYear");
    const academicYear = searchParams.get("academicYear");
    const rollNo = searchParams.get("rollNo");

    console.log("Parameters:", { studyingYear, academicYear, rollNo }); // Log parameters

    // Checking if required parameters are provided
    if (!studyingYear || !academicYear || !rollNo) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Constructing the URL for fetching results
    const yearText = studyingYear === "1st" ? "First" : "Second";
    const yearNumber = studyingYear === "1st" ? "1" : "2";
    const url = `https://tgbie.cgg.gov.in/ResultMemorandum.do?actionpart=getBieResult${yearText}YearGen&property%28pass_year%29=${academicYear}&year=${yearNumber}&category=G&property%28month%29=3&hallticket_no=${rollNo}`;

    console.log("Constructed URL:", url); // Log the constructed URL

    // Fetching the data from the constructed URL
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

    // Check if the fetch was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the HTML content of the response
    const html = await response.text(); // Log the HTML response for debugging
    const $ = cheerio.load(html);

    // Extract the content related to the print page
    const printPage = $("#print_page").html();

    // If no printPage content is found, return a 404 error
    if (!printPage) {
      return NextResponse.json({ error: "No results found" }, { status: 404 });
    }

    // Return the result as JSON
    return NextResponse.json({ data: printPage });
  } catch (error) {
    console.error("Error fetching details:", error);
    return NextResponse.json(
      { error: "Failed to fetch student details" },
      { status: 500 }
    );
  }
}
