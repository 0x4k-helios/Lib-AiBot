const config = {
  apiBaseUrl:
    process.env.NODE_ENV === "production"
      ? "https://libcatalog-backend.onrender.com"
      : "http://localhost:3000",
};

export default config;
