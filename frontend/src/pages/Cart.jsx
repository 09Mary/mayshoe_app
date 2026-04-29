import { useNavigate } from "react-router-dom";

function Cart({ cart, setCart }) {
  const navigate = useNavigate();

  // ➖ Remove item
  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // ➕ Increase quantity
  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  // ➖ Decrease quantity
  const decreaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id && item.qty > 1
          ? { ...item, qty: item.qty - 1 }
          : item
      )
    );
  };

  // 💰 Total price
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // 🛒 Checkout (ONLY navigation)
  const handleCheckout = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login or sign up to continue checkout");
      navigate("/auth", { state: { from: "/checkout" } });
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-white p-4 rounded shadow mb-3"
            >
              {/* LEFT SIDE */}
              <div className="flex items-center gap-4">
                <img
                  src={`http://127.0.0.1:8000${item.image}`}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />

                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p>Ksh {item.price}</p>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => decreaseQty(item.id)}
                  className="px-2 bg-gray-200 rounded"
                >
                  -
                </button>

                <span>{item.qty}</span>

                <button
                  onClick={() => increaseQty(item.id)}
                  className="px-2 bg-gray-200 rounded"
                >
                  +
                </button>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 ml-3"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <h2 className="text-2xl font-bold mt-6 text-right">
            Total: Ksh {total}
          </h2>

          <button
            onClick={handleCheckout}
            className="mt-4 w-full bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;