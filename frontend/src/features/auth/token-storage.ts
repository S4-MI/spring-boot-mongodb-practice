const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
// const COOKIE_NAME = "access_token";

const isBrowser = typeof window !== "undefined";

// function setCookie(name: string, value: string) {
//     if (!isBrowser) return;
//     // 7 days; SameSite=Lax is fine for same-origin; add Secure in production
//     const secure = location.protocol === "https:" ? "; Secure" : "";
//     document.cookie = `${name}=${value}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax${secure}`;
// }

// function clearCookie(name: string) {
//     if (!isBrowser) return;
//     document.cookie = `${name}=; path=/; max-age=0`;
// }

export const tokenStorage = {
    getAccessToken: () =>
        isBrowser ? localStorage.getItem(ACCESS_TOKEN_KEY) : null,
    getRefreshToken: () =>
        isBrowser ? localStorage.getItem(REFRESH_TOKEN_KEY) : null,

    setTokens(accessToken: string, refreshToken: string) {
        if (!isBrowser) return;
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        // setCookie(COOKIE_NAME, accessToken);
    },

    clearTokens() {
        if (!isBrowser) return;
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        // clearCookie(COOKIE_NAME);
    },
};
