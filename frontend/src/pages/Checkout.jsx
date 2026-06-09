import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://127.0.0.1:8000/api";
const POLL_INTERVAL_MS = 3000;
const POLL_MAX_ATTEMPTS = 40; // 2 minutes

// ── helpers ──────────────────────────────────────────────────────────────────

function fmt(amount) {
  return "Ksh " + Number(amount).toLocaleString();
}

function validatePhone(raw) {
  const p = raw.replace(/\s/g, "");
  return /^(07\d{8}|01\d{8}|254\d{9}|\+254\d{9})$/.test(p);
}

function normalisePhone(raw) {
  const p = raw.replace(/\s/g, "");
  if (p.startsWith("0")) return "254" + p.slice(1);
  if (p.startsWith("+")) return p.slice(1);
  return p;
}

// ── sub-components ────────────────────────────────────────────────────────────

function StepBar({ step }) {
  const steps = ["Cart", "Details", "Payment"];
  return (
    <div className="flex items-center mb-8">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = n < step;
        const active = n === step;
        return (
          <div key={n} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium border
                  ${done ? "bg-green-100 border-green-600 text-green-700"
                    : active ? "bg-blue-100 border-blue-600 text-blue-700"
                    : "border-gray-200 text-gray-400"}`}
              >
                {done ? "✓" : n}
              </span>
              <span
                className={`text-sm ${done ? "text-green-700" : active ? "text-gray-900 font-medium" : "text-gray-400"}`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px mx-3 ${done ? "bg-green-300" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function CartSummary({ cart, onChangeQty }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 mb-4">
      {cart.map((item) => (
        <div key={item.id} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-none">
          <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center text-xl flex-shrink-0">
            👟
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Size {item.size} · {item.color}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onChangeQty(item.id, -1)}
              className="w-7 h-7 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center text-base leading-none"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="text-sm font-medium w-4 text-center">{item.qty}</span>
            <button
              onClick={() => onChangeQty(item.id, 1)}
              className="w-7 h-7 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center text-base leading-none"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <p className="text-sm font-medium text-gray-900 min-w-[72px] text-right">
            {fmt(item.price * item.qty)}
          </p>
        </div>
      ))}
      <div className="flex justify-between items-center pt-3">
        <span className="text-sm text-gray-500">Total</span>
        <span className="text-lg font-semibold text-gray-900">{fmt(total)}</span>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="mb-4">
      <label className="block text-sm text-gray-500 mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

function WaitingScreen({ phone, onCancel }) {
  const [secs, setSecs] = useState(120);

  useEffect(() => {
    const id = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");

  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <div className="w-20 h-20 rounded-full border-2 border-green-500 flex items-center justify-center mx-auto mb-5 animate-pulse">
        <span className="text-3xl">📱</span>
      </div>
      <h2 className="text-xl font-semibold mb-2 text-gray-900">Check your phone</h2>
      <p className="text-gray-500 text-sm mb-1">
        An M-Pesa prompt has been sent to{" "}
        <strong className="text-gray-700">{phone}</strong>.
      </p>
      <p className="text-gray-500 text-sm mb-6">Enter your M-Pesa PIN to complete payment.</p>
      <div className="inline-flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 text-sm text-gray-500">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        Waiting — {mm}:{ss} remaining
      </div>
      <button
        onClick={onCancel}
        className="block mx-auto mt-6 text-xs text-gray-400 hover:text-gray-600 underline"
      >
        Cancel and go back
      </button>
    </div>
  );
}

function StatusScreen({ type, phone, onRetry, onOrders }) {
  const config = {
    success: {
      icon: "✅",
      title: "Payment confirmed!",
      body: "Your order is placed. You'll get an M-Pesa confirmation SMS shortly.",
      primary: { label: "View my orders", action: onOrders },
    },
    failed: {
      icon: "❌",
      title: "Payment failed",
      body: "The M-Pesa request was declined or cancelled.",
      primary: { label: "Try again", action: onRetry },
    },
    timeout: {
      icon: "⏱️",
      title: "Request timed out",
      body: "No response from M-Pesa. If the payment went through it'll appear in your orders shortly.",
      primary: { label: "Try again", action: onRetry },
      secondary: { label: "Check orders", action: onOrders },
    },
  }[type];

  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <div className="text-5xl mb-4">{config.icon}</div>
      <h2 className="text-xl font-semibold mb-2 text-gray-900">{config.title}</h2>
      <p className="text-gray-500 text-sm mb-6">{config.body}</p>
      <div className="flex gap-3 justify-center">
        {config.secondary && (
          <button onClick={config.secondary.action} className="btn-outline">
            {config.secondary.label}
          </button>
        )}
        <button onClick={config.primary.action} className="btn-primary">
          {config.primary.label}
        </button>
      </div>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

function Checkout({ cart: initialCart, setCart }) {
  const navigate = useNavigate();

  const [cart, setLocalCart] = useState(initialCart);
  const [step, setStep] = useState(1); // 1 = cart, 2 = details, 3 = paying
  const [paymentState, setPaymentState] = useState("idle"); // idle | waiting | success | failed | timeout

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
  });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);

  const phoneDisplay = form.phone
    ? form.phone.replace(/^0/, "+254")
    : "";

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  // ── cart helpers ────────────────────────────────────────────────────────────

  const changeQty = (id, delta) => {
    setLocalCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  // ── form validation ─────────────────────────────────────────────────────────

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.phone.trim()) {
      e.phone = "Required";
    } else if (!validatePhone(form.phone)) {
      e.phone = "Enter a valid Safaricom number (e.g. 0712 345 678)";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── payment ─────────────────────────────────────────────────────────────────

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
          setTimeout(() => navigate("/orders"), 2500);
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
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      navigate("/auth", { state: { from: "/checkout" } });
      return;
    }

    if (!validate()) return;

    setGlobalError("");
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
          shipping_address: `${form.address}, ${form.city}`,
          first_name: form.firstName,
          last_name: form.lastName,
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
          phone: normalisePhone(form.phone),
        }),
      });

      const payment = await paymentRes.json();

      if (!paymentRes.ok) {
        throw new Error(payment.detail || JSON.stringify(payment));
      }

      setPaymentState("waiting");
      setStep(3);
      pollStatus(payment.id, token);
    } catch (err) {
      setGlobalError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // ── screens ─────────────────────────────────────────────────────────────────

  if (paymentState === "waiting") {
    return (
      <div className="max-w-xl mx-auto p-4">
        <StepBar step={3} />
        <WaitingScreen
          phone={phoneDisplay}
          onCancel={() => {
            setPaymentState("idle");
            setStep(2);
          }}
        />
      </div>
    );
  }

  if (paymentState === "success") {
    return (
      <div className="max-w-xl mx-auto p-4">
        <StatusScreen
          type="success"
          onOrders={() => navigate("/orders")}
        />
      </div>
    );
  }

  if (paymentState === "failed") {
    return (
      <div className="max-w-xl mx-auto p-4">
        <StatusScreen
          type="failed"
          onRetry={() => { setPaymentState("idle"); setStep(2); }}
          onOrders={() => navigate("/orders")}
        />
      </div>
    );
  }

  if (paymentState === "timeout") {
    return (
      <div className="max-w-xl mx-auto p-4">
        <StatusScreen
          type="timeout"
          onRetry={() => { setPaymentState("idle"); setStep(2); }}
          onOrders={() => navigate("/orders")}
        />
      </div>
    );
  }

  // ── cart screen ─────────────────────────────────────────────────────────────

  if (step === 1) {
    return (
      <div className="max-w-xl mx-auto p-4">
        <StepBar step={1} />
        <h1 className="text-2xl font-semibold mb-4 text-gray-900">Your cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🛒</p>
            <p>Your cart is empty.</p>
          </div>
        ) : (
          <>
            <CartSummary cart={cart} onChangeQty={changeQty} />
            <button
              onClick={() => setStep(2)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition-colors"
            >
              Continue to delivery →
            </button>
          </>
        )}
      </div>
    );
  }

  // ── details screen ──────────────────────────────────────────────────────────

  return (
    <div className="max-w-xl mx-auto p-4">
      <StepBar step={2} />
      <h1 className="text-2xl font-semibold mb-4 text-gray-900">Delivery details</h1>

      <div className="bg-white border border-gray-100 rounded-xl p-5 mb-4">
        <div className="flex gap-3">
          <Field label="First name" error={errors.firstName}>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              placeholder="Jane"
              className={`w-full p-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 transition ${errors.firstName ? "border-red-400" : "border-gray-200"}`}
            />
          </Field>
          <Field label="Last name" error={errors.lastName}>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              placeholder="Wanjiku"
              className={`w-full p-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 transition ${errors.lastName ? "border-red-400" : "border-gray-200"}`}
            />
          </Field>
        </div>

        <Field label="M-Pesa phone number" error={errors.phone}>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="0712 345 678 or 254712345678"
            className={`w-full p-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 transition ${errors.phone ? "border-red-400" : "border-gray-200"}`}
          />
        </Field>

        <Field label="Shipping address" error={errors.address}>
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="e.g. Tom Mboya St"
            className={`w-full p-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 transition ${errors.address ? "border-red-400" : "border-gray-200"}`}
          />
        </Field>

        <Field label="City / Town" error={errors.city}>
          <input
            type="text"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            placeholder="Nairobi"
            className={`w-full p-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500 transition ${errors.city ? "border-red-400" : "border-gray-200"}`}
          />
        </Field>
      </div>

      {/* Order summary */}
      <div className="bg-white border border-gray-100 rounded-xl px-5 py-4 mb-4 text-sm">
        <div className="flex justify-between text-gray-500 mb-2">
          <span>Order total</span>
          <span className="font-medium text-gray-900">{fmt(total)}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Shipping</span>
          <span className="text-green-600 font-medium">Free</span>
        </div>
      </div>

      {globalError && (
        <p className="text-red-600 text-sm mb-3 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {globalError}
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => setStep(1)}
          className="px-5 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handlePayment}
          disabled={loading}
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-colors"
        >
          {loading ? "Sending M-Pesa request…" : `Pay ${fmt(total)} with M-Pesa`}
        </button>
      </div>
    </div>
  );
}

export default Checkout;