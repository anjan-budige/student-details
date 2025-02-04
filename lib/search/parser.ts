import * as cheerio from "cheerio";
import type { SearchResult } from "./types";

export function parseNameSearchResults($: cheerio.CheerioAPI): SearchResult[] {
  const results: SearchResult[] = [];

  $("#GridView1 tr").each((i, elem) => {
    if (i === 0 || $(elem).find("th").length > 0) return;

    const tds = $(elem).find("td");
    if (tds.length >= 4) {
      const sno = $(tds[0]).text().trim();
      const name = $(tds[1]).text().trim();
      const rollNo = $(tds[2]).text().trim();

      if (sno && name && rollNo) {
        results.push({
          sno,
          id: rollNo, // Using rollNo as id since it's unique
          name,
          rollNo,
          academicYear: null,
          studyingYear: null,
        });
      }
    }
  });

  return results;
}

export function parseRollNoSearchResult(
  $: cheerio.CheerioAPI,
  rollNo: string
): SearchResult[] {
  const name = $('span:contains("Name")').next("span").text().trim();

  if (!name) {
    return [];
  }

  return [
    {
      sno: "1",
      id: rollNo,
      name,
      rollNo,
      academicYear: null,
      studyingYear: null,
    },
  ];
}
