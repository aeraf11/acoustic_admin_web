export default function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-sm font-medium">{label}</div>
      {children}
      {hint ? <div className="text-xs text-zinc-500">{hint}</div> : null}
    </div>
  );
}
