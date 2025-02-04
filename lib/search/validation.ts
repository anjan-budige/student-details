import type { SearchFormData, SearchParams } from './types';

export function validateSearchParams(formData: SearchFormData): SearchParams | null {
  const { name, rollNo, studyingYear, admissionYear } = formData;

  if (!studyingYear || !admissionYear || (!name && !rollNo)) {
    return null;
  }

  return {
    name: name || undefined,
    rollNo: rollNo || undefined,
    studyingYear,
    admissionYear,
  };
}