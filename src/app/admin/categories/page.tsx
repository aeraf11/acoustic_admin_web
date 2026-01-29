"use client";

import { useEffect, useMemo, useState } from "react";
import Shell from "@/components/Shell";
import Panel from "@/components/Panel";
import Field from "@/components/Field";
import { api, Category } from "@/lib/api";

export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  async function load() {
    try {
      setErr(null);
      setLoading(true);
      const data = await api.getCategories();
      setItems(data);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const canCreate = useMemo(() => name.trim().length >= 2 && slug.trim().length >= 2, [name, slug]);

  async function create() {
    try {
      setErr(null);
      await api.createCategory({ name: name.trim(), slug: slug.trim() });
      setName("");
      setSlug("");
      await load();
    } catch (e: any) {
      setErr(e?.message ?? "Create failed");
    }
  }

  return (
    <Shell title="Categories">
      <div className="flex flex-col gap-4">
        <Panel>
          <div className="font-semibold">Create category</div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Name">
              <input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-200" placeholder="e.g. Electronics" />
            </Field>
            <Field label="Slug" hint="Lowercase, URL-friendly">
              <input value={slug} onChange={(e) => setSlug(e.target.value)} className="rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-200" placeholder="e.g. electronics" />
            </Field>
          </div>
          <button disabled={!canCreate} onClick={create} className="mt-4 rounded-2xl bg-black text-white px-4 py-2 text-sm font-semibold disabled:opacity-40">
            Create
          </button>
          {err ? <div className="mt-3 text-sm text-red-600">{err}</div> : null}
        </Panel>

        <Panel>
          <div className="flex items-center justify-between">
            <div className="font-semibold">All categories</div>
            <button onClick={load} className="text-sm rounded-xl border px-3 py-1.5 hover:bg-zinc-50">Refresh</button>
          </div>

          {loading ? <div className="mt-3 text-sm text-zinc-600">Loading…</div> : null}
          {err && !loading ? <div className="mt-3 text-sm text-red-600">{err}</div> : null}

          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-zinc-500">
                  <th className="py-2 pr-4">Id</th>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Slug</th>
                </tr>
              </thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="py-2 pr-4">{c.id}</td>
                    <td className="py-2 pr-4 font-medium">{c.name}</td>
                    <td className="py-2 pr-4">{c.slug}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </Shell>
  );
}
