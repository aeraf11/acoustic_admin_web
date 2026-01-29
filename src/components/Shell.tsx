import Link from "next/link";
import { ReactNode } from "react";

export default function Shell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="font-semibold">Listing Admin</div>
          <div className="text-sm text-zinc-600">{title}</div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
        <aside className="bg-white border rounded-2xl p-3 h-fit">
          <nav className="flex flex-col gap-1 text-sm">
            <Nav href="/admin/categories" label="Categories" />
            <Nav href="/admin/products" label="Products" />
            <Nav href="/admin/orders" label="Orders" />
            <div className="mt-2 pt-2 border-t text-xs text-zinc-500">
              Set <code className="px-1 py-0.5 bg-zinc-100 rounded">NEXT_PUBLIC_API_BASE_URL</code>
            </div>
          </nav>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}

function Nav({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="px-3 py-2 rounded-xl hover:bg-zinc-50 border border-transparent hover:border-zinc-100">
      {label}
    </Link>
  );
}
