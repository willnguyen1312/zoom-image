import { setupServiceWorker } from "@builder.io/qwik-city/service-worker"

setupServiceWorker()

addEventListener("install", () => self.skipWaiting())

addEventListener("activate", () => self.clients.claim())

declare const self: ServiceWorkerGlobalScope
