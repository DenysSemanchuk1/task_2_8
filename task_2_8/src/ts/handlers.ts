import {
  addItemToCookie,
  removeItemFromCookie,
  toggleItemQuantityToBuy,
} from "./cookie";
import {
  CartItem,
  Product,
  getCartItemsAndGenerate,
  generateProductsForProductsPage,
} from "./products";
import { store } from "./store";
import { showPrice } from "./typography";
const searchInput: HTMLInputElement =
  document.querySelector(".filters__search");
const overlay = document.querySelector(".overlay");
const slider: HTMLInputElement = document.querySelector("#price");
export function toggleMenu() {
  const openMenuBtn = document.querySelector(".menu__btn");
  const closeMenuBtn = document.querySelector(".menu__close");
  const menuList = document.querySelector(".menu__list");
  openMenuBtn?.addEventListener("click", () => {
    menuList?.classList.add("open");
    showOverlay();
  });
  closeMenuBtn?.addEventListener("click", () => {
    menuList?.classList.remove("open");
    hideOverlay();
  });
}

export function toggleLoadingState() {
  const loading: HTMLDivElement | null = document.querySelector(".loading");
  if (loading)
    loading.classList.contains("active")
      ? loading.classList.remove("active")
      : loading.classList.add("active");
}
function showOverlay() {
  overlay.classList.add("open");
}

function hideOverlay() {
  overlay.classList.remove("open");
}
export function toggleCart() {
  const openCartBtn = document.querySelector(".header__cart-btn");
  const cartClose = document.querySelector(".cart__close");
  const cart = document.querySelector("#cart");
  openCartBtn?.addEventListener("click", () => {
    cart?.classList.add("open");
    showOverlay();
  });
  cartClose?.addEventListener("click", () => {
    cart?.classList.remove("open");
    hideOverlay();
  });
}

export function handlePriceInputStyling() {
  const showValueEl = document.querySelector(".filters__price-value");
  slider.addEventListener("input", handleSlider);
  handleSlider();
  function handleSlider() {
    const tempSliderValue = Number(slider.value);
    const max = Number(slider.max);
    const progress = (tempSliderValue / max) * 100;
    slider.style.background = `linear-gradient(to right, #cc5520 ${progress}%, #ffffff ${progress}%)`;
    showValueEl.textContent = `Value: $${slider.value}`;
  }
}

export function handleSearchFilter() {
  const form = document.querySelector(".filters");
  form.addEventListener("keypress", function (e: KeyboardEvent) {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  });

  form.addEventListener("submit", function (e: Event) {
    e.preventDefault();
    handleSearch();
  });

  searchInput.addEventListener("keypress", function (e: KeyboardEvent) {
    if (e.keyCode === 13) {
      handleSearch();
    }
  });

  function handleSearch() {
    store.setFilter("search", searchInput.value);
    store.filterItems();
  }
}

export function handleCategoryFilter() {
  const categoryBtns = document.querySelectorAll(".filters__topic");
  categoryBtns.forEach((categoryBtn) => {
    categoryBtn.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      const selectedCategory = target.value;
      store.setFilter("category", selectedCategory);
      store.filterItems();
    });
  });
}

export function resetFilters() {
  const btn = document.querySelector(".reset-btn");
  const allCategory: HTMLInputElement =
    document.querySelector("#filters__topic-3");
  handleResetFilters();

  btn.addEventListener("click", handleResetFilters);

  function handleResetFilters() {
    store.resetFilter();
    searchInput.value = "";
    allCategory.checked = true;
    slider.value = "0";
    handlePriceInputStyling();
  }
}

export function handlePriceFilter() {
  slider.addEventListener("change", () => {
    store.setFilter("price", slider.value);
    store.filterItems();
  });
}

export function addItemToCart() {
  const list = document.querySelector(".items");
  list.addEventListener("click", function (event) {
    const target = event.target as HTMLElement;
    if (target.classList.contains("item__btn")) {
      const id = Number(target.dataset.productId);
      const { image, amount, title, price }: Product = store.getItem(id);
      const cartItem: CartItem = {
        id,
        image,
        amount,
        title,
        price,
        quantityToBuy: 1,
      };
      addItemToCookie(cartItem);
      store.addToCart(cartItem);
    }
  });
}

export function deleteItemFromCart() {
  const list = document.querySelector(".cart__items");
  list.addEventListener("click", function (e) {
    const target = e.target as HTMLElement;
    if (target.classList.contains("cart__remove-btn")) {
      const id = Number(target.dataset.id);
      removeItemFromCookie(id);
      store.removeFromCart(id);
    }
  });
}

export function toogleItemQuantityToBuy() {
  const list = document.querySelector(".cart__items");
  list.addEventListener("click", function (e) {
    const target = e.target as HTMLElement;
    if (target.classList.contains("toggle-btn")) {
      const id = Number(target.parentElement.dataset.id);
      if (target.classList.contains("lower")) {
        toggleItemQuantityToBuy("lower", id);
        store.toggleCartQuantityToBuy("lower", id);
      } else if (target.classList.contains("increase")) {
        toggleItemQuantityToBuy("increase", id);
        store.toggleCartQuantityToBuy("increase", id);
      }
    }
  });
}

export function updateCartTotal(items: CartItem[]) {
  const cartValue = document.querySelector(".cart__total-value");
  const price = items.reduce((acc: number, item: CartItem): number => {
    const itemPrice = item.price * item.quantityToBuy;
    return acc + itemPrice;
  }, 0);
  cartValue.innerHTML = showPrice(price).slice(1);
}
