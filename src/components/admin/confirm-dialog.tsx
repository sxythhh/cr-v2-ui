// @ts-nocheck
"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextValue>({ confirm: async () => false });

export function useConfirm() {
  return useContext(ConfirmContext);
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ options: ConfirmOptions; resolve: (v: boolean) => void } | null>(null);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({ options, resolve });
    });
  }, []);

  const handleResponse = (value: boolean) => {
    state?.resolve(value);
    setState(null);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {state && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => handleResponse(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="rounded-2xl overflow-hidden"
            style={{
              width: 380,
              maxWidth: "90vw",
              background: "var(--bg)",
              border: "1px solid var(--border-color)",
              boxShadow: "var(--dropdown-shadow)",
            }}
          >
            <div style={{ padding: "20px 20px 12px" }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--fg)", margin: "0 0 6px" }}>{state.options.title}</h3>
              <p style={{ fontSize: 13, color: "var(--muted-fg)", margin: 0, lineHeight: 1.5 }}>{state.options.message}</p>
            </div>
            <div className="flex items-center justify-end gap-2" style={{ padding: "12px 20px", borderTop: "1px solid var(--border-color)" }}>
              <button
                onClick={() => handleResponse(false)}
                className="rounded-lg px-4 py-1.5 cursor-pointer transition-colors hover:bg-[var(--accent)]"
                style={{ background: "transparent", border: "none", fontSize: 13, fontWeight: 500, color: "var(--fg)", fontFamily: "inherit" }}
              >
                {state.options.cancelLabel ?? "Cancel"}
              </button>
              <button
                onClick={() => handleResponse(true)}
                className="rounded-lg px-4 py-1.5 cursor-pointer transition-opacity hover:opacity-90"
                style={{
                  background: state.options.destructive ? "#EB4B62" : "#f6850f",
                  border: "none",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#fff",
                  fontFamily: "inherit",
                }}
              >
                {state.options.confirmLabel ?? "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
