function Cart({ cart, setCart }) {
  // ➖ Remove item
  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // ➕ Increase quantity
  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? { ...item, qty: item.qty + 1 }
          : item
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

  //  Total price
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
 
  // HANDLECHECKOUT
  const handleCheckout = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login to continue checkout");
    window.location.href = "/login";
    return;
  }

  const orderData = {
    items: cart.map(item => ({
      product_id: item.id,
      qty: item.qty
    })),
    total: total
  };

  try {
    const res = await fetch("http://127.0.0.1:8000/api/orders/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(orderData)
    });

    if (!res.ok) throw new Error("Checkout failed");

    setCart([]);
    alert("Order placed successfully!");
  } catch (err) {
    console.log(err);
  }
  };
  
 return (
    <div className="max-w-3x1 mx-auto p-6">
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
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p>Ksh {item.price}</p>
              </div>

              <span>Qty: {item.qty}</span>
            </div>
          ))}

          <h2 className="text-2xl font-bold mt-6 text-right">
            Total: Ksh {total}
          </h2>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded"
          >
            Checkout
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;