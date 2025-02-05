"use client";

import { FormField } from "./form/FormField";
import { SearchButton } from "./form/SearchButton";
import { SelectField } from "./form/SelectField";
import { ADMISSION_YEARS, STUDYING_YEARS } from "@/lib/constants";
import { useState } from "react";

export function SearchForm() {
  const [searchType, setSearchType] = useState<"name" | "rollno">("name");

  return (
    <form
      method="POST"
      action="/api/search"
      className="space-y-6 bg-white p-8 rounded-xl shadow-lg"
    >
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">
          Student Details Search
        </h2>
        <p className="text-gray-600">
          Search for student information using name or roll number
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setSearchType("name")}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
              searchType === "name"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Search by Name
          </button>
          <button
            type="button"
            onClick={() => setSearchType("rollno")}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
              searchType === "rollno"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Search by Roll Number
          </button>
        </div>

        <div className="space-y-4">
          {searchType === "name" ? (
            <FormField label="Student Name" htmlFor="name">
              <input
                type="text"
                id="name"
                name="name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                placeholder="Enter student name"
                required
              />
            </FormField>
          ) : (
            <FormField label="Roll Number" htmlFor="rollNo">
              <input
                type="text"
                id="rollNo"
                name="rollNo"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                placeholder="Enter roll number"
                required
              />
            </FormField>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Studying Year" htmlFor="studyingYear">
              <SelectField
                id="studyingYear"
                name="studyingYear"
                options={STUDYING_YEARS.map((year) => ({
                  value: year.value,
                  label: year.label,
                }))}
                placeholder="Select studying year"
              />
            </FormField>

            <FormField label="Admission Year" htmlFor="admissionYear">
              <SelectField
                id="admissionYear"
                name="admissionYear"
                options={ADMISSION_YEARS}
                placeholder="Select admission year"
              />
            </FormField>
          </div>
        </div>

        <SearchButton />
      </div>
    </form>
  );
}
