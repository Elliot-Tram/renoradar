interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md";
}

function getScoreColor(score: number): string {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-chartreuse";
  if (score >= 40) return "bg-amber-400";
  return "bg-gray-300";
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Bon";
  if (score >= 40) return "Moyen";
  return "Faible";
}

export default function ScoreBadge({ score, size = "md" }: ScoreBadgeProps) {
  const isSmall = size === "sm";

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${isSmall ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm"} rounded-full ${getScoreColor(score)} flex items-center justify-center font-heading font-bold text-gray-900`}
      >
        {score}
      </div>
      {!isSmall && (
        <span className="text-xs text-gray-500">{getScoreLabel(score)}</span>
      )}
    </div>
  );
}
