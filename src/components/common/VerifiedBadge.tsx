import { CheckCircle2 } from "lucide-react";

interface VerifiedBadgeProps {
  verified?: boolean;
  size?: number;
  className?: string;
}

export function VerifiedBadge({ verified, size = 16, className = "" }: VerifiedBadgeProps) {
  if (!verified) return null;
  return (
    <span className={`inline-flex items-center text-blue-400 fill-blue-400/20 title="Verified Account" ${className}`}>
      <CheckCircle2 size={size} className="fill-blue-500/20 text-blue-400" />
    </span>
  );
}
