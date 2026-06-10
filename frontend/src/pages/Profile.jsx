import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const TOKEN = () => localStorage.getItem("token") || sessionStorage.getItem("token");

const STATUS_STYLES = {
  pending:   { bg: "bg-amber-50",   text: "text-amber-700",  dot: "bg-amber-400",  label: "Pending"   },
  paid:      { bg: "bg-blue-50",    text: "text-blue-700",   dot: "bg-blue-400",   label: "Paid"      },
  shipped:   { bg: "bg-indigo-50",  text: "text-indigo-700", dot: "bg-indigo-400", label: "Shipped"   },
  delivered: { bg: "bg-green-50",   text: "text-green-700",  dot: "bg-green-400",  label: "Delivered" },
  cancelled: { bg: "bg-red-50",     text: "text-red-600",    dot: "bg-red-400",    label: "Cancelled" },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50">
        <h2 className="text-sm font-semibold text-gray-900 tracking-wide">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Field({ label, name, value, onChange, type = "text", disabled }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none
          focus:bg-white focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all
          disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = [
  { key: "profile",  label: "Profile",     icon: "👤" },
  { key: "orders",   label: "Orders",      icon: "📦" },
  { key: "security", label: "Security",    icon: "🔒" },
  { key: "wishlist", label: "Wishlist",    icon: "❤️"  },
];

// ── Profile Tab ───────────────────────────────────────────────────────────────
function ProfileTab({ user, setUser }) {
  const [form, setForm]       = useState({});
  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    setForm({
      username:   user.username  || "",
      email:      user.email     || "",
      first_name: user.first_name|| "",
      last_name:  user.last_name || "",
      phone:      user.phone     || "",
    });
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true); setError(""); setSuccess(false);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/profile/", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN()}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Could not save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const initials = [user.first_name, user.last_name]
    .filter(Boolean).map(s => s[0]).join("").toUpperCase()
    || user.username?.slice(0, 2).toUpperCase() || "ME";

  return (
    <div className="space-y-6">
      {/* Avatar + name */}
      <SectionCard title="Personal information">
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-50">
          <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user.first_name ? `${user.first_name} ${user.last_name}` : user.username}</p>
            <p className="text-sm text-gray-400">{user.email}</p>
            <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full capitalize">
              {user.role || "customer"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First name"  name="first_name" value={form.first_name} onChange={handleChange} />
          <Field label="Last name"   name="last_name"  value={form.last_name}  onChange={handleChange} />
          <Field label="Username"    name="username"   value={form.username}   onChange={handleChange} />
          <Field label="Phone"       name="phone"      value={form.phone}      onChange={handleChange} type="tel" />
          <div className="sm:col-span-2">
            <Field label="Email address" name="email" value={form.email} onChange={handleChange} type="email" />
          </div>
        </div>

        {error   && <p className="mt-4 text-sm text-red-500">{error}</p>}
        {success && <p className="mt-4 text-sm text-green-600">✓ Profile updated successfully.</p>}

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-black text-white text-sm px-6 py-2.5 rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </SectionCard>

      {/* Account info (read-only) */}
      <SectionCard title="Account details">
        <div className="space-y-3 text-sm">
          {[
            { label: "Member since", value: user.date_joined ? new Date(user.date_joined).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" }) : "—" },
            { label: "Email verified", value: user.is_email_verified ? "✓ Verified" : "✗ Not verified" },
            { label: "Account type", value: user.is_staff ? "Staff / Admin" : "Customer" },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between py-2.5 border-b border-gray-50 last:border-none">
              <span className="text-gray-400">{label}</span>
              <span className="font-medium text-gray-800">{value}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

// ── Orders Tab ────────────────────────────────────────────────────────────────
function OrdersTab() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/orders/", {
      headers: { Authorization: `Bearer ${TOKEN()}` },
    })
      .then(r => r.json())
      .then(data => { setOrders(Array.isArray(data) ? data : data.results || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-3">
      {[1,2,3].map(i => (
        <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 animate-pulse">
          <div className="flex justify-between mb-3">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-5 w-16 bg-gray-100 rounded-full" />
          </div>
          <div className="h-3 w-40 bg-gray-100 rounded" />
        </div>
      ))}
    </div>
  );

  if (!orders.length) return (
    <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
      <div className="text-4xl mb-4">📦</div>
      <p className="font-medium text-gray-900 mb-1">No orders yet</p>
      <p className="text-sm text-gray-400 mb-6">When you place an order it will appear here.</p>
      <Link to="/shop" className="inline-block bg-black text-white text-sm px-6 py-2.5 rounded-xl hover:bg-gray-800 transition-colors">
        Start shopping
      </Link>
    </div>
  );

  return (
    <div className="space-y-3">
      {orders.map(order => (
        <div key={order.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          {/* Order header */}
          <button
            className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            onClick={() => setExpanded(expanded === order.id ? null : order.id)}
          >
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">Order #{order.id}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(order.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
                  {" · "}{order.items?.length || 0} item{order.items?.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={order.status} />
              <span className="text-sm font-semibold text-gray-900">
                Ksh {Number(order.total_price).toLocaleString()}
              </span>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${expanded === order.id ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </button>

          {/* Order items (expanded) */}
          {expanded === order.id && (
            <div className="border-t border-gray-50 px-6 py-4 space-y-3">
              {order.items?.map((item, i) => {
                const img = item.shoe?.image
                  ? item.shoe.image.startsWith("http") ? item.shoe.image : `http://127.0.0.1:8000${item.shoe.image}`
                  : null;
                return (
                  <div key={i} className="flex items-center gap-4 py-2">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      {img
                        ? <img src={img} alt={item.shoe?.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-xl">👟</div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.shoe?.name || "Product"}</p>
                      <p className="text-xs text-gray-400">Qty {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      Ksh {Number(item.price).toLocaleString()}
                    </p>
                  </div>
                );
              })}
              <div className="pt-3 border-t border-gray-50 flex justify-between text-sm">
                <span className="text-gray-400">Shipping address</span>
                <span className="text-gray-700 font-medium">{order.shipping_address || "—"}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold pt-1">
                <span>Total</span>
                <span>Ksh {Number(order.total_price).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Security Tab ───────────────────────────────────────────────────────────────
function SecurityTab() {
  const [form, setForm]       = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState({ type: "", text: "" });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setMsg({ type: "", text: "" });
    if (form.new_password !== form.confirm_password) {
      return setMsg({ type: "error", text: "New passwords don't match." });
    }
    if (form.new_password.length < 8) {
      return setMsg({ type: "error", text: "Password must be at least 8 characters." });
    }
    setSaving(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/change-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN()}` },
        body: JSON.stringify({ current_password: form.current_password, new_password: form.new_password }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.detail || d.current_password?.[0] || "Failed");
      }
      setMsg({ type: "success", text: "Password changed successfully." });
      setForm({ current_password: "", new_password: "", confirm_password: "" });
    } catch (e) {
      setMsg({ type: "error", text: e.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Change password">
        <div className="space-y-4">
          {[
            { label: "Current password",  name: "current_password"  },
            { label: "New password",       name: "new_password"      },
            { label: "Confirm new password", name: "confirm_password" },
          ].map(f => (
            <Field key={f.name} type="password" label={f.label} name={f.name} value={form[f.name]} onChange={handleChange} />
          ))}

          {msg.text && (
            <p className={`text-sm ${msg.type === "error" ? "text-red-500" : "text-green-600"}`}>
              {msg.type === "success" ? "✓ " : ""}{msg.text}
            </p>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-black text-white text-sm px-6 py-2.5 rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {saving ? "Updating…" : "Update password"}
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Account actions">
        <div className="space-y-3 text-sm text-gray-600">
          <p className="text-xs text-gray-400 leading-relaxed">
            Need to leave? You can delete your account below. This action is permanent and cannot be undone. All your orders, wishlist, and data will be removed.
          </p>
          <button className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors border border-red-100 hover:border-red-300 px-4 py-2 rounded-xl">
            Delete my account
          </button>
        </div>
      </SectionCard>
    </div>
  );
}

// ── Wishlist Tab ───────────────────────────────────────────────────────────────
function WishlistTab() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const w = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setItems(w);
    } catch { setItems([]); }
  }, []);

  const remove = (id) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  if (!items.length) return (
    <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
      <div className="text-4xl mb-4">❤️</div>
      <p className="font-medium text-gray-900 mb-1">Your wishlist is empty</p>
      <p className="text-sm text-gray-400 mb-6">Save items you love and find them here.</p>
      <Link to="/shop" className="inline-block bg-black text-white text-sm px-6 py-2.5 rounded-xl hover:bg-gray-800 transition-colors">
        Browse shoes
      </Link>
    </div>
  );

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {items.map(item => {
        const img = item.image?.startsWith("http") ? item.image : `http://127.0.0.1:8000${item.image}`;
        return (
          <div key={item.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex gap-4 p-4 items-center">
            <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
              {item.image
                ? <img src={img} alt={item.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-2xl">👟</div>
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
              <p className="text-sm text-gray-500">Ksh {Number(item.price).toLocaleString()}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                to={`/product/${item.id}`}
                className="text-xs bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors text-center"
              >
                View
              </Link>
              <button
                onClick={() => remove(item.id)}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main Profile Page ──────────────────────────────────────────────────────────
function Profile() {
  const navigate     = useNavigate();
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]       = useState("profile");

  useEffect(() => {
    const token = TOKEN();
    if (!token) { navigate("/auth"); return; }

    const cached = localStorage.getItem("user");
    if (cached) { setUser(JSON.parse(cached)); setLoading(false); }

    fetch("http://127.0.0.1:8000/api/profile/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => { setUser(data); localStorage.setItem("user", JSON.stringify(data)); setLoading(false); })
      .catch(() => { if (!cached) { navigate("/auth"); } });
  }, []);

  if (loading || !user) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-gray-400">
        <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span className="text-sm">Loading your profile…</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Page header */}
        <div className="mb-8">
          <p className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-1">Account</p>
          <h1 className="text-2xl font-black text-gray-900" style={{ letterSpacing: "-0.02em" }}>
            My Profile
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar tabs */}
          <nav className="md:w-52 flex-shrink-0">
            <div className="bg-white border border-gray-100 rounded-2xl p-2 flex md:flex-col flex-row gap-1 overflow-x-auto">
              {TABS.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-left whitespace-nowrap w-full
                    ${tab === t.key ? "bg-black text-white" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
                >
                  <span>{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Tab content */}
          <div className="flex-1 min-w-0">
            {tab === "profile"  && <ProfileTab  user={user} setUser={setUser} />}
            {tab === "orders"   && <OrdersTab />}
            {tab === "security" && <SecurityTab />}
            {tab === "wishlist" && <WishlistTab />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;