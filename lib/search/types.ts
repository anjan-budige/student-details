export type StudyingYear = "1st" | "2nd";

export interface SearchFormData {
  name: string | null;
  rollNo: string | null;
  studyingYear: StudyingYear | null;
  admissionYear: string | null;
}

export interface SearchParams {
  name?: string;
  rollNo?: string;
  studyingYear: StudyingYear;
  admissionYear: string;
}

export interface SearchResult {
  sno: string;
  id: string;
  name: string;
  rollNo: string;
  academicYear: string | null;
  studyingYear: string | null; // Modify this to string | null instead of number
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}
