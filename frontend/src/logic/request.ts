const DEV_BACKEND_URL = import.meta.env.VITE_BACKEND_ORIGIN
    ? import.meta.env.VITE_BACKEND_ORIGIN
    : "http://localhost:8080";

const BACKEND_URL = import.meta.env.PROD ? "/api" : DEV_BACKEND_URL;

export const backendRequest = (
    path: string,
    method: string,
    body?: unknown
) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    return fetch(`${BACKEND_URL}/${path}`, {
        method: method,
        headers: headers,
        redirect: "follow",
        body: JSON.stringify(body),
    });
};