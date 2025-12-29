import { cn } from "../general/utils/utils"; // Ho?c ???ng d?n t?i file utils ch?a hàm cn

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200", className)}
      {...props}
    />
  )
}

export { Skeleton }