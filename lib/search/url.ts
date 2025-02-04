import type { SearchParams } from "./types";

const BASE_URL =
  "https://tg-inter-2nd-year-result.indiaresults.com/tg/bie-telangana";

export function buildSearchUrl(params: SearchParams): string {
  const searchType = params.name ? "name" : "rollno";
  const searchValue = params.name || params.rollNo;
  const yearNumber = params.studyingYear === "1st" ? "1" : "2";

  if (searchType === "name") {
    return `${BASE_URL}/intermediate-${yearNumber}-year-gen-exam-result-${
      params.admissionYear
    }/name-results.aspx?name=${encodeURIComponent(searchValue!)}`;
  }

  return `${BASE_URL}/intermediate-${yearNumber}-year-gen-exam-result-${params.admissionYear}/result.asp?rollno=${searchValue}`;
}
