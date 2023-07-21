import { toggleLoadingState } from "./handlers";
import { store } from "./store";

export async function fetchProducts(url: string, onFetchSuccess: Function) {
  toggleLoadingState();
  const data = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
  const json = await data.json();
  store.setAllItems(json);
  toggleLoadingState();

  onFetchSuccess(json);
}
