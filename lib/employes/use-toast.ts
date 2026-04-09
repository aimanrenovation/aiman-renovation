"use client";

import { useCallback, useSyncExternalStore } from "react";

export type ToastVariant = "success" | "error" | "info";

export interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

let nextId = 0;
let toasts: Toast[] = [];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot() {
  return toasts;
}

export function showToast(message: string, variant: ToastVariant = "info") {
  const id = ++nextId;
  toasts = [...toasts, { id, message, variant }];
  emit();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, 3000);
}

export function useToast() {
  const list = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const toast = useCallback(
    (message: string, variant: ToastVariant = "info") => {
      showToast(message, variant);
    },
    []
  );

  return { toasts: list, toast };
}
