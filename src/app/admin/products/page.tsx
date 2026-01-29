"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Shell from "@/components/Shell";
import Panel from "@/components/Panel";
import { api, Category, Product } from "@/lib/api";
import { money } from "@/lib/money";

export default function ProductsPage() {
  const [cats, setCats] = useState<Category[]>([]);
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [priceCents, setPriceCents] = useState<number>(1999);
  const [currency, setCurrency] = useState("GBP");
  const [stock, setStock] = useState<number>(10);

  async function load() {
    try {
      setErr(null);
      setLoading(true);
      const [c, p] = await Promise.all([api.getCategories(), api.getProducts()]);
      setCats(c);
      setItems(p);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const canCreate = useMemo(() => name.trim().length >= 2 && categoryId !== "" && priceCents > 0 && currency.trim().length >= 3, [name, categoryId, priceCents, currency]);

  async function create() {
    try {
      if (categoryId === "") return;
      setErr(null);
      await api.createProduct({
        name: name.trim(),
        description: description.trim() || null,
        categoryId: categoryId,
        priceCents,
        currency: currency.toUpperCase(),
        stock,
      });
      setName("");
      setDescription("");
      await load();
    } catch (e: any) {
      setErr(e?.message ?? "Create failed");
    }
  }

  const catName = useMemo(() => {
    const map = new Map(cats.map((c) => [c.id, c.name]));
    return (id: number) => map.get(id) ?? String(id);
  }, [cats]);

  return (
    <Shell title="Products">
      <div className="flex flex-col gap-4">
        <Panel>
          <div className="font-semibold">Create product</div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="text-sm flex flex-col gap-1">
              <span className="font-medium">Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-200" placeholder="e.g. iPhone case" />
            </label>

            <label className="text-sm flex flex-col gap-1">
              <span className="font-medium">Category</span>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : "")} className="rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-200">
                <option value="">Select…</option>
                {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>

            <label className="text-sm flex flex-col gap-1 md:col-span-2">
              <span className="font-medium">Description</span>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-200 min-h-[80px]" placeholder="Optional" />
            </label>

            <label className="text-sm flex flex-col gap-1">
              <span className="font-medium">Price (cents)</span>
              <input value={priceCents} onChange={(e) => setPriceCents(Number(e.target.value || 0))} type="number" className="rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-200" />
            </label>

            <label className="text-sm flex flex-col gap-1">
              <span className="font-medium">Currency</span>
              <input value={currency} onChange={(e) => setCurrency(e.target.value)} className="rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-200" />
            </label>

            <label className="text-sm flex flex-col gap-1">
              <span className="font-medium">Stock</span>
              <input value={stock} onChange={(e) => setStock(Number(e.target.value || 0))} type="number" className="rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-200" />
            </label>
          </div>

          <button disabled={!canCreate} onClick={create} className="mt-4 rounded-2xl bg-black text-white px-4 py-2 text-sm font-semibold disabled:opacity-40">Create</button>
          {err ? <div className="mt-3 text-sm text-red-600">{err}</div> : null}
        </Panel>

        <Panel>
          <div className="flex items-center justify-between">
            <div className="font-semibold">All products</div>
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
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Price</th>
                  <th className="py-2 pr-4">Stock</th>
                  <th className="py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="py-2 pr-4">{p.id}</td>
                    <td className="py-2 pr-4 font-medium">{p.name}</td>
                    <td className="py-2 pr-4">{catName(p.categoryId)}</td>
                    <td className="py-2 pr-4">{money(p.priceCents, p.currency)}</td>
                    <td className="py-2 pr-4">{p.stock}</td>
                    <td className="py-2 pr-4">
                      <Link className="underline" href={`/admin/products/${p.id}`}>Edit & Images</Link>
                    </td>
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
