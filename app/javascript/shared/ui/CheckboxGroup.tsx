import React from "react";
import Checkbox from "./Checkbox";

interface CheckboxGroupProps {
  legend: string;
  options: string[];
  selected?: string[];
  onChange: (selected: string[]) => void;
}

export default function CheckboxGroup({
  legend,
  options,
  selected = [],
  onChange,
}: CheckboxGroupProps) {
  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value],
    );
  };

  return (
    <fieldset>
      <legend>{legend}</legend>
      {options.map((opt) => (
        <Checkbox
          key={opt}
          checked={selected.includes(opt)}
          onChange={() => toggle(opt)}
          label={opt}
        />
      ))}
    </fieldset>
  );
}
