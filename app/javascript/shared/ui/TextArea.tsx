import React from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function TextArea({
  label,
  error,
  id,
  rows = 3,
  className = "",
  ...props
}: TextAreaProps) {
  const inputId =
    id ||
    (label ? `field-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

  return (
    <div className={className}>
      {label && <label htmlFor={inputId}>{label}</label>}
      <textarea id={inputId} rows={rows} {...props} />
      {error && <p className="error">{error}</p>}
    </div>
  );
}
