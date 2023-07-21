import "./scss/main.scss";
import { fetchProducts } from "./ts/fetch";
import {
  addItemToCart,
  deleteItemFromCart,
  handleCategoryFilter,
  handlePriceFilter,
  handlePriceInputStyling,
  handleSearchFilter,
  resetFilters,
  toggleCart,
  toggleMenu,
  toogleItemQuantityToBuy,
} from "./ts/handlers";
import {
  getCartItemsAndGenerate,
  generateProductsForHomePage,
  generateProductsForProductsPage,
  Product,
} from "./ts/products";
import { store } from "./ts/store";

if (document.body.classList.contains("home-page")) {
  fetchProducts("../homeProducts.json", generateProductsForHomePage);
}
if (document.body.classList.contains("products-page")) {
  fetchProducts("../allProducts.json", (products: Product[]) => {
    generateProductsForProductsPage(products);
    const slider = document.querySelector('#price') as HTMLInputElement;
    const maxValue = store.state.allItems.reduce(
      (biggestValue: number, item: Product): number => {
        return item.price > biggestValue ? item.price : biggestValue;
      },
      store.state.allItems[0].price
    );
    slider.max = `${maxValue}`;
  });

  handleSearchFilter();
  handleCategoryFilter();
  resetFilters();
  handlePriceFilter();
  handlePriceInputStyling();

  addItemToCart();
}
toggleMenu();
toggleCart();

deleteItemFromCart();
getCartItemsAndGenerate();
toogleItemQuantityToBuy();
