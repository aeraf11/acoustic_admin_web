"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Shell from "@/components/Shell";
import Panel from "@/components/Panel";
import { api, Category, Product, API_BASE_URL } from "@/lib/api";
import { money } from "@/lib/money";

export default function ProductEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);

  const [cats, setCats] = useState<Category[]>([]);
  const [p, setP] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number>(0);
  const [priceCents, setPriceCents] = useState<number>(0);
  const [currency, setCurrency] = useState("GBP");
  const [stock, setStock] = useState<number>(0);

  async function load() {
    try {
      setErr(null);
      setLoading(true);
      const [c, prod] = await Promise.all([api.getCategories(), api.getProduct(id)]);
      setCats(c);
      setP(prod);
      setName(prod.name ?? "");
      setDescription(prod.description ?? "");
      setCategoryId(prod.categoryId);
      setPriceCents(prod.priceCents);
      setCurrency(prod.currency ?? "GBP");
      setStock(prod.stock ?? 0);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (Number.isFinite(id)) load(); }, [id]);

  const canSave = useMemo(() => name.trim().length >= 2 && categoryId > 0 && priceCents > 0, [name, categoryId, priceCents]);

  async function save() {
    try {
      setErr(null);
      await api.updateProduct(id, { name: name.trim(), description: description.trim() || null, categoryId, priceCents, currency: currency.toUpperCase(), stock });
      await load();
    } catch (e: any) {
      setErr(e?.message ?? "Save failed");
    }
  }

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      setErr(null);
      await api.uploadProductImage(id, file);
      await load();
      e.target.value = "";
    } catch (e: any) {
      setErr(e?.message ?? "Upload failed");
    }
  }
  async function removeImage(imageId: number) {
    try {
      setErr(null);
      if (!confirm("Delete this image?")) return;
      await api.deleteProductImage(id, imageId);
      await load();
    } catch (e: any) {
      setErr(e?.message ?? "Delete failed");
    }
  }

  return (
    <Shell title={`Product #${id}`}>
      <div className="flex flex-col gap-4">
        <Panel>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Edit product</div>
              {p ? <div className="text-sm text-zinc-600 mt-1">Current: {money(p.priceCents, p.currency)}</div> : null}
            </div>
            <button onClick={() => router.back()} className="text-sm rounded-xl border px-3 py-1.5 hover:bg-zinc-50">Back</button>
          </div>

          {loading ? <div className="mt-3 text-sm text-zinc-600">Loading…</div> : null}
          {err && !loading ? <div className="mt-3 text-sm text-red-600">{err}</div> : null}

          {p ? (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="text-sm flex flex-col gap-1">
                <span className="font-medium">Name</span>
                <input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-200" />
              </label>

              <label className="text-sm flex flex-col gap-1">
                <span className="font-medium">Category</span>
                <select value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))} className="rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-200">
                  {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>

              <label className="text-sm flex flex-col gap-1 md:col-span-2">
                <span className="font-medium">Description</span>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-200 min-h-[90px]" />
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
          ) : null}

          <button disabled={!p || !canSave} onClick={save} className="mt-4 rounded-2xl bg-black text-white px-4 py-2 text-sm font-semibold disabled:opacity-40">Save</button>
        </Panel>

        <Panel>
          <div className="font-semibold">Images</div>
          <div className="mt-2 text-sm text-zinc-600">Upload an image for this product.</div>
          <div className="mt-4 flex items-center gap-3">
            <input type="file" accept="image/*" onChange={upload} className="text-sm" />
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">

            {(p?.images ?? []).map((img) => (
              <div key={img.id} className="border rounded-2xl overflow-hidden bg-zinc-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${API_BASE_URL}${img.url}`} alt="" className="w-full h-32 object-cover" />

                <div className="p-2 flex items-center justify-between gap-2">
                  <div className="text-xs text-zinc-600 truncate min-w-0">{img.url}</div>
                  <button
                    onClick={() => removeImage(img.id)}
                    className="text-xs rounded-xl border px-2 py-1 hover:bg-zinc-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {(!p?.images || p.images.length === 0) ? <div className="text-sm text-zinc-600">No images yet.</div> : null}
          </div>
        </Panel>

        <Panel>
          <div className="font-semibold">Orders</div>
          <div className="mt-2 text-sm text-zinc-600">Orders screen is available, but your API needs an orders endpoint to populate it.</div>
        </Panel>
      </div>
    </Shell>
  );
}
