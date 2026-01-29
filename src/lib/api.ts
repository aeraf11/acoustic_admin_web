export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:5000";

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText}${text ? `: ${text}` : ""}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export type Category = { id: number; name: string; slug: string };
export type ProductImage = { id: number; url: string; sortOrder: number };
export type Product = {
  id: number;
  categoryId: number;
  name: string;
  description?: string | null;
  priceCents: number;
  currency: string;
  stock: number;
  isActive?: boolean;
  images?: ProductImage[];
};

function normCategory(x: any) {
  return {
    id: x.id ?? x.Id,
    name: x.name ?? x.Name,
    slug: x.slug ?? x.Slug,
  };
}

function normProduct(x: any) {
  return {
    id: x.id ?? x.Id,
    categoryId: x.categoryId ?? x.CategoryId,
    name: x.name ?? x.Name,
    description: x.description ?? x.Description ?? null,
    priceCents: x.priceCents ?? x.PriceCents,
    currency: x.currency ?? x.Currency,
    stock: x.stock ?? x.Stock,
    isActive: x.isActive ?? x.IsActive ?? true,
    images: (x.images ?? x.Images ?? []).map((img: any) => ({
      id: img.id ?? img.Id,
      url: img.url ?? img.Url,
      sortOrder: img.sortOrder ?? img.SortOrder ?? 0,
    })),
  };
}


export const api = {
  
getCategories: async () => {
  const data = await http<any[]>("/api/categories");
  return data.map(normCategory);
},

getProducts: async () => {
  const data = await http<any[]>("/api/products");
  return data.map(normProduct);
},

getProduct: async (id: number) => {
  const data = await http<any>(`/api/products/${id}`);
  return normProduct(data);
},


  // getCategories: () => http<Category[]>("/api/categories"),
  createCategory: (body: { name: string; slug: string }) =>
    http<Category>("/api/categories", { method: "POST", body: JSON.stringify(body) }),

  // getProducts: () => http<Product[]>("/api/products"),
  // getProduct: (id: number) => http<Product>(`/api/products/${id}`),
  createProduct: (body: Omit<Product, "id" | "images">) =>
    http<Product>("/api/products", { method: "POST", body: JSON.stringify(body) }),
  updateProduct: (id: number, body: Partial<Omit<Product, "id" | "images">>) =>
    http<Product>(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(body) }),

  uploadProductImage: async (productId: number, file: File) => {
    const form = new FormData();
    form.append("image", file);
    const res = await fetch(`${API_BASE_URL}/api/products/${productId}/images`, {
      method: "POST",
      body: form,
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`${res.status} ${res.statusText}${text ? `: ${text}` : ""}`);
    }
    return (await res.json()) as { url: string };
  },
  deleteProductImage: (productId: number, imageId: number) =>
  http<void>(`/api/products/${productId}/images/${imageId}`, { method: "DELETE" }),

};
