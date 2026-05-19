import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getToken } from "../../utils/auth";

const API = "http://127.0.0.1:8000/api";

const STARS = (n) => "★".repeat(n) + "☆".repeat(5 - n);

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("pending"); // pending | approved | all
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(null);

  const authHeader = { Authorization: `Bearer ${getToken()}` };

  const fetchReviews = () => {
    setLoading(true);
    fetch(`${API}/reviews/`, { headers: authHeader })
      .then((r) => r.json())
      .then((data) => {
        setReviews(Array.isArray(data) ? data : data.results ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, []);

  const setApproval = async (id, approved) => {
    setActing(id);
    await fetch(`${API}/reviews/${id}/`, {
      method: "PATCH",
      headers: { ...authHeader, "Content-Type": "application/json" },
      body: JSON.stringify({ is_approved: approved }),
    });
    setActing(null);
    fetchReviews();
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review permanently?")) return;
    setActing(id);
    await fetch(`${API}/reviews/${id}/`, { method: "DELETE", headers: authHeader });
    setActing(null);
    fetchReviews();
  };

  const visible = reviews.filter((r) => {
    if (filter === "pending") return !r.is_approved;
    if (filter === "approved") return r.is_approved;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Review Moderation</h1>
        <Link to="/admin-dashboard" className="btn btn-sm btn-ghost">← Dashboard</Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {[
          { key: "pending", label: `Pending (${reviews.filter((r) => !r.is_approved).length})` },
          { key: "approved", label: "Approved" },
          { key: "all", label: "All" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`btn btn-sm ${filter === key ? "btn-neutral" : "btn-outline"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : visible.length === 0 ? (
        <p className="text-gray-400">No reviews in this category.</p>
      ) : (
        <div className="space-y-3">
          {visible.map((review) => (
            <div
              key={review.id}
              className={`bg-white rounded-xl shadow p-5 border-l-4 ${
                review.is_approved ? "border-green-400" : "border-yellow-400"
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className="font-semibold">{review.username}</span>
                    <span className="text-yellow-500 text-sm">{STARS(review.rating)}</span>
                    <span className="text-xs text-gray-400">
                      on <em>{review.shoe_name}</em>
                    </span>
                    <span className="text-xs text-gray-300">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">{review.comment}</p>
                </div>

                <div className="flex gap-2 shrink-0">
                  {!review.is_approved ? (
                    <button
                      onClick={() => setApproval(review.id, true)}
                      disabled={acting === review.id}
                      className="btn btn-xs btn-success"
                    >
                      Approve
                    </button>
                  ) : (
                    <button
                      onClick={() => setApproval(review.id, false)}
                      disabled={acting === review.id}
                      className="btn btn-xs btn-outline"
                    >
                      Unapprove
                    </button>
                  )}
                  <button
                    onClick={() => deleteReview(review.id)}
                    disabled={acting === review.id}
                    className="btn btn-xs btn-error btn-outline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}