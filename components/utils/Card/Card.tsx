import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  size: "sm" | "md" | "lg";
};

const Card = ({ children }: CardProps) => {
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      {children}
    </div>
  );
};

export default Card;
