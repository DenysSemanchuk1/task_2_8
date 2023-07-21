import { removeItemFromCookie, toggleItemQuantityToBuy } from "./cookie";
import { updateCartTotal } from "./handlers";
import {
  CartItem,
  Product,
  getCartItemsAndGenerate,
  generateProductsForProductsPage,
} from "./products";

interface State {
  allItems: Product[];
  itemsToDisplay: Product[];
  cartItems: CartItem[];
  filters: {
    search: string;
    category: string;
    price: number;
  };
  totalCartPrice: number;
}

interface Observer {
  update(): void;
}
class CartObserver implements Observer {
  private store: Store;
  constructor(store: Store) {
    this.store = store;
  }

  update() {
    updateCartTotal(this.store.state.cartItems);
  }
}

export class Store {
  private cartObserver: Observer;
  state: State;
  constructor() {
    this.state = {
      allItems: [],
      itemsToDisplay: [],
      cartItems: [],
      filters: {
        search: "",
        category: "",
        price: 0,
      },
      totalCartPrice: 0,
    };
    this.cartObserver = new CartObserver(this);
  }

  addToCart(item: CartItem) {
    const { id } = item;
    const isExist = this.state.cartItems.find((item) => item.id === id);
    if (isExist) {
      toggleItemQuantityToBuy("increase", id);
      this.toggleCartQuantityToBuy("increase", id);
      getCartItemsAndGenerate();
      return;
    }
    this.state.cartItems.push(item);
    this.notifyCartObserver();
    getCartItemsAndGenerate();
  }

  removeFromCart(id: number) {
    this.state.cartItems = this.state.cartItems.filter(
      (item: CartItem) => item.id !== id
    );
    getCartItemsAndGenerate(this.state.cartItems);
    this.notifyCartObserver();
  }

  toggleCartQuantityToBuy(type: string, id: number) {
    const item: CartItem = this.state.cartItems.find(
      (cartItem: CartItem) => cartItem.id === id
    );
    if (type === "lower") {
      if (item.quantityToBuy <= 1) {
        removeItemFromCookie(id);
      }
      item.quantityToBuy--;
    } else if (type === "increase") {
      if (item.quantityToBuy >= item.amount) {
        return;
      }
      item.quantityToBuy++;
    }
    this.notifyCartObserver();
    getCartItemsAndGenerate();
  }

  private notifyCartObserver() {
    this.cartObserver.update();
  }

  setAllItems(items: Product[]) {
    this.state.allItems = items;
  }

  filterItemsByCategory(items: Product[]) {
    const category = this.state.filters.category;
    if (category === "all") {
      this.state.filters.category = "";
      return;
    }
    this.state.itemsToDisplay = items.filter(
      (item: Product) => item.category === category
    );
  }

  setCartItems(items: CartItem[]) {
    this.state.cartItems = items;
    this.notifyCartObserver();
  }

  filterItemsByPrice(items: Product[]) {
    this.state.itemsToDisplay = items.filter(
      (item: Product) => item.price >= this.state.filters.price
    );
  }

  filterItemsBySearch(items: Product[]) {
    this.state.itemsToDisplay = items.filter((item: Product) =>
      item.title
        .toLowerCase()
        .startsWith(this.state.filters.search.toLowerCase())
    );
  }

  setFilter(filter: string, value: string | number) {
    this.state.filters[filter] = value;
  }

  checkDisplayedItems() {
    return this.state.itemsToDisplay.length > 1 ? "itemsToDisplay" : "allItems";
  }

  resetFilter() {
    this.state.filters = {
      search: "",
      category: "",
      price: 0,
    };
    this.state.itemsToDisplay = [];
    generateProductsForProductsPage(this.state.allItems);
  }
  filterItems() {
    const { search, category, price } = this.state.filters;
    if (search) {
      this.filterItemsBySearch(this.state.allItems);
      if (category) {
        this.filterItemsByCategory(this.state.itemsToDisplay);
      }
      if (price) {
        this.filterItemsByPrice(this.state.itemsToDisplay);
      }
    } else if (category) {
      if (category === "all") {
        this.state.itemsToDisplay = this.state.allItems;
      } else this.filterItemsByCategory(this.state.allItems);

      if (price > 0) {
        this.filterItemsByPrice(this.state.itemsToDisplay);
      }
    } else if (price) {
      this.filterItemsByPrice(this.state.allItems);
    }

    generateProductsForProductsPage(this.state.itemsToDisplay);
  }

  getItem(id: number) {
    const product = this.state.allItems.find((item: Product) => item.id === id);
    return product;
  }
}

export const store = new Store();
