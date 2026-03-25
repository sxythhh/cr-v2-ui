"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import * as React from "react";

import { cn } from "@/lib/utils";

const AnalyticsPocToggleGroupContext = React.createContext<{
  orientation?: "horizontal" | "vertical";
}>({
  orientation: "horizontal",
});

type BaseToggleGroupProps = Omit<
  ToggleGroupPrimitive.Props<string>,
  "children" | "defaultValue" | "multiple" | "onValueChange" | "value"
>;

interface AnalyticsPocToggleGroupProps extends BaseToggleGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

function AnalyticsPocToggleGroup({
  className,
  orientation = "horizontal",
  children,
  value,
  defaultValue,
  onValueChange,
  ...props
}: AnalyticsPocToggleGroupProps) {
  const groupRef = React.useRef<HTMLDivElement | null>(null);
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = React.useState<
    string | undefined
  >(defaultValue);
  const activeValue = isControlled ? value : uncontrolledValue;
  const [thumbPosition, setThumbPosition] = React.useState({
    offset: 0,
    visible: false,
    width: 0,
  });

  const updateThumbPosition = React.useCallback(() => {
    const groupElement = groupRef.current;

    if (!groupElement) {
      return;
    }

    const activeItem = groupElement.querySelector<HTMLElement>(
      '[data-slot="analytics-poc-toggle-group-item"][data-pressed]',
    );

    if (!activeItem) {
      setThumbPosition((current) =>
        current.visible ? { ...current, visible: false } : current,
      );
      return;
    }

    const groupRect = groupElement.getBoundingClientRect();
    const activeRect = activeItem.getBoundingClientRect();
    const nextOffset = activeRect.left - groupRect.left;
    const nextWidth = activeRect.width;

    setThumbPosition((current) => {
      const sameOffset = Math.abs(current.offset - nextOffset) < 0.5;
      const sameWidth = Math.abs(current.width - nextWidth) < 0.5;

      if (current.visible && sameOffset && sameWidth) {
        return current;
      }

      return {
        offset: nextOffset,
        visible: true,
        width: nextWidth,
      };
    });
  }, []);

  React.useLayoutEffect(() => {
    const groupElement = groupRef.current;

    if (!groupElement) {
      return;
    }

    updateThumbPosition();

    const mutationObserver = new MutationObserver(() => {
      updateThumbPosition();
    });

    mutationObserver.observe(groupElement, {
      attributeFilter: ["data-pressed"],
      attributes: true,
      childList: true,
      subtree: true,
    });

    if (typeof ResizeObserver === "undefined") {
      return () => {
        mutationObserver.disconnect();
      };
    }

    const resizeObserver = new ResizeObserver(() => {
      updateThumbPosition();
    });

    resizeObserver.observe(groupElement);

    for (const item of groupElement.querySelectorAll<HTMLElement>(
      '[data-slot="analytics-poc-toggle-group-item"]',
    )) {
      resizeObserver.observe(item);
    }

    return () => {
      mutationObserver.disconnect();
      resizeObserver.disconnect();
    };
  }, [updateThumbPosition]);

  const handleValueChange = React.useCallback(
    (nextValues: string[]) => {
      const nextValue = nextValues[0];

      if (!nextValue) {
        return;
      }

      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange],
  );

  return (
    <ToggleGroupPrimitive
      className={cn(
        "relative inline-flex h-8 w-fit items-center gap-0 rounded-[10px] bg-[var(--ap-toggle-bg)]",
        className,
      )}
      data-orientation={orientation}
      data-slot="analytics-poc-toggle-group"
      multiple={false}
      onValueChange={handleValueChange}
      orientation={orientation}
      ref={groupRef}
      value={activeValue ? [activeValue] : []}
      {...props}
    >
      <AnalyticsPocToggleGroupContext.Provider value={{ orientation }}>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-0 rounded-[10px] bg-[var(--ap-toggle-thumb)] shadow-[0px_1px_2px_rgba(0,0,0,0.06)] transition-[transform,width] duration-[var(--ap-motion-duration-surface)] ease-[var(--ap-motion-ease-primary)] motion-reduce:transition-none"
          style={{
            transform: `translateX(${thumbPosition.offset}px)`,
            visibility: thumbPosition.visible ? "visible" : "hidden",
            width: `${thumbPosition.width}px`,
          }}
        />
        {children}
      </AnalyticsPocToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  );
}

type BaseToggleItemProps = Omit<TogglePrimitive.Props<string>, "value">;

interface AnalyticsPocToggleGroupItemProps extends BaseToggleItemProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

function AnalyticsPocToggleGroupItem({
  className,
  children,
  ...props
}: AnalyticsPocToggleGroupItemProps) {
  const context = React.useContext(AnalyticsPocToggleGroupContext);

  return (
    <TogglePrimitive
      className={cn(
        "relative z-10 inline-flex h-7 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 font-inter text-xs font-medium tracking-[-0.02em] text-page-text-subtle transition-colors duration-150 data-[pressed]:text-page-text focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      data-orientation={context.orientation}
      data-slot="analytics-poc-toggle-group-item"
      {...props}
    >
      {children}
    </TogglePrimitive>
  );
}

export { AnalyticsPocToggleGroup, AnalyticsPocToggleGroupItem };
