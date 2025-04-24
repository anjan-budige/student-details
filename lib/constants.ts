export const ADMISSION_YEARS = Array.from(
  { length: 6 }, 
  (_, i) => ({ 
    value: String(2020 + i), 
    label: String(2020 + i) 
  })
);

export const STUDYING_YEARS = [
  { value: '1st', label: '1st Year' },
  { value: '2nd', label: '2nd Year' },
] as const;
