import { Star } from "lucide-react";

export function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="inline-flex items-center gap-1 text-lime-300" aria-label={`${count} star rating`}>
      {Array.from({ length: count }).map((_, index) => (
        <Star key={index} className="h-3.5 w-3.5 fill-current" />
      ))}
    </div>
  );
}
