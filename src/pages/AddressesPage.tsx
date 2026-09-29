import { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, MapPin } from 'lucide-react';
import { Header } from '@/components/Header';
import { useAddresses } from '@/lib/store';
import type { Address } from '@/types';

export function AddressesPage() {
  const { addresses, addAddress, updateAddress, removeAddress } = useAddresses();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Address, 'id'>>({
    label: '',
    recipient_name: '',
    phone: '',
    address: '',
    city: '',
    is_default: false,
  });

  const resetForm = () => {
    setForm({ label: '', recipient_name: '', phone: '', address: '', city: '', is_default: false });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = () => {
    if (!form.label || !form.recipient_name || !form.phone || !form.address) return;
    if (editingId) {
      updateAddress(editingId, form);
    } else {
      addAddress(form);
    }
    resetForm();
  };

  const startEdit = (addr: Address) => {
    setEditingId(addr.id);
    setForm({ label: addr.label, recipient_name: addr.recipient_name, phone: addr.phone, address: addr.address, city: addr.city, is_default: addr.is_default });
    setShowForm(true);
  };

  return (
    <div className="pb-20 md:pb-8">
      <Header showBack title="Manzillar" />

      <div className="max-w-3xl mx-auto px-4 py-4">
        {addresses.length === 0 && !showForm ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <MapPin size={48} className="text-neutral-300 mb-4" />
            <p className="text-neutral-500 font-medium mb-1">Manzillar yo'q</p>
            <p className="text-sm text-neutral-400 mb-4">Yetkazib berish uchun manzil qo'shing</p>
            <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
              <Plus size={18} /> Manzil qo'shish
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-4">
              {addresses.map((addr) => (
                <div key={addr.id} className="card p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{addr.label}</span>
                      {addr.is_default && (
                        <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded">Asosiy</span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => startEdit(addr)} className="p-1.5 text-neutral-400 hover:text-neutral-900 transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => removeAddress(addr.id)} className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600">{addr.recipient_name} • {addr.phone}</p>
                  <p className="text-sm text-neutral-500">{addr.address}, {addr.city}</p>
                </div>
              ))}
            </div>

            {showForm ? (
              <div className="card p-4 animate-slide-up">
                <h3 className="text-sm font-bold mb-3">{editingId ? 'Manzilni tahrirlash' : 'Yangi manzil'}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Nomi (masalan: Uy, Ish)</label>
                    <input className="input" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Uy" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Ism va familiya</label>
                    <input className="input" value={form.recipient_name} onChange={(e) => setForm({ ...form, recipient_name: e.target.value })} placeholder="Ismingiz" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Telefon raqam</label>
                    <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+998 90 123 45 67" type="tel" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Manzil</label>
                    <input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Ko'cha, uy raqami" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Shahar</label>
                    <input className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Toshkent" />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_default} onChange={(e) => setForm({ ...form, is_default: e.target.checked })} className="w-4 h-4 rounded" />
                    <span className="text-sm">Asosiy manzil sifatida</span>
                  </label>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={resetForm} className="btn-outline flex-1 flex items-center justify-center gap-1.5">
                    <X size={18} /> Bekor qilish
                  </button>
                  <button onClick={handleSubmit} className="btn-primary flex-1 flex items-center justify-center gap-1.5">
                    <Check size={18} /> Saqlash
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowForm(true)} className="w-full btn-outline flex items-center justify-center gap-2">
                <Plus size={18} /> Manzil qo'shish
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
