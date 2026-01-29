import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white border rounded-2xl p-6 max-w-md w-full">
        <div className="text-xl font-semibold">Listing Admin</div>
        <div className="mt-2 text-sm text-zinc-600">
          Minimal admin dashboard for managing categories, products, images, and orders.
        </div>
        <Link className="mt-6 inline-flex items-center justify-center rounded-2xl bg-black text-white px-4 py-3 text-sm font-semibold w-full" href="/admin/categories">
          Open Admin
        </Link>
        <div className="mt-3 text-xs text-zinc-500">
          Configure <code className="px-1 py-0.5 bg-zinc-100 rounded">NEXT_PUBLIC_API_BASE_URL</code> in{" "}
          <code className="px-1 py-0.5 bg-zinc-100 rounded">.env.local</code>.
        </div>
      </div>
    </div>
  );
}
