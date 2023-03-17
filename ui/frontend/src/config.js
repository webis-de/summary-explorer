const { NODE_ENV, REACT_APP_API_PORT } = process.env;
const { protocol, hostname } = window.location;
const baseURL =
  NODE_ENV === "development"
    ? `${protocol}//${hostname}:${REACT_APP_API_PORT}`
    : "";

export { baseURL };
