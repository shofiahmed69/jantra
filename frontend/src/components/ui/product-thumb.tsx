import { isSafeImageUrl } from "@/lib/safe-url";

type ProductThumbProps = {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const sizes = {
  sm: "h-12 w-12",
  md: "h-16 w-16",
  lg: "h-20 w-20",
  xl: "h-28 w-28",
};

export function ProductThumb({ src, alt = "", size = "md", className = "" }: ProductThumbProps) {
  const dim = sizes[size];
  if (src && isSafeImageUrl(src)) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${dim} rounded-xl object-cover border-2 border-slate-200 bg-white shrink-0 ${className}`}
      />
    );
  }
  return (
    <span
      className={`${dim} rounded-xl border-2 border-slate-200 bg-orange-50 text-3xl grid place-items-center shrink-0 ${className}`}
      aria-hidden
    >
      💊
    </span>
  );
}
