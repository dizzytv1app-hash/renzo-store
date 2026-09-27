import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product, Category, Banner, StoreSettings, ProductImage } from '@/types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order');
      if (!error && data) setCategories(data);
      setLoading(false);
    })();
  }, []);

  return { categories, loading };
}

export function useBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('sort_order');
      if (!error && data) setBanners(data);
      setLoading(false);
    })();
  }, []);

  return { banners, loading };
}

export function useProducts(opts?: { categorySlug?: string; search?: string; sort?: string; onlyNew?: boolean; onlyDiscount?: boolean }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let query = supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('is_active', true);

      if (opts?.onlyNew) query = query.eq('is_new', true);

      if (opts?.sort === 'price_asc') query = query.order('price', { ascending: true });
      else if (opts?.sort === 'price_desc') query = query.order('price', { ascending: false });
      else if (opts?.sort === 'newest') query = query.order('created_at', { ascending: false });
      else query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (!error && data) {
        let filtered = data as Product[];

        if (opts?.categorySlug) {
          filtered = filtered.filter((p) => p.category?.slug === opts.categorySlug);
        }

        if (opts?.search) {
          const q = opts.search.toLowerCase().trim();
          filtered = filtered.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.sku.toLowerCase().includes(q),
          );
        }

        if (opts?.onlyDiscount) {
          filtered = filtered.filter(
            (p) => p.discount_price !== null && p.discount_price < p.price,
          );
        }

        setProducts(filtered);
      }
      setLoading(false);
    })();
  }, [opts?.categorySlug, opts?.search, opts?.sort, opts?.onlyNew, opts?.onlyDiscount]);

  return { products, loading };
}

export function useProduct(slug: string | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*), product_images(*)')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();
      if (!error && data) {
        const sorted = { ...data, product_images: data.product_images?.sort((a: ProductImage, b: ProductImage) => a.sort_order - b.sort_order) };
        setProduct(sorted);
      } else {
        setProduct(null);
      }
      setLoading(false);
    })();
  }, [slug]);

  return { product, loading };
}

export function useStoreSettings() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('store_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();
      if (data) setSettings(data);
    })();
  }, []);

  return settings;
}
