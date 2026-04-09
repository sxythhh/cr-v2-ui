"use client";

import { Toast } from "@base-ui/react/toast";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const toastManager = Toast.createToastManager();
const anchoredToastManager = Toast.createToastManager();

function ToastInfoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[rgba(37,37,37,0.5)] dark:text-white/70" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0ZM7.66667 4.33333C7.66667 3.96514 7.36819 3.66667 7 3.66667C6.63181 3.66667 6.33333 3.96514 6.33333 4.33333V7.66667C6.33333 8.03486 6.63181 8.33333 7 8.33333C7.36819 8.33333 7.66667 8.03486 7.66667 7.66667V4.33333ZM7 9.33333C6.63181 9.33333 6.33333 9.63181 6.33333 10C6.33333 10.3682 6.63181 10.6667 7 10.6667C7.36819 10.6667 7.66667 10.3682 7.66667 10C7.66667 9.63181 7.36819 9.33333 7 9.33333Z" fill="currentColor" />
    </svg>
  );
}

function ToastSuccessIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M6.66667 0C2.98477 0 0 2.98477 0 6.66667C0 10.3486 2.98477 13.3333 6.66667 13.3333C10.3486 13.3333 13.3333 10.3486 13.3333 6.66667C13.3333 2.98477 10.3486 0 6.66667 0ZM9.18264 5.42218C9.41579 5.13721 9.37379 4.7172 9.08882 4.48405C8.80386 4.2509 8.38385 4.2929 8.15069 4.57786L5.61717 7.67439L4.80474 6.86195C4.54439 6.6016 4.12228 6.6016 3.86193 6.86195C3.60158 7.1223 3.60158 7.54441 3.86193 7.80476L5.19526 9.13809C5.32845 9.27128 5.51176 9.34191 5.69988 9.33253C5.88799 9.32314 6.06337 9.23462 6.18264 9.08885L9.18264 5.42218Z" fill="#00994D" />
    </svg>
  );
}

function ToastWarningIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="13" viewBox="0 0 14 13" fill="none" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M4.95407 0.992259C5.72583 -0.330751 7.63743 -0.330754 8.40919 0.992257L13.0878 9.01275C13.8656 10.3461 12.9038 12.0205 11.3602 12.0205H2.00301C0.459432 12.0205 -0.502312 10.3461 0.275454 9.01275L4.95407 0.992259ZM6.68229 4.02051C7.05048 4.02051 7.34896 4.31898 7.34896 4.68717V6.68717C7.34896 7.05536 7.05048 7.35384 6.68229 7.35384C6.3141 7.35384 6.01562 7.05536 6.01562 6.68717V4.68717C6.01562 4.31898 6.3141 4.02051 6.68229 4.02051ZM5.84896 8.68717C5.84896 8.22694 6.22205 7.85384 6.68229 7.85384C7.14253 7.85384 7.51562 8.22694 7.51562 8.68717C7.51562 9.14741 7.14253 9.52051 6.68229 9.52051C6.22205 9.52051 5.84896 9.14741 5.84896 8.68717Z" fill="#E57100" />
    </svg>
  );
}

function ToastErrorIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M0 6.66667C0 2.98477 2.98477 0 6.66667 0C10.3486 0 13.3333 2.98477 13.3333 6.66667C13.3333 10.3486 10.3486 13.3333 6.66667 13.3333C2.98477 13.3333 0 10.3486 0 6.66667ZM5.13807 4.19526C4.87772 3.93491 4.45561 3.93491 4.19526 4.19526C3.93491 4.45561 3.93491 4.87772 4.19526 5.13807L5.72386 6.66667L4.19526 8.19526C3.93491 8.45561 3.93491 8.87772 4.19526 9.13807C4.45561 9.39842 4.87772 9.39842 5.13807 9.13807L6.66667 7.60948L8.19526 9.13807C8.45561 9.39842 8.87772 9.39842 9.13807 9.13807C9.39842 8.87772 9.39842 8.45561 9.13807 8.19526L7.60948 6.66667L9.13807 5.13807C9.39842 4.87772 9.39842 4.45561 9.13807 4.19526C8.87772 3.93491 8.45561 3.93491 8.19526 4.19526L6.66667 5.72386L5.13807 4.19526Z" fill="#FF3355" />
    </svg>
  );
}

const TOAST_ICONS = {
  error: ToastErrorIcon,
  info: ToastInfoIcon,
  loading: ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}><path d="M12 3a9 9 0 1 0 9 9"/></svg>
  ),
  success: ToastSuccessIcon,
  warning: ToastWarningIcon,
} as const;

type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

interface ToastProviderProps extends Toast.Provider.Props {
  position?: ToastPosition;
}

function ToastProvider({
  children,
  position = "bottom-right",
  ...props
}: ToastProviderProps) {
  return (
    <Toast.Provider toastManager={toastManager} {...props}>
      {children}
      <Toasts position={position} />
    </Toast.Provider>
  );
}

function Toasts({ position = "bottom-right" }: { position: ToastPosition }) {
  const { toasts } = Toast.useToastManager();
  const isTop = position.startsWith("top");

  return (
    <Toast.Portal data-slot="toast-portal">
      <Toast.Viewport
        className={cn(
          "fixed z-50 mx-auto flex w-[calc(100%-var(--toast-inset)*2)] max-w-90 [--toast-inset:--spacing(4)] sm:[--toast-inset:--spacing(8)]",
          // Vertical positioning
          "data-[position*=top]:top-(--toast-inset)",
          "data-[position*=bottom]:bottom-(--toast-inset)",
          // Horizontal positioning
          "data-[position*=left]:left-(--toast-inset)",
          "data-[position*=right]:right-(--toast-inset)",
          "data-[position*=center]:-translate-x-1/2 data-[position*=center]:left-1/2",
        )}
        data-position={position}
        data-slot="toast-viewport"
      >
        {toasts.map((toast) => {
          const Icon = toast.type
            ? TOAST_ICONS[toast.type as keyof typeof TOAST_ICONS]
            : null;

          return (
            <Toast.Root
              className={cn(
                "absolute z-[calc(9999-var(--toast-index))] h-(--toast-calc-height) w-full select-none rounded-[12px] border border-foreground/[0.06] bg-card-bg text-foreground shadow-[0px_4px_12px_rgba(0,0,0,0.12)] [transition:transform_.28s_cubic-bezier(.22,1,.36,1),opacity_.28s,height_.15s]",
                // Base positioning using data-position
                "data-[position*=right]:right-0 data-[position*=right]:left-auto",
                "data-[position*=left]:right-auto data-[position*=left]:left-0",
                "data-[position*=center]:right-0 data-[position*=center]:left-0",
                "data-[position*=top]:top-0 data-[position*=top]:bottom-auto data-[position*=top]:origin-top",
                "data-[position*=bottom]:top-auto data-[position*=bottom]:bottom-0 data-[position*=bottom]:origin-bottom",
                // Gap fill for hover
                "after:absolute after:left-0 after:h-[calc(var(--toast-gap)+1px)] after:w-full",
                "data-[position*=top]:after:top-full",
                "data-[position*=bottom]:after:bottom-full",
                // Define some variables
                "[--toast-calc-height:var(--toast-frontmost-height,var(--toast-height))] [--toast-gap:--spacing(3)] [--toast-peek:--spacing(3)] [--toast-scale:calc(max(0,1-(var(--toast-index)*.1)))] [--toast-shrink:calc(1-var(--toast-scale))]",
                // Define offset-y variable
                "data-[position*=top]:[--toast-calc-offset-y:calc(var(--toast-offset-y)+var(--toast-index)*var(--toast-gap)+var(--toast-swipe-movement-y))]",
                "data-[position*=bottom]:[--toast-calc-offset-y:calc(var(--toast-offset-y)*-1+var(--toast-index)*var(--toast-gap)*-1+var(--toast-swipe-movement-y))]",
                // Default state transform
                "data-[position*=top]:transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)+(var(--toast-index)*var(--toast-peek))+(var(--toast-shrink)*var(--toast-calc-height))))_scale(var(--toast-scale))]",
                "data-[position*=bottom]:transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--toast-peek))-(var(--toast-shrink)*var(--toast-calc-height))))_scale(var(--toast-scale))]",
                // Limited state
                "data-limited:opacity-0",
                // Expanded state
                "data-expanded:h-(--toast-height)",
                "data-position:data-expanded:transform-[translateX(var(--toast-swipe-movement-x))_translateY(var(--toast-calc-offset-y))]",
                // Starting and ending animations
                "data-[position*=top]:data-starting-style:transform-[translateY(calc(-100%-var(--toast-inset)))]",
                "data-[position*=bottom]:data-starting-style:transform-[translateY(calc(100%+var(--toast-inset)))]",
                "data-ending-style:opacity-0",
                // Ending animations (direction-aware)
                "data-ending-style:not-data-limited:not-data-swipe-direction:transform-[translateY(calc(100%+var(--toast-inset)))]",
                "data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-100%-var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]",
                "data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+100%+var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]",
                "data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-100%-var(--toast-inset)))]",
                "data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+100%+var(--toast-inset)))]",
                // Ending animations (expanded)
                "data-expanded:data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-100%-var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]",
                "data-expanded:data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+100%+var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]",
                "data-expanded:data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-100%-var(--toast-inset)))]",
                "data-expanded:data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+100%+var(--toast-inset)))]",
              )}
              data-position={position}
              key={toast.id}
              swipeDirection={
                position.includes("center")
                  ? [isTop ? "up" : "down"]
                  : position.includes("left")
                    ? ["left", isTop ? "up" : "down"]
                    : ["right", isTop ? "up" : "down"]
              }
              toast={toast}
            >
              <Toast.Content className="pointer-events-auto flex items-center justify-between gap-2 overflow-hidden py-3 pl-2.5 pr-3.5 text-sm font-medium tracking-[-0.02em] transition-opacity duration-250 data-behind:not-data-expanded:pointer-events-none data-behind:opacity-0 data-expanded:opacity-100">
                <div className="flex items-center gap-2">
                  {Icon && (
                    <div
                      className="[&>svg]:h-lh [&>svg]:w-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
                      data-slot="toast-icon"
                    >
                      <Icon className="in-data-[type=loading]:animate-spin in-data-[type=loading]:opacity-80" />
                    </div>
                  )}

                  <div className="flex flex-col gap-0.5">
                    <Toast.Title
                      className="font-medium"
                      data-slot="toast-title"
                    />
                    <Toast.Description
                      className="text-muted-foreground"
                      data-slot="toast-description"
                    />
                  </div>
                </div>
                {toast.actionProps && (
                  <Toast.Action
                    className={buttonVariants({ size: "xs" })}
                    data-slot="toast-action"
                  >
                    {toast.actionProps.children}
                  </Toast.Action>
                )}
              </Toast.Content>
            </Toast.Root>
          );
        })}
      </Toast.Viewport>
    </Toast.Portal>
  );
}

function AnchoredToastProvider({ children, ...props }: Toast.Provider.Props) {
  return (
    <Toast.Provider toastManager={anchoredToastManager} {...props}>
      {children}
      <AnchoredToasts />
    </Toast.Provider>
  );
}

function AnchoredToasts() {
  const { toasts } = Toast.useToastManager();

  return (
    <Toast.Portal data-slot="toast-portal-anchored">
      <Toast.Viewport
        className="outline-none"
        data-slot="toast-viewport-anchored"
      >
        {toasts.map((toast) => {
          const Icon = toast.type
            ? TOAST_ICONS[toast.type as keyof typeof TOAST_ICONS]
            : null;
          const tooltipStyle =
            (toast.data as { tooltipStyle?: boolean })?.tooltipStyle ?? false;
          const positionerProps = toast.positionerProps;

          if (!positionerProps?.anchor) {
            return null;
          }

          return (
            <Toast.Positioner
              className="z-50 max-w-[min(--spacing(64),var(--available-width))]"
              data-slot="toast-positioner"
              key={toast.id}
              sideOffset={positionerProps.sideOffset ?? 4}
              toast={toast}
            >
              <Toast.Root
                className={cn(
                  "relative text-balance border bg-popover not-dark:bg-clip-padding text-popover-foreground text-xs transition-[scale,opacity] before:pointer-events-none before:absolute before:inset-0 before:shadow-[0_1px_--theme(--color-black/4%)] data-ending-style:scale-98 data-starting-style:scale-98 data-ending-style:opacity-0 data-starting-style:opacity-0 dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
                  tooltipStyle
                    ? "rounded-md shadow-md/5 before:rounded-[calc(var(--radius-md)-1px)]"
                    : "rounded-lg shadow-lg/5 before:rounded-[calc(var(--radius-lg)-1px)]",
                )}
                data-slot="toast-popup"
                toast={toast}
              >
                {tooltipStyle ? (
                  <Toast.Content className="pointer-events-auto px-2 py-1">
                    <Toast.Title data-slot="toast-title" />
                  </Toast.Content>
                ) : (
                  <Toast.Content className="pointer-events-auto flex items-center justify-between gap-1.5 overflow-hidden px-3.5 py-3 text-sm">
                    <div className="flex gap-2">
                      {Icon && (
                        <div
                          className="[&>svg]:h-lh [&>svg]:w-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
                          data-slot="toast-icon"
                        >
                          <Icon className="in-data-[type=loading]:animate-spin in-data-[type=loading]:opacity-80" />
                        </div>
                      )}

                      <div className="flex flex-col gap-0.5">
                        <Toast.Title
                          className="font-medium"
                          data-slot="toast-title"
                        />
                        <Toast.Description
                          className="text-muted-foreground"
                          data-slot="toast-description"
                        />
                      </div>
                    </div>
                    {toast.actionProps && (
                      <Toast.Action
                        className={buttonVariants({ size: "xs" })}
                        data-slot="toast-action"
                      >
                        {toast.actionProps.children}
                      </Toast.Action>
                    )}
                  </Toast.Content>
                )}
              </Toast.Root>
            </Toast.Positioner>
          );
        })}
      </Toast.Viewport>
    </Toast.Portal>
  );
}

export {
  ToastProvider,
  type ToastPosition,
  toastManager,
  AnchoredToastProvider,
  anchoredToastManager,
  Toast as ToastPrimitive,
};
