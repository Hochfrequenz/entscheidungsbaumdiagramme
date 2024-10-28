import type { User } from "@auth0/auth0-spa-js";
import { writable } from "svelte/store";

export const isAuthenticated = writable<boolean>(false);
export const user = writable<User | Record<string, never>>({});
export const popupOpen = writable<boolean>(false);
export const error = writable<string | null>(null);
