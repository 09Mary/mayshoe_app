import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/auth";

const API = "http://127.0.0.1:8000/api";

const STATUS_COLOURS = {
  pending: "badge-warning",
  paid: "badge-success",
  shipped: "badge-info",
  delivered: "badge-accent",
  cancelled: "badge-error",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/auth", { state: { from: "/orders" } });
      return;
    }

    fetch(`${API}/orders/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch orders");
        return r.json();
      })
      .then((data) => setOrders(Array.isArray(data) ? data : data.results ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6 text-gray-400">Loading orders…</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="bg-white p-5 mb-4 shadow rounded-xl">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-semibold">Order #{order.id}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(order.created_at).toLocaleDateString("en-KE", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </p>
              </div>
              <span className={`badge ${STATUS_COLOURS[order.status] || "badge-ghost"}`}>
                {order.status}
              </span>
            </div>

            {order.shipping_address && (
              <p className="text-sm text-gray-500 mb-3">
                <span className="font-medium">Ship to:</span> {order.shipping_address}
              </p>
            )}

            {order.items && order.items.length > 0 ? (
              <div className="border-t pt-3 space-y-1">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.shoe_name ?? `Shoe #${item.shoe}`} × {item.quantity}
                    </span>
                    <span>Ksh {Number(item.price).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm border-t pt-3">No item details available.</p>
            )}

            <p className="text-right font-bold mt-3">
              Total: Ksh {Number(order.total_price).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}