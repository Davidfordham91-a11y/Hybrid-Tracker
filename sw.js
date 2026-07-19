const CACHE_NAME = "hybrid-tracker-v5-0";
const APP_SHELL = "./";
const ASSETS = [
  APP_SHELL,
  "./styles.css",
  "./app.js",
  "./src/main.js",
  "./src/core/version.js",
  "./src/utils/validation.js",
  "./manifest.webmanifest",
  "./icon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.all(ASSETS.map((asset) => cacheFresh(cache, asset))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.pathname.startsWith("/api/")) return;
  if (event.request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(event.request));
    return;
  }
  event.respondWith(cacheFirstAsset(event.request));
});

async function cacheFresh(cache, request) {
  try {
    const response = await fetch(request, { cache: "reload", redirect: "follow" });
    if (isCacheable(response)) {
      await cache.put(request, response.clone());
    }
  } catch (error) {
    // Offline installs can continue with whatever is already cached.
  }
}

async function networkFirstNavigation(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(APP_SHELL, { cache: "reload", redirect: "follow" });
    if (isCacheable(response)) {
      await cache.put(APP_SHELL, response.clone());
      return response;
    }
    const shell = await fetch(APP_SHELL, { cache: "reload", redirect: "follow" });
    if (isCacheable(shell)) {
      await cache.put(APP_SHELL, shell.clone());
      return shell;
    }
  } catch (error) {
    const cached = await cache.match(APP_SHELL);
    if (cached && !cached.redirected) return cached;
  }
  return new Response("Hybrid Tracker is offline and the app shell is not cached yet.", {
    status: 503,
    headers: { "Content-Type": "text/plain" }
  });
}

async function cacheFirstAsset(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached && !cached.redirected) return cached;
  const response = await fetch(request, { redirect: "follow" });
  if (isCacheable(response)) {
    cache.put(request, response.clone());
  }
  return response;
}

function isCacheable(response) {
  return response && response.ok && !response.redirected && response.type !== "opaqueredirect";
}
