interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

const paddingStyles = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function Card({
  children,
  className = "",
  padding = "md",
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200 shadow-sm ${paddingStyles[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
