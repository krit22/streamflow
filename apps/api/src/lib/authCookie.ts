import type { CookieOptions } from "express";

export const AUTH_COOKIE_NAME =
  process.env.JWT_COOKIE_NAME ?? "access_token";

const isProduction = process.env.NODE_ENV === "production";

export function getAuthCookieOptions(): CookieOptions {
  const options: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 60 * 60 * 1000, // 1h, matches JWT expiresIn
    path: "/",
  };

  const domain = process.env.COOKIE_DOMAIN;
  if (domain) {
    options.domain = domain;
  }

  return options;
}

export function getClearAuthCookieOptions(): CookieOptions {
  const { maxAge: _maxAge, ...options } = getAuthCookieOptions();
  return options;
}
