// @ts-nocheck
"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CentralIcon } from "@central-icons-react/all";

const ci = { join: "round" as const, fill: "outlined" as const, stroke: "2" as const, radius: "2" as const };

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const ICONS: Record<ToastType, { name: string; color: string }> = {
  success: { name: "IconCircleCheck", color: "#34D399" },
  error: { name: "IconExclamationTriangle", color: "#FB7185" },
  info: { name: "IconCircleCheck", color: "#60A5FA" },
  warning: { name: "IconExclamationTriangle", color: "#FBBF24" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "success") => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}

      {/* Toast container — fixed bottom-right */}
      {toasts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-[300] flex flex-col gap-2" style={{ pointerEvents: "auto" }}>
          {toasts.map((t) => {
            const icon = ICONS[t.type];
            return (
              <div
                key={t.id}
                className="flex items-center gap-2.5 rounded-xl"
                style={{
                  padding: "10px 14px",
                  minWidth: 200,
                  maxWidth: "min(360px, calc(100vw - 2rem))",
                  background: "var(--dropdown-bg)",
                  border: "1px solid var(--dropdown-border)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  boxShadow: "var(--dropdown-shadow)",
                  animation: "fadeInUp 0.2s ease",
                }}
              >
                <CentralIcon name={icon.name as any} size={16} color={icon.color} {...ci} />
                <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: "var(--fg)" }}>{t.message}</span>
                <button
                  onClick={() => removeToast(t.id)}
                  className="flex items-center justify-center shrink-0 cursor-pointer rounded-md transition-colors hover:bg-[var(--accent)]"
                  style={{ width: 20, height: 20, background: "none", border: "none" }}
                >
                  <CentralIcon name="IconX" size={10} color="var(--muted-fg)" {...ci} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </ToastContext.Provider>
  );
}
