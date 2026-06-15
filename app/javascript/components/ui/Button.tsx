import React from "react";

const VARIANTS: Record<string, string> = {
  primary: "btn",
  secondary: "btn secondary",
  danger: "btn danger",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  loadingText?: string;
}

export default function Button({
  children,
  variant = "primary",
  loading = false,
  loadingText,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${VARIANTS[variant] || VARIANTS.primary} ${className}`.trim()}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (loadingText || "Saving…") : children}
    </button>
  );
}
