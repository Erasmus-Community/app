import React from "react";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  children?: React.ReactNode;
}

export default function Checkbox({ label, children, className = "", ...props }: CheckboxProps) {
  return (
    <label className={`flex items-start gap-2 font-normal ${className}`.trim()}>
      <input type="checkbox" className="mt-1 w-auto" {...props} />
      <span>{children || label}</span>
    </label>
  );
}
