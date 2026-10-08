import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return (
    <header className="border-b border-[#34418E]/12 bg-[#ECEEF7]">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 py-12 sm:flex-row sm:items-end lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#B88910]">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em]">{title}</h1>
          <p className="mt-3 max-w-2xl text-[#6B7C8F]">{description}</p>
        </div>
        {action}
      </div>
    </header>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "error" | "success"; children: ReactNode }) {
  const styles = tone === "error" ? "border-red-200 bg-red-50 text-red-800" : tone === "success" ? "border-green-200 bg-green-50 text-green-800" : "border-[#34418E]/15 bg-white text-[#52677A]";
  return <div className={`border p-4 text-sm ${styles}`}>{children}</div>;
}

export function LoadingState() {
  return <div className="grid min-h-64 place-items-center"><div className="size-9 animate-spin rounded-full border-4 border-[#34418E]/15 border-t-[#34418E]" aria-label="Loading" /></div>;
}

export function FormField({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold">{label}</span>
      {children}
      {error && <span role="alert" className="mt-1 block text-xs font-semibold text-red-700">{error}</span>}
    </label>
  );
}
