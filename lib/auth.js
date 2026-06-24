export const AUTH_COOKIE = "posyandu_girimulyo_auth";
export const AUTH_EMAIL = "admin@posyandugirimulyo.com";
export const AUTH_PASSWORD = "user123";

export function isAuthenticated(cookieStore) {
  return cookieStore.get(AUTH_COOKIE)?.value === "authenticated";
}
