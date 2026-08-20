"use client";

import { Search } from "lucide-react";

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  id?: string;
};

export function SearchField({ value, onChange, placeholder, id }: SearchFieldProps) {
  return (
    <div className="search-field">
      <Search className="search-field-icon" aria-hidden />
      <input
        id={id}
        type="search"
        className="input search-field-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
      />
    </div>
  );
}
