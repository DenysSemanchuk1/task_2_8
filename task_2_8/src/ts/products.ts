import { getItemsFromCookie } from "./cookie";
import { store } from "./store";
import { capitalizeString, showPrice } from "./typography";

export interface Product {
  title: string;
  image: string;
  category: string;
  price: number;
  rating: number;
  id: number;
  amount: number;
}

export interface CartItem {
  id: number;
  image: string;
  amount: number;
  quantityToBuy: number;
  price: number;
  title: string;
}
export function generateProductsForHomePage(products: Product[]) {
  const wrappElement = document.querySelector(".products__list");
  if (!wrappElement) return;
  products.forEach(({ title, image, category }) => {
    wrappElement.innerHTML += `<li class="home-product">
    <div class="home-product__content">
      <div class="home-product__category">#${capitalizeString(category)}</div>
      <h4 class="home-product__title">${title}</h4>
    </div>
    <img src="${image}" alt="${title}">
  </li>`;
  });
}

export function generateProductsForProductsPage(products?: Product[]) {
  if (!products) {
    products = store.state.allItems;
  }
  const wrappElement = document.querySelector(".items__list");
  if (!wrappElement) return;
  wrappElement.innerHTML = "";
  products.forEach((product) => {
    const { title, image, category, price, rating, id } = product;
    wrappElement.innerHTML += `
    <div class="item">
    <button class="item__btn" data-product-id="${id}">
      <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.6256 9.1H9.78458V14.875H6.25358V9.1H0.412578V5.8H6.25358V0.0249984H9.78458V5.8H15.6256V9.1Z" fill="white" />
      </svg>
      Add
    </button>
    <img src="${image}" alt="${title}">
    <div class="item__descr">
      <h4 class="item__title">${title}</h4>
      <strong class="item__price">${showPrice(price)}</strong>
      <span class="item__rating">${generateRating(rating)}</span>
      <span class="item__category">${category}</span>
    </div>
  </div>
    `;
  });
}

function generateRating(rating: number) {
  let stars = ``;
  for (let i = 0; i < rating; i++) {
    stars +=
      '<svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.40564 0L6.61248 5.72927H0.811157L5.5049 9.26996L3.7119 15L8.40564 11.4578L13.0992 15L11.3062 9.26996L16 5.72927H10.1986L8.40564 0Z" fill="#CC5520"/></svg>';
  }
  return stars;
}

export function getCartItemsAndGenerate(items?: CartItem[]) {
  if (!items) {
    items = getItemsFromCookie();
    store.setCartItems(items)
  }
  const wrappElement = document.querySelector(".cart__items");
  wrappElement.innerHTML = "";
  items.forEach((product) => {
    const { amount, id, image, price, quantityToBuy, title } = product;
    wrappElement.innerHTML += `
    <div class="cart__item" data-id="${id}">
    <div class="cart__item-content">
      <img src="${image}" alt="fox">
      <div class="item__descr cart__item-descr">
        <h4 class=" cart__item-title item__title">${title}</h4>
        <strong class="cart__item-price item__price">${showPrice(
          price
        )}</strong>
      </div>
    </div>
    <div class="cart__item-functionality">
      <div class="cart__toggle-btns" data-id="${id}">
        <button class="lower toggle-btn">-</button>
        <output>
          ${quantityToBuy}
        </output>
        <button class="increase toggle-btn">+</button>
      </div>
      <button class="cart__remove-btn" data-max-items="${amount}" data-id="${id}">
        <svg width="48" height="48" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2.625C7.71641 2.625 2.625 7.71641 2.625 14C2.625 20.2836 7.71641 25.375 14 25.375C20.2836 25.375 25.375 20.2836 25.375 14C25.375 7.71641 20.2836 2.625 14 2.625ZM16.882 18.118L14 15.2359L11.118 18.118C10.7789 18.457 10.2211 18.457 9.88203 18.118C9.7125 17.9484 9.625 17.7242 9.625 17.5C9.625 17.2758 9.7125 17.0516 9.88203 16.882L12.7641 14L9.88203 11.118C9.7125 10.9484 9.625 10.7242 9.625 10.5C9.625 10.2758 9.7125 10.0516 9.88203 9.88203C10.2211 9.54297 10.7789 9.54297 11.118 9.88203L14 12.7641L16.882 9.88203C17.2211 9.54297 17.7789 9.54297 18.118 9.88203C18.457 10.2211 18.457 10.7789 18.118 11.118L15.2359 14L18.118 16.882C18.457 17.2211 18.457 17.7789 18.118 18.118C17.7789 18.4625 17.2211 18.4625 16.882 18.118Z" fill="#8C8C8C" />
        </svg>
        Remove
      </button>
    </div>
  </div>
    `;
  });
}
