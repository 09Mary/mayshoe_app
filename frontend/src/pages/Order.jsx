import { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login to view your orders");
        window.location.href = "/login";
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/api/orders/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();
        console.log("Orders:", data); // 🔍 important for debugging
        setOrders(data);
      } catch (err) {
        console.error(err);
        alert("Could not load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="p-6">Loading orders...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-4 mb-4 shadow rounded"
          >
            <p className="font-semibold mb-2">
              Order #{order.id}
            </p>

            <p className="text-sm text-gray-500 mb-2">
              Total: Ksh {order.total || order.total_price}
            </p>

            {/* 🧾 ORDER ITEMS */}
            {order.items && order.items.length > 0 ? (
              <div className="mt-3 border-t pt-3">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm mb-1"
                  >
                    <span>
                      {item.product_name || item.product} × {item.qty || item.quantity}
                    </span>
                    <span>
                      Ksh {item.price}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">
                No item details available
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;