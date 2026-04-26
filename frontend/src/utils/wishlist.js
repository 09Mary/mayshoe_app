export const getWishlist = () => {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
};

export const saveWishlist = (items) => {
  localStorage.setItem("wishlist", JSON.stringify(items));
};

export const toggleWishlist = (product) => {
  let wishlist = getWishlist();

  const exists = wishlist.find((item) => item.id === product.id);

  if (exists) {
    wishlist = wishlist.filter((item) => item.id !== product.id);
  } else {
    wishlist.push(product);
  }

  saveWishlist(wishlist);
  return wishlist;
};