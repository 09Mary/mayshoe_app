import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getToken } from "../../utils/auth";

const API = "http://127.0.0.1:8000/api";
const CATEGORIES = ["sneakers", "running", "casual", "boots", "heels"];
const BLANK_FORM = { name: "", brand: "", price: "", stock: "", category: "sneakers", description: "", size: "", color: "" };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(BLANK_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const authHeader = { Authorization: `Bearer ${getToken()}` };

  const fetchProducts = () => {
    setLoading(true);
    fetch(`${API}/shoes/?page_size=200`, { headers: authHeader })
      .then((r) => r.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : data.results ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const startEdit = (product) => {
    setEditId(product.id);
    setEditData({ stock: product.stock, price: product.price, is_active: product.is_active });
  };

  const saveEdit = async (id) => {
    setSaving(true);
    await fetch(`${API}/shoes/${id}/`, {
      method: "PATCH",
      headers: { ...authHeader, "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });
    setSaving(false);
    setEditId(null);
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await fetch(`${API}/shoes/${id}/`, { method: "DELETE", headers: authHeader });
    fetchProducts();
  };

  const addProduct = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const res = await fetch(`${API}/shoes/`, {
      method: "POST",
      headers: { ...authHeader, "Content-Type": "application/json" },
      body: JSON.stringify(addForm),
    });
    setSaving(false);
    if (res.ok) {
      setShowAdd(false);
      setAddForm(BLANK_FORM);
      fetchProducts();
    } else {
      const data = await res.json();
      setError(JSON.stringify(data));
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowAdd(!showAdd)} className="btn btn-sm btn-primary">
            {showAdd ? "Cancel" : "+ Add Product"}
          </button>
          <Link to="/admin-dashboard" className="btn btn-sm btn-ghost">← Dashboard</Link>
        </div>
      </div>

      {/* Add product form */}
      {showAdd && (
        <form onSubmit={addProduct} className="bg-white rounded-xl shadow p-5 mb-6">
          <h2 className="font-semibold mb-4">New Product</h2>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <div className="grid grid-cols-2 gap-3">
            {[
              ["name", "Name", "text"],
              ["brand", "Brand", "text"],
              ["price", "Price (Ksh)", "number"],
              ["stock", "Stock", "number"],
              ["size", "Size", "text"],
              ["color", "Color", "text"],
            ].map(([field, label, type]) => (
              <div key={field}>
                <label className="text-sm text-gray-600">{label}</label>
                <input
                  type={type}
                  className="input input-bordered input-sm w-full"
                  value={addForm[field]}
                  onChange={(e) => setAddForm({ ...addForm, [field]: e.target.value })}
                />
              </div>
            ))}
            <div>
              <label className="text-sm text-gray-600">Category</label>
              <select
                className="select select-bordered select-sm w-full"
                value={addForm.category}
                onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-3">
            <label className="text-sm text-gray-600">Description</label>
            <textarea
              className="textarea textarea-bordered w-full text-sm"
              rows={2}
              value={addForm.description}
              onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
            />
          </div>
          <button type="submit" disabled={saving} className="btn btn-primary btn-sm mt-4">
            {saving ? "Saving…" : "Save Product"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500">{p.category}</td>
                  <td className="px-4 py-3">
                    {editId === p.id ? (
                      <input
                        type="number"
                        className="input input-bordered input-xs w-24"
                        value={editData.price}
                        onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                      />
                    ) : (
                      `Ksh ${Number(p.price).toLocaleString()}`
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editId === p.id ? (
                      <input
                        type="number"
                        className="input input-bordered input-xs w-20"
                        value={editData.stock}
                        onChange={(e) => setEditData({ ...editData, stock: e.target.value })}
                      />
                    ) : (
                      <span className={p.stock <= 5 ? "text-red-600 font-semibold" : ""}>{p.stock}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editId === p.id ? (
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={editData.is_active}
                        onChange={(e) => setEditData({ ...editData, is_active: e.target.checked })}
                      />
                    ) : (
                      <span className={`badge badge-sm ${p.is_active ? "badge-success" : "badge-ghost"}`}>
                        {p.is_active ? "Yes" : "No"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    {editId === p.id ? (
                      <>
                        <button
                          onClick={() => saveEdit(p.id)}
                          disabled={saving}
                          className="btn btn-xs btn-success"
                        >
                          Save
                        </button>
                        <button onClick={() => setEditId(null)} className="btn btn-xs btn-ghost">
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(p)} className="btn btn-xs btn-outline">
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="btn btn-xs btn-error btn-outline"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}