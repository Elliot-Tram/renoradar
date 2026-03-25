interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "dpe-f" | "dpe-g" | "success" | "warning";
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: "bg-gray-100 text-gray-700",
  "dpe-f": "bg-dpe-f/15 text-dpe-f font-bold",
  "dpe-g": "bg-dpe-g/15 text-dpe-g font-bold",
  success: "bg-green-50 text-green-700",
  warning: "bg-amber-50 text-amber-700",
};

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
