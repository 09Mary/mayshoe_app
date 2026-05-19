import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getToken } from "../../utils/auth";

const API = "http://127.0.0.1:8000/api";

function StatCard({ label, value, accent }) {
  return (
    <div className={`bg-white rounded-xl shadow p-5 border-l-4 ${accent}`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold mt-1">{value ?? "—"}</p>
    </div>
  );
}

const STATUS_COLOURS = {
  pending: "badge-warning",
  paid: "badge-success",
  shipped: "badge-info",
  delivered: "badge-accent",
  cancelled: "badge-error",
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/orders/stats/`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load stats");
        return r.json();
      })
      .then(setStats)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="p-8 text-red-500">{error}</p>;
  if (!stats) return <p className="p-8 text-gray-400">Loading…</p>;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-3">
          <Link to="/admin-dashboard/orders" className="btn btn-sm btn-outline">Orders</Link>
          <Link to="/admin-dashboard/products" className="btn btn-sm btn-outline">Products</Link>
          <Link to="/admin-dashboard/reviews" className="btn btn-sm btn-outline relative">
            Reviews
            {stats.pending_reviews > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {stats.pending_reviews}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Orders" value={stats.total_orders} accent="border-blue-500" />
        <StatCard label="Revenue (Ksh)" value={Number(stats.total_revenue).toLocaleString()} accent="border-green-500" />
        <StatCard label="Pending" value={stats.pending_orders} accent="border-yellow-500" />
        <StatCard label="Shipped" value={stats.shipped_orders} accent="border-indigo-500" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="font-semibold mb-3">Recent Orders</h2>
          {stats.recent_orders.length === 0 ? (
            <p className="text-gray-400 text-sm">No orders yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b">
                  <th className="pb-2">#</th>
                  <th className="pb-2">Total</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_orders.map((o) => (
                  <tr key={o.id} className="border-b last:border-0">
                    <td className="py-2">{o.id}</td>
                    <td className="py-2">Ksh {Number(o.total_price).toLocaleString()}</td>
                    <td className="py-2">
                      <span className={`badge badge-sm ${STATUS_COLOURS[o.status] || ''}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Low stock */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="font-semibold mb-3">Low Stock (&le; 5 units)</h2>
          {stats.low_stock.length === 0 ? (
            <p className="text-gray-400 text-sm">All products well stocked.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b">
                  <th className="pb-2">Product</th>
                  <th className="pb-2">Stock</th>
                </tr>
              </thead>
              <tbody>
                {stats.low_stock.map((s) => (
                  <tr key={s.id} className="border-b last:border-0">
                    <td className="py-2">{s.name}</td>
                    <td className={`py-2 font-semibold ${s.stock === 0 ? 'text-red-600' : 'text-yellow-600'}`}>
                      {s.stock}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}