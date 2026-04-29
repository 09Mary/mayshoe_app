import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Checkout({ cart, setCart }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/auth", { state: { from: "/checkout" } });
      return;
    }

    if (!form.name || !form.phone || !form.address) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      // 🧾 STEP 1: CREATE ORDER
      const orderRes = await fetch("http://127.0.0.1:8000/api/orders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            product_id: item.id,
            qty: item.qty,
          })),
          total,
          shipping_address: form.address,
        }),
      });

      if (!orderRes.ok) throw new Error("Order creation failed");

      const orderData = await orderRes.json();

      // 💳 STEP 2: CALL PAYMENT API
      const paymentRes = await fetch("http://127.0.0.1:8000/api/payments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          order: orderData.id,
          amount: total,
          phone: form.phone,
        }),
      });

      const paymentData = await paymentRes.json();

      if (!paymentRes.ok) throw new Error("Payment failed");

      // 🔗 STEP 3: REDIRECT TO PAYMENT PAGE
      if (paymentData.checkout_url) {
        window.location.href = paymentData.checkout_url;
      } else {
        // fallback if no URL
        alert("Payment successful 🎉");
        setCart([]);
        navigate("/orders");
      }

    } catch (err) {
      console.error(err);
      alert("Something went wrong during checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <input
        name="name"
        placeholder="Full Name"
        onChange={handleChange}
        className="w-full mb-2 p-2 border"
      />

      <input
        name="phone"
        placeholder="Phone (e.g. 07XXXXXXXX)"
        onChange={handleChange}
        className="w-full mb-2 p-2 border"
      />

      <input
        name="address"
        placeholder="Shipping Address"
        onChange={handleChange}
        className="w-full mb-4 p-2 border"
      />

      <h2 className="font-bold mb-2">Total: Ksh {total}</h2>

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded"
      >
        {loading ? "Processing..." : "Pay with M-Pesa"}
      </button>
    </div>
  );
}

export default Checkout;