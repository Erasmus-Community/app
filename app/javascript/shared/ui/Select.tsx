import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: [string, string][];
  placeholder?: string;
}

export default function Select({
  label,
  error,
  id,
  options = [],
  placeholder = "Select…",
  className = "",
  ...props
}: SelectProps) {
  const inputId =
    id ||
    (label ? `field-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

  return (
    <div className={className}>
      {label && <label htmlFor={inputId}>{label}</label>}
      <select id={inputId} {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
