"use client";

import { useEffect, useRef } from "react";

const VAPID_KEY_STORAGE = "employes-push-subscribed";

/**
 * After first login, waits 5 seconds then requests push notification permission.
 * If granted, subscribes via pushManager and stores the subscription in localStorage.
 * Renders nothing visible.
 */
export function PushPermission() {
  const asked = useRef(false);

  useEffect(() => {
    // Only run in browsers that support push
    if (
      typeof window === "undefined" ||
      !("Notification" in window) ||
      !("serviceWorker" in navigator) ||
      !("PushManager" in window)
    ) {
      return;
    }

    // Already subscribed
    if (localStorage.getItem(VAPID_KEY_STORAGE)) return;

    // Already granted or denied — don't prompt again
    if (Notification.permission !== "default") return;

    if (asked.current) return;
    asked.current = true;

    const timer = setTimeout(async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        const registration = await navigator.serviceWorker.ready;

        // Get VAPID public key from env (injected at build time)
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidPublicKey) {
          console.warn("[PushPermission] No VAPID public key configured");
          return;
        }

        // Convert VAPID key to Uint8Array
        const urlBase64ToUint8Array = (base64String: string) => {
          const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
          const base64 = (base64String + padding)
            .replace(/-/g, "+")
            .replace(/_/g, "/");
          const rawData = atob(base64);
          const outputArray = new Uint8Array(rawData.length);
          for (let i = 0; i < rawData.length; i++) {
            outputArray[i] = rawData.charCodeAt(i);
          }
          return outputArray;
        };

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });

        // Store subscription in localStorage for now (will send to server later)
        localStorage.setItem(VAPID_KEY_STORAGE, JSON.stringify(subscription.toJSON()));
      } catch (err) {
        console.warn("[PushPermission] Failed to subscribe:", err);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
