// Версия кэша: при обновлении сайта увеличь число, чтобы браузер забрал новые файлы
const CACHE = "guess-game-v1";

// Файлы, которые сохраняются для работы без интернета
const FILES = ["./", "index.html", "bg.gif", "manifest.json", "icon-192.png", "icon-512.png"];

// Установка: сохраняем файлы в кэш
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) { return cache.addAll(FILES); })
  );
  self.skipWaiting();
});

// Активация: удаляем старые версии кэша
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(
        names.filter(function (name) { return name !== CACHE; })
             .map(function (name) { return caches.delete(name); })
      );
    })
  );
  self.clients.claim();
});

// Запросы: сначала смотрим в кэш, если там нет, идём в интернет
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      return cached || fetch(event.request);
    })
  );
});
