import React from "react";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function TextField({
  label,
  error,
  id,
  className = "",
  ...props
}: TextFieldProps) {
  const inputId =
    id ||
    (label ? `field-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

  return (
    <div className={className}>
      {label && <label htmlFor={inputId}>{label}</label>}
      <input id={inputId} {...props} />
      {error && <p className="error">{error}</p>}
    </div>
  );
}
