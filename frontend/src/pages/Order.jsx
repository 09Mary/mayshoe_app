import { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("http://127.0.0.1:8000/api/orders/", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="bg-white p-4 mb-3 shadow rounded">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Total:</strong> Ksh {order.total}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;