interface DpeBadgeProps {
  etiquette: string;
  size?: "sm" | "md" | "lg";
}

const dpeColors: Record<string, string> = {
  A: "bg-dpe-a text-white",
  B: "bg-dpe-b text-gray-900",
  C: "bg-dpe-c text-gray-900",
  D: "bg-dpe-d text-gray-900",
  E: "bg-dpe-e text-gray-900",
  F: "bg-dpe-f text-white",
  G: "bg-dpe-g text-white",
};

const sizeStyles = {
  sm: "w-6 h-6 text-xs",
  md: "w-8 h-8 text-sm",
  lg: "w-10 h-10 text-base",
};

export default function DpeBadge({ etiquette, size = "md" }: DpeBadgeProps) {
  const color = dpeColors[etiquette] || "bg-gray-200 text-gray-700";

  return (
    <div
      className={`${sizeStyles[size]} ${color} rounded-lg flex items-center justify-center font-heading font-bold`}
    >
      {etiquette}
    </div>
  );
}
