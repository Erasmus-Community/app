import React from "react";

interface FormStackProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

export default function FormStack({
  children,
  onSubmit,
  className = "",
  ...props
}: FormStackProps) {
  return (
    <form
      className={`stack ${className}`.trim()}
      onSubmit={onSubmit}
      {...props}
    >
      {children}
    </form>
  );
}
