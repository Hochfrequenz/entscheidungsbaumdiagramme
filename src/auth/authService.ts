import type { LogoutOptions } from "@auth0/auth0-spa-js";
import { Auth0Client, createAuth0Client, User } from "@auth0/auth0-spa-js";

import { isAuthenticated, user } from "../store";
import config from "./auth_config";

let auth0Client: Auth0Client;

async function createClient(): Promise<Auth0Client> {
  auth0Client = await createAuth0Client({
    domain: config.domain,
    clientId: config.clientId,
    authorizationParams: {
      redirect_uri: window.location.origin,
    },
    cacheLocation: "localstorage",
    useRefreshTokens: true,
  });

  return auth0Client;
}

async function loginWithRedirect(): Promise<void> {
  try {
    await auth0Client.loginWithRedirect();
  } catch (e) {
    console.error(e);
  }
}

async function handleRedirectCallback(): Promise<void> {
  try {
    await auth0Client.handleRedirectCallback();
    await updateAuthStore();
  } catch (e) {
    console.error(e);
  }
}

async function logout(): Promise<void> {
  const logoutOptions: LogoutOptions = {
    logoutParams: {
      returnTo: window.location.origin,
    },
  };
  await auth0Client.logout(logoutOptions);
  user.set({});
  isAuthenticated.set(false);
}

async function updateAuthStore(): Promise<void> {
  const authenticated = await auth0Client.isAuthenticated();
  isAuthenticated.set(authenticated);

  if (authenticated) {
    const userData = await auth0Client.getUser();
    user.set(userData as User);
    window.localStorage.setItem("isLoggedIn", "true");
  } else {
    user.set({});
    window.localStorage.removeItem("isLoggedIn");
  }
}

async function checkAuth(): Promise<boolean> {
  const isLoggedIn = window.localStorage.getItem("isLoggedIn") === "true";
  if (isLoggedIn) {
    await updateAuthStore();
  }
  return isLoggedIn;
}

const auth = {
  createClient,
  loginWithRedirect,
  handleRedirectCallback,
  logout,
  updateAuthStore,
  checkAuth,
};

export default auth;
