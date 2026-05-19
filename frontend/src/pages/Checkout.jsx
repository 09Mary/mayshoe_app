import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://127.0.0.1:8000/api";
const POLL_INTERVAL_MS = 3000;
const POLL_MAX_ATTEMPTS = 40; // 2 minutes

function Checkout({ cart, setCart }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [paymentState, setPaymentState] = useState("idle"); // idle | waiting | success | failed | timeout
  const [errorMsg, setErrorMsg] = useState("");

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const pollStatus = (paymentId, token, attempts = 0) => {
    if (attempts >= POLL_MAX_ATTEMPTS) {
      setPaymentState("timeout");
      setLoading(false);
      return;
    }

    setTimeout(async () => {
      try {
        const res = await fetch(`${API}/payments/${paymentId}/status/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.status === "SUCCESS") {
          setCart([]);
          setPaymentState("success");
          setLoading(false);
          setTimeout(() => navigate("/orders"), 2000);
        } else if (data.status === "FAILED") {
          setPaymentState("failed");
          setLoading(false);
        } else {
          pollStatus(paymentId, token, attempts + 1);
        }
      } catch {
        pollStatus(paymentId, token, attempts + 1);
      }
    }, POLL_INTERVAL_MS);
  };

  const handlePayment = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      navigate("/auth", { state: { from: "/checkout" } });
      return;
    }

    if (!form.name || !form.phone || !form.address) {
      setErrorMsg("Please fill all fields.");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      // Step 1: create order
      const orderRes = await fetch(`${API}/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart.map((item) => ({ shoe: item.id, quantity: item.qty })),
          payment_method: "mpesa",
          shipping_address: form.address,
        }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        throw new Error(err.detail || "Order creation failed");
      }

      const order = await orderRes.json();

      // Step 2: initiate STK push
      const paymentRes = await fetch(`${API}/payments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          order: order.id,
          amount: total,
          phone: form.phone,
        }),
      });

      const payment = await paymentRes.json();

      if (!paymentRes.ok) {
        throw new Error(payment.detail || JSON.stringify(payment));
      }

      setPaymentState("waiting");
      pollStatus(payment.id, token);
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (paymentState === "waiting") {
    return (
      <div className="max-w-xl mx-auto p-6 text-center">
        <div className="text-5xl mb-4">📱</div>
        <h2 className="text-xl font-bold mb-2">Check your phone</h2>
        <p className="text-gray-600 mb-1">
          An M-Pesa prompt has been sent to <strong>{form.phone}</strong>.
        </p>
        <p className="text-gray-600 mb-6">Enter your M-Pesa PIN to complete payment.</p>
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg text-green-600" />
        </div>
        <p className="text-sm text-gray-400 mt-4">Waiting for confirmation…</p>
      </div>
    );
  }

  if (paymentState === "success") {
    return (
      <div className="max-w-xl mx-auto p-6 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-bold mb-2">Payment confirmed!</h2>
        <p className="text-gray-600">Redirecting to your orders…</p>
      </div>
    );
  }

  if (paymentState === "failed") {
    return (
      <div className="max-w-xl mx-auto p-6 text-center">
        <div className="text-5xl mb-4">❌</div>
        <h2 className="text-xl font-bold mb-2">Payment failed</h2>
        <p className="text-gray-600 mb-4">
          The M-Pesa payment was declined or cancelled.
        </p>
        <button
          onClick={() => setPaymentState("idle")}
          className="btn btn-outline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (paymentState === "timeout") {
    return (
      <div className="max-w-xl mx-auto p-6 text-center">
        <div className="text-5xl mb-4">⏱️</div>
        <h2 className="text-xl font-bold mb-2">Payment timed out</h2>
        <p className="text-gray-600 mb-4">
          We didn't receive a response from M-Pesa. Check your orders page — if
          the payment went through it will appear there shortly.
        </p>
        <div className="flex gap-2 justify-center">
          <button onClick={() => navigate("/orders")} className="btn btn-outline">
            My orders
          </button>
          <button onClick={() => setPaymentState("idle")} className="btn btn-primary">
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <input
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        className="w-full mb-2 p-2 border rounded"
      />

      <input
        name="phone"
        placeholder="Phone (e.g. 07XXXXXXXX)"
        value={form.phone}
        onChange={handleChange}
        className="w-full mb-2 p-2 border rounded"
      />

      <input
        name="address"
        placeholder="Shipping Address"
        value={form.address}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
      />

      {errorMsg && (
        <p className="text-red-600 text-sm mb-3">{errorMsg}</p>
      )}

      <h2 className="font-bold mb-4">Total: Ksh {total.toLocaleString()}</h2>

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-semibold disabled:opacity-60"
      >
        {loading ? "Sending STK push…" : "Pay with M-Pesa"}
      </button>
    </div>
  );
}

export default Checkout;