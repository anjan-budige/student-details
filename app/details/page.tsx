/* eslint-disable-next-line react/jsx-pascal-case */
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Margarine } from "next/font/google";

import { Suspense } from "react";
interface DetailsState {
  data: string | null;
  error: string | null;
  isLoading: boolean;
  extractedDetails: {
    name: string | null;
    photo: string | null;
    marks: string | null;
  } | null;
}

function DetailsContent() {
  const searchParams = useSearchParams();
  const studyingYear = searchParams?.get("studyingYear");
  const academicYear = searchParams?.get("academicYear");
  const rollNo = searchParams?.get("rollNo");
  const [state, setState] = useState<DetailsState>({
    data: null,
    error: null,
    isLoading: true,
    extractedDetails: null,
  });

  function extractDetails(data: string) {
    let name = "";
    let photo = "";
    let marks: string[] = [];

    const nameMatch = data.match(
      /<td colspan="4" style="width: auto;" valign="top"><b>(.*?)<\/b>/ // name
    );
    if (nameMatch) {
      name = nameMatch[1];
    }

    const photoMatch = data.match(
      /<img src="https?:\/\/tgbie\.cgg\.gov\.in:443\/scannedPhotos\/\d+\/\d+_\d+_photo\.jpg"/ // photo
    );
    if (photoMatch && photoMatch.length > 0) {
      const photoMatchResult = photoMatch[0].match(/src="([^"]+)"/);
      if (photoMatchResult && photoMatchResult.length > 0) {
        photo = photoMatchResult[1];
      }
    }

    const grandTotalMatch = data.match(
      /<b>\s*\*([A-Z]+)\*\*([A-Z]+)\*\*\*([A-Z]+)\*\s*<\/b>/ // marks
    );
    if (grandTotalMatch) {
      const totalMarks = `${convertTextToNumber(
        grandTotalMatch[1]
      )}${convertTextToNumber(grandTotalMatch[2])}${convertTextToNumber(
        grandTotalMatch[3]
      )}`;
      marks = [totalMarks];
    }

    

    return { name, photo, marks: marks.join(", ") };
  }

  useEffect(() => {
    if (!studyingYear || !academicYear || !rollNo) {
      setState({
        data: null,
        error: "Missing parameters",
        isLoading: false,
        extractedDetails: null,
      });
      return;
    }

    async function fetchDetails() {
      try {
        const response = await fetch(
          `/api/details?studyingYear=${studyingYear}&academicYear=${academicYear}&rollNo=${rollNo}`
        );
        const data: { data: string; error?: string } = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch details");
        }

        const extractedDetails = extractDetails(data.data || "");

        setState({
          data: data.data || null,
          error: null,
          isLoading: false,
          extractedDetails,
        });
      } catch (error) {
        setState({
          data: null,
          error: error instanceof Error ? error.message : "An error occurred",
          isLoading: false,
          extractedDetails: null,
        });
      }
    }

    fetchDetails();
  }, [studyingYear, academicYear, rollNo]);

  if (state.isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column" as const,
        }}
      >
        <div style={styles.loader}></div>
        <p style={styles.loadingText}>Loading details, please wait...</p>
      </div>
    );
  }

  if (state.error) {
    return (
      <div style={styles.errorContainer}>
        <div
          style={{
            backgroundColor: "#f7fafc",
            padding: "2rem",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            textAlign: "center" as const,
            width: "100%",
            maxWidth: "500px",
          }}
        >
          <h3 style={styles.errorHeader}>Error</h3>
          <p style={styles.errorMessage}>{state.error}</p>
          <button
            style={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column" as const,
        backgroundColor: "#f7fafc",
      }}
    >
      <header
        style={{
          backgroundColor: "#3182ce",
          color: "white",
          padding: "1rem",
          textAlign: "center" as const,
        }}
      >
        <h1 style={styles.headerText}>Student Details</h1>
      </header>

      <main style={styles.main}>
        {state.extractedDetails && (
          <div style={styles.card}>
            {state.extractedDetails.photo ? (
              <img
                alt="Student Photo"
                style={{
                  ...styles.image,
                  display: "block",
                  margin: "0 auto", // Center the image horizontally
                }}
                src={state.extractedDetails.photo}
                width={270}
              />
            ) : (
              <div style={styles.imagePlaceholder}>
                <span style={styles.imagePlaceholderText}>
                  No photo available
                </span>
              </div>
            )}
            <div style={{ padding: "1rem", textAlign: "center" as const }}>
              <br />
              <h4 style={styles.cardTitle}>
                {state.extractedDetails.name || "N/A"}
              </h4>
              <p style={styles.cardSubtitle}>
                Roll No: <span style={styles.cardTextBlue}>{rollNo}</span>
              </p>
              <p style={styles.cardMarks}>
                <strong>Marks:</strong> {state.extractedDetails.marks || "N/A"}
              </p>
            </div>
          </div>
        )}
      </main>

      <footer
        style={{
          textAlign: "center",
          padding: "1rem",
          backgroundColor: "#f7fafc",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <p style={styles.footerText}>
          Developed by <span style={styles.footerHighlight}>Team Cypher</span>.
          For educational purposes only.
        </p>
      </footer>
    </div>
  );
}

function convertTextToNumber(text: string): number {
  const wordToNumber: { [key: string]: number } = {
    ZERO: 0,
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
    SIX: 6,
    SEVEN: 7,
    EIGHT: 8,
    NINE: 9,
  };

  const numberString = text
    .trim()
    .split(" ")
    .map((word) => wordToNumber[word] || "")
    .join("");

    return numberString ? parseInt(numberString, 10) : 0;
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f7fafc",
  },
  header: {
    backgroundColor: "#3182ce",
    color: "white",
    padding: "1rem",
    textAlign: "center",
  },
  headerText: {
    fontSize: "2rem",
    fontWeight: "bold",
  },
  main: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    padding: "1rem",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "1rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "2rem",
    width: "100%",
    maxWidth: "800px",
  },
  image: {
    borderRadius: "1rem",
    width: "100%",
    maxWidth: "270px",
    marginBottom: "1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholder: {
    width: "100%",
    height: "12rem",
    backgroundColor: "#e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "1rem",
  },
  imagePlaceholderText: {
    color: "#4a5568",
  },
  cardHeader: {
    padding: "0 1rem",
    textAlign: "center",
  },
  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },
  cardSubtitle: {
    color: "#718096",
    fontSize: "1rem",
  },
  cardTextBlue: {
    color: "#3182ce",
  },
  cardMarks: {
    fontSize: "1.125rem",
    color: "#4a5568",
  },
  footer: {
    textAlign: "center",
    padding: "1rem",
    backgroundColor: "#f7fafc",
    borderTop: "1px solid #e2e8f0",
  },
  footerText: {
    fontSize: "1rem",
    color: "#4a5568",
  },
  footerHighlight: {
    fontWeight: "bold",
    color: "#3182ce",
    textDecoration: "underline",
  },
  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  loader: {
    borderTop: "4px solid #3182ce",
    borderRight: "4px solid transparent",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "1rem",
    fontSize: "1.2rem",
    color: "#3182ce",
  },
  errorContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#fffaf0",
  },
  errorCard: {
    backgroundColor: "#f7fafc",
    padding: "2rem",
    borderRadius: "0.5rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    width: "100%",
    maxWidth: "500px",
  },
  errorHeader: {
    color: "#e53e3e",
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  errorMessage: {
    fontSize: "1.1rem",
    color: "#4a5568",
    marginBottom: "1rem",
  },
  retryButton: {
    backgroundColor: "#3182ce",
    color: "white",
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    border: "none",
    borderRadius: "0.375rem",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default function DetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DetailsContent />
    </Suspense>
  );
}
