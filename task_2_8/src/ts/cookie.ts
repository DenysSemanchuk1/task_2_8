import { CartItem } from "./products";

export function addItemToCookie(item: CartItem) {
  const items = getItemsFromCookie();
  const id = Number(item.id);
  const checkIfExists = () => {
    const findEl = items.find((item) => item.id === id);
    return findEl;
  };
  if (checkIfExists()) {
    toggleItemQuantityToBuy("increase", id);
    localStorage.setItem("cart", JSON.stringify(items));
    return;
  }
  items.push(item);
  localStorage.setItem("cart", JSON.stringify(items));
}

export function getItemsFromCookie(): CartItem[] {
  const items = localStorage.getItem("cart");
  if (!items) return [];
  return JSON.parse(items);
}

export function removeItemFromCookie(id: number) {
  let items: CartItem[] = getItemsFromCookie();
  items = items.filter((item) => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(items));
}

export function toggleItemQuantityToBuy(type: string, id: number) {
  const items = getItemsFromCookie();
  const itemToToggle = items.find((item) => item.id === id);
  if (type === "lower") {
    if (itemToToggle.quantityToBuy < 1) {
      removeItemFromCookie(id);
      return;
    }
    itemToToggle.quantityToBuy--;
  } else if (type === "increase") {
    if (itemToToggle.quantityToBuy >= itemToToggle.amount) {
      return;
    }
    itemToToggle.quantityToBuy++;
  }

  localStorage.setItem("cart", JSON.stringify(items));
}
