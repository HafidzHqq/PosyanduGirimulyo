export const AUTH_COOKIE = "posyandu_girimulyo_auth";
export const AUTH_EMAIL = "admin@posyandu.com";

export const POSYANDU_ACCOUNTS = [
  {
    id: "admin",
    label: "Plamboyan",
    password: "plamboyan",
    role: "admin",
    posyanduName: "Plamboyan",
  },
  ...Array.from({ length: 6 }, (_, index) => {
    const number = index + 1;

    return {
      id: `plamboyan-${number}`,
      label: `Plamboyan ${number}`,
      password: `plamboyan${number}`,
      passwordAlias: `plamboyan ${number}`,
      role: "posyandu",
      posyanduName: `Plamboyan ${number}`,
    };
  }),
];

function encodeSession(account) {
  return encodeURIComponent(JSON.stringify({
    id: account.id,
    label: account.label,
    role: account.role,
    posyanduName: account.posyanduName,
  }));
}

function decodeSession(value) {
  if (!value) return null;

  if (value === "authenticated") {
    return POSYANDU_ACCOUNTS[0];
  }

  try {
    const session = JSON.parse(decodeURIComponent(value));
    const account = POSYANDU_ACCOUNTS.find((item) => item.id === session.id);
    if (!account) return null;

    return {
      id: account.id,
      label: account.label,
      role: account.role,
      posyanduName: account.posyanduName,
    };
  } catch {
    return null;
  }
}

export function findAccount(email, password) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedPassword = String(password || "").trim().toLowerCase();

  if (normalizedEmail !== AUTH_EMAIL) return null;

  return POSYANDU_ACCOUNTS.find((account) => (
    account.password === normalizedPassword || account.passwordAlias === normalizedPassword
  )) || null;
}

export function createAuthCookieValue(account) {
  return encodeSession(account);
}

export function getAuthSession(cookieStore) {
  return decodeSession(cookieStore.get(AUTH_COOKIE)?.value);
}

export function isAuthenticated(cookieStore) {
  return Boolean(getAuthSession(cookieStore));
}
