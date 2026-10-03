import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; classes: string; dot: string }> = {
  succeeded: {
    label: "Succeeded",
    classes: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  failed: {
    label: "Failed",
    classes: "bg-red-500/10 text-red-400 border border-red-500/20",
    dot: "bg-red-400",
  },
  cancelled: {
    label: "Cancelled",
    classes: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    dot: "bg-amber-400",
  },
  running: {
    label: "Running",
    classes: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    dot: "bg-blue-400 animate-pulse",
  },
};

export default function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? {
    label: status,
    classes: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
    dot: "bg-slate-400",
  };

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold", config.classes)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}
