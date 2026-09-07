import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  src?: string;
  size?: number;
  className?: string;
}

function initials(name: string) {
  const clean = name.replace(/\(.*?\)/g, "").trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({ name, src, size = 40, className }: AvatarProps) {
  if (src) {
    return (
      <div
        className={cn("rounded-full overflow-hidden flex-shrink-0 relative", className)}
        style={{ width: size, height: size }}
      >
        <Image src={src} alt={name} fill sizes={`${size}px`} className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-full flex-shrink-0 bg-primary-container text-on-primary flex items-center justify-center font-bold",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      aria-hidden
    >
      {initials(name)}
    </div>
  );
}
