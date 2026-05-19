import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getToken } from "../../utils/auth";

const API = "http://127.0.0.1:8000/api";
const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"];
const STATUS_COLOURS = {
  pending: "badge-warning",
  paid: "badge-success",
  shipped: "badge-info",
  delivered: "badge-accent",
  cancelled: "badge-error",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    fetch(`${API}/orders/`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : data.results ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    await fetch(`${API}/orders/${orderId}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });
    setUpdating(null);
    fetchOrders();
  };

  const visible = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <Link to="/admin-dashboard" className="btn btn-sm btn-ghost">← Dashboard</Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {["all", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`btn btn-sm ${filter === s ? "btn-neutral" : "btn-outline"}`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : visible.length === 0 ? (
        <p className="text-gray-400">No orders found.</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Ship to</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Update</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((order) => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono">{order.id}</td>
                  <td className="px-4 py-3">{order.user}</td>
                  <td className="px-4 py-3">{order.items?.length ?? 0}</td>
                  <td className="px-4 py-3">Ksh {Number(order.total_price).toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-[160px] truncate" title={order.shipping_address}>
                    {order.shipping_address || <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge badge-sm ${STATUS_COLOURS[order.status] || ''}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      className="select select-sm select-bordered"
                      value={order.status}
                      disabled={updating === order.id}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
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