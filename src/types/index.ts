export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  sort_order: number;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  sort_order: number;
  type: 'front' | 'back' | 'extra';
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  discount_percent: number | null;
  colors: string[];
  sizes: string[];
  is_new: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: Category | null;
  product_images?: ProductImage[];
}

export interface Banner {
  id: string;
  title: string | null;
  subtitle: string | null;
  image_url: string;
  link_url: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface StoreSettings {
  id: number;
  store_name: string;
  store_description: string | null;
  telegram_bot_url: string | null;
  telegram_channel_url: string | null;
  help_url: string | null;
  privacy_policy: string | null;
  about_text: string | null;
}

export type OrderStatus =
  | 'new'
  | 'accepted'
  | 'awaiting_payment'
  | 'payment_confirmed'
  | 'delivering'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_telegram: string | null;
  delivery_address: string;
  total_amount: number;
  prepaid_amount: number;
  status: OrderStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_sku: string;
  quantity: number;
  price: number;
  color: string | null;
  size: string | null;
}

export interface CartItem {
  product_id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  discount_price: number | null;
  image_url: string;
  color: string;
  size: string;
  quantity: number;
}

export interface FavoriteItem {
  product_id: string;
  name: string;
  slug: string;
  price: number;
  discount_price: number | null;
  image_url: string;
  added_at: number;
}

export interface Address {
  id: string;
  label: string;
  recipient_name: string;
  phone: string;
  address: string;
  city: string;
  is_default: boolean;
}
