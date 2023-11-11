import classNames from "classnames";
import React from "react";

interface InputProps {
  onChange?: (e: any) => void;
  value?: string | number;
  customCss?: string;
  labelText?: string;
  name?: string;
  errorMessage?: string;
  disabled?: boolean;
  placeholder?: string;
  [x: string]: any;
}

export default function Input({
  onChange,
  value,
  name = "",
  labelText = "",
  customCss = "",
  errorMessage = "",
  placeholder = "",
  disabled = false,
  ...props
}: InputProps) {
  return (
    <div>
      <div>
        {name && <label htmlFor={name}>{labelText}</label>}
        <input
          placeholder={placeholder}
          className={classNames(
            "block w-full rounded-md border border-solid border-terciary-500 px-5 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-0",
            `${customCss}`,
            { "border-red-700": errorMessage },
            { "bg-gray-100": disabled }
          )}
          onChange={onChange}
          name={name}
          value={value}
          aria-labelledby={name}
          disabled={disabled}
          {...props}
        ></input>
        {errorMessage && <small className="text-red-700">{errorMessage}</small>}
      </div>
    </div>
  );
}
