// Search related types
export interface SearchResult {
  id: string;
  rollNo: string;
  name: string;
  admissionYear: string;
  currentYear: string;
  department: string;
}

export interface SearchParams {
  name?: string;
  rollNo?: string;
  studyingYear: "1st" | "2nd";
  admissionYear: string;
}

// Form related types
export interface FormFieldProps {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}

export interface SelectOption {
  value: string;
  label: string;
}

// API response types
export interface ApiErrorResponse {
  error: string;
}

export interface ApiSuccessResponse {
  results: SearchResult[];
}
